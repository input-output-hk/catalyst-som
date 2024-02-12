import typer
import csv
import re
from datetime import datetime
from itertools import groupby
import orjson

from rich import print

from manager.utils.gdrive import GDrive
from manager.utils.sb import SB
from manager.utils.models import Fund, Challenge, Proposal, Som, SomReview, Poa, PoaReview, IoSomReview, IoPoaReview

from pydantic import ValidationError

app = typer.Typer()
sb = SB()
gdrive = GDrive()

@app.command()
def push_funds(
    funds: str = typer.Option("", help="Funds file"),
):
    results = []
    with open(funds, mode='r') as infile:
        reader = csv.DictReader(infile)
        for row in reader:
            try:
                fund = Fund(**row)
                results.append(fund.dict())
            except ValidationError as e:
                print(row)
                print(e)
    sb.push_entities(results, 'funds')
    print("[bold green]Funds successfully added to DB.[/bold green]")

@app.command()
def push_challenges(
    challenges: str = typer.Option("", help="Challenges file"),
):
    results = []
    with open(challenges, mode='r') as infile:
        reader = csv.DictReader(infile)
        for row in reader:
            try:
                challenge = Challenge(**row)
                results.append(challenge.dict())
            except ValidationError as e:
                print(row)
                print(e)
        print(results)
    sb.push_entities(results, 'challenges')
    print("[bold green]Challenges successfully added to DB.[/bold green]")

@app.command()
def push_proposals(
    proposals: str = typer.Option("", help="Proposals file"),
    proposals_urls_map: str = typer.Option("", help="Proposals urls file"),
):
    results = []
    proposals_urls = proposals_extra_map(proposals_urls_map)
    with open(proposals, mode='r') as infile:
        reader = csv.DictReader(infile)
        for row in reader:
            try:
                proposal = Proposal(**row, url=proposals_urls[row['id']])
                results.append(orjson.loads(proposal.json()))
            except ValidationError as e:
                print(row)
                print(e)
    sb.push_entities(results, 'proposals')
    print("[bold green]Proposals successfully added to DB.[/bold green]")

@app.command()
def push_soms(
    soms: str = typer.Option("", help="Soms file"),
):
    results = []
    proposals = sb.get_entity('proposals')
    with open(soms, mode='r') as infile:
        reader = csv.DictReader(infile)
        for row in reader:
            try:
                proposal = get_proposal(row['Project ID'], proposals)
                #proposal.completion_date = row['Completion Date']
                for i in range(1,6):
                    if i != 4 or row['Do you have M4?'] == 'Yes':
                        som = Som(
                            **row,
                            proposal_id = proposal['id'],
                            milestone = i
                        )
                        if proposal.milestones_qty == 4:
                            if i == 5:
                                som.milestone = 4
                        # Passing though JSON to serialize datetime correctly
                        results.append(orjson.loads(som.json()))
            except ValidationError as e:
                print(e)
            except Exception as e:
                print(e)
    #sb.upsert_entities(proposals, 'proposals')
    sb.push_entities(results, 'soms')
    '''
    for result in results:
        print(result)
        sb.push_entities([result], 'soms')
    '''

@app.command()
def push_som_reviews(
    som_reviews: str = typer.Option("", help="Som reviews file"),
):
    project_id_key = 'What is the project ID number? This is a 6 digit number starting with 9******'
    results = []
    proposals = sb.get_entity('proposals')
    soms = sb.get_entity('soms')
    ct = get_user(1)
    with open(som_reviews, mode='r') as infile:
        reader = csv.DictReader(infile)
        for row in reader:
            try:
                proposal = get_proposal(row[project_id_key], proposals)
                project_soms = get_soms(proposal['id'], soms)
                groups_by_creation = make_groups_by(project_soms, 'created_at')
                sr_submission = datetime.strptime(row['Timestamp'], '%m/%d/%Y %H:%M:%S')
                related_soms = get_related(groups_by_creation, sr_submission)
                for som in related_soms:
                    ml_n = som['milestone']
                    if ml_n == 4 and proposal.milestones_qty == 4:
                        ml_n = 5
                    som_review = SomReview(
                        **row,
                        som_id = som['id'],
                        milestone = ml_n,
                        user_id = ct.user_id
                    )
                    # Passing though JSON to serialize datetime correctly
                    results.append(orjson.loads(som_review.json()))
            except Exception as e:
                print(e)
    sb.push_entities(results, 'som_reviews')


@app.command()
def push_poas(
    poas: str = typer.Option("", help="PoAs file"),
):
    project_id_key = 'What is your project ID number?'
    milestone_key = 'Which Milestone are you reporting here as being completed?'
    results = []
    proposals = sb.get_entity('proposals')
    soms = sb.get_entity('soms')
    with open(poas, mode='r') as infile:
        reader = csv.DictReader(infile)
        for row in reader:
            try:
                proposal = get_proposal(row[project_id_key], proposals)
                som = get_som(proposal['id'], row[milestone_key], soms, proposal)
                poa = Poa(
                    **row,
                    proposal_id = proposal['id'],
                    som_id = som['id']
                )
                # Passing though JSON to serialize datetime correctly
                results.append(orjson.loads(poa.json()))
            except Exception as e:
                print(e)
    sb.push_entities(results, 'poas')


