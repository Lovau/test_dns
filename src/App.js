import React from "react";
import ReactDOM from 'react-dom';

// import 'bootstrap/dist/css/bootstrap.min.css';
import './css/bootstrap_darky.min.css';

import Container from 'react-bootstrap/Container';

import Navbar from 'react-bootstrap/Navbar';
// import Alert from 'react-bootstrap/Alert';
import URLList from './components/URLList';


function App() {
  const rolexURL = 
    <Container fluid>
      <Navbar expand="lg" variant="dark" bg="dark">
        <Navbar.Brand href="#">Rolex - URLs verification tool</Navbar.Brand>
      </Navbar>

      <URLList />

    </Container>
  ;
  return ReactDOM.render(rolexURL, document.getElementById('root'));
}

export default App;
