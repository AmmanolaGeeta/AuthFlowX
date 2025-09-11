import { Injectable, inject } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, User } from '@angular/fire/auth';
import { from, Observable } from 'rxjs';
import { signInWithPopup, GoogleAuthProvider, GithubAuthProvider } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth: Auth = inject(Auth);

  signup(email: string, password: string): Observable<User> {
    console.log('authService signup called with', email);
    
    return from(
      createUserWithEmailAndPassword(this.auth, email, password).then(cred => cred.user)
    );
  }

  login(email: string, password: string): Observable<User> {
        console.log('authService login called with', email);

    return from(
      signInWithEmailAndPassword(this.auth, email, password).then(cred => cred.user)
    );
  }

  logout(): Observable<void> {
    return from(signOut(this.auth));
  }

  get currentUser() {
    return this.auth.currentUser;
  }


  loginWithGoogle() {
  return signInWithPopup(this.auth, new GoogleAuthProvider());
}

loginWithGithub() {
  return signInWithPopup(this.auth, new GithubAuthProvider());
}
}
