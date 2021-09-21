import React from "react";
import Helper from "./Helper";

const fetch = require('node-fetch');
// const sslChecker = require("ssl-checker");
// const checkCertExpiration = require('check-cert-expiration');
// const sslCertificate = require('get-ssl-certificate-next')


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
const SSLError = "Unable to get SSL";
const RedirectionError = "Unable to get the redirection";
const NoRedirectionMessage = "No redirection - <span class='rolex-experience' >Rolex experience</span>";

const API_DNS = "https://tj4k759l15.execute-api.eu-west-1.amazonaws.com/test/dnslookup?DNS=";
const API_SSL = "https://tj4k759l15.execute-api.eu-west-1.amazonaws.com/test/getsslexpirydate?DNS=";
const API_REDIRECT = "https://tj4k759l15.execute-api.eu-west-1.amazonaws.com/test/getredirect?URL=";

class URL extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
    	updateInProgress: false,
    	updateDNSInProgress: false,
    	updateSSLInProgress: false,
    	updateRedirWithSGTINInProgress: false,
    	updateRedirWithoutSGTINInProgress: false,
    	sgtin: Helper.getRandomSGTIN()
    };

    this.state = {
    	url: props.domain + "/" + this.state.sgtin
    };
  }

  componentDidUpdate() {
  	if (this.props.update === true && !this.state.updateInProgress && (!this.state.cname || !this.state.SSLExpiryDate || !this.state.redirectWithSGTIN || !this.state.redirectWithoutSGTIN)) {
  		// updateInProgress is here to avoid calling the update again while it is already called
  		this.setState({
  			updateInProgress: true,
  			updateDNSInProgress: true,
  			updateSSLInProgress: true,
  			updateRedirWithSGTINInProgress: true,
  			updateRedirWithoutSGTINInProgress: true,
  		});
    	this.getAllURLDetails(this.props.domain);
  	}
  	else if (this.props.updateDNS === true && !this.state.updateDNSInProgress && !this.state.cname) {
  		this.setState({
  			updateDNSInProgress: true,
  		});
    	this.getDNSDetails(this.props.domain);
  	}
  	else if (this.props.updateSSL === true && !this.state.updateSSLInProgress && !this.state.SSLExpiryDate) {
  		this.setState({
  			updateSSLInProgress: true,
  		});
    	this.getSSLDetails(this.props.domain);
  	}
  	else if (this.props.updateRedirection === true 
  						&& !this.state.updateRedirWithoutSGTINInProgress && !this.state.redirectWithoutSGTIN
  						&& !this.state.updateRedirWithSGTINInProgress && !this.state.redirectWithSGTIN) {
  		this.setState({
  			updateRedirWithoutSGTINInProgress: true,
  			updateRedirWithSGTINInProgress: true,
  		});
    	this.getRedirectionDetails(this.props.domain);
  	}
  }

  async dnsExist(domain) {
  			return new Promise((resolve, reject) => {
  				// console.log(API_DNS+domain);
  				fetch(API_DNS+domain, {
  						method: 'GET',
  					})
  			    .then(res => res.json())
  	        .then(body => resolve(body.CNAME[0]))
  			    .catch(err => {
  			    	console.log("getDNS err", API_DNS+domain, err);
  			    	reject(err);
  			    });
  			});
  }

  async getSSLExpiryDate(domain) {
		return new Promise((resolve, reject) => {
			// console.log(API_SSL+domain);
			fetch(API_SSL+domain, {
					method: 'GET',
				})
		    .then(res => res.json())
        .then(body => resolve(body.daysRemaining))
		    .catch(err => {
		    	console.log("getSSL err", API_SSL+domain, err);
		    	reject(err);
		    });
		});
	}

	async getRedirect(fullURL) {
		return new Promise((resolve, reject) => {
			// console.log(API_REDIRECT+domain);
			fetch(API_REDIRECT+fullURL, {
					method: 'GET',
				})
		    .then(res => {
		    	if (!res.ok) {
			    	console.log("getRedirect err", API_REDIRECT+fullURL, "Not a 200 response");
			    	reject(res);
		    	}
		    	return res.json();
		    })
        .then(body => resolve(body.redirect))
		    .catch(err => {
		    	console.log("getRedirect err", API_REDIRECT+fullURL, err);
		    	reject(err);
		    });
		});
	}

	// TODO : if API error, handle it and display a dedicated error message. Or even allows to retry.
  async getAllURLDetails(domain) {
  	await this.getDNSDetails(domain);

		if (this.state.cname && this.state.cname !== cnameErrorMessage) {
			await this.getSSLDetails(domain);
  		await this.getRedirectionDetails(domain);
  	}
  	this.setState({
  		updateInProgress: false,
  	});
  }

  async getDNSDetails(domain) {
		var domainAndCnameData = {};
		try {
			var cname = await this.dnsExist(Helper._removeDomainProtocol(domain));
			this.setState({
				cname: cname
			});

			var server;
			if (this.props.cnameMapping[cname]) {
					server = this.props.cnameMapping[cname];
			} else if (this.props.cnameMapping[cname+"."]) {
					server = this.props.cnameMapping[cname+"."];
			} else {
					server = serverUnknownMessage;
			}
			this.setState({
				server: server
			});
			domainAndCnameData[Helper._removeDomainProtocol(domain)] = cname + ' ' + server;
			this.props.parentCallback(domainAndCnameData);

		} catch (err) {
			this.setState({
				cname: cnameErrorMessage
			});
			domainAndCnameData[Helper._removeDomainProtocol(domain)] = cnameErrorMessage;
			this.props.parentCallback(domainAndCnameData);
			console.log(domain + ": Error", err);
		}

		this.setState({
			updateDNSInProgress: false,
		});
  }

  async getSSLDetails(domain) {
		try {
			var SSLExpiryDate = await this.getSSLExpiryDate(Helper._removeDomainProtocol(domain));
			this.setState({
				SSLExpiryDate: SSLExpiryDate
			});
		} catch (err) {
			this.setState({
				SSLExpiryDate: SSLError
			});
			console.log(domain + ": Error", err);
		}

		this.setState({
			updateSSLInProgress: false,
		});
  }

  async getRedirectionDetails(domain) {
		try {
			//TODO : test if http/https is there
			var redirectWithSGTIN = await this.getRedirect(this.state.url);
			if (redirectWithSGTIN === this.state.url) {
				redirectWithSGTIN = NoRedirectionMessage;
			}
			this.setState({
				redirectWithSGTIN: redirectWithSGTIN
			});
		} catch (err) {
			this.setState({
				redirectWithSGTIN: RedirectionError
			});
			console.log(domain + ": Error", err);
		}

		this.setState({
			updateRedirWithSGTINInProgress: false,
		});


		try {
			//TODO : test if http/https is there
			var redirectWithoutSGTIN = await this.getRedirect(domain);
			if (redirectWithoutSGTIN === domain || redirectWithoutSGTIN === domain+"/" || redirectWithoutSGTIN + "/" === domain) {
				redirectWithoutSGTIN = NoRedirectionMessage;
			}
			this.setState({
				redirectWithoutSGTIN: redirectWithoutSGTIN
			});
		} catch (err) {
			this.setState({
				redirectWithoutSGTIN: RedirectionError
			});
			console.log(domain + ": Error", err);
		}

		this.setState({
			updateRedirWithoutSGTINInProgress: false,
		});
  }


  redirectionsWithSGTINisTheSameAsWithoutSGTIN() {
  	if (!this.state.redirectWithoutSGTIN || this.state.redirectWithoutSGTIN.length < 1 || !this.state.redirectWithSGTIN || this.state.redirectWithSGTIN.length < 1 ) {
  		return true;
  	}

  	if (this.state.redirectWithoutSGTIN === this.state.redirectWithSGTIN || this.state.redirectWithSGTIN.includes(this.state.redirectWithoutSGTIN)) {
  		return true;
  	}
  	return false;
  }

  render() {
  	if (!this.props.display) {
  		return null;
  	}
  	// console.log(this.props, this.state.updateRedirWithoutSGTINInProgress);

  	var domain = Helper._removeDomainProtocol(this.props.domain, this.state.url);

  	// DNS cell
  	var tdCnameClass = "";
  	var DNSContent = this.state.cname;
  	if (this.state.updateDNSInProgress) {
  		tdCnameClass = "updating";
  	}
  	if (this.state.server === serverUnknownMessage) {
  		tdCnameClass = "warningCell";
  	} 
  	if (this.state.cname === cnameErrorMessage) {
  		tdCnameClass = "errorCell";
  	}
  	if ("server" in this.state) {
  		DNSContent = this.state.cname + "<br/>" + this.state.server 
  	}

  	// SSL cell
  	var tdSSLClass = "";
  	var SSLContent = "";
  	if (this.state.updateSSLInProgress) {
  		tdSSLClass = "updating";
  	}
  	if (this.state.SSLExpiryDate === SSLError) {
  		tdSSLClass = "errorCell";
  		SSLContent = SSLError
  	} else if (this.state.SSLExpiryDate < 40) {
			tdSSLClass = "warningCell";
		} else if (this.state.SSLExpiryDate) {
			SSLContent = this.state.SSLExpiryDate + " days";
  	}

  	// Redirection
  	var tdRedirectionClass = "";
  	var RedirectionContent = "";
  	var sameRedirectionsWithOrWithoutSGTIN = true;
  	if (typeof this.state.redirectWithoutSGTIN !== "undefined" && typeof this.state.redirectWithSGTIN !== "undefined") {
  		sameRedirectionsWithOrWithoutSGTIN = this.redirectionsWithSGTINisTheSameAsWithoutSGTIN();
  	}

  	if (this.state.updateRedirWithoutSGTINInProgress) {
  		tdRedirectionClass = "updating";
  	}
  	if (this.state.redirectWithoutSGTIN === RedirectionError) {
  		tdRedirectionClass = "errorCell";
  		RedirectionContent = RedirectionError;
		} else {
			RedirectionContent = this.state.redirectWithoutSGTIN;
		}
  	if (!sameRedirectionsWithOrWithoutSGTIN) {
  		tdRedirectionClass = "warningCell";
  		RedirectionContent = "Without SGTIN: "+ RedirectionContent+"<br/>With SGTIN:" + this.state.redirectWithSGTIN;
  	}

  	return (
  		<tr>
  			<td>{this.props.site}</td>
  			<td>{this.props.environment}</td>
  			<td>{domain}</td>
  			<td className={tdCnameClass} dangerouslySetInnerHTML={{__html: DNSContent}}></td>
  			<td className={tdSSLClass}>{SSLContent}</td>
  			<td className={tdRedirectionClass} dangerouslySetInnerHTML={{__html: RedirectionContent}}></td>
  		</tr>
		);
  }

}

export default URL;
