import React from "react";
import ReactDOM from 'react-dom';

// import 'bootstrap/dist/css/bootstrap.min.css';
import './css/bootstrap_darky.min.css';

import Container from 'react-bootstrap/Container';

import Navbar from 'react-bootstrap/Navbar';
import FilterableURLList from './components/FilterableURLList';


function App() {
  const rolexURL = 
    <Container fluid>
      <Navbar expand="lg" variant="dark" bg="dark">
        <Navbar.Brand href="#">Rolex - URLs verification tool</Navbar.Brand>
      </Navbar>

      <FilterableURLList />

    </Container>
  ;
  return ReactDOM.render(rolexURL, document.getElementById('root'));
}

export default App;
