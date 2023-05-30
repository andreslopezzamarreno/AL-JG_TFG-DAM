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
import { Usuario } from '../utils/Usuario';
import { user } from '@angular/fire/auth';
import { MenuComponent } from '../components/menu/menu.component';
import { BehaviorSubject } from 'rxjs';

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
    appId: '1:1004625728225:web:336928f0ecfdc08c861da0',
    measurementId: 'G-WTKRBJ8X6W',
  };
  app = initializeApp(this.firebaseConfig);
  db = getFirestore(this.app);

  //variables que se asignaran a la parte grafica en menu
  //con los setter y getter ir cambiandolas graficamente cuando lo hagan en la bd
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

  registrarUsuario(userId: string, gametag: string) {
    // Escribe en la base de datos --> en la coleccion users, el usuario con el siguiente formato
    try {
      setDoc(doc(this.db, 'users', userId), {
        id: userId,
        gametag: gametag,
        coins: 200,
        juegos: [false, false, false, false],
        records: [0, 0, 0, 0],
        solicitudes: [],
        amigos: [],
        premios: [],
      });
    } catch (e) {
      //si da error
      console.error('Error añadiendo gameTag: ', e);
    }
  }

  async recuperarUsuario(id: string) {
    //obtiene todo el usuario de la base de datos
    //a partir de id del usuario (uid)
    let usuario = '';
    try {
      const querySnapshot = query(
        collection(this.db, 'users'),
        where('id', '==', id)
      );
      await getDocs(querySnapshot).then((response) => {
        response.forEach((element: any) => {
          usuario = JSON.stringify(element.data());
        });
      });
    } catch (e) {
      console.error('Error añadiendo gameTag: ', e);
    }
    //devuelve usuario encontrado--> deberia ser siempre 1
    return usuario;
  }

  async asignarDatosMenu(uid: string) {
    //setea las monedas y gametag a la variable para la parte grafica de menu
    try {
      await this.recuperarUsuario(uid).then((user) => {
        var usuario: Usuario = JSON.parse(user);
        this.setgametag = usuario.gametag;
        this.setcoins = usuario.coins;
      });
    } catch (e) {
      console.error('Error al añadir datos', e);
    }
  }

  async userGametag(gametag: string) {
    //devuelve un usuario a partir del gametag, que tambien deberia ser unico
    var usuario = '';
    // Ver si existe el gametag para que no exista dos usuarios con el mismo
    try {
      const querySnapshot = query(
        collection(this.db, 'users'),
        where('gametag', '==', gametag)
      );
      await getDocs(querySnapshot).then((data) => {
        data.forEach((user) => {
          usuario = JSON.stringify(user.data());
        });
      });
    } catch (error) {
      console.error('Error', error);
    }
    //devuelvo usuario
    return usuario;
  }

  async verJuegos() {
    // Carga todos los juegos de dentro de la base de datos
    const juegosRef = collection(this.db, 'juegos');
    const q = query(juegosRef);
    return await getDocs(q);
  }

  async actualizarRecord(uid: string, record: number, idJuego: number) {
    //actualiza la base de datos
    //al usuario le pone el record indicado en el idJuego indicado
    try {
      var records: number[] = [];
      await this.recuperarUsuario(uid).then((user) => {
        var usuario: Usuario = JSON.parse(user);
        records = usuario.records;
        records[idJuego] = record;
        //actualiza bd
        updateDoc(doc(this.db, 'users/' + uid), {
          records: records,
        });
      });
    } catch (e) {
      console.error('Error', e);
    }
  }

  async obtenerRecord(uid: string, idJuego: number) {
    //recupera el record del id del juego pasado para que haya consistencia
    var record = 0;
    try {
      await this.recuperarUsuario(uid).then((user) => {
        var usuario: Usuario = JSON.parse(user);
        record = usuario.records[idJuego];
      });
    } catch (e) {
      console.error('Error', e);
    }
    return record;
  }

  async obtenerSolicitudes(gameTag: string, gametagCuerrentUser: string) {
    //actualiza las solicitudes del gametag pasado que es al enviar solicitud --> el solicitado
    var uid_usuario: string = '';
    var solicitudes: string[] = [];
    try {
      await this.userGametag(gameTag).then((user) => {
        var usuario: Usuario = JSON.parse(user);
        solicitudes = usuario.solicitudes;
        if (!usuario.solicitudes.includes(gametagCuerrentUser)) {
          if (!usuario.amigos.includes(gametagCuerrentUser)) {
            solicitudes.push(gametagCuerrentUser);
            uid_usuario = usuario.id;
          }
        }
      });
      await updateDoc(doc(this.db, 'users/' + uid_usuario), {
        solicitudes: solicitudes,
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  async eliminarSolicitudes(uid: string, solicitud_eliminar: string) {
    //emilimina solicitud 'solicitud_eliminar' de solicitudes de currentUser
    var solicitudes: string[] = [];
    try {
      await this.recuperarUsuario(uid).then((user) => {
        var usuario: Usuario = JSON.parse(user);
        solicitudes = usuario.solicitudes;
        solicitudes.splice(solicitudes.indexOf(solicitud_eliminar), 1);
      });
      //actualiza bd
      await updateDoc(doc(this.db, 'users/' + uid), {
        solicitudes: solicitudes,
      });
    } catch (error) {
      console.error('Error', error);
    }
    return solicitudes;
  }

  async aniadirAmigo(uid: string, solicitud: string) {
    //añade amigo tanto a solicitado como a solicitante
    var amigos_solicitante: string[] = [];
    var amigos: string[] = [];
    //var solicitudes: string[] = [];
    var gametagCuerrentUser: string;
    var idSolicitud;
    try {
      //obtengo gametag de solicitante y añado a solicitante el nuevo amigo (solicitud)
      await this.recuperarUsuario(uid).then((user) => {
        var usuario: Usuario = JSON.parse(user);
        gametagCuerrentUser = usuario.gametag;
        amigos = usuario.amigos;
        amigos.push(solicitud);
      });
      //actualizo db
      await updateDoc(doc(this.db, 'users/' + uid), {
        amigos: amigos,
      });
      //obtengo el id del solicitado (solicitud) y añado a solicitado nuevo amigo (gametag solicitante)
      await this.userGametag(solicitud).then((user) => {
        var usuario: Usuario = JSON.parse(user);
        idSolicitud = usuario.id;
        amigos_solicitante = usuario.amigos;
        amigos_solicitante.push(gametagCuerrentUser);
      });
      //actualizo db
      await updateDoc(doc(this.db, 'users/' + idSolicitud), {
        amigos: amigos_solicitante,
      });
    } catch (error) {
      console.error('error', error);
    }
    return amigos;
  }

  async comprarJuego(uid: string, idJuego: number, precioJuego: number) {
    //metodo para comprar un juego
    var chequeo = false;
    try {
      //obtengo usuario y actualiza array de juegos disponibles con el idJuego
      //resto monedas
      await this.recuperarUsuario(uid).then(async (user) => {
        var usuario: Usuario = JSON.parse(user);
        if (usuario.coins >= precioJuego) {
          usuario.coins -= precioJuego;
          usuario.juegos[idJuego] = true;
          //actualiza base de datos
          await updateDoc(doc(this.db, 'users/' + uid), {
            coins: usuario.coins,
            juegos: usuario.juegos,
          });
          this.setcoins = usuario.coins;
          chequeo = true;
        } else {
          alert('No tienes suficientes monedas');
        }
      });
    } catch (error) {
      console.error('Error', error);
    }
    return chequeo;
  }

  async aniadirMoneda(uid: string, numMonedas: number) {
    //despues de cada partida, sumar monedas conseguidas
    var monedas = 0;
    try {
      //recupero usuario y actulizo monedas
      await this.recuperarUsuario(uid).then((user) => {
        var usuario: Usuario = JSON.parse(user);
        monedas = usuario.coins + numMonedas;
        //actualizo base de datos
        updateDoc(doc(this.db, 'users/' + uid), {
          coins: monedas,
        });
      });
    } catch (error) {
      console.error('Error', error);
    }
    return monedas;
  }

  async cambiarNombre(uid: string, gametagNuevo: string) {
    try {
      //miro si existe gametag y es posible cambiarlo
      await this.userGametag(gametagNuevo).then((user) => {
        if (user == '') {
          //gametag esta libre
          //actualizo db
          updateDoc(doc(this.db, 'users/' + uid), {
            gametag: gametagNuevo,
          });
        }
      });
    } catch (error) {
      console.error('Error', error);
    }
  }

  async comprarPremio(uid: string, codigoPremio: string, precioPremio: number) {
    let premios: string[] = [];
    try {
      //recupero usuario, añado codigo premio y resto monedas
      await this.recuperarUsuario(uid).then((user) => {
        var usuario: Usuario = JSON.parse(user);
        if (usuario.coins >= precioPremio) {
          usuario.coins -= precioPremio;
          usuario.premios.push(codigoPremio);
          premios = usuario.premios;
          //actualizo base de datos
          updateDoc(doc(this.db, 'users/' + uid), {
            coins: usuario.coins,
            premios: usuario.premios,
          });
          //actualizo parte grafica
          this.setcoins = usuario.coins;
          alert('Tu codigo es: ' + codigoPremio);
        } else {
          alert('No tienes suficientes monedas');
        }
      });
    } catch (error) {
      console.error('Error', error);
    }
    return premios;
  }
}
