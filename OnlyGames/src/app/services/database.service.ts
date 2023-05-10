import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';

import {
  getFirestore,
  setDoc,
  doc,
  query,
  collection,
  where,
  getDocs,
  updateDoc,
  getDoc,
} from 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  firebaseConfig = {
    apiKey: 'AIzaSyBrqX1EVnN70JYSGQdn-2SZRYwxtIqMets',
    authDomain: 'al-jg-tfg.firebaseapp.com',
    databaseURL: 'https://al-jg-tfg-default-rtdb.firebaseio.com',
    projectId: 'al-jg-tfg',
    storageBucket: 'al-jg-tfg.appspot.com',
    messagingSenderId: '1004625728225',
    appId: '1:1004625728225:web:1bdfacd07b2bbd8d861da0',
    measurementId: 'G-E21591H7RX',
  };

  app = initializeApp(this.firebaseConfig);

  db = getFirestore(this.app);

  constructor() {}

  // Escribe en la base de datos --> en la coleccion users, el usuario uid-gametag
  escribirDatos(userId: string, gametag: string) {
    try {
      setDoc(doc(this.db, 'users', userId), {
        id: userId,
        gametag: gametag,
        coins: 150,
        diamantes: 0,
        juegos: [true, false, false, false, false],
        records: [0, 0, 0, 0, 0],
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

  actualizarRecord(
    uid: string | null | undefined,
    record: number,
    idJuego: number
  ) {
    try {
      var records: number[] = [];
      const querySnapshot = query(
        collection(this.db, 'users'),
        where('id', '==', uid)
      );
      getDocs(querySnapshot).then((data) => {
        data.forEach((item) => {
          records = item.get('records');
          records[idJuego] = record;
          updateDoc(doc(this.db, 'users/' + uid), {
            records: records,
          });
        });
      });
    } catch (e) {
      console.error('Error', e);
    }
  }
}
