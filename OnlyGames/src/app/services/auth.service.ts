// Servicio para manejar la autorizacion de base de datos
import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private auth: Auth) {}

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
