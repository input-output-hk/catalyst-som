import typer
import csv
import re
from datetime import datetime
from itertools import groupby
from pydantic import BaseModel, Field, HttpUrl, ValidationError, validator, root_validator
import orjson

from manager.utils.sb import SB

class Proposal(BaseModel):
    title: str
    url: HttpUrl
    project_id: int = Field(900000, gte=900001, alias='id')
    budget: int
    challenge_id: int

    @validator('budget', pre=True)
    @classmethod
    def parse_budget(cls, value):
        '''
        Parse a budget that comes in this form: $20,000
        '''
        digits = re.findall(r'\b\d+\b', value)
        return ''.join(digits) if (digits) else 0

class Som(BaseModel):
    proposal_id: int
    milestone: int = Field(1, gte=1, lte=5)
    title: str
    outputs: str
    success_criteria: str
    evidence: str
    month: int = Field(1, gte=1, lte=24)
    cost: int
    completion: int = Field(..., gt=0, lte=100)
    current: bool = Field(True)
    created_at: datetime

    @validator('month', pre=True)
    @classmethod
    def parse_month(cls, value):
        month = re.findall(r'^Month ([0-9]{1,2})( 202[0-9])?$', value)
        return month[0][0] if month else 1

    @validator('created_at', pre=True)
    @classmethod
    def parse_date(cls, value):
        return datetime.strptime(value, '%m/%d/%Y %H:%M:%S')

    @validator('completion', 'cost', pre=True)
    @classmethod
    def parse_completion(cls, value):
        digits = re.findall(r'\b\d+\b', value)
        return ''.join(digits) if (digits) else 0

    @root_validator(pre=True)
    def assign_values_based_on_milestone(cls, values):
        ml = 'Final' if values['milestone'] == 5 else values['milestone']
        values['title'] = values[f"Milestone {ml} - Title"]
        values['success_criteria'] = values[f"Milestone {ml} - Success Criteria"]
        values['evidence'] = values[f"Milestone {ml} - Evidence of Milestone completion"]
        values['month'] = values[f"Milestone {ml} - month"]
        values['cost'] = values[f"Milestone {ml} - cost"]
        values['created_at'] = values["Timestamp"]
        if ml == 'Final':
            values['completion'] = '100'
            values['outputs'] = values["Project completion - Outputs"] + values["Project completion - Final output"]
        else:
            values['completion'] = values[f"Milestone {ml} - % completion"]
            values['outputs'] = values[f"Milestone {ml} - Outputs"]
        return values

class SomReview(BaseModel):
    outputs_approves: bool
    outputs_comment: str
    success_criteria_approves: bool
    success_criteria_comment: str
    evidence_approves: bool
    evidence_comment: str
    som_id: int
    created_at: datetime

    @validator('created_at', pre=True)
    @classmethod
    def parse_date(cls, value):
        return datetime.strptime(value, '%m/%d/%Y %H:%M:%S')

    @root_validator(pre=True)
    def assign_values_based_on_milestone(cls, values):
        ml = 'Final Milestone' if values['milestone'] == 5 else f"Milestone {values['milestone']}"
        values['outputs_approves'] = (values[f"Is {ml} - Outputs valid?"] == "Yes")
        values['outputs_comment'] = values[f"Comments for {ml} - Outputs"]
        values['success_criteria_approves'] = (values[f"Is {ml} - Acceptance Criteria valid?"] == "Yes")
        values['success_criteria_comment'] = values[f"Comments for {ml} - Acceptance Criteria"]
        values['evidence_approves'] = (values[f"Is {ml} - Evidence of Milestone completion valid?"] == "Yes")
        values['evidence_comment'] = values[f"Comments for {ml} - Evidence of Milestone completion"]
        values['created_at'] = values["Timestamp"]
        return values


app = typer.Typer()
sb = SB()

@app.command()
def push_proposals(
    proposals: str = typer.Option("", help="Proposals file"),
    proposals_urls_map: str = typer.Option("", help="Proposals urls file"),
):
    results = []
    proposals_urls = proposals_url_map(proposals_urls_map)
    with open(proposals, mode='r') as infile:
        reader = csv.DictReader(infile)
        for row in reader:
            try:
                proposal = Proposal(**row, url=proposals_urls[row['id']])
                results.append(proposal.dict())
            except ValidationError as e:
                print(row)
                print(e)
    sb.push_proposals(results)

@app.command()
def push_soms(
    soms: str = typer.Option("", help="Soms file"),
):
    results = []
    proposals = sb.get_proposals()
    new_proposals = []
    with open(soms, mode='r') as infile:
        reader = csv.DictReader(infile)
        for row in reader:
            try:
                proposal = get_proposal(row['Project ID'], proposals)
                if proposal:
                    proposal.completion_date = row['Completion Date']
                    for i in range(1,6):
                        if i != 4 or row['Do you have M4?'] == 'Yes':
                            som = Som(
                                **row,
                                proposal_id = proposal['id'],
                                milestone = i
                            )
                            # Passing though JSON to serialize datetime correctly
                            results.append(orjson.loads(som.json()))
            except ValidationError as e:
                print(e)
    sb.upsert_proposals(proposals)
    sb.push_soms(results)

@app.command()
def push_som_reviews(
    som_reviews: str = typer.Option("", help="Som reviews file"),
):
    project_id_key = 'What is the project ID number? This is a 6 digit number starting with 9******'
    results = []
    proposals = sb.get_proposals()
    soms = sb.get_soms()
    new_proposals = []
    with open(som_reviews, mode='r') as infile:
        reader = csv.DictReader(infile)
        for row in reader:
            proposal = get_proposal(row[project_id_key], proposals)
            if proposal:
                p_soms = get_soms(proposal['id'], soms)
                if len(p_soms) > 0:
                    groups = {}
                    grouped = groupby(p_soms, key=lambda x:x['created_at'])
                    for key, group in grouped:
                        groups[key] = list(group)
                    sr_submission = datetime.strptime(row['Timestamp'], '%m/%d/%Y %H:%M:%S')
                    s = get_related_som(groups, sr_submission)
                    if s is not False and len(s) > 0:
                        for som in s:
                            som_review = SomReview(
                                **row,
                                som_id = som['id'],
                                milestone = som['milestone']
                            )
                            # Passing though JSON to serialize datetime correctly
                            results.append(orjson.loads(som_review.json()))
                    else:
                        print('####')
                        print(proposal['project_id'])
                        #print([(j['created_at'], j['id']) for j in p_soms])
                        #print(row)
                        print(f"SoM related not found")
                        print('####')
                    #print([ps['id'] for ps in p_soms])
                else:
                    print(f"Error finding soms for {proposal['title']}")
            else:
                print(f"Proposal {row[project_id_key]} not found")
    sb.push_som_reviews(results)


def proposals_url_map(urls_map):
    with open(urls_map, mode='r') as infile:
        reader = csv.reader(infile)
        proposals = {rows[0]:rows[1] for rows in reader}
        return proposals

def get_proposal(id, proposals):
    if id != '':
        for p in proposals:
            if p['project_id'] == int(id):
                return p
    return False

def get_soms(id, soms):
    results = []
    for s in soms:
        if s['proposal_id'] == id:
            results.append(s)
    return sorted(results, key=lambda r: r['created_at'])

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


def get_related_som(groups, submission_date):
    intervals = create_intervals(groups)
    submission_date_ts = submission_date.timestamp()
    for k in intervals:
        if (submission_date_ts >= intervals[k][1]) and (submission_date_ts < intervals[k][0]):
            return groups[k]

    return False
