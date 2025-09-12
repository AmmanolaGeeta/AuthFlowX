import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';

console.log('Auth guard called');
export const authGuard: CanActivateFn = (route, state) => {
 
  
  const auth = inject(Auth);
  const router = inject(Router);
  // const localStorage = inject(Storage);

  // const userInfo = localStorage.getItem('userData');

  // console.log('userInfo from localStorage:', userInfo);
  
  if (!auth.currentUser) {
    console.log( '==>', auth.currentUser);

    router.navigate(['/user-login']);
    return false;
  }else{
  //   if(userInfo.role !== 'admin'){
  // router.navigate(['/home']);
  //   }else{
  //     router.navigate(['/forgot-password']);
  //   }
  //       console.log( '==>', auth.currentUser);

  //   // if(auth.currentUser.){
  }
   
  return true;
};
