import re
from datetime import datetime
from pydantic import BaseModel, Field, HttpUrl, ValidationError, validator, root_validator

ml_rows_map = {
    1: 9,
    2: 16,
    3: 23,
    4: 31,
    5: 39
}

class Fund(BaseModel):
    title: str

class Challenge(BaseModel):
    title: str
    fund_id: int

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

class IoSomReview(BaseModel):
    outputs_approves: bool
    outputs_comment: str
    success_criteria_approves: bool
    success_criteria_comment: str
    evidence_approves: bool
    evidence_comment: str
    som_id: int
    created_at: datetime

    @root_validator(pre=True)
    def assign_values_based_on_milestone(cls, values):
        keys = ['outputs', 'success_criteria', 'evidence']
        row = ml_rows_map[values['milestone']]
        true_count = 0
        chars_count = 0
        for index, key in enumerate(keys):
            values[f"{key}_approves"] = values['csv'][row + index][4] == 'TRUE'
            values[f"{key}_comment"] = values['csv'][row + index][5].strip()
            true_count += values[f"{key}_approves"]
            chars_count += len(values[f"{key}_comment"])
        if (true_count == 0 and chars_count == 0):
            raise ValueError('Empty review')
        return values

class IoPoaReview(BaseModel):
    content_approved: bool
    content_comment: str
    poas_id: int
    created_at: datetime

    @root_validator(pre=True)
    def assign_values_based_on_milestone(cls, values):
        row = ml_rows_map[values['milestone']]
        values['content_approved'] = values['csv'][row][9] == 'TRUE'
        values['content_comment'] = values['csv'][row][10]
        return values

class Poa(BaseModel):
    content: str = Field(alias='Please describe here the Milestone output.')
    proposal_id: int
    som_id: int
    # challenge_id: int
    # user_id: int
    current: bool = Field(True)
    created_at: datetime = Field(alias='Timestamp')

    @validator('created_at', pre=True)
    @classmethod
    def parse_date(cls, value):
        return datetime.strptime(value, '%m/%d/%Y %H:%M:%S')

class PoaReview(BaseModel):
    content_approved: bool = Field(alias='Is the PoA Milestone approved by Challenge Team')
    content_comment: str = Field(alias='Rationale for Approval / Non Approval')
    poas_id: int
    created_at: datetime = Field(alias='Timestamp')
    #user_id: int
    #role: int

    @validator('created_at', pre=True)
    @classmethod
    def parse_date(cls, value):
        return datetime.strptime(value, '%m/%d/%Y %H:%M:%S')

    @validator('content_approved', pre=True)
    @classmethod
    def parse_approval(cls, value):
        return (value == 'Yes')
