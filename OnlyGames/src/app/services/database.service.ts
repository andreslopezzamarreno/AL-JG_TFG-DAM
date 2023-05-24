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
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
   firebaseConfig = {

    apiKey: "AIzaSyBrqX1EVnN70JYSGQdn-2SZRYwxtIqMets",

    authDomain: "al-jg-tfg.firebaseapp.com",

    databaseURL: "https://al-jg-tfg-default-rtdb.firebaseio.com",

    projectId: "al-jg-tfg",

    storageBucket: "al-jg-tfg.appspot.com",

    messagingSenderId: "1004625728225",

    appId: "1:1004625728225:web:336928f0ecfdc08c861da0",

    measurementId: "G-WTKRBJ8X6W"

  };
  app = initializeApp(this.firebaseConfig);
  db = getFirestore(this.app);
  private _gametag: BehaviorSubject<string> = new BehaviorSubject<string>('');
  get getgametag(): BehaviorSubject<string> {
    return this._gametag;
  }
  set setgametag(value: string) {
    this._gametag.next(value);
  }

  private _coins: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  get getcoins(): BehaviorSubject<number> {
    return this._coins;
  }
  set setcoins(value: number) {
    this._coins.next(value);
  }

  currentCoins = 0;

  constructor() {}

  registrarUsuario(userId: string, gametag: string) {
    // Escribe en la base de datos --> en la coleccion users, el usuario
    try {
      setDoc(doc(this.db, 'users', userId), {
        id: userId,
        gametag: gametag,
        coins: 200,
        juegos: [false, false, false, false],
        records: [0, 0, 0, 0],
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

  async asignarDatos(uid: string) {
    await this.recuperarUsuario(uid).then((user) => {
      var usuario: Usuario = JSON.parse(user);
      this.setgametag = usuario.gametag;
      this.setcoins = usuario.coins;
    });
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

  async obtenerSolicitudes(gameTag: string, gametagCuerrentUser: string) {
    var uid_usuario: string = '';
    var solicitudes: string[] = [];
    await this.userGametag(gameTag).then((user) => {
      var usuario: Usuario = JSON.parse(user);
      solicitudes = usuario.solicitudes;
      solicitudes.push(gametagCuerrentUser);
      uid_usuario = usuario.id;
    });
    await updateDoc(doc(this.db, 'users/' + uid_usuario), {
      solicitudes: solicitudes,
    });
    return solicitudes;
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

  async aniadirAmigo(uid: string, solicitud: string) {
    var amigos_solicitante: string[] = [];
    var amigos: string[] = [];
    var solicitudes: string[] = [];
    var gametagCuerrentUser: string;
    var idSolicitud;

    await this.recuperarUsuario(uid).then((user) => {
      var usuario: Usuario = JSON.parse(user);
      gametagCuerrentUser = usuario.gametag;
      amigos = usuario.amigos;
      amigos.push(solicitud);
    });
    await updateDoc(doc(this.db, 'users/' + uid), {
      amigos: amigos,
    });

    await this.userGametag(solicitud).then((user) => {
      var usuario: Usuario = JSON.parse(user);
      idSolicitud = usuario.id;
      amigos_solicitante = usuario.amigos;
      amigos_solicitante.push(gametagCuerrentUser);
    });
    await updateDoc(doc(this.db, 'users/' + idSolicitud), {
      amigos: amigos_solicitante,
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
        this.setcoins = usuario.coins;
        chequeo = true;
      }
    });
    return chequeo;
  }

  async aniadirMoneda(uid: string, numMonedas: number) {
    var monedas = 0;
    await this.recuperarUsuario(uid).then((user) => {
      var usuario: Usuario = JSON.parse(user);
      monedas = usuario.coins + numMonedas;
      updateDoc(doc(this.db, 'users/' + uid), {
        coins: monedas,
      });
    });
    return monedas;
  }

  async cambiarNombre(uid: string, gametagNuevo: string) {
    var libre = false;

    await this.userGametag(gametagNuevo).then((user) => {
      if (user == '') {
        //gametag esta libre
        libre = true;
      }
    });

    if (libre) {
      await this.recuperarUsuario(uid).then((user) => {
        var usuario: Usuario = JSON.parse(user);
        updateDoc(doc(this.db, 'users/' + uid), {
          gametag: gametagNuevo,
        });
      });
    }
  }
}
