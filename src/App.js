import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import Container from "react-bootstrap/Container";
import FilterableURLList from "components/FilterableURLList";
import Header from "components/Header";
import { DomainAddEdit } from "admin/domains/DomainAddEdit";
import userEdit from "admin/users/userEdit";
import domainEdit from "admin/domains/domainEdit";
import { AddEdit } from "admin/users/AddEdit";
import usersManagement from "admin/users/usersManagement";
import Footer from "components/Footer";

// import 'bootstrap/dist/css/bootstrap.min.css';
import "css/bootstrap_darky.min.css";
import "css/rolex_url.css";
import "admin/App.css";

function App() {
  // trim spaces when copying a text
  React.useEffect(() => {
    window.addEventListener("copy", function (e) {
      const text_only = document.getSelection().toString().trim();
      const clipdata = e.clipboardData || window.clipboardData;
      clipdata.setData("text/plain", text_only);
      clipdata.setData("text/html", text_only);
      e.preventDefault();
    });
  }, []);

  return (
    <Container fluid>
      <BrowserRouter>
        <Header />
        <Switch>
          <Route exact path="/">
            <FilterableURLList key={window.location.pathname} />
          </Route>
          <Route
            exact
            path="/admin/domain/add"
            component={DomainAddEdit}
            key={window.location.pathname}
          />
          <Route
            path="/admin/update/:domainid"
            component={domainEdit}
            key={window.location.pathname}
          />
          <Route path="/admin/users/:userid" component={userEdit} key={window.location.pathname} />
          <Route exact path="/admin/user/add" component={AddEdit} key={window.location.pathname} />
          <Route
            exact
            path="/admin/users"
            component={usersManagement}
            key={window.location.pathname}
          />
        </Switch>
      </BrowserRouter>
      <Footer />
    </Container>
  );
}

export default App;
