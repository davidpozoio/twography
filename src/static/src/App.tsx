import { useEffect, useState } from "react";
import "./App.css";
import { roomSocket } from "./config/socket";

function App() {
  const [token, setToken] = useState("");

  useEffect(() => {
    roomSocket.on("error", (err) => {
      console.log("error", err);
    });
    roomSocket.on("room:create", (data) => {
      console.log(data);
      setToken(data.token);
    });

    roomSocket.on("room:join", (data) => {
      console.log(data);
    });
  });

  return (
    <>
      <button
        onClick={() => {
          roomSocket.emit("room:create");
        }}
      >
        create room
      </button>
      <button
        onClick={() => {
          roomSocket.emit("room:join", { token, name: "example" });
        }}
      >
        join to a room
      </button>
    </>
  );
}

export default App;