@app.command()
def push_poa_reviews(
    poa_reviews: str = typer.Option("", help="Poa reviews file"),
):
    project_id_key = 'What is the project ID number? This is a 6 digit number starting with 9******'
    milestone_key = 'For which Milestone are you submitting approval of PoM (Proof of Milestone)?'
    results = []
    proposals = sb.get_entity('proposals')
    soms = sb.get_entity('soms')
    poas = sb.get_entity('poas')
    ct = get_user(1)
    with open(poa_reviews, mode='r') as infile:
        reader = csv.DictReader(infile)
        for row in reader:
            try:
                proposal = get_proposal(row[project_id_key], proposals)
                som = get_som(proposal['id'], row[milestone_key], soms, proposal)
                project_poas = get_poas(som['id'], poas)
                groups_by_creation = make_groups_by(project_poas, 'created_at')
                sr_submission = datetime.strptime(row['Timestamp'], '%m/%d/%Y %H:%M:%S')
                related_poas = get_related(groups_by_creation, sr_submission)
                for poa in related_poas:
                    poa_review = PoaReview(
                        **row,
                        poas_id = poa['id'],
                        user_id = ct.user_id
                    )
                    # Passing though JSON to serialize datetime correctly
                    results.append(orjson.loads(poa_review.json()))
            except Exception as e:
                print(e)
                #print(f"Proposal {row[project_id_key]} not found")
    sb.push_entities(results, 'poas_reviews')

@app.command()
def push_io_reviews(
    sheets_map: str = typer.Option("", help="Spreadsheet map file"),
):
    proposals = sb.get_entity('proposals')
    soms = sb.get_entity('soms')
    poas = sb.get_entity('poas')
    spreadsheet_map = proposals_extra_map(sheets_map)
    new_som_reviews = []
    new_poa_reviews = []
    poa_signoffs = []
    som_signoffs = []
    io_user = get_user(2)
    signoff_user = get_user(4)
    for proposal in proposals:
        sheet_url = spreadsheet_map[proposal['project_id']]
        io_reviews = extract_io_reviews(sheet_url)
        # SoMs review
        project_soms = get_soms(proposal['id'], soms)
        _som_reviews, _poa_signoffs, _som_signoffs = process_io_review(project_soms, io_reviews, proposal, io_user, signoff_user)
        new_som_reviews += _som_reviews
        poa_signoffs += _poa_signoffs
        som_signoffs += _som_signoffs
        # PoA reviews
        for project_som in project_soms:
            project_poas = get_poas(project_som['id'], poas)
            _poa_reviews, _poa_signoffs, _som_signoffs = process_io_review(project_poas, io_reviews, proposal, io_user, signoff_user, project_som)
            new_poa_reviews += _poa_reviews
            poa_signoffs += _poa_signoffs
            som_signoffs += _som_signoffs
    publish_io_reviews(new_som_reviews, 'som_reviews')
    publish_io_reviews(new_poa_reviews, 'poas_reviews')
    sb.push_entities(som_signoffs, 'signoffs')
    sb.push_entities(poa_signoffs, 'signoffs')

def process_io_review(entities, io_reviews, proposal, io_user, signoff_user, parent=None):
    results = []
    poa_signoffs = []
    som_signoffs = []
    groups_by_creation = make_groups_by(entities, 'created_at')
    groups_related = get_groups_related(groups_by_creation, io_reviews)
    for group_related in groups_related:
        elements = group_related['elements']
        for element in elements:
            if parent:
                review = parse_io_review(proposal, group_related['review'], parent, io_user, element)
                if review:
                    if review.content_approved:
                        poa_signoffs.append({'poa_id': element.id, 'user_id': signoff_user.user_id})
            else:
                review = parse_io_review(proposal, group_related['review'], element, io_user)
                if review:
                    if review.outputs_approves and review.success_criteria_approves and review.evidence_approves:
                        som_signoffs.append({'som_id': element.id, 'user_id': signoff_user.user_id})
            if review:
                results.append(orjson.loads(review.json()))
    return results, poa_signoffs, som_signoffs


def publish_io_reviews(reviews, entity):
    db_reviews = sb.get_entity(entity)
    to_publish = list(filter(lambda x: review_exists(x, db_reviews), reviews))
    sb.push_entities(to_publish, entity)

