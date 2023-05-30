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
    //metodo de firebase que inicia sesion
    return await signInWithEmailAndPassword(this.auth, usuario, pass);
  }

  registro(usuario: string, pass: string) {
    //metodo de firebase que registra usuario
    return createUserWithEmailAndPassword(this.auth, usuario, pass);
  }

  logout() {
    //cierrre de sesion
    return signOut(this.auth);
  }

  currentUser() {
    //devuelve el usuario actual que esta logueado
    return this.auth.currentUser;
  }
}
