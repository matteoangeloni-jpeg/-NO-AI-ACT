"""Submit the existing public language sitemaps; never request URL indexing."""
import argparse
import json
from pathlib import Path
import sys
import urllib.request
import xml.etree.ElementTree as ET

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("--submit", action="store_true", help="Explicitly perform sitemap submissions")
parser.add_argument("--include-index", action="store_true", help="Also refresh the existing sitemap index")
args = parser.parse_args()
root = Path(__file__).resolve().parents[2]
config = json.loads((root / "scripts/seo/routes.config.json").read_text(encoding="utf-8"))
languages = json.loads((root / "release.config.json").read_text(encoding="utf-8"))["siteLanguages"]
site = "https://www.no-ai-act.eu/"
assert config["site"] == site
paths = [f"{site}sitemap-{language}.xml" for language in languages]
if args.include_index:
    paths.append(f"{site}sitemap.xml")
for path in paths:
    with urllib.request.urlopen(path, timeout=30) as response:
        document = ET.fromstring(response.read())
    expected = "sitemapindex" if path.endswith("/sitemap.xml") else "urlset"
    assert document.tag == f"{{http://www.sitemaps.org/schemas/sitemap/0.9}}{expected}", path

if not args.submit:
    print(json.dumps({"mode": "validated dry run", "paths": paths}, indent=2))
    sys.exit(0)

sys.path.insert(0, str(Path.home() / ".codex/skills/seo/scripts"))
from google_auth import get_oauth_credentials
from googleapiclient.discovery import build

credentials = get_oauth_credentials(["https://www.googleapis.com/auth/webmasters"])
service = build("searchconsole", "v1", credentials=credentials)
for path in paths:
    service.sitemaps().submit(siteUrl="sc-domain:no-ai-act.eu", feedpath=path).execute()
    print(json.dumps({"submitted": path}))
