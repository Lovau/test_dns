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

    this.handleTriggerVerification = this.handleTriggerVerification.bind(this);
    this.handleFilterSiteChange = this.handleFilterSiteChange.bind(this);
    this.handleFilterEnvironmentChange = this.handleFilterEnvironmentChange.bind(this);
    this.handleFilterDomainChange = this.handleFilterDomainChange.bind(this);
  }

  handleFilterSiteChange(e) {
  	this.setState({
  		site: e.target.value
  	});
  }
  handleFilterEnvironmentChange(e) {
  	this.setState({
  		environment: e.target.value
  	});
  }
  handleFilterDomainChange(e) {
  	this.setState({
  		domain: e.target.value
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

  handleTriggerVerification() {
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
  	var update = false;
  	if (this.state != null && 'update' in this.state) {
  		update = this.state.update;
  	}

  	return (
  		<Row>
	  		<Col sm={{ span: 2, offset: 10 }}>
		  		<Button variant="light" onClick={this.handleTriggerVerification}>Verify the URLs</Button>
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
		  	  		    <Form.Control size="sm" type="text" placeholder="Site" value={siteFilter} onChange={this.handleFilterSiteChange} />
		  	  		  </Form>
			  		  </td>
			  		  <td>
  		  	  		<Form>
  		    		    <Form.Control size="sm" type="text" placeholder="Envt" value={environmentFilter} onChange={this.handleFilterEnvironmentChange} />
  		    		  </Form>
			  		  </td>
			  		  <td>
  		  	  		<Form>
  		    		    <Form.Control size="sm" type="text" placeholder="Domain" value={domainFilter} onChange={this.handleFilterDomainChange} />
  		    		  </Form>
			  		  </td>
			  		  <td></td>
			  		  <td></td>
			  		  <td></td>
			  		  <td></td>
		  		  </tr>
		  		  </thead>
			  			<URLList siteFilter={siteFilter} environmentFilter={environmentFilter} domainFilter={domainFilter} update={update} />
		  		</Table>
	  		</Col>
  		</Row>
		);
  }
}

export default FilterableURLList;
