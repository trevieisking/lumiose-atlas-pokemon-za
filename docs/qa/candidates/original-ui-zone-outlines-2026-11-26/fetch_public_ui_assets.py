"""Read only the five pinned UI research assets into a directory outside Atlas."""
from pathlib import Path
import argparse,hashlib,json,subprocess

HERE=Path(__file__).resolve().parent

def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('--public-repository',type=Path,required=True)
    parser.add_argument('--output',type=Path,required=True)
    args=parser.parse_args()
    out=args.output.resolve()
    assert not out.is_relative_to(HERE.parents[3]),'Recovered original assets must stay outside Atlas.'
    out.mkdir(parents=True,exist_ok=True)
    source=json.loads((HERE/'source-provenance.json').read_text())
    for row in source['assets']:
        blob=subprocess.check_output(['git','rev-parse',source['source_commit']+':'+row['source_path']],cwd=args.public_repository,text=True).strip()
        assert blob==row['git_blob_sha']
        data=subprocess.check_output(['git','cat-file','blob',blob],cwd=args.public_repository)
        assert len(data)==row['bytes']
        assert hashlib.sha1(b'blob '+str(len(data)).encode()+b'\0'+data).hexdigest()==blob
        assert hashlib.sha256(data).hexdigest()==row['sha256']
        assert Path(row['local_file']).name==row['local_file']
        (out/row['local_file']).write_bytes(data)
    print(json.dumps(dict(status='PASS',asset_count=len(source['assets']),output=str(out))))

if __name__=='__main__':main()
