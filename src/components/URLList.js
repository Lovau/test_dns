import React from "react";
import Table from 'react-bootstrap/Table';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import URL from './URL';

const fetch = require('node-fetch');

class URLList extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
    	urls: Array(2)
    };
    this.state.urls[0] = {'domain': "https://qru.aptamilessensis.com", "update": false};
    this.state.urls[1] = {'domain': "https://qr.aptaclub.de", "update": false};
    this.state.urls[2] = {'domain': "https://qrG.aptaclub.de", "update": false};

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
  	console.log("click !");
  	var urls = this.state.urls;
  	for (var i = 0; i < urls.length; i++) {
  		urls[i].update = true;
  	}
  	this.setState({
  		urls: urls
  	})
  }

  render() {
  	var domains = this.state.urls;
  	console.log("domains", domains);
  	const listUrls = domains.map((domain) =>
  	  <URL key={domain.domain} domain={domain.domain} update={domain.update} />
  	);

  	return (
  		<Row>
	  		<Col sm={12}>
		  		<button onClick={this.handleClick}>trigger</button>
	  		</Col>

	  		<Col sm={12} >
		  		<Table striped bordered hover responsive size="sm" className="stubLinks">
		  		  <thead>
		  		  <tr>
		  		  <td>URL</td>
		  		  <td>CNAME</td>
		  		  <td>SSL expiry date</td>
		  		  <td>Redirect without SGTIN</td>
		  		  <td>Redirect with SGTIN</td>
		  		  </tr>
		  		  </thead>
		  		  <tbody>
		  		    {listUrls}
		  		  </tbody>
		  		</Table>
	  		</Col>
  		</Row>
		);
  }
}

export default URLList;