def parse_io_review(proposal, review, som, io_user, poa=None):
    revision = gdrive.download_revision(proposal['project_id'], review['file_id'], review['rev_id'])
    with open(revision, mode='r') as infile:
        csv_content = list(csv.reader(infile))
        try:
            ml = som['milestone']
            if ml == 4 and proposal['milestones_qty'] == 4:
                ml = 5
            arguments = {
                'csv': csv_content,
                'milestone': ml,
                'created_at': review['submission_date'],
                'user_id': io_user.user_id
            }
            if poa:
                arguments['poas_id'] = poa['id']
                parsed_review = IoPoaReview(**arguments)
            else:
                arguments['som_id'] = som['id']
                parsed_review = IoSomReview(**arguments)
            return parsed_review
        except ValueError as e:
            print(f"[bold yellow]Skipping malformed/empty IO review: {e}[/bold yellow]")
    return None

def extract_io_reviews(file_id):
    revisions = gdrive.get_revisions(file_id)
    reviews = []
    for rev in revisions:
        reviews.append({
            'submission_date': datetime.strptime(rev['modifiedTime'], '%Y-%m-%dT%H:%M:%S.%fZ'),
            'rev_id': rev['id'],
            'file_id': file_id
        })
    return reviews

def proposals_extra_map(extra_map):
    with open(extra_map, mode='r') as infile:
        reader = csv.reader(infile)
        try:
            proposals = {int(rows[0]):rows[1] for rows in reader}
        except ValueError:
            proposals = {rows[0]:rows[1] for rows in reader}
        return proposals

def get_proposal(id, proposals):
    if len(id) > 0:
        for p in proposals:
            if p['project_id'] == int(id):
                return p
    raise Exception(f"Proposal with id {id} not found")

def review_exists(review, reviews):
    for s in reviews:
        key = 'som_id' if ('som_id' in s) else 'poas_id'
        try:
            a = datetime.strptime(s['created_at'], '%Y-%m-%dT%H:%M:%S+00:00').replace(tzinfo=None)
        except ValueError:
            a = datetime.strptime(s['created_at'], '%Y-%m-%dT%H:%M:%S.%f+00:00').replace(tzinfo=None)
        b = datetime.fromisoformat(review['created_at']).replace(tzinfo=None)
        if (
            (s[key] == review[key]) and
            (a == b)
        ):
            return False
    return True

def get_soms(id, soms):
    results = []
    for s in soms:
        if s['proposal_id'] == id:
            results.append(s)
    return sorted(results, key=lambda r: r['created_at'])

def get_poas(id, poas):
    results = []
    for s in poas:
        if s['som_id'] == id:
            results.append(s)
    return sorted(results, key=lambda r: r['created_at'])

def get_som_by_id(id, soms):
    for s in soms:
        if (s['id'] == id):
            return s
    raise Exception(f"SoM with id {id} not found")

def get_som(proposal_id, milestone, soms, proposal):
    ml = int(''.join(re.findall(r'\b\d+\b', milestone.replace('Final', str(proposal.milestones_qty)))))
    for s in soms:
        if (
            s['proposal_id'] == proposal_id and
            s['milestone'] == ml and
            s['current'] == True
        ):
            return s
    raise Exception(f"SoM for proposal {proposal_id} and milestone {milestone} not found")

def make_groups_by(elements, group_key):
    groups = {}
    if len(elements) > 0:
        grouped = groupby(elements, key=lambda x:x[group_key])
        for key, group in grouped:
            groups[key] = list(group)
    return groups

def create_intervals(groups):
    # Assumes groups of submissions grouped in a dictionary by a key
    # representing a datetime
    som_dates = list(groups.keys())
    som_dates.reverse()
    intervals = {}
    last = False
    # Create the interval relative to each SoM in order to correctly associate
    # the som review.
    for idx, som_date in enumerate(som_dates):
        current = datetime.fromisoformat(som_date).timestamp()
        if idx == 0:
            intervals[som_date] = (datetime.now().timestamp(), current)
        elif idx == (len(som_dates) - 1):
            intervals[som_date] = (last, datetime.strptime('01/01/1990', '%m/%d/%Y').timestamp())
        else:
            intervals[som_date] = (last, current)
        last = current - 1
    return intervals


def get_related(groups, submission_date):
    intervals = create_intervals(groups)
    submission_date_ts = submission_date.timestamp()
    for k in intervals:
        if (submission_date_ts >= intervals[k][1]) and (submission_date_ts < intervals[k][0]):
            return groups[k]

    print("Not related elements found")
    return []

def get_groups_related(groups, submissions):
    intervals = create_intervals(groups)
    results = []
    for k in intervals:
        reviews = []
        for submission in submissions:
            submission_date_ts = submission['submission_date'].timestamp()
            if (submission_date_ts >= intervals[k][1]) and (submission_date_ts < intervals[k][0]):
                reviews.append(submission)
        if (len(reviews) > 0):
            results.append({
                'elements': groups[k],
                'review': reviews[-1]
            })
    return results

def get_user(role):
    users = sb.get_entity('users')
    for user in users:
        if user.role == role:
            return user
    return None