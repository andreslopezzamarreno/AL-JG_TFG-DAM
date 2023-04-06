import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private auth: Auth) {}

  login(usuario: string, pass: string) {
    return signInWithEmailAndPassword(this.auth, usuario, pass);
  }
  registro(usuario: string, pass: string) {
    return createUserWithEmailAndPassword(this.auth, usuario, pass);
  }
}
