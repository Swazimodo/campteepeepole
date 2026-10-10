import os
import sys
from types import SimpleNamespace
from unittest.mock import MagicMock

sys.modules["boto3"] = SimpleNamespace(client=lambda _: MagicMock())
sys.modules.setdefault("PIL", SimpleNamespace(Image=None, ImageOps=None))
os.environ.update(LIVE_BUCKET="live", THUMB_PREFIX="thumb_")
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "src"))

import handler  # noqa: E402

assert handler.thumbnail_key("gallery/2026/a.jpg") == "gallery/2026/thumb_a.jpg"
assert handler.thumbnail_key("a.jpg") == "thumb_a.jpg"
print("ok")
