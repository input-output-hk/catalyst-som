"""Interact with Google Sheets."""
import gspread
import re

from typing import List

from manager.config import settings
from rich import print


class GSheet:
    """Interact with Google Sheets."""

    def __init__(self):
        """Initialize gspread instance."""
        self.service = gspread.service_account(filename=f"{settings.gdrive_auth_path}service_account.json")

    def _get_doc(self, file_id):
        file_id = self._extract_file_id(file_id)
        try:
            doc = self.service.open_by_key(file_id)
            return doc
        except gspread.exceptions.APIError as e:
            print(e)
        except Exception as e:
            print(e)
        return None

    def _get_sheet(self, doc, sheet_id):
        sheet = None
        if sheet_id:
            sheets = [s.title for s in doc.worksheets()]
            if sheet_id in sheets:
                sheet = doc.worksheet(sheet_id)
        if not sheet:
            sheet = doc.get_worksheet(0)
        return sheet

    def _get_headers(self, records: List[List[str]]) -> List[str]:
        """Get headers from the first row of the spreadsheet.

        Rename columns if they are not unique.
        """
        original_headers = list(filter(lambda x: (x.strip() != ""), records[0]))
        if len(original_headers) != len(set(original_headers)):
            # Because columns are not unique they will be renamed.
            headers = [f"{col}_{i}" for i, col in enumerate(original_headers)]
        else:
            headers = original_headers
        return headers

    def get_records(self, file_id, sheet_id=False, return_sheet=False):
        """Get records from a Google sheet, given the file id and the sheet id.

        It can optionally return the sheet instance.
        """
        doc = self._get_doc(file_id)
        if doc:
            sheet = self._get_sheet(doc, sheet_id)
            if sheet:
                records = sheet.get_values()
                headers = self._get_headers(records)
                records.pop(0)
                records = [dict(zip(headers, row)) for row in records]
                if return_sheet:
                    return records, sheet
                else:
                    return sheet
        return []

    def _extract_file_id(self, url):
        file_id = re.findall("[-\w]{25,}", url)
        if len(file_id) == 1:
            return file_id[0]
        else:
            print("Not valid Google doc/sheet link found.")
            return False
