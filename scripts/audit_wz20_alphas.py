import hashlib,json,sys
from pathlib import Path
from collections import Counter
root=Path(sys.argv[1])
hashes={'spawner':'285b0cd4e7baf95ea8bab77a5c89700f4de7e5c0','encounter':'435502d116a7941096c7d589a92e65d0fcde0996','personal':'ddbe44da3d5ae479129a26953c6597b4a308e0b0'}
def load(k):
 b=(root/(k+'.json')).read_bytes()
 assert hashlib.sha1(f'blob {len(b)}\0'.encode()+b).hexdigest()==hashes[k]
 t=json.loads(b)['Table']
 return t if k=='personal' else [r for d in t for r in d['Table']]
s={r['Id']:r for r in load('spawner')}
e={r['Id']:r for r in load('encounter')}
p={(i['SpeciesInternal'],i['Form']):i['SpeciesNational'] for r in load('personal') if (i:=r['Info'])}
def rows(slot):
 result=[]
 for c in s[slot]['EncountDataInfoList']:
  d=e[c['EncountDataId']]
  a,b,f=d['DevNo'],d['OyabunAdditionalLevel']+c['AdditionalLevel'],d['FormNo']
  assert d['OyabunProbability']==100
  result.append((p[a,f],f,d['MinLevel']+b,d['MaxLevel']+b))
 return sorted(result)
a=rows('id_spn_a0601_w01_v00_401_A')
assert a==rows('id_spn_a0601_w01_v00_402_A') and len(a)==len(set(x[0] for x in a))==67
assert Counter(x[2:] for x in a)=={(63,64):41,(64,65):26}
assert (666,6,63,64) in a and (671,0,64,65) in a
for i,(zone,n) in enumerate([('a0403_w01',208),('a0202_w02',475),('a0301_w02',675)],1):
 slot=f'id_spn_{zone}_v01_201_X'
 assert rows(slot)==[(n,0,70,70)]
 assert 'flag_Ev_m10_9010' in str(s[slot]) and f'flag_Main10_X_Oyabun_{i:02}' in str(s[slot])
print(json.dumps(a))
