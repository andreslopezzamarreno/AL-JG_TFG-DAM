import { Injectable } from '@angular/core';
import { getDatabase, ref, set, get, child } from 'firebase/database';
@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  db = getDatabase();

  constructor() {}

  escribirGametag(userId: string, nametag: string) {
    set(ref(this.db, 'users/' + userId), nametag);
  }

  //Trminar metodo
  existeGametag(gametag: string): boolean {
    const dbRef = ref(getDatabase());

    get(child(dbRef, `users/`))
      .then((snapshot) => {
        console.log(snapshot.toJSON());

        /* if (snapshot.exists()) {
          console.log(snapshot.val());
          return false;
        } else {
          console.log(snapshot);
          return true;
        } */
      })
      .catch((error) => {
        console.error(error);
        return false;
      });
    return false;
  }
}
