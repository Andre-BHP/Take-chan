"""Actualiza PROGRESO.md: python herramientas/progreso.py <paso R#> "<qué se hizo>" "<qué sigue>" "<tabla de capturas markdown>"."""
import re, sys, datetime
paso, hecho, sigue, capturas = sys.argv[1:5]
h = datetime.datetime.now().strftime('%Y-%m-%d %H:%M')
p = 'PROGRESO.md'
t = open(p, encoding='utf-8').read()
t = re.sub(r'- \[ \] ' + re.escape(paso) + r'\.', f'- [x] {paso}.', t)
t = re.sub(r'\*\*Última subida:\*\* .*', f'**Última subida:** {h} (hora de Guadalajara)', t)
t = re.sub(r'## Último paso\n.*?\n\n## Sigue\n.*?\n\n## Capturas más recientes\n.*', f'## Último paso\n**{paso}.** {hecho}\n\n## Sigue\n{sigue}\n\n## Capturas más recientes\n{capturas}\n', t, flags=re.S)
open(p, 'w', encoding='utf-8').write(t)
