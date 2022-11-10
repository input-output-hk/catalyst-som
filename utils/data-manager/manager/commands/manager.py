import typer
import csv
import re
from datetime import datetime
from manager.utils.sb import SB

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
        reader = csv.reader(infile)
        for row in reader:
            if (row[0] != 'id'):
                proposal = {
                    'title': row[1],
                    'url': proposals_urls[row[0]],
                    'project_id': int(row[0]),
                    'budget': int(row[2].replace('$', '').replace(',','')),
                    'challenge_id': int(row[3])
                }
                results.append(proposal)
    sb.push_proposals(results)
    print(results)

@app.command()
def push_soms(
    soms: str = typer.Option("", help="Soms file"),
):
    results = []
    proposals = sb.get_proposals()
    new_proposals = []
    with open(soms, mode='r') as infile:
        reader = csv.reader(infile)
        for row in reader:
            if (row[0] != 'Timestamp'):
                proposal_id = int(row[2])
                proposal = get_proposal(proposal_id, proposals)
                if (proposal is not False):
                    proposal['completion_date'] = datetime.strftime(datetime.strptime(row[4], '%m/%d/%Y'), '%m/%d/%Y 0:0:0')
                    print(proposal['completion_date'])
                    submitted_at = row[0]
                    som1 = {
                        'proposal_id': proposal['id'],
                        'milestone': 1,
                        'title': row[5],
                        'outputs': row[6],
                        'success_criteria': row[7],
                        'evidence': row[8],
                        'month': int(''.join(re.findall(r'\d+', row[9].replace(' 2022', '').replace(' 2023', '')))),
                        'cost': int(''.join(re.findall(r'\d+', row[10]))),
                        'completion': int(row[11].replace('%', '')),
                        'created_at': submitted_at
                    }
                    results.append(som1)
                    som2 = {
                        'proposal_id': proposal['id'],
                        'milestone': 2,
                        'title': row[12],
                        'outputs': row[13],
                        'success_criteria': row[14],
                        'evidence': row[15],
                        'month': int(''.join(re.findall(r'\d+', row[16].replace(' 2022', '').replace(' 2023', '')))),
                        'cost': int(''.join(re.findall(r'\d+', row[17]))),
                        'completion': int(row[18].replace('%', '')),
                        'created_at': submitted_at
                    }
                    results.append(som2)
                    som3 = {
                        'proposal_id': proposal['id'],
                        'milestone': 3,
                        'title': row[19],
                        'outputs': row[20],
                        'success_criteria': row[21],
                        'evidence': row[22],
                        'month': int(''.join(re.findall(r'\d+', row[23].replace(' 2022', '').replace(' 2023', '')))),
                        'cost': int(''.join(re.findall(r'\d+', row[24]))),
                        'completion': int(row[25].replace('%', '')),
                        'created_at': submitted_at
                    }
                    results.append(som3)
                    if (row[26] == 'Yes'):
                        try:
                            cost4 = int(''.join(re.findall(r'\d+', row[32])))
                        except:
                            cost4 = 0
                        som4 = {
                            'proposal_id': proposal['id'],
                            'milestone': 4,
                            'title': row[27],
                            'outputs': row[28],
                            'success_criteria': row[29],
                            'evidence': row[30],
                            'month': int(''.join(re.findall(r'\d+', row[31].replace(' 2022', '').replace(' 2023', '')))),
                            'cost': cost4,
                            'completion': int(row[33].replace('%', '')),
                            'created_at': submitted_at
                        }
                        results.append(som4)
                    try:
                        cost5 = int(''.join(re.findall(r'\d+', row[40])))
                    except:
                        cost5 = 0
                    som5 = {
                        'proposal_id': proposal['id'],
                        'milestone': 5,
                        'title': row[35],
                        'outputs': row[45],
                        'success_criteria': row[37],
                        'evidence': row[38],
                        'month': int(''.join(re.findall(r'\d+', row[39].replace(' 2022', '').replace(' 2023', '')))),
                        'cost': cost5,
                        'completion': 100,
                        'created_at': submitted_at
                    }
                    results.append(som5)
                else:
                    print(f"Error finding {row[2]}")
    #print(results)
    sb.upsert_proposals(proposals)
    sb.push_soms(results)
    #print(proposals)

def proposals_url_map(urls_map):
    with open(urls_map, mode='r') as infile:
        reader = csv.reader(infile)
        proposals = {rows[0]:rows[1] for rows in reader}
        return proposals

def get_proposal(id, proposals):
    for p in proposals:
        if p['project_id'] == id:
            return p
    return False
