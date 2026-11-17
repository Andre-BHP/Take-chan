// Prueba de la PWA: manifest e instalabilidad (CDP), service worker activo y el menú sin conexión.
// Con el ensayo oficial, además: al enviar sin red avisa que el pedido quedó listo.
// Uso: node herramientas/pwa.mjs [http://localhost:4333/Take-chan] [http://localhost:4344] [paso]
import { chromium } from 'playwright-core';
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const [propuestaArg = 'http://localhost:4333/Take-chan', oficialArg = 'http://localhost:4344', paso = ''] = process.argv.slice(2);
const fecha = new Date().toLocaleDateString('sv-SE');
const b = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe' });
let fallas = 0;
const ok = (c, t) => { console.log((c ? 'ok    ' : 'FALLA ') + t); if (!c) fallas++; };

async function preparar(base, nombre) {
  // Perfil persistente (no incógnito): en incógnito Chrome nunca ofrece instalar, y la prueba quedaría ciega.
  const perfil = fs.mkdtempSync(path.join(os.tmpdir(), 'take-pwa-'));
  const ctx = await chromium.launchPersistentContext(perfil, { executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce', serviceWorkers: 'allow' });
  await ctx.addInitScript(() => { try { sessionStorage.setItem('take-intro', '1'); } catch (e) {} window.open = (u) => { window.__abierto = String(u); return null; }; });
  const p = ctx.pages()[0] ?? (await ctx.newPage());
  await p.goto(base + '/', { waitUntil: 'networkidle' });
  const cdp = await ctx.newCDPSession(p);
  const manifiesto = await cdp.send('Page.getAppManifest').catch((e) => ({ errors: [{ message: e.message }] }));
  ok(manifiesto.url && !manifiesto.errors?.length, `${nombre}: manifest sin errores (${manifiesto.url?.split('/').pop()})`);
  const instalable = await cdp.send('Page.getInstallabilityErrors').catch(() => null);
  // Antes de activarse el service worker puede faltar "no matching service worker"; se revisa otra vez después.
  // Espera a que el service worker (registrado 5 s después de estable) termine de instalarse y controle la página.
  const listo = await p.evaluate(async () => {
    const inicio = Date.now();
    while (Date.now() - inicio < 30000) {
      const r = await navigator.serviceWorker.getRegistration();
      if (r?.active && (await caches.keys()).some((k) => k.includes('ngsw'))) return true;
      await new Promise((l) => setTimeout(l, 500));
    }
    return false;
  });
  ok(listo, `${nombre}: service worker activo con su caché`);
  await p.goto(base + '/menu', { waitUntil: 'networkidle' });
  await p.waitForTimeout(2500);
  const despues = await cdp.send('Page.getInstallabilityErrors').catch(() => null);
  const errores = (despues ?? instalable)?.installabilityErrors?.map((e) => e.errorId) ?? ['sin respuesta'];
  ok(errores.length === 0, `${nombre}: instalable ("Agregar a pantalla de inicio")${errores.length ? ' → ' + errores.join(', ') : ''}`);
  return { ctx, p };
}

// Propuesta: el menú abre sin red y el pedido se arma.
{
  const base = propuestaArg.replace(/\/$/, '');
  const { ctx, p } = await preparar(base, 'propuesta');
  await ctx.setOffline(true);
  await p.goto(base + '/menu', { waitUntil: 'load' }).catch((e) => console.log('  ', e.message));
  await p.waitForTimeout(1500);
  const teclas = await p.locator('.tecla').count();
  ok(teclas >= 10, `sin red: /menu abre con ${teclas} teclas`);
  if (teclas) {
    await p.getByRole('button', { name: /^Agregar Iekei clásico/ }).click();
    await p.waitForTimeout(300);
    ok((await p.locator('.barra-movil').innerText()).includes('$165'), 'sin red: el pedido se arma ($165)');
    if (paso) await p.screenshot({ path: path.join(raiz, 'entregables/avances', `${fecha}_paso-${paso}_sin-red_390.png`) });
  }
  await p.goto(base + '/en/menu', { waitUntil: 'load' }).catch(() => {});
  await p.waitForTimeout(1500);
  ok((await p.locator('h1').innerText().catch(() => '')) === 'Menu & order', 'sin red: /en/menu también abre');
  await ctx.close();
}
// Oficial (ensayo): enviar sin red avisa y no abre WhatsApp.
{
  const base = oficialArg.replace(/\/$/, '');
  const { ctx, p } = await preparar(base, 'oficial');
  await ctx.setOffline(true);
  await p.goto(base + '/menu', { waitUntil: 'load' }).catch(() => {});
  await p.waitForTimeout(1500);
  await p.getByRole('button', { name: /^Agregar Iekei clásico/ }).click();
  await p.locator('.barra-movil').click();
  await p.waitForTimeout(400);
  await p.getByRole('button', { name: 'Imprimir ticket' }).click();
  await p.waitForTimeout(400);
  await p.getByRole('button', { name: /Enviar por WhatsApp/ }).click();
  await p.waitForTimeout(400);
  const aviso = await p.locator('.burbuja-titulo').innerText().catch(() => '');
  ok(aviso.startsWith('Sin conexión') && !(await p.evaluate(() => window.__abierto)), 'sin red: avisa que el pedido quedó listo y no abre WhatsApp');
  await ctx.close();
}
await b.close();
console.log(fallas ? `\n${fallas} fallas` : '\nTodo en orden');
process.exit(fallas ? 1 : 0);
