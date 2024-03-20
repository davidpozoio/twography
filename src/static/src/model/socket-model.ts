export interface CreateRoomResponse {
  token: string;
}

export interface PlayerRoom {
  id: string;
  name: string;
}

export interface JoinRoomResponse {
  token: string;
  connections: number;
  players: PlayerRoom[];
}

export interface JoinRoomEmitter {
  token: string;
  name: string;
}

export interface StartResponse {
  count: number;
}

export interface StartEmitter {
  count: number;
  interval: number;
}

export interface ErrorResponse {
  errorCode: number;
  message: string;
  error?: unknown;
}
