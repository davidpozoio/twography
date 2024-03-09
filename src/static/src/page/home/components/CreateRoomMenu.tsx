import { useEffect, useState } from "react";
import socket from "../../../config/socket";
import SOCKET_ROUTES from "../../../consts/socket-routes";
import { CreateRoomData } from "../../../model/socket-model";

const CreateRoomMenu = () => {
  const [rooms, setRooms] = useState<CreateRoomData[]>([]);

  useEffect(() => {
    socket.on(SOCKET_ROUTES.CREATE_ROOM, (data: CreateRoomData) => {
      setRooms((prev) => [...prev, data]);
    });
  }, []);

  return (
    <div>
      <div>
        {rooms.map((room, index) => {
          return (
            <div
              style={{ width: "400px", height: "200px", overflow: "auto" }}
              key={index}
            >
              <h2>token:</h2>
              <span>{room.token}</span>
            </div>
          );
        })}
      </div>
      <button onClick={() => socket.emit(SOCKET_ROUTES.CREATE_ROOM)}>+</button>
    </div>
  );
};
export default CreateRoomMenu;
