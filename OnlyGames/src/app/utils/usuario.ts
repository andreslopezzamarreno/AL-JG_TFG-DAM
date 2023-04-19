export class Usuario {
  id: string;
  gametag: string;
  coins: number;
  diamantes: number;

  constructor(id: string, gametag: string, coins: number, diamantes: number) {
    this.id = id;
    this.gametag = gametag;
    this.coins = coins
    this.diamantes = diamantes
  }
}
