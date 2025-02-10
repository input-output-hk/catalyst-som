import typer

from rich import print

from typing import List, Dict
from manager.utils.gsheet import GSheet
from manager.utils.sb import SB
from manager.utils.models import CohortProposal, LightProposal, SbProposal, CohortReviewer, SbReviewer, SBPoaReview, SBSomReview

app = typer.Typer()
sb = SB()

@app.command()
def update_funds_distributed(
  funding_cohort_sheet_url: str = typer.Option("", help="Spreadsheet URL to fund cohort"),
  funding_cohort_sheet_name: str = typer.Option("", help="Spreadsheet URL to fund cohort"),
  project_id_col: str = typer.Option("A", help="Column (as a letter) used for project id"),
  project_requested_col: str = typer.Option("I", help="Column (as a letter) user for total project budget"),
  project_remaining_col: str = typer.Option("J", help="Column (as a letter) user for total budget to be distributed"),
):
  gsheet = GSheet()

  funding_utils = FundingUtils(gsheet=gsheet)
  funding_utils.extract_distribution_data(
     funding_cohort_sheet_url,
     funding_cohort_sheet_name,
     project_id_col,
     project_requested_col,
     project_remaining_col
  )
  funding_utils.parse_prepare_projects()
  funding_utils.update_proposals()


@app.command()
def update_reviewers_funds_distributed(
  som_sheet_url: str = typer.Option("", help="Spreadsheet URL for SoM Milestone Reviewer cohort"),
  poa_sheet_url: str = typer.Option("", help="Spreadsheet URL for PoA Milestone Reviewer cohort"),
  som_sheet_name: str = typer.Option("", help="Sheet name for SoM"),
  poa_sheet_name: str = typer.Option("", help="Sheet name for SoM"),
  email_col: str = typer.Option("C", help="Column (as a letter) used for user email id"),
  paid_to_date_col: str = typer.Option("D", help="Column (as a letter) user for total project budget"),
  fund: str = typer.Option("Fund 10", help="Fund identifier, e.g. 'Fund 10' or 'Fund 9'"),
):
  gsheet = GSheet()

  funding_utils = FundingUtils(gsheet=gsheet)
  # SOMS
  if som_sheet_name != "":
    som_rows = funding_utils.extract_reviewer_distribution_data(
      som_sheet_url,
      som_sheet_name,
      email_col,
      paid_to_date_col
    )
    funding_utils.parse_reviewers(som_rows, 'som')
  # POA
  if poa_sheet_name != "":
    poa_rows = funding_utils.extract_reviewer_distribution_data(
      poa_sheet_url,
      poa_sheet_name,
      email_col,
      paid_to_date_col
    )
    funding_utils.parse_reviewers(poa_rows, 'poa')
  
  funding_utils.prepare_reviewers(fund)
  funding_utils.update_reviewers()
  

  print("[bold green]Project funds distributed successfully updated.[/bold green]")

@app.command()
def migrate_user_reviews(
  source_email: str = typer.Option("", help="Email to be used as starting point of the migration."),
  target_email: str = typer.Option("", help="Email to be used as final point of the migration.")
):
  origin_user = sb.search_entity('users', SbReviewer, 'email', [source_email])[0]
  target_user = sb.search_entity('users', SbReviewer, 'email', [target_email])[0]


  origin_user_som_reviews = sb.search_entity('som_reviews', SBSomReview, 'user_id', [origin_user.user_id])
  target_user_som_reviews = sb.search_entity('som_reviews', SBSomReview, 'user_id', [target_user.user_id])
  for som_review in origin_user_som_reviews:
    duplicates = [np for np in target_user_som_reviews if (np.som_id == som_review.som_id and np.current == True)]
    if (len(duplicates)>0):
      print("Contains duplicates as current, please check.")
    print({
      'id': som_review.id,
      'old_user': origin_user.user_id,
      'user_id': target_user.user_id,
      'current': False if len(duplicates) > 0 else som_review.current
    })
    proceed = typer.confirm("Migrate this SOM review?")
    if proceed:
      sb.update_entity(
        {'key': 'id', 'value': som_review.id},
        {'user_id': target_user.user_id, 'current': False if len(duplicates) > 0 else som_review.current},
        'som_reviews'
      )


  origin_user_poas_reviews = sb.search_entity('poas_reviews', SBPoaReview, 'user_id', [origin_user.user_id])
  target_user_poas_reviews = sb.search_entity('poas_reviews', SBPoaReview, 'user_id', [target_user.user_id])
  for poa_review in origin_user_poas_reviews:
    duplicates = [np for np in target_user_poas_reviews if (np.poas_id == poa_review.poas_id and np.current == True)]
    if (len(duplicates)>0):
      print("Contains duplicates as current, please check.")
    print({
      'id': poa_review.id,
      'old_user': origin_user.user_id,
      'user_id': target_user.user_id,
      'current': False if len(duplicates) > 0 else poa_review.current
    })
    proceed = typer.confirm("Migrate this PoA review?")
    if proceed:
      sb.update_entity(
        {'key': 'id', 'value': poa_review.id},
        {'user_id': target_user.user_id, 'current': False if len(duplicates) > 0 else poa_review.current},
        'poas_reviews'
      )

