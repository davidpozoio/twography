import { Route } from "react-router-dom";
import Game from "./Game";
import ROUTES from "../../consts/routes";

const GameRouter = (
  <>
    <Route path={ROUTES.GAME.TOKEN} element={<Game />} />
  </>
);
export default GameRouter;
