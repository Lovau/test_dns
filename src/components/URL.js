import React from "react";
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

class URL extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
    	sgtin: this.getRandomSGTIN()
    };
    this.state = {
    	url: props.domain + "/" + this.state.sgtin
    };

    // this.handleClick = this.handleClick.bind(this);
  }

  // handleClick() {
  // 	if (! this.state.cname) {
	 //  	console.log("click !");
	 //  	this.getDNSDetails(this.props.domain);
		// }
  // }

  componentDidMount() {
  	if (this.props.update && !this.state.cname) {
    	this.getDNSDetails(this.props.domain);
  	}
  }
  componentDidUpdate() {
  	if (this.props.update && !this.state.cname) {
    	this.getDNSDetails(this.props.domain);
  	}
  }


  _randomstring(length, hasCharacters = true) {
      var result           = '';
      var characters       = '0123456789';
      if (hasCharacters) {
      	characters += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      }
      var charactersLength = characters.length;
      for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
     }
     return result;
  }

  getRandomSGTIN() {
  	// return '0' + this._randomstring(12, false) + '9' + this._randomstring(11, true);
  	return '0123';
  }

  _removeDomainProtocol(domain) {
  	if (domain.includes("https://")) {
  		 domain = domain.replace("https://", "");
  	} else if (domain.includes("http://")) {
  		 domain = domain.replace("http://", "");
  	} 
  	return domain;
  }

  async dnsExist(domain) {
  	return new Promise((resolve, reject) => {

  		domain = this._removeDomainProtocol(domain);

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
		// domain = this._removeDomainProtocol(domain);
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
  // 		domain = this._removeDomainProtocol(domain);
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
	  		domain = this._removeDomainProtocol(domain);

	  		sslCertificate.get(domain).then(function (certificate) {
	  			console.log("SSL expiry date for domain "+domain+ ": "+certificate.valid_to)
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
					method: 'GET', // The method
				})
		    .then(res => {
			    	console.log("Redirect for "+fullURL+" is: "+ res.url, res);
			    	resolve(res.url);
		    })
		    .catch(err => {
		    	console.log("getRedirect err", fullURL, err);
		    	reject(err);
		    });
		});
	}

  async getDNSDetails(domain) {

  	try {
  		var cname = await this.dnsExist(domain);
  		this.setState({
  			cname: cname
  		});
  		console.log(domain + ": CNAME", this.state.cname);

			if (cname) {
	  		try {
		  		var SSLExpiryDate = await this.getSSLExpiryDate(domain);
		  		this.setState({
		  			SSLExpiryDate: SSLExpiryDate
		  		});
		  		console.log(domain + ": SSL expiry Date", SSLExpiryDate);
	  		} catch (err) {
	  			this.setState({
	  				SSLExpiryDate: "Unable to get SSL"
	  			});
	  			console.log(domain + ": Error", err);
	  		}

	  		try {
	  			//TODO : test if http/https is there
		  		var redirectWithoutSGTIN = await this.getRedirect(domain);
		  		if (redirectWithoutSGTIN === domain+"/") {
		  			redirectWithoutSGTIN = "No redirection";
		  		}
		  		this.setState({
		  			redirectWithoutSGTIN: redirectWithoutSGTIN
		  		});
		  		console.log(domain + " redirects to "+ redirectWithoutSGTIN);
	  		} catch (err) {
	  			this.setState({
	  				redirectWithoutSGTIN: "Unable to get the redirection"
	  			});
	  			console.log(domain + ": Error", err);
	  		}

	  		try {
		  		//TODO : test if http/https is there
		  		var redirectWithSGTIN = await this.getRedirect(this.state.url);
		  		if (redirectWithSGTIN === this.state.url) {
		  			redirectWithSGTIN = "No redirection";
		  		}
		  		this.setState({
		  			redirectWithSGTIN: redirectWithSGTIN
		  		});
		  		console.log(this.state.url + " redirects to "+ redirectWithSGTIN);
	  		} catch (err) {
		  		this.setState({
		  			redirectWithSGTIN: "Unable to get the redirection"
		  		});
	  			console.log(domain + ": Error", err);
	  		}
	  	}

  	} catch (err) {
  		this.setState({
  			cname: "Doesn't exist"
  		});
  		console.log(domain + ": Error", err);
  	}
  }

  render() {
  	return (
  		<tr>
  			<td>{this.state.url}</td>
  			<td>{this.state.cname}</td>
  			<td>{this.state.SSLExpiryDate}</td>
  			<td>{this.state.redirectWithoutSGTIN}</td>
  			<td>{this.state.redirectWithSGTIN}</td>
  		</tr>
	);
  }

}

export default URL;
