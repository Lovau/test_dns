import React from "react";
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route } from "react-router-dom";

// import 'bootstrap/dist/css/bootstrap.min.css';
import './css/bootstrap_darky.min.css';
import './css/rolex_url.css';

import Container from 'react-bootstrap/Container';
import FilterableURLList from './components/FilterableURLList';
import Header from './components/Header';
import AddDomain from "./admin/components/add-domain.component";
// import Domain from "./admin/components/domain.component";
// import DomainsList from "./admin/components/domains-list.component";
import "./admin/App.css";

function App() {

  // trim spaces when copying a text 
  React.useEffect(() => {
    window.addEventListener('copy', function(e) {
      const text_only = document.getSelection().toString().trim();
      const clipdata = e.clipboardData || window.clipboardData;  
      clipdata.setData('text/plain', text_only);
      clipdata.setData('text/html', text_only);
      e.preventDefault();
    });
  }, []);

  const rolexURL = 
    <Container fluid>

      <BrowserRouter>
        <Header />
        <Switch>
            <Route exact path="/" >
              <FilterableURLList isadmin={false} />
            </Route>
            <Route exact path="/isadmin" >
              <FilterableURLList isadmin={true} />
            </Route>
            <Route exact path="/admin/add" component={AddDomain} />
            <Route path="/admin/update/:id" component={AddDomain} />
        </Switch>
      </BrowserRouter>

    </Container>
  ;
  return ReactDOM.render(rolexURL, document.getElementById('root'));
}

export default App;
