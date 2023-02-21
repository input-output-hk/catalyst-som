import typer
import csv
import re
from datetime import datetime
from itertools import groupby
import orjson

from manager.utils.sb import SB
from manager.utils.models import Proposal, Som, SomReview, Poa

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
                    print(f"Error finding soms for {proposal['title']}")
            else:
                print(f"Proposal {row[project_id_key]} not found")
    sb.push_som_reviews(results)


@app.command()
def push_poas(
    poas: str = typer.Option("", help="PoAs file"),
):
    project_id_key = 'What is your project ID number?'
    milestone_key = 'Which Milestone are you reporting here as being completed?'
    results = []
    proposals = sb.get_proposals()
    soms = sb.get_soms()
    with open(poas, mode='r') as infile:
        reader = csv.DictReader(infile)
        for row in reader:
            proposal = get_proposal(row[project_id_key], proposals)
            if proposal:
                som = get_som(proposal['id'], row[milestone_key], soms)
                if som:
                    poa = Poa(
                        **row,
                        proposal_id = proposal['id'],
                        som_id = som['id']
                    )
                    # Passing though JSON to serialize datetime correctly
                    results.append(orjson.loads(poa.json()))
                else:
                    print('No som found')
    sb.push_poas(results)
    #print(results)


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

def get_som(proposal_id, milestone, soms):
    ml = int(''.join(re.findall(r'\b\d+\b', milestone.replace('Final', '5'))))
    for s in soms:
        if (
            s['proposal_id'] == proposal_id and
            s['milestone'] == ml and
            s['current'] == True
        ):
            return s
    return False

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
