import React from "react";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import URLList from './URLList';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Helper from "./Helper";
import Column from "./Column";

const messageFilterNeedsToBeActive = "Too many URLs to proceed, please use the filters below first. If too many requests are triggered at the same time, some results may be wrong.";

class FilterableURLList extends React.Component {

  constructor(props) {
    super(props);

    this.handleURLsVerifications = this.handleURLsVerifications.bind(this);
    this.handleFilterColumnChange = this.handleFilterColumnChange.bind(this);
    this.handleFilterCnameChange = this.handleFilterCnameChange.bind(this);
    this.handleFilterRedirectChange = this.handleFilterRedirectChange.bind(this);

    this.handleDNSVerifications = this.handleDNSVerifications.bind(this);
    this.handleSSLVerifications = this.handleSSLVerifications.bind(this);
    this.handleRedirection = this.handleRedirection.bind(this);

    this.handleColumnChange = this.handleColumnChange.bind(this);
  }

  handleKeyPress(e) {
  	if (e.key === 'Enter') {
  		e.preventDefault();
  	}
  }

  handleFilterColumnChange(e) {
  	var columnName = e.target.placeholder;
  	var columnsFilters = this.state.columnsFilters;
  	columnsFilters[columnName].filter = e.target.value;
  	this.setState({
  		columnsFilters: columnsFilters
  	})
  	this.setUpdateToFalse();
  }

  handleFilterCnameChange(e) {
  	this.setState({
  		cname: e.target.value,
  		msg: '',
  	});
  	this.setUpdateToFalse();
  }

  handleFilterRedirectChange(e) {
  	this.setState({
  		redirectFilter: e.target.value,
  		msg: '',
  	});
  	this.setUpdateToFalse();
  }

  handleColumnChange(columnName, isVisible) {
  	var columnsFilters = this.state.columnsFilters;
  	columnsFilters[columnName] = {
  		isVisible: isVisible,
  		filter: '',
  	};
  	this.setState({
  		columnsFilters: columnsFilters
  	});
  	this.setUpdateToFalse();
  }

  componentDidMount() {
  	var columns = Helper.getColumnsNames();
  	var columnsFilters = [];
  	for (var i = 0; i < columns.length; i++) {
  		columnsFilters[columns[i]] = {
	  		isVisible: Helper.isColumnAlwaysVisible(columns[i]),
	  		filter: '',
	  	};
  	}
  	this.setState({
  		columnsFilters: columnsFilters,
  		site: '',
  		environment: '',
  		domain: '',
  		cname: '',
  		msg: '',
  	});
  	this.setUpdateToFalse();
  }

  isFilterActive() {
  	for (var column in this.state.columnsFilters) {
  		if (this.state.columnsFilters[column].isVisible 
  				&& this.state.columnsFilters[column].filter 
  				&& this.state.columnsFilters[column].filter.length > 0) {
  			return true;
  		}
  	}
  	return false;
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
  	var cnameFilter = '';
  	if (this.state != null && 'cname' in this.state) {
  		cnameFilter = this.state.cname;
  	}
  	var redirectFilter = '';
  	if (this.state != null && 'redirectFilter' in this.state) {
  		redirectFilter = this.state.redirectFilter;
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


  	var checkboxes = [];
  	var header1 = [];
  	var header2 = [];
  	var header3 = [];
  	var columnsFilters = [];
  	if (this.state && 'columnsFilters' in this.state) {
  		columnsFilters = this.state.columnsFilters;
  		for (var column in this.state.columnsFilters) {
  			var isVisible = this.state.columnsFilters[column].isVisible;
	  		if (isVisible) {
	  			header1.push(<td key={column}></td>);
	  			header2.push(<td key={column}>{column}</td>);
	  			header3.push(<td key={column}><Form>
		  	  		    			<Form.Control size="sm" type="text" placeholder={column} value={this.state.columnsFilters[column].filter} onChange={this.handleFilterColumnChange} onKeyPress={this.handleKeyPress} />
		  	  		  			</Form></td>);
	  		} 
				checkboxes.push(<Column key={column} columnName={column} onChange={this.handleColumnChange} defaultChecked={isVisible} />);
  		}
  	}

  	return (
  		<Container fluid>

  		<Navbar expand="lg" variant="dark" bg="dark">
  		  <Navbar.Brand href="#">Rolex - URLs verification tool</Navbar.Brand>
	    		<Col sm={9}>
	  	  		<Button variant="outline-warning" onClick={this.handleURLsVerifications} className="mt-2 mb-2 main" >Test all</Button>
	    		</Col>
  		</Navbar>
  		<Row>
    		<Col sm={9}>
    			<Form>
    				{checkboxes}
					</Form>
    		</Col>
  		</Row>
  		<Row>

	  		{this.state && this.state.msg && this.state.msg.length > 0 &&
	  			<Alert variant="danger" >{this.state.msg}</Alert>
	  		}

	  		<Col sm={12} >
	  			<Table striped bordered hover responsive size="sm" className="stubLinks">
		  		  <thead>
		  		  <tr>
				  		{header1}
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
				  		{header2}
			  		  <td>CNAME</td>
			  		  <td>SSL validity</td>
			  		  <td>Redirect</td>
		  		  </tr>
		  		  <tr>
				  		{header3}
			  		  <td>
  		  	  		<Form>
  		    		    <Form.Control size="sm" type="text" placeholder="CNAME & server" value={cnameFilter} onChange={this.handleFilterCnameChange} onKeyPress={this.handleKeyPress} />
  		    		  </Form>
			  		  </td>
			  		  <td>
				  		</td>
			  		  <td>
  		  	  		<Form>
  		    		    <Form.Control size="sm" type="text" placeholder="Redirect" value={redirectFilter} onChange={this.handleFilterRedirectChange} onKeyPress={this.handleKeyPress} />
  		    		  </Form>
				  		</td>
		  		  </tr>
		  		  </thead>
			  			<URLList cnameFilter={cnameFilter} redirectFilter={redirectFilter} update={update} updateDNS={updateDNS} updateSSL={updateSSL} updateRedirection={updateRedirection} columnsFilters={columnsFilters} />
		  		</Table>
	  		</Col>
  		</Row>
  		</Container>
		);
  }
}

export default FilterableURLList;
