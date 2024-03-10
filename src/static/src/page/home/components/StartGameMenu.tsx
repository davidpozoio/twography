import { useEffect } from "react";
import socket from "../../../config/socket";
import SOCKET_ROUTES from "../../../consts/socket-routes";
import {
  ConnectRoomData,
  ConnectRoomEmitter,
} from "../../../model/socket-model";
import { useNavigate } from "react-router-dom";
import ROUTES from "../../../consts/routes";

const StartGameMenu = () => {
  const navigate = useNavigate();

  useEffect(() => {
    socket.on(SOCKET_ROUTES.ERROR, (err) => {
      console.log(err);
    });
    socket.on(SOCKET_ROUTES.CONNECT_ROOM, (data: ConnectRoomData) => {
      console.log(data);
      navigate(ROUTES.GAME.TOKEN_VALUE(data.token));
    });
  }, [navigate]);

  return (
    <form
      action=""
      onSubmit={(e) => {
        e.preventDefault();
        const formData = Object.fromEntries(
          new FormData(e.target as HTMLFormElement)
        );
        socket.emit(SOCKET_ROUTES.CONNECT_ROOM, {
          token: formData["token"],
          name: "example",
        } as ConnectRoomEmitter);
      }}
    >
      <h2>Put your token</h2>
      <input type="text" placeholder="token" name="token" />
      <button>Join</button>
    </form>
  );
};
export default StartGameMenu;
