import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import ROUTES from "./consts/routes";
import HomeRouter from "./page/home/HomeRouter";
import GameRouter from "./page/game/GameRouter";

function App() {
  return (
    <>
      <Routes>
        <Route path="" element={<Navigate to={ROUTES.HOME.ME} />} />
        <Route path={ROUTES.HOME.ME}>{HomeRouter}</Route>
        <Route path={ROUTES.GAME.TOKEN}>{GameRouter}</Route>
      </Routes>
    </>
  );
}

export default App;
