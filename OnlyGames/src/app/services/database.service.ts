import { Injectable } from '@angular/core';
import {
  collection,
  doc,
  getFirestore,
  query,
  where,
  getDocs,
  setDoc,
  getDoc,
} from 'firebase/firestore';
@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  db = getFirestore();
  constructor() {}

  // Escribe en la base de datos --> en la coleccion users, el usuario uid-gametag
  escribirDatos(userId: string, gametag: string) {
    try {
      setDoc(doc(this.db, 'users', userId), {
        id: userId,
        gametag: gametag,
        coins: 0,
        diamantes: 0,
        juegos: [true, false, false],
      });
    } catch (e) {
      console.error('Error añadiendo gameTag: ', e);
    }
  }

  // Conseguir el gametag del usuario pasado
  async recuperarGameTag(id: any) {
    const querySnapshot = query(
      collection(this.db, 'users'),
      where('id', '==', id)
    );
    return await getDocs(querySnapshot);
  }

  // Ver si existe el gametag para que no exista dos usuarios con el mismo
  async existeGametag(gametag: string) {
    const querySnapshot = query(
      collection(this.db, 'users'),
      where('gametag', '==', gametag)
    );
    return await getDocs(querySnapshot);
  }

  // Carga todos losjuegos
  async verJuegos() {
    const juegosRef = collection(this.db, 'juegos');
    const q = query(juegosRef);
    return await getDocs(q);
  }
  // Carga mis juegos
  async verMisJuegos(uid: string) {
    const querySnapshot = query(
      collection(this.db, 'users'),
      where('id', '==', uid)
    );
    return await getDocs(querySnapshot);
  }
}
