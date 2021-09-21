import React from "react";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import URLList from './URLList';

const messageFilterNeedsToBeActive = "Too many URLs to proceed, please use the filters below first. If too many requests are triggered at the same time, some results may be wrong.";

class FilterableURLList extends React.Component {

  constructor(props) {
    super(props);

    this.handleURLsVerifications = this.handleURLsVerifications.bind(this);
    this.handleFilterSiteChange = this.handleFilterSiteChange.bind(this);
    this.handleFilterEnvironmentChange = this.handleFilterEnvironmentChange.bind(this);
    this.handleFilterDomainChange = this.handleFilterDomainChange.bind(this);
    this.handleFilterCnameChange = this.handleFilterCnameChange.bind(this);

    this.handleDNSVerifications = this.handleDNSVerifications.bind(this);
    this.handleSSLVerifications = this.handleSSLVerifications.bind(this);
    this.handleRedirection = this.handleRedirection.bind(this);
  }

  handleKeyPress(e) {
  	if (e.key === 'Enter') {
  		e.preventDefault();
  	}
  }

  handleFilterSiteChange(e) {
  	this.setState({
  		site: e.target.value,
  		msg: '',
  	});
  	this.setUpdateToFalse();
  }
  handleFilterEnvironmentChange(e) {
  	this.setState({
  		environment: e.target.value,
  		msg: '',
  	});
  	this.setUpdateToFalse();
  }
  handleFilterDomainChange(e) {
  	this.setState({
  		domain: e.target.value,
  		msg: '',
  	});
  	this.setUpdateToFalse();
  }
  handleFilterCnameChange(e) {
  	this.setState({
  		cname: e.target.value,
  		msg: '',
  	});
  	this.setUpdateToFalse();
  }

  componentDidMount() {
  	this.setState({
  		site: '',
  		environment: '',
  		domain: '',
  		cname: '',
  		msg: '',
  	});
  	this.setUpdateToFalse();
  }

  isFilterActive() {
  	return this.state.site !== "" || this.state.environment !== "" || this.state.domain !== "" || this.state.cname !== "";
  }

  setUpdateToFalse() {
  	this.setState({
  		update: false,
  		updateDNS: false,
  		updateSSL: false,
  		updateRedirection: false,
  	});
  }

  handleURLsVerifications() {
  	if (!this.isFilterActive()) {
  		this.setState({
  			msg: messageFilterNeedsToBeActive
  		});
  		return;
  	}
  	this.setState({
  		update: true
  	});
  }
  handleDNSVerifications() {
  	if (!this.isFilterActive()) {
  		this.setState({
  			msg: messageFilterNeedsToBeActive
  		});
  		return;
  	}
  	this.setState({
  		updateDNS: true
  	});
  }
  handleSSLVerifications() {
  	if (!this.isFilterActive()) {
  		this.setState({
  			msg: messageFilterNeedsToBeActive
  		});
  		return;
  	}
  	this.setState({
  		updateSSL: true
  	});
  }
  handleRedirection() {
  	if (!this.isFilterActive()) {
  		this.setState({
  			msg: messageFilterNeedsToBeActive
  		});
  		return;
  	}
  	this.setState({
  		updateRedirection: true
  	});
  }

  render() {
  	var siteFilter = '';
  	if (this.state != null && 'site' in this.state) {
  		siteFilter = this.state.site;
  	}
  	var environmentFilter = '';
  	if (this.state != null && 'environment' in this.state) {
  		environmentFilter = this.state.environment;
  	}
  	var domainFilter = '';
  	if (this.state != null && 'domain' in this.state) {
  		domainFilter = this.state.domain;
  	}
  	var cnameFilter = '';
  	if (this.state != null && 'cname' in this.state) {
  		cnameFilter = this.state.cname;
  	}
  	var update = false;
  	if (this.state != null && 'update' in this.state) {
  		update = this.state.update;
  	}
  	var updateDNS = false;
  	if (this.state != null && 'updateDNS' in this.state) {
  		updateDNS = this.state.updateDNS;
  	}
  	var updateSSL = false;
  	if (this.state != null && 'updateSSL' in this.state) {
  		updateSSL = this.state.updateSSL;
  	}
  	var updateRedirection = false;
  	if (this.state != null && 'updateRedirection' in this.state) {
  		updateRedirection = this.state.updateRedirection;
  	}

  	return (
  		<Row>
	  		<Col sm={10}>
	  		</Col>
	  		<Col sm={2}>
		  		<Button variant="outline-warning" onClick={this.handleURLsVerifications} className="mt-2 mb-2 main" >Verify everything</Button>
	  		</Col>

	  		{this.state && this.state.msg && this.state.msg.length > 0 &&
	  			<Alert variant="danger" >{this.state.msg}</Alert>
	  		}

	  		<Col sm={12} >
	  			<Table striped bordered hover responsive size="sm" className="stubLinks">
		  		  <thead>
		  		  <tr>
			  		  <td>
			  		  </td>
			  		  <td>
			  		  </td>
			  		  <td>
			  		  </td>
			  		  <td>
					  		<Button variant="outline-info" onClick={this.handleDNSVerifications} >Test</Button>
			  		  </td>
			  		  <td>
					  		<Button variant="outline-info" onClick={this.handleSSLVerifications} >Test</Button>
				  		</td>
			  		  <td>
					  		<Button variant="outline-info" onClick={this.handleRedirection} >Test</Button>
				  		</td>
		  		  </tr>
		  		  <tr>
			  		  <td>Site</td>
			  		  <td>Environment</td>
			  		  <td>Domain</td>
			  		  <td>CNAME</td>
			  		  <td>SSL validity</td>
			  		  <td>Redirect</td>
		  		  </tr>
		  		  <tr>
			  		  <td>
		  		  		<Form>
		  	  		    <Form.Control size="sm" type="text" placeholder="Site" value={siteFilter} onChange={this.handleFilterSiteChange} onKeyPress={this.handleKeyPress} />
		  	  		  </Form>
			  		  </td>
			  		  <td>
  		  	  		<Form>
  		    		    <Form.Control size="sm" type="text" placeholder="Envt" value={environmentFilter} onChange={this.handleFilterEnvironmentChange} onKeyPress={this.handleKeyPress} />
  		    		  </Form>
			  		  </td>
			  		  <td>
  		  	  		<Form>
  		    		    <Form.Control size="sm" type="text" placeholder="Domain" value={domainFilter} onChange={this.handleFilterDomainChange} onKeyPress={this.handleKeyPress} />
  		    		  </Form>
			  		  </td>
			  		  <td>
  		  	  		<Form>
  		    		    <Form.Control size="sm" type="text" placeholder="CNAME & server" value={cnameFilter} onChange={this.handleFilterCnameChange} onKeyPress={this.handleKeyPress} />
  		    		  </Form>
			  		  </td>
			  		  <td>
				  		</td>
			  		  <td>
				  		</td>
		  		  </tr>
		  		  </thead>
			  			<URLList siteFilter={siteFilter} environmentFilter={environmentFilter} domainFilter={domainFilter} cnameFilter={cnameFilter} update={update} updateDNS={updateDNS} updateSSL={updateSSL} updateRedirection={updateRedirection} />
		  		</Table>
	  		</Col>
  		</Row>
		);
  }
}

export default FilterableURLList;
