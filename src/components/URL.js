import React from "react";
import Helper from "./Helper";
import DomainDataService from "../admin/services/domain.service";
import { Link } from "react-router-dom";

const fetch = require('node-fetch');
// const sslChecker = require("ssl-checker");
// const checkCertExpiration = require('check-cert-expiration');
// const sslCertificate = require('get-ssl-certificate-next')

const cnameErrorMessage = "Doesn't exist";
const serverUnknownMessage = "Unknown server";
const SSLError = "Unable to get SSL";
const RedirectionError = "Unable to get the redirection";
const NoRedirectionMessage = "No redirection";
const RolexExperienceMessage = "<span class='rolex-experience' >Rolex experience</span>";

// curl --location --request https://tj4k759l15.execute-api.eu-west-1.amazonaws.com/test/dnslookup?DNS=qrt.aptaclub.de --header 'x-api-key: 44XlITH2DCdahKjpe4401eT5070UwdK9xBFCJMR6'
// curl --location --request https://fd902g59y1.execute-api.eu-west-1.amazonaws.com/prod/dnslookup?DNS=qrt.aptaclub.de --header 'x-api-key: ARISr1o5Cp5ElA4GyfbWeR4hgrZeINBaeLTuJZ04'

// const API_DNS = "https://tj4k759l15.execute-api.eu-west-1.amazonaws.com/test/dnslookup?DNS="; // sandbox
// const API_SSL = "https://tj4k759l15.execute-api.eu-west-1.amazonaws.com/test/getsslexpirydate?DNS="; // sandbox
// const API_REDIRECT = "https://tj4k759l15.execute-api.eu-west-1.amazonaws.com/test/getredirect?URL="; // sandbox
// const API_KEY = "44XlITH2DCdahKjpe4401eT5070UwdK9xBFCJMR6"; //sandbox

const API_DNS = "https://fd902g59y1.execute-api.eu-west-1.amazonaws.com/prod/dnslookup?DNS="; // prod
const API_SSL = "https://fd902g59y1.execute-api.eu-west-1.amazonaws.com/prod/getsslexpirydate?DNS="; // prod
const API_REDIRECT = "https://fd902g59y1.execute-api.eu-west-1.amazonaws.com/prod/getredirect?URL="; // prod
const API_KEY = "ARISr1o5Cp5ElA4GyfbWeR4hgrZeINBaeLTuJZ04"; // prod

class URL extends React.Component {

  constructor(props) {
    super(props);

    this.setActiveDomain = this.setActiveDomain.bind(this);
    this.setEditMode = this.setEditMode.bind(this);
    this.cancelEditMode = this.cancelEditMode.bind(this);
    this.validateComment = this.validateComment.bind(this);
    this.onChangeComment = this.onChangeComment.bind(this);

    this.state = {
    	updateInProgress: false,
    	updateDNSInProgress: false,
    	updateSSLInProgress: false,
    	updateRedirWithSGTINInProgress: false,
    	updateRedirWithoutSGTINInProgress: false,
    	sgtin: Helper.getRandomSGTIN()
    };

    this.state = {
    	url: props.domain + "/" + this.state.sgtin,
      isSelected: false,
      editMode: false
    };
  }
  
  setEditMode(e) {
  	if (!this.state.editMode) {
	  	this.setState({
	  		editMode: true
	  	});
  	}
  }  

  onChangeComment(e) {
  	console.log("comment updated");
    this.setState({
      comment: e.target.value
    });
  }
 
  cancelEditMode(e) {
  	console.log("Cancel comment");
  	this.setState({
  		editMode: false,
  		comment: null
  	});
  }

  validateComment(e) {
  	if (!this.state.comment) {
  		this.setState({
  			editMode: false,
  		});
  		return;
  	}

  	var domain = Object.assign({}, this.props);
  	domain.comment = this.state.comment;
  	console.log("validate comment", domain);

  	DomainDataService.update(
  	  domain.uuid,
  	  domain
  	)
  	  .then(response => {
  	    console.log(response.data);
  	    this.setState({
  	      submitted: true,
  	      message: "The domain was updated successfully!"
  	    });
  	  })
  	  .catch(e => {
  	    console.log(e);
  	  });

  	this.setState({
  		editMode: false
  	});
  }

  setActiveDomain() {
    this.setState({
      isSelected: !this.state.isSelected
    });
  }

  componentDidMount() {

  }

