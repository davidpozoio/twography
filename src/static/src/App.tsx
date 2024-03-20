import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import ROUTES from "./consts/routes";
import PageNotFound from "./pages/error/PageNotFound";
import Home from "./pages/home/Home";
import Game from "./pages/game/Game";
import GameRouter from "./pages/game/GameRouter";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to={ROUTES.HOME.ME} />}></Route>
        <Route path={ROUTES.HOME.ME} element={<Home />}></Route>
        <Route path={ROUTES.GAME.ME} element={<Game />}>
          {GameRouter}
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
}

export default App;
