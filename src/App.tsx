import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import Header from "./Component/Header";
import Home from "./Routes/Home_recoil";
import Search from "./Routes/Search";
import Tv from "./Routes/Tv";


function App() {

  return (
    <Router basename="pub_netflex_clone">
      <Header />
      <Switch>
        <Route path="/tv">
          <Tv />
        </Route>
        <Route path="/search">
          <Search />
        </Route>
        <Route path={["/", "/movies/:movieId"]}>
          <Home />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
