#!/usr/bin/env python3
import re
import os
from pathlib import Path

PROJECT_ROOT = Path(".")
PUBLISH_DATE = "2024-03-15T00:00:00Z"
MODIFY_DATE = "2026-07-08T00:00:00Z"

# Find all HTML files
html_files = list(PROJECT_ROOT.glob("**/index.html"))
html_files = [f for f in html_files if ".git" not in str(f) and "node_modules" not in str(f) and "play" not in str(f)]

print(f"Processing {len(html_files)} files...")

count = 0

for file in sorted(html_files):
    content = file.read_text(encoding='utf-8')

    # Skip if already has datePublished
    if '"datePublished"' in content:
        continue

    # Find the Organization schema block and add dates before the closing brace
    # Pattern: look for "@type": "Organization" ... }, add dates in the next }}

    # More general: add to ANY @type schema (Article, Organization, etc.)
    # Look for closing }, add before it

    # Add dates before the last } in any JSON-LD script tag
    pattern = r'("sameAs":\s*\[[^\]]*\])([\s\n]*)\}'

    if pattern and re.search(pattern, content):
        # Found a likely place to add dates
        new_content = re.sub(
            pattern,
            r'\1,\n    "datePublished": "' + PUBLISH_DATE + '",\n    "dateModified": "' + MODIFY_DATE + '"\2}',
            content
        )
        file.write_text(new_content, encoding='utf-8')
        count += 1
        print(f"✓ {file.relative_to(PROJECT_ROOT)}")

print(f"\nUpdated {count} files with datePublished/dateModified")
