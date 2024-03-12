import { Manager, io } from "socket.io-client";

const manager = new Manager("http://localhost:8081");

export const mainSocket = manager.socket("/");
export const roomSocket = manager.socket("/room");

const socket = io("http://localhost:8081");

export default socket;
