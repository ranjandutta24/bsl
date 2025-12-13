// import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
// import { provideRouter } from '@angular/router';

// import { routes } from './app.routes';
// import { provideHttpClient } from '@angular/common/http';

// export const appConfig: ApplicationConfig = {
//   providers: [
//     provideZoneChangeDetection({ eventCoalescing: true }),
//     provideRouter(routes),
//     provideHttpClient(),
//   ],
// };

import { ApplicationConfig, APP_INITIALIZER } from '@angular/core';
import { provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { IpService } from '../services/ip.service';
import { ConfigService } from '../services/config.service';

// import { IpService } from './services/ip.service';
// import { ConfigService } from './services/config.service';

export function initApp(ip: IpService, config: ConfigService) {
  return () =>
    ip
      .getIp()
      .toPromise()
      .then((res: any) => {
        let ipAddressv6 = res.from;
        let ipAddressv4 = ipAddressv6.replace('::ffff:', '');
        // console.log(ipAddressv4);

        config.setApiUrlBasedOnIp(ipAddressv4);
      })
      .catch(() => {
        // fallback if IP API fails
        config.setApiUrlBasedOnIp('0.0.0.0');
      });
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withHashLocation()),
    provideHttpClient(),

    {
      provide: APP_INITIALIZER,
      useFactory: initApp,
      deps: [IpService, ConfigService],
      multi: true,
    },
  ],
};