class FundingUtils:
  def __init__(self, gsheet):
    self.gsheet = gsheet
    self.sheet = None
    self.headers: Dict[str, str] = {}
    self.reviewers = []
    self.projects = []
    self.project_rows = []
    self.sb_proposals = []
    self.to_update = []
  
  def extract_reviewer_distribution_data(self, sheet_url, sheet_name, email_col, paid_to_date_col) -> None:
    """Extract raw distribution data from a Google spreadsheet."""

    print("[bold green]Extracting and parsing distribution data...[/bold green]")
    rows, self.sheet = self.gsheet.get_records(sheet_url, sheet_name, return_sheet=True, force_numbered_headers=True)
    self.headers = self._extract_headers(
        self.sheet,
        [
            {"name": "email", "col": email_col},
            {"name": "paid", "col": paid_to_date_col},
        ],
    )
    return rows

  def extract_distribution_data(self, sheet_url, sheet_name, project_id_col, project_requested_col, project_remaining_col) -> None:
    """Extract raw distribution data from a Google spreadsheet."""

    print("[bold green]Load projects from Milestone module...[/bold green]")
    self.sb_proposals = sb.get_entity('proposals', SbProposal)

    print("[bold green]Extracting and parsing distribution data...[/bold green]")
    self.projects_rows, self.sheet = self.gsheet.get_records(sheet_url, sheet_name, return_sheet=True)
    self.headers = self._extract_headers(
        self.sheet,
        [
            {"name": "id", "col": project_id_col},
            {"name": "requested", "col": project_requested_col},
            {"name": "remaining", "col": project_remaining_col},
        ],
    )

  def _extract_headers(self, sheet, cols: List[Dict[str, str]]) -> Dict[str, str]:
    """Extract headers from a sheet."""
    headers = {}
    for col in cols:
      cell = sheet.acell(f"{col['col']}1")  
      headers[col["name"]] = cell.value + f"_{cell.col - 1}"
    return headers
  
  def parse_reviewers(self, rows, _type):
    print("[bold green]Processing data...[/bold green]")
    for record in rows:
      try:
        reviewer = self.find_reviewer(record[self.headers["email"]].strip().lower(), self.reviewers)
        reviewer.set_paid(_type, record[self.headers["paid"]])
      except:
        c = CohortReviewer(
          email=record[self.headers["email"]]
        )
        c.set_paid(_type, record[self.headers["paid"]])
        self.reviewers.append(c)
  
  def update_payment_received(self, source, model, fund):
    payments = {'poa': model.poa_paid, 'som': model.som_paid}
    source[fund] = payments
    return source
   
  def prepare_reviewers(self, fund):
    sb_reviewers = sb.search_entity('users', SbReviewer, 'email', [r.email for r in self.reviewers])
    for reviewer in self.reviewers:
      try:
        sb_reviewer = self.find_reviewer(reviewer.email, sb_reviewers)
        sb_reviewer.payment_received = self.update_payment_received(sb_reviewer.payment_received, reviewer, fund)
        self.to_update.append(sb_reviewer)
      except Exception as e:
        print(e)

  def parse_prepare_projects(self):
    print("[bold green]Processing data...[/bold green]")
    _projects = [
      CohortProposal(
        id=record[self.headers["id"]],
        requested=record[self.headers["requested"]],
        remaining=record[self.headers["remaining"]]
      )
      for record in self.projects_rows
    ]
    self.projects = [
      LightProposal(
        id=p.project_id,
        funds_distributed=p.requested - p.remaining
      )
      for p in _projects
    ]

    for project in self.projects:
      try:
        proposal = self.find_proposal(project.project_id)
        proposal.funds_distributed = project.funds_distributed
        self.to_update.append(proposal)
      except Exception as e:
        print(e)
  
  def update_proposals(self):
    print("[bold green]Uploading data...[/bold green]")
    sb.upsert_entities(self.to_update, 'proposals', {'id': True, 'funds_distributed': True})
  
  def update_reviewers(self):
    print("[bold green]Uploading data...[/bold green]")
    sb.upsert_entities(self.to_update, 'users', {'id': True, 'payment_received': True})
  
  def find_proposal(self, _id):
    if _id > 0:
      for p in self.sb_proposals:
        if p.project_id == _id:
          return p
    raise Exception(f"Proposal with id {_id} not found")
  
  def find_reviewer(self, _email, source):
    if _email.strip() != '':
      for r in source:
        if r.email == _email:
          return r
    raise Exception(f"Reviewer with email {_email} not found")