import React from "react";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import URLList from './URLList';

class FilterableURLList extends React.Component {

  constructor(props) {
    super(props);

    this.handleURLsVerifications = this.handleURLsVerifications.bind(this);
    this.handleFilterSiteChange = this.handleFilterSiteChange.bind(this);
    this.handleFilterEnvironmentChange = this.handleFilterEnvironmentChange.bind(this);
    this.handleFilterDomainChange = this.handleFilterDomainChange.bind(this);
    this.handleFilterCnameChange = this.handleFilterCnameChange.bind(this);
  }

  handleKeyPress(e) {
  	if (e.key === 'Enter') {
  		e.preventDefault();
  	}
  }

  handleFilterSiteChange(e) {
  	this.setState({
  		site: e.target.value,
  		update: false
  	});
  }
  handleFilterEnvironmentChange(e) {
  	this.setState({
  		environment: e.target.value,
  		update: false
  	});
  }
  handleFilterDomainChange(e) {
  	this.setState({
  		domain: e.target.value,
  		update: false
  	});
  }
  handleFilterCnameChange(e) {
  	this.setState({
  		cname: e.target.value,
  		update: false
  	});
  }

  componentDidMount() {
  	this.setState({
  		site: '',
  		environment: '',
  		domain: '',
  		update: false
  	});
  }

  handleURLsVerifications() {
  	this.setState({
  		update: true
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

  	return (
  		<Row>
	  		<Col sm={10}>
	  		</Col>
	  		<Col sm={2}>
		  		<Button variant="primary" onClick={this.handleURLsVerifications} className="mt-2 mb-2" >Verify the URLs</Button>
	  		</Col>

	  		<Col sm={12} >
	  			<Table striped bordered hover responsive size="sm" className="stubLinks">
		  		  <thead>
		  		  <tr>
			  		  <td>Site</td>
			  		  <td>Environment</td>
			  		  <td>Domain</td>
			  		  <td>CNAME</td>
			  		  <td>SSL expiry date</td>
			  		  <td>Redirect without SGTIN</td>
			  		  <td>Redirect with SGTIN</td>
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
			  		  <td></td>
			  		  <td></td>
			  		  <td></td>
		  		  </tr>
		  		  </thead>
			  			<URLList siteFilter={siteFilter} environmentFilter={environmentFilter} domainFilter={domainFilter} cnameFilter={cnameFilter} update={update} />
		  		</Table>
	  		</Col>
  		</Row>
		);
  }
}

export default FilterableURLList;
