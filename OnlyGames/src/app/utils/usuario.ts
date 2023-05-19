// Clase Usuario
export class Usuario {
  id: string;
  gametag: string;
  coins: number;
  amigos: string[];
  juegos: boolean[];
  solicitudes: string[];
  records: number[];

  constructor(
    id: string,
    gametag: string,
    coins: number,
    diamantes: number,
    amigos: string[],
    juegos: boolean[],
    solicitudes: string[],
    records: number[]
  ) {
    this.id = id;
    this.gametag = gametag;
    this.coins = coins;
    this.amigos = amigos;
    this.juegos = juegos;
    this.solicitudes = solicitudes;
    this.records = records;
  }
}
