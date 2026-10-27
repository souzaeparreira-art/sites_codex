"""Static release checks. No network, credentials or personal data."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
import re

ROOT = Path(__file__).resolve().parent / 'site'
errors = []
class Parser(HTMLParser):
    def __init__(self, path):
        super().__init__(); self.path = path; self.h1 = 0
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == 'h1': self.h1 += 1
        for attr in ['src', 'href']:
            value = a.get(attr, '')
            parsed = urlsplit(value)
            if not value or parsed.scheme or parsed.netloc or value.startswith('#'): continue
            target = ROOT / unquote(parsed.path).lstrip('/')
            if not target.exists(): errors.append(f'{self.path}: missing {value}')
        if tag == 'img' and not a.get('alt'): errors.append(f'{self.path}: missing image alt')

pages = list(ROOT.rglob('index.html'))
for page in pages:
    content = page.read_text(encoding='utf-8')
    p = Parser(page.relative_to(ROOT)); p.feed(content)
    if p.h1 != 1: errors.append(f'{page}: expected one h1, got {p.h1}')
    if '{{' in content: errors.append(f'{page}: unresolved placeholder')
    if not re.search(r'LBG-SC-\d{8}-[0-9A-F]{10}', content): errors.append(f'{page}: missing signature')
for path in ROOT.rglob('*'):
    if path.is_file() and path.suffix in ['.js','.html','.css','.json','.txt']:
        text = path.read_text(encoding='utf-8')
        if re.search(r'sk-or-v1-[a-zA-Z0-9]+', text): errors.append(f'{path}: exposed credential')
        if '{{' in text: errors.append(f'{path}: unresolved placeholder')
if errors:
    print('\n'.join(errors)); raise SystemExit(1)
print(f'OK: {len(pages)} pages; local links/assets, h1, alt, signatures and absence of credentials/placeholders checked.')
