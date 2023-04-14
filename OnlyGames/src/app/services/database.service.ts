import { Injectable } from '@angular/core';
import {
  collection,
  doc,
  getFirestore,
  query,
  where,
  getDocs,
  setDoc,
} from 'firebase/firestore';
import { Usuario } from '../utils/usuario';
import { user } from '@angular/fire/auth';
@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  db = getFirestore();
  constructor() {}

  //Escribe en la base de datos --> en la coleccion users, el usuario uid-gametag
  escribirGameTag(userId: string, gametag: string) {
    try {
      setDoc(doc(this.db, 'users', userId), {
        id: userId,
        gametag: gametag,
      });
    } catch (e) {
      console.error('Error añadiendo gameTag: ', e);
    }
  }

  //conseguir el gametag del usuario pasado
  recuperarGameTag(id: any) {
    const querySnapshot = query(
      collection(this.db, 'users'),
      where('id', '==', id)
    );
    return getDocs(querySnapshot);
  }

  //ver si existe el gametag para que no exista dos usuarios con el mismo
  existeGametag(gametag: string) {
    const querySnapshot = query(
      collection(this.db, 'users'),
      where('gametag', '==', gametag)
    );
    return getDocs(querySnapshot);
  }

  verJuegos() {}
}
