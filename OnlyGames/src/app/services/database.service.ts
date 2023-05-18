import { RecursiveVisitor } from '@angular/compiler';
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
import { Usuario } from '../utils/usuario';
import { user } from '@angular/fire/auth';
import { MenuComponent } from '../components/menu/menu.component';

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

  registrarUsuario(userId: string, gametag: string) {
    // Escribe en la base de datos --> en la coleccion users, el usuario
    try {
      setDoc(doc(this.db, 'users', userId), {
        id: userId,
        gametag: gametag,
        coins: 150,
        diamantes: 0,
        juegos: [true, false, false, false, false],
        records: [0, 0, 0, 0, 0],
        solicitudes: [],
        amigos: [],
      });
    } catch (e) {
      console.error('Error añadiendo gameTag: ', e);
    }
  }

  async recuperarUsuario(id: string) {
    let usuario = '';
    const querySnapshot = query(
      collection(this.db, 'users'),
      where('id', '==', id)
    );
    await getDocs(querySnapshot).then((response) => {
      response.forEach((element: any) => {
        usuario = JSON.stringify(element.data());
      });
    });
    return usuario;
  }

  async userGametag(gametag: string) {
    var usuario = '';
    // Ver si existe el gametag para que no exista dos usuarios con el mismo
    const querySnapshot = query(
      collection(this.db, 'users'),
      where('gametag', '==', gametag)
    );
    await getDocs(querySnapshot).then((data) => {
      data.forEach((user) => {
        usuario = JSON.stringify(user.data());
      });
    });
    return usuario;
  }

  async verJuegos() {
    // Carga todos los juegos
    const juegosRef = collection(this.db, 'juegos');
    const q = query(juegosRef);
    return await getDocs(q);
  }

  async actualizarRecord(uid: string, record: number, idJuego: number) {
    try {
      var records: number[] = [];
      await this.recuperarUsuario(uid).then((user) => {
        var usuario: Usuario = JSON.parse(user);
        records = usuario.records;
        records[idJuego] = record;
        updateDoc(doc(this.db, 'users/' + uid), {
          records: records,
        });
      });
    } catch (e) {
      console.error('Error', e);
    }
  }

  async obtenerRecord(uid: string, idJuego: number) {
    var record = 0;
    try {
      await this.recuperarUsuario(uid).then((user) => {
        var usuario: Usuario = JSON.parse(user);
        record = usuario.records[idJuego];
      });
      return record;
    } catch (e) {
      console.error('Error', e);
      return record;
    }
  }

  async eliminarSolicitudes(uid: string, solicitud_eliminar: string) {
    var solicitudes: string[] = [];
    await this.recuperarUsuario(uid).then((user) => {
      var usuario: Usuario = JSON.parse(user);
      solicitudes = usuario.solicitudes;
      solicitudes.splice(solicitudes.indexOf(solicitud_eliminar), 1);
    });
    await updateDoc(doc(this.db, 'users/' + uid), {
      solicitudes: solicitudes,
    });
    return solicitudes;
  }

  async aniadirAmigo(uid: string, solicitud: string, anidir: boolean) {
    var amigos: string[] = [];
    var solicitudes: string[] = [];
    var gametagCuerrentUser;
    var idSolicitud;

    await this.userGametag(solicitud).then((user) => {
      var usuario: Usuario = JSON.parse(user);
      idSolicitud = usuario.id;
      if (anidir) {
        amigos = usuario.amigos;
        amigos.push(solicitud);
      }
    });
    await updateDoc(doc(this.db, 'users/' + idSolicitud), {
      amigos: amigos,
    });

    await this.recuperarUsuario(uid).then((user) => {
      var usuario: Usuario = JSON.parse(user);
      gametagCuerrentUser = usuario.gametag;
      if (anidir) {
        amigos = usuario.amigos;
        amigos.push(solicitud);
      } else {
        solicitudes = usuario.solicitudes;
        solicitudes.splice(solicitudes.indexOf(solicitud), 1);
      }
    });
    await updateDoc(doc(this.db, 'users/' + uid), {
      amigos: amigos,
    });

    return amigos;
  }

  async comprarJuego(uid: string, idJuego: number, precioJuego: number) {
    var chequeo = false;
    await this.recuperarUsuario(uid).then(async (user) => {
      var usuario: Usuario = JSON.parse(user);
      if (usuario.coins >= precioJuego) {
        usuario.coins -= precioJuego;
        usuario.juegos[idJuego] = true;

        await updateDoc(doc(this.db, 'users/' + uid), {
          coins: usuario.coins,
          juegos: usuario.juegos,
        });
        chequeo = true;
      }
    });
    return chequeo;
  }
}
