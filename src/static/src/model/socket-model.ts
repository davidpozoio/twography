export interface CreateRoomData {
  token: string;
}

export interface ConnectRoomData {
  connections: number;
  token: string;
}

export interface ConnectRoomEmitter {
  token: string;
}
