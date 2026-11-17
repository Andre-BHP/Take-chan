import { ApplicationConfig, isDevMode, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideServiceWorker } from '@angular/service-worker';
import { PreloadingStrategy, Route, provideRouter, withInMemoryScrolling, withPreloading, withViewTransitions } from '@angular/router';
import { Injectable } from '@angular/core';
import { EMPTY, Observable, switchMap, timer } from 'rxjs';
import { inject } from '@angular/core';
import { Telon } from './componentes/telon';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { routes } from './app.routes';

/**
 * Precarga solo las rutas marcadas (el menú, el siguiente paso natural) y 3 s después de la carga,
 * para no competir con la portada. Las demás se bajan al visitarlas.
 */
@Injectable({ providedIn: 'root' })
export class PrecargaMarcadas implements PreloadingStrategy {
  preload(ruta: Route, cargar: () => Observable<unknown>) {
    return ruta.data?.['precargar'] ? timer(3000).pipe(switchMap(() => cargar())) : EMPTY;
  }
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }),
      withPreloading(PrecargaMarcadas),
      // View Transitions solo para el elemento compartido (foto del bento → tecla). Las demás navegaciones usan el telón de noren.
      withViewTransitions({
        skipInitialTransition: true,
        onViewTransitionCreated: ({ transition }) => {
          const telon = inject(Telon);
          if (!telon.compartido || matchMedia('(prefers-reduced-motion: reduce)').matches) transition.skipTransition();
          transition.finished.finally(() => (telon.compartido = false));
        },
      }),
    ),
    provideClientHydration(withEventReplay()),
    // PWA: el menú abre sin conexión. Se registra 5 s después de que la app queda estable,
    // para que la descarga en segundo plano no compita con la carga de la portada.
    provideServiceWorker('ngsw-worker.js', { enabled: !isDevMode(), registrationStrategy: 'registerWithDelay:5000' }),
  ],
};
