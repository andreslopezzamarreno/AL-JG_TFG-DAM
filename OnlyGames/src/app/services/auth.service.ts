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

  registro(usuario: string, pass: string) {
    return createUserWithEmailAndPassword(this.auth, usuario, pass);
  }
}
