import re
import io
import os
import json
import requests

from requests.adapters import HTTPAdapter, Retry
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from google.oauth2 import service_account
from googleapiclient.http import MediaIoBaseDownload, MediaFileUpload

from manager.config import settings

class GDrive():
    def __init__(self):
        self.creds = None
        self.SCOPES = ['https://www.googleapis.com/auth/drive']
        self.authenticate()
        self.service = build('drive', 'v3', credentials=self.creds)
        self.setup_requests()

    def setup_requests(self):
        self.session = requests.Session()
        retries = Retry(total=5,
                backoff_factor=1,
                status_forcelist=[ 429, 500, 502, 503, 504 ])

        self.session.mount('http://', HTTPAdapter(max_retries=retries))
        self.session.mount('https://', HTTPAdapter(max_retries=retries))


    def authenticate(self):
        self.creds = None
        credentials = service_account.Credentials.from_service_account_file(
            f"{settings.gdrive_auth_path}service_account.json"
        )
        self.creds = credentials.with_scopes(self.SCOPES)
        if not self.creds or not self.creds.valid:
            return False

    def extract_file_id(self, url):
        file_id = re.findall("[-\w]{25,}", url)
        if len(file_id) == 1:
            return file_id[0]
        else:
            print("Not valid Google Drive link found.")
            return False

    def get_revisions(self, file_id):
        revisions = []
        page_token = None
        is_next = True
        while is_next == True:
            try:
                response = self.service.revisions().list(
                    fileId=file_id,
                    pageToken=page_token,
                    fields='revisions(modifiedTime,id,lastModifyingUser(me, emailAddress),exportLinks)'
                ).execute()
                revisions += response['revisions']
                if 'nextPageToken' in response:
                    page_token = response['nextPageToken']
                else:
                    is_next = False
            except Exception as e:
                print(e)
        return list(filter(
            lambda x: x['lastModifyingUser']['me'] == False,
            revisions,
        ))
        return result


    def download_revision(self, proposal_id, file_id, rev_id):
        filename = f"{proposal_id}-{file_id}-{rev_id}.csv"
        full_path = f"{settings.sheets_path}/{filename}"
        if not os.path.exists(full_path):
            with self.session.get(
                f"https://docs.google.com/spreadsheets/export?id={file_id}&revision={rev_id}&exportFormat=csv",
                headers={"Authorization": f"Bearer {self.creds.token}"}
            ) as r:
                if r.status_code == 200:
                    print(r.status_code)
                    with open(full_path, 'wb') as f:
                        f.write(r.content)
                else:
                    print("Error downloading.")
        else:
            #print("Already downloaded.")
            return full_path
        return full_path

    def download_file(self, file_id, video_path, filename):
        full_path = f"{video_path}/{filename}"
        if not os.path.exists(full_path):
            request = self.service.files().get_media(fileId=file_id)
            fh = io.FileIO(full_path, mode='wb')
            downloader = MediaIoBaseDownload(fh, request)
            done = False
            try:
                while done is False:
                    status, done = downloader.next_chunk()
            except HttpError as e:
                content = json.loads(e.content)
                os.remove(full_path)
                raise Exception(content)
        else:
            print("Already downloaded.")
            return filename
