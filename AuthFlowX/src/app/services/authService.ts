import { Injectable, inject } from '@angular/core';
import { Auth, sendPasswordResetEmail, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, User } from '@angular/fire/auth';
import { from, Observable } from 'rxjs';
import { signInWithPopup, GoogleAuthProvider, GithubAuthProvider } from '@angular/fire/auth';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // private auth: Auth = inject(Auth);
    constructor(private auth: Auth, private firestore: Firestore) {}

  signup(email: string, password: string): Observable<User>  {
    return from(
      createUserWithEmailAndPassword(this.auth, email, password).then(async cred => {
        await setDoc(doc(this.firestore, `users/${cred.user.uid}`), {
          email,
          role : 'user',
          createdAt: new Date()
        });
        return cred.user;
      })
    );
  }

  // login(email: string, password: string): Observable<User> {
  //       console.log('authService login called with', email);

  //   return from(
  //     signInWithEmailAndPassword(this.auth, email, password).then(cred => cred.user)
  //   );
  // }


  login(email: string, password: string): Observable<User & { role: string | null }> {
    return from(
      signInWithEmailAndPassword(this.auth, email, password).then(async cred => {
        const snap = await getDoc(doc(this.firestore, `users/${cred.user.uid}`));
        return {
          ...cred.user,
          role: snap.exists() ? (snap.data()['role'] as string) : null
        } as User & { role: string | null };
      })
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

resetPassword(email: string) {
    return sendPasswordResetEmail(this.auth, email);
  }
}


