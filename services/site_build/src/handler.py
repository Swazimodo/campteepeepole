import os

import boto3

amplify = boto3.client("amplify")
APP_ID = os.environ["APP_ID"]
BRANCH_NAME = os.environ["BRANCH_NAME"]
NOT_STARTED = {"PENDING", "PROVISIONING"}


def handler(event, context):
    """Starts an Amplify release unless the latest job has not started yet and will pick up the changes."""
    jobs = amplify.list_jobs(appId=APP_ID, branchName=BRANCH_NAME, maxResults=1)["jobSummaries"]
    if jobs and jobs[0]["status"] in NOT_STARTED:
        print(f"Job {jobs[0]['jobId']} is {jobs[0]['status']}; skipping")
        return

    job = amplify.start_job(appId=APP_ID, branchName=BRANCH_NAME, jobType="RELEASE")["jobSummary"]
    print(f"Started job {job['jobId']}")
