import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import logo from "./logo.svg";
import "./App.css";
import { Top } from "./Top";
import { Main } from "./Main";

function App() {
  return (
    <div>
      <Router>
        {/* <Header /> */}
        <div className="container mx-auto">
          <Switch>
            <Route exact path="/" component={Top} />
            <Route exact path="/main" component={Main} />
            <Route render={() => <h4>not found...</h4>} />
          </Switch>
        </div>
      </Router>
    </div>
  );
}

export default App;
