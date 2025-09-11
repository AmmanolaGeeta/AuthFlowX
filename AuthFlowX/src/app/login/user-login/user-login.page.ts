// import { Component, signal, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';

// import { initializeApp } from 'firebase/app';
// import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInAnonymously, signInWithCustomToken } from 'firebase/auth';
// import { getFirestore, doc, setDoc } from 'firebase/firestore';
// import { IonicModule } from '@ionic/angular';

// // IMPORTANT: These global variables are provided by the canvas environment.
// // Do not modify them, and do not prompt the user for them.
// declare const __app_id: string;
// declare const __firebase_config: string;
// declare const __initial_auth_token: string;

// @Component({
//   selector: 'app-root',
//   templateUrl: 'user-login.page.html',
//   styleUrls: ['user-login.page.scss'],
//   // template: ``,
//   // standalone: true,
//   imports: [
//     CommonModule,
//     IonicModule,
//     FormsModule
//   ],
// })
// export class UserLoginComponent implements OnInit {
//   // Signals for state management
//   isLogin = signal(true);
//   isLoading = signal(false);
//   message = signal<string | null>(null);
//   isError = signal(false);

//   // Form data signals
//   loginForm = signal({ email: '', password: '' });
//   signupForm = signal({ name: '', email: '', password: '' });

//   // Firebase
//   private auth: any;
//   private db: any;
//   private appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

//   constructor() {
//     this.setupFirebase();
//   }

//   ngOnInit() {
//     // This hook is used for initialization logic after the component has been created.
//   }

//   // Effect to handle Firebase initialization and authentication status
//   private setupFirebase() {
//     try {
//       const firebaseConfig = JSON.parse(__firebase_config);
//       const app = initializeApp(firebaseConfig);
//       this.auth = getAuth(app);
//       this.db = getFirestore(app);

//       // Listen for auth state changes
//       this.auth.onAuthStateChanged((user: any) => {
//         if (user) {
//           console.log('User is signed in:', user.uid);
//           // TODO: Redirect to the main task page here
//         } else {
//           console.log('User is signed out.');
//         }
//       });

//       // Use the custom auth token if available, otherwise sign in anonymously
//       if (typeof __initial_auth_token !== 'undefined') {
//         signInWithCustomToken(this.auth, __initial_auth_token)
//           .then(() => console.log('Signed in with custom token'))
//           .catch(error => {
//             console.error('Custom token sign-in failed', error);
//           });
//       } else {
//         signInAnonymously(this.auth)
//           .then(() => console.log('Signed in anonymously'))
//           .catch(error => {
//             console.error('Anonymous sign-in failed', error);
//           });
//       }
//     } catch (e) {
//       console.error('Firebase setup failed:', e);
//       this.message.set('Failed to initialize the app. Please check the logs.');
//       this.isError.set(true);
//     }
//   }

//   // Method to toggle between login and signup forms
//   toggleAuthMode() {
//     this.isLogin.set(!this.isLogin());
//     this.clearMessages();
//   }

//   // Clear toast messages
//   clearMessages() {
//     this.message.set(null);
//   }

//   // Handles the login process with Firebase
//   async onLogin() {
//     this.isLoading.set(true);
//     this.isError.set(false);
//     try {
//       const { email, password } = this.loginForm();
//       const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
//       console.log('Login successful:', userCredential.user.uid);
//       this.message.set('Login successful!');
//     } catch (error: any) {
//       console.error('Login failed:', error);
//       this.message.set(error.message || 'Login failed. Please check your credentials.');
//       this.isError.set(true);
//     } finally {
//       this.isLoading.set(false);
//     }
//   }

//   // Handles the signup process with Firebase
//   async onSignup() {
//     this.isLoading.set(true);
//     this.isError.set(false);
//     try {
//       const { name, email, password } = this.signupForm();
//       const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);

//       // Save user data to Firestore
//       const userId = userCredential.user.uid;
//       const userDocRef = doc(this.db, `/artifacts/${this.appId}/users/${userId}/profile/data`);
//       await setDoc(userDocRef, {
//         name: name,
//         email: email,
//         createdAt: new Date()
//       });

//       console.log('Signup successful:', userId);
//       this.message.set('Account created successfully! You are now logged in.');
//     } catch (error: any) {
//       console.error('Signup failed:', error);
//       this.message.set(error.message || 'Signup failed. Please try again.');
//       this.isError.set(true);
//     } finally {
//       this.isLoading.set(false);
//     }
//   }

