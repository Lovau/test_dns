import React from "react";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Papa from 'papaparse';
import URL from './URL';
// import CSV from "../data/urls.csv";
import CSV from "../data/Rolex_URL_working_copy.csv";
import cnameMapping from "../data/cname_mapping.json";
import Helper from "./Helper";
import DomainDataService from "../admin/services/domain.service";

const fetch = require('node-fetch');


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
    this.state.loadingURLs = false;
  }

  handleCallback(childData) {
    var domainsToCnames = { ...this.state.domainsToCnames, ...childData };

    this.setState({
      domainsToCnames: domainsToCnames
    });
  }

  async getURLsFromCSV() {
  	// if (URLs && URLs.length > 0) {
  	// 	return URLs;
  	// }
  	var URLs = await this.readCSV();
  	for (var i = 0; i < URLs.length; i++) {
  		URLs[i].update = false;
  	}

    console.log("URLS", URLs);

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

  async retrieveDomains() {
    this.setState({
      loadingURLs: true
    });

    await DomainDataService.getAll()
      .then(response => {
        var URLs = response.data.Items;
        for (var i = 0; i < URLs.length; i++) {
          URLs[i].update = false;
        }

        this.setState({
          domains: URLs,
          loadingURLs: false
        });

        this.orderDomains();
      })
      .catch(e => {
        console.log(e);
      });
  }
  
  orderDomains() {
    this.setState({
      domains: this.state.domains.sort((a, b) => {
        var brandcompare = a.brand.localeCompare(b.brand);
        if (brandcompare !== 0) {
          return brandcompare;
        }
        return a.environment.localeCompare(b.environment);
      })
    });
  }

  componentDidMount() {
    // this.getURLsFromCSV();
    this.retrieveDomains();
  }

  URLisFiltered(domain) {

    var dns = Helper._removeDomainProtocol(domain.brand);
    if (this.props.cnameFilter.length > 0 
      && 
        (!(dns in this.state.domainsToCnames) || !(this.state.domainsToCnames[dns].toLowerCase().includes(this.props.cnameFilter.toLowerCase())))
        ) {
        return true;
    }

    for (var column in this.props.columnsFilters) {
      if (this.props.columnsFilters[column].isVisible 
          && this.props.columnsFilters[column].filter && this.props.columnsFilters[column].filter.length > 0
          && !domain[Helper.getDBNameFromDisplayName(column)].toLowerCase().includes(this.props.columnsFilters[column].filter.toLowerCase())) {
        return true;
      }
    }

    return false;
  }

  render() {

  	// if (!this.state || !("urls" in this.state) || this.state.urls.length < 1) {
    if (this.state && this.state.loadingURLs) {
      return (
        <Row>
          <Col sm={12}>
            Loading the URLs ...
          </Col>
        </Row>
      );
    } 
    else if (!this.state || !("domains" in this.state) || this.state.domains.length < 1) {
  		return (
  			<Row>
	  			<Col sm={4}>
	  				No URLs provided.
	  			</Col>
	  		</Row>
  		);
  	}

    var redirectFilter = this.props.redirectFilter;
    
  	// const listUrls = this.state.urls.map((domain) => {
    const listUrls = this.state.domains.map((domain) => {
      
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

      domain.brand = domain.brand.trim();
      
  	  return <URL 
                  key={domain.domain}
                  uuid={domain.uuid}
                  domain={domain.domain}
                  Brand={domain.brand}              // dynamic field
                  Environment={domain.environment}  // dynamic field
                  URL={domain.domain}                  // dynamic field
                  Live={domain.live}                // dynamic field
                  Comment={domain.comment}                // dynamic field
                  redirectFilter={redirectFilter}
                  cnameMapping={cnameMapping}
                  update={update}
                  updateDNS={updateDNS}
                  updateSSL={updateSSL}
                  updateRedirection={updateRedirection}
                  display={display}
                  parentCallback={this.handleCallback}
                  columnsFilters={this.props.columnsFilters}
                  isadmin={this.props.isadmin}
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