  componentDidUpdate() {
  	if (this.props.update === true && !this.state.updateInProgress && !this.state.cname && !this.state.otherRecords) {
  	// || !this.state.SSLExpiryDate || !this.state.redirectWithSGTIN || !this.state.redirectWithoutSGTIN)) {
  	
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
  	else if (this.props.updateDNS === true && !this.state.updateDNSInProgress && !this.state.cname && !this.state.otherRecords) {
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
  						&& !this.state.updateRedirWithoutSGTINInProgress
  						&& !this.state.updateRedirWithSGTINInProgress
  						&& (typeof this.state.redirects === "undefined" 
  								|| typeof this.state.redirects.redirectWithSGTIN === "undefined"
  								|| typeof this.state.redirects.redirectWithoutSGTIN === "undefined")) {
  		this.setState({
  			updateRedirWithoutSGTINInProgress: true,
  			updateRedirWithSGTINInProgress: true,
  		});
    	this.getRedirectionDetails(this.props.domain);
  	}
  }

  async dnsExist(domain) {
		return new Promise((resolve, reject) => {
			fetch(API_DNS+domain, {
					method: 'GET',
					headers:  {
						'x-api-key': API_KEY
					}
				})
		    .then(res => res.json())
        .then(body => {
        	resolve(body);
        })
		    .catch(err => {
		    	console.log("getDNS err2", API_DNS+domain, err);
		    	reject(err);
		    });
		});
  }

  async getSSLExpiryDate(domain) {
		return new Promise((resolve, reject) => {
			fetch(API_SSL+domain, {
					method: 'GET',
					headers:  {
						'x-api-key': API_KEY
					}
				})
		    .then(res => res.json())
        .then(body => {
        		if (!body.daysRemaining) {
        			console.log("getSSL err1", API_SSL+domain, body);
        			return reject(body);
        		}
        		return resolve(body.daysRemaining);
        	})
		    .catch(err => {
		    	console.log("getSSL err2", API_SSL+domain, err);
		    	reject(err);
		    });
		});
	}

	async getRedirect(fullURL) {
		return new Promise((resolve, reject) => {
			fetch(API_REDIRECT+fullURL, {
					method: 'GET',
					headers:  {
						'x-api-key': API_KEY
					}
				})
		    .then(res => {
		    	if (!res.ok) {
			    	console.log("getRedirect err", API_REDIRECT+fullURL, "Not a 200 response");
			    	reject(res);
		    	}
		    	return res.json();
		    })
        .then(body => resolve(body))
		    .catch(err => {
		    	console.log("getRedirect err", API_REDIRECT+fullURL, err);
		    	reject(err);
		    });
		});
	}

	// TODO : if API error, handle it and display a dedicated error message. Or even allows to retry.
  async getAllURLDetails(domain) {
  	await this.getDNSDetails(domain);

		if ((this.state.cname || this.state.otherRecords) && this.state.cname !== cnameErrorMessage) {
			await this.getSSLDetails(domain);
  		await this.getRedirectionDetails(domain);
  	} else {
  		this.setState({
  			SSLExpiryDate: SSLError,
  			redirects: {
  				redirectWithoutSGTIN: {
  					msg: RedirectionError 
  				},
  				redirectWithSGTIN: {
  					msg: RedirectionError 
  				},
  			}
  		});
  	}
  	this.setState({
  		updateInProgress: false,
  		updateDNSInProgress: false,
  		updateSSLInProgress: false,
  		updateRedirWithoutSGTINInProgress: false,
  		updateRedirWithSGTINInProgress: false,
  	});
  }


  // TODO: when no CNAME, check if the DNS exists with another record
  async getDNSDetails(domain) {
		var domainAndCnameData = {};
		try {
			var response = await this.dnsExist(Helper._removeDomainProtocol(domain));
			console.log("DNS response", response);
			var cname, otherRecords;
			if ('CNAME' in response && response.CNAME[0]) {
				cname = response.CNAME[0];
			} else if ('otherrecords' in response) {
				otherRecords = response.otherrecords;
			} else {
				throw Error("Record not found");
			}

			this.setState({
				cname: cname,
				otherRecords: otherRecords
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
			var redirects = {};
			redirects.redirectWithSGTIN = {};
			redirects.redirectWithSGTIN = await this.getRedirect(this.state.url);
			redirects.redirectWithSGTIN.msg = redirects.redirectWithSGTIN.redirect;
			if (redirects.redirectWithSGTIN.redirect === this.state.url) {
				redirects.redirectWithSGTIN.msg = NoRedirectionMessage;
			}
		} catch (err) {
			redirects.redirectWithSGTIN.msg = RedirectionError;
			console.log(domain + ": Error", err);
		}

		this.setState({
			updateRedirWithSGTINInProgress: false,
		});

		try {
			redirects.redirectWithoutSGTIN = {};
			redirects.redirectWithoutSGTIN = await this.getRedirect(domain);
			redirects.redirectWithoutSGTIN.msg = redirects.redirectWithoutSGTIN.redirect;
			if (redirects.redirectWithoutSGTIN.redirect === domain || redirects.redirectWithoutSGTIN.redirect === domain+"/" || redirects.redirectWithoutSGTIN.redirect + "/" === domain) {
				redirects.redirectWithoutSGTIN.msg = NoRedirectionMessage;
			}
		} catch (err) {
			redirects.redirectWithoutSGTIN.msg = RedirectionError;
			console.log(domain + ": Error", err);
		}

		this.setState({
			redirects: redirects,
			updateRedirWithoutSGTINInProgress: false,
		});
  }

  redirectionsWithSGTINisTheSameAsWithoutSGTIN() {
  	if (!this.state.redirects.redirectWithoutSGTIN.redirect || this.state.redirects.redirectWithoutSGTIN.redirect.length < 1 || !this.state.redirects.redirectWithSGTIN.redirect || this.state.redirects.redirectWithSGTIN.redirect.length < 1 ) {
  		return true;
  	}

  	if (this.state.redirects.redirectWithoutSGTIN.redirect === this.state.redirects.redirectWithSGTIN.redirect || this.state.redirects.redirectWithSGTIN.redirect.includes(this.state.redirects.redirectWithoutSGTIN.redirect)) {
  		return true;
  	}
  	return false;
  }

  render() {
  	if (!this.props.display) {
  		return null;
  	}

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
  		DNSContent = (this.state.cname ? this.state.cname + "<br/>" : '') + this.state.server 
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
  	if (this.state.updateRedirWithoutSGTINInProgress) {
  		tdRedirectionClass = "updating";
  	}
  	if (typeof this.state.redirects !== "undefined"
  			&& typeof this.state.redirects.redirectWithoutSGTIN.redirect !== "undefined" 
  			&& typeof this.state.redirects.redirectWithSGTIN.redirect !== "undefined") {
  		


  		sameRedirectionsWithOrWithoutSGTIN = this.redirectionsWithSGTINisTheSameAsWithoutSGTIN();

	  	if (this.state.redirects.redirectWithoutSGTIN.msg === RedirectionError) {
	  		tdRedirectionClass = "errorCell";
	  		RedirectionContent = RedirectionError;
			} else {
				RedirectionContent = this.state.redirects.redirectWithoutSGTIN.msg;
				if (this.state.redirects.redirectWithoutSGTIN.isRolex) {
					RedirectionContent += " - "  + RolexExperienceMessage;
				}
			}
	  	if (!sameRedirectionsWithOrWithoutSGTIN) {
	  		tdRedirectionClass = "warningCell";
	  		RedirectionContent = "Without SGTIN: "+ RedirectionContent+"<br/>With SGTIN:" + this.state.redirects.redirectWithSGTIN.msg;
	  		if (this.state.redirects.redirectWithSGTIN.isRolex) {
	  			RedirectionContent += " - "  + RolexExperienceMessage;
	  		}
	  	}
  	}

  	// Filter
  	if ('redirectFilter' in this.props
  			&& this.props.redirectFilter.length > 0 
  			&& (RedirectionContent.length < 1 || !RedirectionContent.toLowerCase().includes(this.props.redirectFilter.toLowerCase()))) {
  		return '';
  	}

  	var TDs = [];
  	var countTD = 0;
  	var value;
		var editLink = "";
  	if (this.props && 'columnsFilters' in this.props) {
			for (var column in this.props.columnsFilters) {
	  		if (this.props.columnsFilters[column].isVisible) {
	  			value = '';
	  			editLink = '';
	  			// console.log("column", column, this.props[column]);
	  			if (column in this.props) {
	  				value = this.props[column];
	  			}
	  			if (column === "comment" && this.state.comment) {
	  				value = this.state.comment;
	  			}
	  			if (column === "comment" && !this.state.editMode) {
	  				value = value.replace(/(?:\r\n|\r|\n)/g, '<br>');
	  			}

	  			// if it is the 1st cell, we display here the edit button
	  			if (this.props.isadmin && countTD === 0 && this.state && this.state.isSelected) {
	  				editLink = <Link to={"/isadmin/update/" + this.props.uuid} className="edit badge badge-warning" target="_blank">Edit</Link>
	  			}
	  			countTD++;
	  			if (column === "comment" && this.state.editMode) {
	  				TDs.push(<td key={column} onClick={this.setEditMode}>
		  				<textarea name="comment" id="comment" className="form-control" onChange={this.onChangeComment} defaultValue={value} rows="3"></textarea>
		  				<button onClick={this.cancelEditMode} className="badge badge-warning comment">Cancel</button>
		  				<button onClick={this.validateComment} className="badge badge-success comment">Submit</button>
  					</td>);
	  			} else if (column === "comment") {
	  				TDs.push(<td key={column} onClick={this.setEditMode} dangerouslySetInnerHTML={{__html: value}}></td>);
	  			} else {
	  				TDs.push(<td key={column} >{editLink}{value}</td>);
	  			}
	  		}
			}
		}
  	return (
  		<tr onClick={() => this.setActiveDomain()} >
  			{TDs}
  			<td className={tdCnameClass} dangerouslySetInnerHTML={{__html: DNSContent}}></td>
  			<td className={tdSSLClass}>{SSLContent}</td>
  			<td className={tdRedirectionClass} dangerouslySetInnerHTML={{__html: RedirectionContent}}>
  			</td>
  		</tr>
		);
  }

}

export default URL;
