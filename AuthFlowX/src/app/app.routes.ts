import { Routes } from '@angular/router';
import { authGuard } from './services/auth-guard';

export const routes: Routes = [
  // {
  //   path: '',
  //   loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  // },
  {
    path: 'user-login',
    loadComponent: () => import('./login/user-login/user-login.page').then(m => m.UserLoginPage)
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then( m => m.HomePage), canActivate : [authGuard]
  },

  {
    path: 'forgot-password',
    loadComponent: () => import('./login/forgot-password/forgot-password.page').then( m => m.ForgotPasswordPage)
  },
];
