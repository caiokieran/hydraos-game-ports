from __future__ import annotations
import copy, hashlib, io, json, tarfile
from pathlib import Path
ROOT = Path(__file__).resolve().parent.parent
CATALOG = ROOT / 'catalog.json'
MAGIC = b'!<arch>\n'

def read_ar(data):
    if not data.startswith(MAGIC): raise ValueError('IPK inválido')
    pos, entries = len(MAGIC), []
    while pos < len(data):
        h = data[pos:pos+60]
        if len(h) != 60 or h[58:60] != b'`\n': raise ValueError('Cabeçalho ar inválido')
        name = h[:16].decode('ascii').strip().rstrip('/')
        size = int(h[48:58].decode('ascii').strip())
        body = data[pos+60:pos+60+size]
        if len(body) != size: raise ValueError('Entrada ar truncada')
        entries.append((name,h,body)); pos += 60+size+(size&1)
    return entries

def write_ar(entries):
    out=bytearray(MAGIC)
    for name,h,body in entries:
        h=bytearray(h); encoded=(name+'/').encode('ascii')
        if len(encoded)>16: raise ValueError('Nome ar não suportado')
        h[:16]=encoded.ljust(16,b' '); h[48:58]=str(len(body)).encode('ascii').ljust(10,b' ')
        out.extend(h); out.extend(body)
        if len(body)&1: out.extend(b'\n')
    return bytes(out)

def hide(ipk, app_id):
    # Always rewrite ar headers so member sizes use the left-aligned decimal
    # layout accepted by webOS's package extractor, even when appinfo is
    # already hidden.
    output=[]; changed=True; found=False
    for name,h,body in read_ar(ipk.read_bytes()):
        if name=='debian-binary':
            if body != b'2.0\n': changed=True
            output.append((name,h,b'2.0\n'))
            continue
        if name!='data.tar.gz': output.append((name,h,body)); continue
        target=io.BytesIO(); data_changed=False
        with tarfile.open(fileobj=io.BytesIO(body),mode='r:gz') as src, tarfile.open(fileobj=target,mode='w:gz',format=tarfile.GNU_FORMAT) as dst:
            for member in src.getmembers():
                stream=src.extractfile(member) if member.isfile() else None
                if member.name==f'usr/palm/applications/{app_id}/appinfo.json':
                    data=stream.read(); info=json.loads(data.decode('utf-8-sig')); found=True
                    if info.get('visible') is False: dst.addfile(member,io.BytesIO(data))
                    else:
                        info['visible']=False
                        data=(json.dumps(info,indent=2,ensure_ascii=False)+'\n').encode('utf-8')
                        member=copy.copy(member); member.size=len(data); dst.addfile(member,io.BytesIO(data)); changed=True; data_changed=True
                else: dst.addfile(member,stream)
        output.append((name,h,target.getvalue() if data_changed else body))
    if not found: raise ValueError(f'appinfo não encontrado: {ipk.name}/{app_id}')
    if changed: ipk.write_bytes(write_ar(output))

catalog=json.loads(CATALOG.read_text(encoding='utf-8'))
for game in catalog.get('games',[]):
    ipk=(ROOT/game['ipk']).resolve()
    if ROOT.resolve() not in ipk.parents: raise ValueError('Caminho de IPK inválido')
    hide(ipk,game['appId']); game['sha256']=hashlib.sha256(ipk.read_bytes()).hexdigest()
CATALOG.write_text(json.dumps(catalog,indent=2,ensure_ascii=False)+'\n',encoding='utf-8')
print(f'Launchpoints ocultos e hashes atualizados: {len(catalog["games"])} IPKs')

