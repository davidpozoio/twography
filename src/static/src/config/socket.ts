import { Manager } from "socket.io-client";

const url = import.meta.env.NODE_ENV === "test" ? "" : `http://localhost:8081`;

const manager = new Manager(url);

export const mainSocket = manager.socket("/");
export const roomSocket = manager.socket("/room");
export const gameSocket = manager.socket("/game");
