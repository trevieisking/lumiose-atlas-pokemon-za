"""Replay source decode/extraction into scratch and compare the frozen candidate.

The separately obtained, pinned pure buffer reader is deliberately not bundled.
No console/game installation, editor, credential or network API is used here.
"""
from pathlib import Path
import argparse,contextlib,hashlib,importlib.util,io,json,shutil,sys

HERE=Path(__file__).resolve().parent

def load(name,path):
    spec=importlib.util.spec_from_file_location(name,path)
    module=importlib.util.module_from_spec(spec)
    sys.modules[name]=module
    spec.loader.exec_module(module)
    return module

def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('--assets',type=Path,required=True)
    parser.add_argument('--formats-helper',type=Path,required=True)
    parser.add_argument('--output',type=Path,required=True)
    args=parser.parse_args()
    out=args.output.resolve()
    assert not out.is_relative_to(HERE.parents[3]),'Recovered artwork must stay outside Atlas.'
    out.mkdir(parents=True,exist_ok=True)
    source=json.loads((HERE/'source-provenance.json').read_text())
    for row in source['assets']:
        data=(args.assets/row['local_file']).read_bytes()
        assert len(data)==row['bytes']
        assert hashlib.sha256(data).hexdigest()==row['sha256']
        assert hashlib.sha1(b'blob '+str(len(data)).encode()+b'\0'+data).hexdigest()==row['git_blob_sha']
    helper=args.formats_helper.read_bytes()
    helper_source=source['passive_format_helper']
    # The original research text fetch appended exactly one LF. Both byte forms
    # contain the identical reader code; the source blob is independently pinned.
    if hashlib.sha256(helper).hexdigest()==helper_source['research_copy_sha256']:
        helper=helper[:-1]
    assert len(helper)==helper_source['bytes']
    assert hashlib.sha256(helper).hexdigest()==helper_source['sha256']
    assert hashlib.sha1(b'blob '+str(len(helper)).encode()+b'\0'+helper).hexdigest()==helper_source['git_blob_sha']
    load('za_formats_reference',args.formats_helper)
    previous=HERE.parent/'source-area-footprints-2026-11-26'
    load('inspect_scene',previous/'inspect_scene.py')
    decoder=load('atlas_ui_layout_replay',HERE/'decode_original_ui_zones.py')
    decoder.HERE=out;decoder.ASSETS=args.assets.resolve();decoder.OUT=out/'ui-zone-textures'
    with contextlib.redirect_stdout(io.StringIO()):decoder.main()
    metadata=(out/'original-ui-zone-placement.json').read_bytes()
    assert hashlib.sha256(metadata).hexdigest()==source['source_metadata_sha256']
    shutil.copyfile(previous/'texture-native-registration.json',out/'texture-native-registration.json')
    derive=load('atlas_ui_contour_replay',HERE/'derive_ui_contours.py');derive.HERE=out
    with contextlib.redirect_stdout(io.StringIO()):derive.main()
    candidate=(out/'original-ui-contour-candidates-first.json').read_bytes()
    assert candidate==(HERE/'original-ui-contour-candidates-first.json').read_bytes()
    diagnostic=load('atlas_ui_source_differences',HERE/'review_ui_source_differences.py');diagnostic.HERE=out
    with contextlib.redirect_stdout(io.StringIO()):diagnostic.main()
    assert (out/'ui-contour-review/source-difference-intervals-first.json').read_bytes()==(HERE/'validation/source-difference-intervals-first.json').read_bytes()
    print(json.dumps(dict(status='PASS',source_assets=len(source['assets']),source_ui_joins=20,
        byte_identical_first_contour_sha256=hashlib.sha256(candidate).hexdigest(),
        diagnostic_intervals_byte_identical=True,output=str(out))))

if __name__=='__main__':main()
