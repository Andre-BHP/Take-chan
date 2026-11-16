import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { PreloadAllModules, provideRouter, withInMemoryScrolling, withPreloading, withViewTransitions } from '@angular/router';
import { inject } from '@angular/core';
import { Telon } from './componentes/telon';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }),
      withPreloading(PreloadAllModules),
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
  ],
};
