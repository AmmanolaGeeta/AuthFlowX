import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'user-login',
    loadComponent: () => import('./login/user-login/user-login.page').then(m => m.UserLoginPage)
  },
];
