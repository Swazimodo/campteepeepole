import os
import sys
from types import SimpleNamespace
from unittest.mock import MagicMock

sys.modules["boto3"] = SimpleNamespace(client=lambda _: MagicMock())
os.environ.update(APP_ID="app", BRANCH_NAME="master")
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "src"))

import handler  # noqa: E402


def run_with_latest_status(status):
    handler.amplify = MagicMock()
    handler.amplify.list_jobs.return_value = {"jobSummaries": [{"jobId": "1", "status": status}] if status else []}
    handler.amplify.start_job.return_value = {"jobSummary": {"jobId": "2"}}
    handler.handler({}, None)
    return handler.amplify.start_job.called


assert not run_with_latest_status("PENDING"), "PENDING job should skip StartJob"
assert not run_with_latest_status("PROVISIONING"), "PROVISIONING job should skip StartJob"
assert run_with_latest_status("RUNNING"), "RUNNING job should call StartJob"
assert run_with_latest_status("SUCCEED"), "SUCCEED job should call StartJob"
assert run_with_latest_status(None), "no jobs should call StartJob"
print("ok")
