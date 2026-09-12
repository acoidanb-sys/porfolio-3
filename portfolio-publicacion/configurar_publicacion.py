#!/usr/bin/env python3
"""Completa metadatos públicos antes de subir la carpeta. No publica nada."""
from pathlib import Path
from urllib.parse import urlsplit,urljoin
from xml.sax.saxutils import escape
import argparse,re,json,html
p=argparse.ArgumentParser(description=__doc__)
p.add_argument('url',help='URL pública completa del portfolio, incluida su subcarpeta si existe')
a=p.parse_args();parsed=urlsplit(a.url)
if parsed.scheme not in ('http','https') or not parsed.netloc or parsed.query or parsed.fragment or parsed.username or parsed.password:
 p.error('Indica una URL http(s) sin usuario, contraseña, consulta ni fragmento.')
base=a.url
if base.endswith('/index.html'):base=base[:-10]
if not base.endswith('/'):base+='/'
root=Path(__file__).resolve().parent
index=root/'index.html';s=index.read_text()
s=re.sub(r'\n?\s*<!-- PUBLIC_URL_START -->.*?<!-- PUBLIC_URL_END -->','',s,flags=re.S)
fields='\n<!-- PUBLIC_URL_START -->\n'+f'<link rel="canonical" href="{html.escape(base,quote=True)}">\n<meta property="og:url" content="{html.escape(base,quote=True)}">\n<meta property="og:image" content="{html.escape(urljoin(base,"assets/og-image.jpg"),quote=True)}">\n<meta property="og:image:width" content="1280">\n<meta property="og:image:height" content="720">\n<meta property="og:image:alt" content="Fotograma de Refraction Proyect, proyecto audiovisual de Ico Sánchez">\n<meta name="twitter:image" content="{html.escape(urljoin(base,"assets/og-image.jpg"),quote=True)}">\n<!-- PUBLIC_URL_END -->\n'
s=s.replace('</head>',fields+'</head>')
def structured(m):
 data=json.loads(m[1]);data['url']=base
 for item in data.get('hasPart',[]):
  # Preserve anchors across subsequent runs with a changed domain.
  old=item['url'];fragment=old.split('#')[-1];item['url']=base+'#'+fragment
 return '<script type="application/ld+json">'+json.dumps(data,ensure_ascii=False)+'</script>'
s=re.sub(r'<script type="application/ld\+json">(.*?)</script>',structured,s,flags=re.S)
index.write_text(s)
(root/'robots.txt').write_text('User-agent: *\nAllow: /\n\nSitemap: '+urljoin(base,'sitemap.xml')+'\n')
(root/'sitemap.xml').write_text('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>'+escape(base)+'</loc></url></urlset>\n')
f=root/'404.html';text=f.read_text();text=re.sub(r'(<a id="home-link" href=")[^"]*',r'\g<1>'+html.escape(base,quote=True),text);f.write_text(text)
print('Configurado:',base,'— canonical, Open Graph, sitemap.xml, robots.txt y enlace de retorno 404.')
