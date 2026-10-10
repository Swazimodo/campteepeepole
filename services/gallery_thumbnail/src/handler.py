import os
from io import BytesIO

import boto3
from PIL import Image, ImageOps

s3 = boto3.client("s3")
LIVE_BUCKET = os.environ["LIVE_BUCKET"]
THUMB_PREFIX = os.environ["THUMB_PREFIX"]
THUMB_SIZE = (400, 400)


def thumbnail_key(key):
    folder, slash, name = key.rpartition("/")
    return f"{folder}{slash}{THUMB_PREFIX}{name}"


def handler(event, context):
    """Copies an uploaded image to the live bucket and writes a thumbnail next to it."""
    bucket = event["detail"]["bucket"]["name"]
    key = event["detail"]["object"]["key"]

    obj = s3.get_object(Bucket=bucket, Key=key)
    body = obj["Body"].read()
    content_type = obj.get("ContentType")
    s3.put_object(Bucket=LIVE_BUCKET, Key=key, Body=body, ContentType=content_type)

    if key.lower().endswith(".svg"):
        return

    image = Image.open(BytesIO(body))
    image_format = image.format
    thumb = ImageOps.exif_transpose(image)
    thumb.thumbnail(THUMB_SIZE)
    out = BytesIO()
    thumb.save(out, format=image_format)
    s3.put_object(Bucket=LIVE_BUCKET, Key=thumbnail_key(key), Body=out.getvalue(), ContentType=content_type)