//   updateLoginForm(field: 'email' | 'password', value: string) {
//   this.loginForm.update(form => ({ ...form, [field]: value }));
// }

// updateSignupForm(field: 'name' | 'email' | 'password', value: string) {
//   this.signupForm.update(form => ({ ...form, [field]: value }));
// }
// }

import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule , NavController, ToastController, LoadingController} from '@ionic/angular';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/authService';
import { passwordMatchValidator, strongPasswordPattern } from './../../validators';


@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.page.html',
  styleUrls: ['./user-login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule,ReactiveFormsModule],
})
export class UserLoginPage implements OnInit {
  isMode = signal(false);
  isLogin = signal(true);
  showPassword = signal(false);
  passwordType: string = 'password';

  showSignupPassword = signal(false);
  passwordSignupType: string = 'password';

  showSignupCPassword = signal(false);
  passwordSignupCType: string = 'password';
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.pattern(strongPasswordPattern)]],
  });
  signupForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.pattern(strongPasswordPattern)]],
    confirmPassword: ['', [Validators.required]],
    },
    { validators: passwordMatchValidator('password', 'confirmPassword') }
  );
 
  submitting = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private navCtrl: NavController,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {}

  changeMode(event: any) {
    this.isMode.set(event.detail.checked);
    if (this.isMode()) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }

  login(event: any) {
    this.isLogin.set(event.detail.checked); 
  }


    async submit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.submitting = true;
    const loading = await this.loadingCtrl.create({ message: 'Logging in...' });
    await loading.present();

    const { email, password } = this.loginForm.value;
    this.auth.login(email!, password!).subscribe({
    next: user => {
      console.log('Logged in as:', user);
      this.navCtrl.navigateRoot('/tabs/tab1');
    },
    error: err => {
      console.error('Login failed:', err.message);
    }
  });
    // this.auth.login(email!, password!).subscribe({
    //   next: async () => {
    //     await loading.dismiss();
    //     this.submitting = false;
    //     const t = await this.toastCtrl.create({ message: 'Login successful', duration: 1500, position: 'top' });
    //     await t.present();
    //     this.navCtrl.navigateRoot('/home');
    //   },
    //   error: async (err: { message: any; }) => {
    //     await loading.dismiss();
    //     this.submitting = false;
    //     const t = await this.toastCtrl.create({ message: err.message || 'Login failed', duration: 2000, color: 'danger' });
    //     await t.present();
    //   },
    // });
  }

  get loginCon() {
    return this.loginForm.controls;
  }
   get SignupCon() {
    return this.signupForm.controls;
  }

  async signUpSubmit() {
    console.log('signUpSubmit called');
    
   if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    this.submitting = true;
    const loading = await this.loadingCtrl.create({ message: 'signing up...' });
    await loading.present();

    const { email, password } = this.signupForm.value;
    this.auth.signup(email!, password!).subscribe({
    next: async user => {
      console.log('Logged in as:', user);
 
      await loading.dismiss();
      const t = await this.toastCtrl.create({ message: 'Signup successful', duration: 1500, position: 'top' });
      await t.present();
      this.isLogin.set(!this.isLogin());
      // this.navCtrl.navigateRoot('/home');

    },
    error: err => {
      console.error('Login failed:', err.message);
    }
  });
 
  }

  get signupControls() {
    return this.loginForm.controls;
  }

//   toggleLoginPassword(){
//     console.log('Toggling login password visibility');
//     this.showPassword.set(!this.showPassword());
//       this.passwordType = this.showPassword() ? 'text' : 'password';
//   }

//     toggleSignupPassword(){
//     this.showSignupPassword.set(!this.showSignupPassword());
//       this.passwordSignupType = this.showSignupPassword() ? 'text' : 'password';
//   }

//     toggleSignupCPassword(){
//     this.showSignupCPassword.set(!this.showSignupCPassword());
//       this.passwordSignupCType = this.showSignupCPassword() ? 'text' : 'password';  
  
// }

toggleShowPassword(passwordField: 'login' | 'signup' | 'confirm') {
  if (passwordField === 'login') {
    this.showPassword.set(!this.showPassword());
    this.passwordType = this.showPassword() ? 'text' : 'password';
  } else if (passwordField === 'signup') {
    this.showSignupPassword.set(!this.showSignupPassword());
    this.passwordSignupType = this.showSignupPassword() ? 'text' : 'password';
  } else if (passwordField === 'confirm') {
    this.showSignupCPassword.set(!this.showSignupCPassword());
    this.passwordSignupCType = this.showSignupCPassword() ? 'text' : 'password';
  }
}
  
}
