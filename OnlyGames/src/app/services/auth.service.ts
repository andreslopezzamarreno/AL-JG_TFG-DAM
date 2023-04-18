import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private auth: Auth) {}
  loginWithGoogle() {
    //Prompt o aviso para que introduzca gametag
    return signInWithPopup(this.auth, new GoogleAuthProvider());
  }

  async login(usuario: string, pass: string) {
    return await signInWithEmailAndPassword(this.auth, usuario, pass);
  }

  registro(usuario: string, pass: string) {
    return createUserWithEmailAndPassword(this.auth, usuario, pass);
  }

  logout() {
    return signOut(this.auth);
  }

  currentUser() {
    return this.auth.currentUser;
  }
}
