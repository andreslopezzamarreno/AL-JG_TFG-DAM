import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider
} from '@angular/fire/auth';



@Injectable({
  providedIn: 'root',
})
export class AuthService {
  login_status = false
  constructor(private auth: Auth) {}

  loginWithGoogle(){
    return signInWithPopup(this.auth, new GoogleAuthProvider())
  }

  login(usuario: string, pass: string) {
    this.login_status = true
    return signInWithEmailAndPassword(this.auth, usuario, pass);

  }
  registro(usuario: string, pass: string) {
    return createUserWithEmailAndPassword(this.auth, usuario, pass);
  }
}
