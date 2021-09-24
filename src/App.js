import React from "react";
import ReactDOM from 'react-dom';

// import 'bootstrap/dist/css/bootstrap.min.css';
import './css/bootstrap_darky.min.css';
import './css/rolex_url.css';

import Container from 'react-bootstrap/Container';

import FilterableURLList from './components/FilterableURLList';


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
      <FilterableURLList />

    </Container>
  ;
  return ReactDOM.render(rolexURL, document.getElementById('root'));
}

export default App;
