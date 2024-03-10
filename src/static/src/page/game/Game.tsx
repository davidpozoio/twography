import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import socket from "../../config/socket";
import SOCKET_ROUTES from "../../consts/socket-routes";
import { ConnectRoomData } from "../../model/socket-model";

const Game = () => {
  const { token } = useParams();
  const [connections, setConnections] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    /*    socket.on(SOCKET_ROUTES.ERROR, () => {
      navigate(ROUTES.HOME.ME);
    }); */
    socket.on(SOCKET_ROUTES.CONNECT_ROOM, (data: ConnectRoomData) => {
      console.log(data);
      setConnections(data.connections);
    });
  }, [navigate]);

  useEffect(() => {
    socket.emit(SOCKET_ROUTES.CONNECT_ROOM, { token: token, name: "example" });
  }, [token]);

  return (
    <div>
      <div>
        <div>connections: {connections}/2</div>
        <div>
          link:
          {/*  <a
            href={`http://localhost:8081/game/${token}`}
          >{`http://localhost:8081/game/${token}`}</a> */}
        </div>
      </div>
    </div>
  );
};
export default Game;
