"""Fetch only pinned research inputs to an explicit directory outside this repo.

Uses an existing public partial clone of 969981/ZA_Resources. This never reads a
console, game installation or credentials, and does not modify Atlas runtime.
"""
from pathlib import Path
import argparse, hashlib, json, subprocess

HERE = Path(__file__).resolve().parent
parser = argparse.ArgumentParser()
parser.add_argument('--public-repository', type=Path, required=True)
parser.add_argument('--output', type=Path, required=True)
parser.add_argument('--include-map', action='store_true')
args = parser.parse_args()
repo_root = HERE.parents[3]
out = args.output.resolve()
assert not out.is_relative_to(repo_root), 'Keep recovered original source assets outside Atlas.'
out.mkdir(parents=True, exist_ok=True)
provenance = json.loads((HERE/'source-provenance.json').read_text())
rows = provenance['shared_assets'] + json.loads((HERE/'public-sector-assets-receipt.json').read_text())['assets']
for row in rows:
    if row['local_file'] == 'map_field_00.arc' and not args.include_map:
        continue
    member = subprocess.check_output(['git', 'rev-parse', provenance['source_commit']+':'+row['source_path']], cwd=args.public_repository, text=True).strip()
    assert member == row['git_blob_sha']
    data = subprocess.check_output(['git', 'cat-file', 'blob', member], cwd=args.public_repository)
    assert len(data) == row['bytes']
    assert hashlib.sha1(b'blob '+str(len(data)).encode()+b'\0'+data).hexdigest() == member
    assert hashlib.sha256(data).hexdigest() == row['sha256']
    assert Path(row['local_file']).name == row['local_file']
    (out/row['local_file']).write_bytes(data)
print(json.dumps(dict(status='pinned research inputs verified', output=str(out), include_map=args.include_map)))
