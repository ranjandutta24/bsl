import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'main' },
  {
    path: 'main',
    loadChildren: () =>
      import('../app/main/main.module').then((m) => m.MainModule),
  },
];
