import React from "react";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Papa from 'papaparse';
import URL from './URL';
// import CSV from "../data/urls.csv";
import CSV from "../data/Rolex_URL_working_copy.csv";

const fetch = require('node-fetch');
var URLs;

class URLList extends React.Component {

  constructor(props) {
    super(props);

   //  this.state.urls[0] = {'domain': "https://qru.aptamilessensis.com", "update": false};
   //  this.state.urls[1] = {'domain': "https://qr.aptaclub.de", "update": false};
   //  this.state.urls[2] = {'domain': "https://qrG.aptaclub.de", "update": false};

    this.handleTriggerClick = this.handleTriggerClick.bind(this);
  }

  async getURLs() {
  	// if (URLs && URLs.length > 0) {
  	// 	return URLs;
  	// }
  	URLs = await this.readCSV();
  	for (var i = 0; i < URLs.length; i++) {
  		URLs[i].update = false;
  	}

    this.setState({
    	urls: URLs
    });
  }

  async readCSV() {
  	return fetch(CSV)
  	  .then((response) => {
  	  	return response.text();
  	  })
  	  .then(text => {
		  	var results = Papa.parse(text, { header: true, skipEmptyLines: true }); // object with { data, errors, meta }
  		  var rows = results.data; // array of objects
  		  // console.log("Results, rows", results, rows);
  		  return rows;
  	  });
  }

  componentDidMount() {
    this.getURLs();
  }

  // componentDidUpdate() {
  //   this.getURLs();
  // }

  handleTriggerClick() {
  	console.log("click !");
  	var urls = this.state.urls;
  	for (var i = 0; i < urls.length; i++) {
  		urls[i].update = true;
  	}
  	this.setState({
  		urls: urls
  	});
  }

  render() {
  	if (!this.state || !("urls" in this.state) || this.state.urls.length < 1) {
  		return (
  			<Row>
	  			<Col sm={4}>
	  				No URLs provided.
	  			</Col>
	  		</Row>
  		);
  	}
  	var domains = this.state.urls;

  	const listUrls = domains.map((domain) => {
  	  return <URL key={domain.URL} 
				  	  		site={domain.Brand} 
				  	  		environment={domain.Environment} 
				  	  		domain={domain.URL} 
				  	  		update={this.props.update}
				  	  		siteFilter={this.props.siteFilter}
				  	  		environmentFilter={this.props.environmentFilter}
				  	  		domainFilter={this.props.domainFilter}
		  	  		/>
  	});

  	return (
  		<tbody>

  		    {listUrls}
  		    </tbody>

		);
  }
}

export default URLList;
