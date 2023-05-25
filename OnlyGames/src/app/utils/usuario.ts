// Clase Usuario
export class Usuario {
  id: string;
  gametag: string;
  coins: number;
  amigos: string[];
  juegos: boolean[];
  solicitudes: string[];
  records: number[];
  premios: string[];

  constructor(
    id: string,
    gametag: string,
    coins: number,
    amigos: string[],
    juegos: boolean[],
    solicitudes: string[],
    records: number[],
    premios: string[]
  ) {
    this.id = id;
    this.gametag = gametag;
    this.coins = coins;
    this.amigos = amigos;
    this.juegos = juegos;
    this.solicitudes = solicitudes;
    this.records = records;
    this.premios = premios;
  }
}
