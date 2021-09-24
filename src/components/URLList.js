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

    var dns = Helper._removeDomainProtocol(domain.URL);
    if (this.props.cnameFilter.length > 0 
      && 
        (!(dns in this.state.domainsToCnames) || !(this.state.domainsToCnames[dns].toLowerCase().includes(this.props.cnameFilter.toLowerCase())))
        ) {
        return true;
    }

    for (var column in this.props.columnsFilters) {
      if (this.props.columnsFilters[column].isVisible 
          && this.props.columnsFilters[column].filter && this.props.columnsFilters[column].filter.length > 0
          && !domain[column].toLowerCase().includes(this.props.columnsFilters[column].filter.toLowerCase())) {
        return true;
      }
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

    var redirectFilter = this.props.redirectFilter;
    
  	const listUrls = this.state.urls.map((domain) => {
      
      var update = this.props.update;
      var updateDNS = this.props.updateDNS;
      var updateSSL = this.props.updateSSL;
      var updateRedirection = this.props.updateRedirection;
      var display = true;
      if (this.URLisFiltered(domain)) {
        update = false;
        updateDNS = false;
        updateSSL = false;
        updateRedirection = false;
        display = false;
      }

      domain.URL = domain.URL.trim();
      
  	  return <URL 
                  key={domain.URL}
                  domain={domain.URL}
                  Brand={domain.Brand}              // dynamic field
                  Environment={domain.Environment}  // dynamic field
                  URL={domain.URL}                  // dynamic field
                  Live={domain.Live}                // dynamic field
                  GeoDNS={domain.GeoDNS}            // dynamic field
                  Server={domain.Server}            // dynamic field
                  redirectFilter={redirectFilter}
                  cnameMapping={cnameMapping}
                  update={update}
                  updateDNS={updateDNS}
                  updateSSL={updateSSL}
                  updateRedirection={updateRedirection}
                  display={display}
                  parentCallback={this.handleCallback}
                  columnsFilters={this.props.columnsFilters}
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
