import React from "react";
import Helper from "./Helper";

const fetch = require('node-fetch');
// const sslChecker = require("ssl-checker");
// const checkCertExpiration = require('check-cert-expiration');
const sslCertificate = require('get-ssl-certificate-next')


// from: https://stackoverflow.com/questions/43262121/trying-to-use-fetch-and-pass-in-mode-no-cors
// Generated with:
// 	git clone https://github.com/Rob--W/cors-anywhere.git
// 	cd cors-anywhere/
// 	npm install
// 	heroku create
// 	git push heroku master
// const CORS_PROXY = 'https://infinite-crag-06340.herokuapp.com/';

const cnameErrorMessage = "Doesn't exist";
const serverUnknownMessage = "Unknown server";

class URL extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
    	updateInProgress: false,
    	sgtin: Helper.getRandomSGTIN()
    };
    this.state = {
    	url: props.domain + "/" + this.state.sgtin
    };
  }

  componentDidUpdate() {
  	if (this.props.update && !this.state.updateInProgress && !this.state.cname) {
  		// updateInProgress is here to avoid calling the update again while it is already called but 
  		this.setState({
  			updateInProgress: true
  		});
    	this.getDNSDetails(this.props.domain);
  	}
  }

  async dnsExist(domain) {
  	return new Promise((resolve, reject) => {

  		domain = Helper._removeDomainProtocol(domain);

  		var url = 'https://dns.google/resolve?name=' + domain;

  		fetch(url)
		    .then(res => res.json())
		    .then(json => {
		    	if (json.Answer) {
		    		var cname = json.Answer[0].data;
			  		resolve(cname);
		    	}
		    	reject(json);
		    })
		    .catch(err => {
		    	console.log(err);
		    	reject(err);
		    });
  	});
  }

  // getSSLExpiryDate(domain) {
		// domain = Helper._removeDomainProtocol(domain);
		// console.log("Getting SSL expiry date for "+domain);
		// (async function () {
	 //    try {
  //       const { valid_to, daysLeft, host, port } = await checkCertExpiration('qru.aptamilessensis.com');
  //       console.log(`${daysLeft} days until the certificate expires for ${host}:${port}`);
		// 		this.setState({
		// 			SSLExpiryDate: valid_to
		// 		});
		// 		return valid_to;
	 //    } catch (err) {
  //       console.error(`${err.name}:${err.message}`);
  //       return err;
	 //    }
  //   })();
  // }

  // async getSSLExpiryDate(domain) {
  // 	return new Promise((resolve, reject) => {
  // 		domain = Helper._removeDomainProtocol(domain);
  // 		console.log("SSL",domain);
  // 		sslChecker(domain, { method: "GET", port: 443 })
  // 			.then((data) => {
  // 				this.setState({
  // 					SSLExpiryDate: data.validTo
  // 				});
  // 				resolve(data.validTo);
  // 			});
  // 	});
  // }
  
  async getSSLExpiryDate(domain) {
  	return new Promise((resolve, reject) => {
	  		domain = Helper._removeDomainProtocol(domain);

	  		sslCertificate.get(domain).then(function (certificate) {
					resolve(certificate.valid_to);
	  		})
	  		.catch(err => {
	  			console.log("SSL domain for "+domain, err);
	  			reject(err);
	  		});
	  });
	}

	async getRedirect(fullURL) {
		return new Promise((resolve, reject) => {
			fetch(fullURL, {
					method: 'GET',
				})
		    .then(res => {
			    	resolve(res.url);
		    })
		    .catch(err => {
		    	console.log("getRedirect err", fullURL, err);
		    	reject(err);
		    });
		});
	}

  async getDNSDetails(domain) {

  	var domainAndCnameData = {};
  	try {
  		var cname = await this.dnsExist(domain);
  		this.setState({
  			cname: cname
  		});

  		var server;
  		if (this.props.cnameMapping[cname]) {
  				server = this.props.cnameMapping[cname];
  		} else {
  				server = serverUnknownMessage;
  		}
			this.setState({
				server: server
			});
	  	domainAndCnameData[Helper._removeDomainProtocol(domain)] = cname + ' ' + server;
	  	this.props.parentCallback(domainAndCnameData);

			// if (cname) {
	  // 		try {
		 //  		var SSLExpiryDate = await this.getSSLExpiryDate(domain);
		 //  		this.setState({
		 //  			SSLExpiryDate: SSLExpiryDate
		 //  		});
	  // 		} catch (err) {
	  // 			this.setState({
	  // 				SSLExpiryDate: "Unable to get SSL"
	  // 			});
	  // 			console.log(domain + ": Error", err);
	  // 		}

	  // 		try {
	  // 			//TODO : test if http/https is there
		 //  		var redirectWithoutSGTIN = await this.getRedirect(domain);
		 //  		if (redirectWithoutSGTIN === domain+"/") {
		 //  			redirectWithoutSGTIN = "No redirection";
		 //  		}
		 //  		this.setState({
		 //  			redirectWithoutSGTIN: redirectWithoutSGTIN
		 //  		});
	  // 		} catch (err) {
	  // 			this.setState({
	  // 				redirectWithoutSGTIN: "Unable to get the redirection"
	  // 			});
	  // 			console.log(domain + ": Error", err);
	  // 		}

	  // 		try {
		 //  		//TODO : test if http/https is there
		 //  		var redirectWithSGTIN = await this.getRedirect(this.state.url);
		 //  		if (redirectWithSGTIN === this.state.url) {
		 //  			redirectWithSGTIN = "No redirection";
		 //  		}
		 //  		this.setState({
		 //  			redirectWithSGTIN: redirectWithSGTIN
		 //  		});
	  // 		} catch (err) {
		 //  		this.setState({
		 //  			redirectWithSGTIN: "Unable to get the redirection"
		 //  		});
	  // 			console.log(domain + ": Error", err);
	  // 		}
	  // 	}

  	} catch (err) {
  		this.setState({
  			cname: cnameErrorMessage
  		});
  		domainAndCnameData[Helper._removeDomainProtocol(domain)] = cnameErrorMessage;
  		this.props.parentCallback(domainAndCnameData);
  		console.log(domain + ": Error", err);
  	}

  }

  render() {
  	var domain = Helper._removeDomainProtocol(this.props.domain);

  	var tdCnameClass = "";
  	if (this.state.server === serverUnknownMessage) {
  		tdCnameClass = "warningCell";
  	} 
  	if (this.state.cname === cnameErrorMessage) {
  		tdCnameClass = "errorCell";
  	}
  	var cnameCell = <td className={tdCnameClass} >{this.state.cname}</td>;
  	if ("server" in this.state) {
  		cnameCell = <td className={tdCnameClass} >{this.state.cname}<br/>{this.state.server}</td> 
  	}

  	if (!this.props.display) {
  		return null;
  	}

  	return (
  		<tr>
  			<td>{this.props.site}</td>
  			<td>{this.props.environment}</td>
  			<td>{domain}</td>
  			{cnameCell}
  			<td>{this.state.SSLExpiryDate}</td>
  			<td>{this.state.redirectWithoutSGTIN}</td>
  			<td>{this.state.redirectWithSGTIN}</td>
  		</tr>
		);
  }

}

export default URL;
