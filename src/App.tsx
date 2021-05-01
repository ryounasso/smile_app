import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Top } from "./Top";
import { Main } from "./Main";
import "./tailwind.css";

function App() {
  return (
    <div>
      <Router>
        {/* <Header /> */}
        <div className="">
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
