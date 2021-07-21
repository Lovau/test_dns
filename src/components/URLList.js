import React from "react";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Papa from 'papaparse';
import URL from './URL';
// import CSV from "../data/urls.csv";
import CSV from "../data/Rolex_URL_working_copy.csv";
import cnameMapping from "../data/cname_mapping.json";
import Helper from "./Helper";

const fetch = require('node-fetch');
var URLs;

class URLList extends React.Component {

  constructor(props) {
    super(props);

    //  this.state.urls[0] = {'domain': "https://qru.aptamilessensis.com", "update": false};
    //  this.state.urls[1] = {'domain': "https://qr.aptaclub.de", "update": false};
    //  this.state.urls[2] = {'domain': "https://qrG.aptaclub.de", "update": false};
    this.state = {
     domainsToCnames: {}
    };

    this.handleCallback = this.handleCallback.bind(this);
  }

  handleCallback(childData) {
    var domainsToCnames = { ...this.state.domainsToCnames, ...childData };

    this.setState({
      domainsToCnames: domainsToCnames
    });
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

  URLisFiltered(domain) {
    if (this.props.siteFilter.length > 0 && !(domain.Brand.toLowerCase().includes(this.props.siteFilter.toLowerCase()))) {
      return true;
    }
    if (this.props.environmentFilter.length > 0 && !(domain.Environment.toLowerCase().includes(this.props.environmentFilter.toLowerCase()))) {
      return true;
    }
    if (this.props.domainFilter.length > 0 && !(domain.URL.toLowerCase().includes(this.props.domainFilter.toLowerCase()))) {
      return true;
    }

    var dns = Helper._removeDomainProtocol(domain.URL);
    if (this.props.cnameFilter.length > 0 
      && 
        (!(dns in this.state.domainsToCnames) || !(this.state.domainsToCnames[dns].toLowerCase().includes(this.props.cnameFilter.toLowerCase())))
        ) {
        return true;
    }

    return false;
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

  	const listUrls = this.state.urls.map((domain) => {
      
      var update = this.props.update;
      var updateDNS = this.props.updateDNS;
      var updateSSL = this.props.updateSSL;
      var updateRedirectionWithoutSGTIN = this.props.updateRedirectionWithoutSGTIN;
      var updateRedirectionWithSGTIN = this.props.updateRedirectionWithSGTIN;
      var display = true;
      if (this.URLisFiltered(domain)) {
        update = false;
        updateDNS = false;
        updateSSL = false;
        updateRedirectionWithoutSGTIN = false;
        updateRedirectionWithSGTIN = false;
        display = false;
      }
      
  	  return <URL key={domain.URL} 
				  	  		site={domain.Brand} 
				  	  		environment={domain.Environment} 
				  	  		domain={domain.URL} 
                  cnameMapping={cnameMapping}
                  update={update}
                  updateDNS={updateDNS}
                  updateSSL={updateSSL}
                  updateRedirectionWithoutSGTIN={updateRedirectionWithoutSGTIN}
                  updateRedirectionWithSGTIN={updateRedirectionWithSGTIN}
                  display={display}
                  parentCallback={this.handleCallback}
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
