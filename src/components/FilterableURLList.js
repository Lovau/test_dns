import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import URLList from "./URLList";
import Container from "react-bootstrap/Container";
import Helper from "./Helper";
import Column from "./Column";

const messageFilterNeedsToBeActive =
  "Too many URLs to proceed, please use the filters below first. If too many requests are triggered at the same time, some results may be wrong.";

const dynamicColumns = [
  {
    name: "DNS",
    isVisible: false,
  },
  {
    name: "SSL",
    isVisible: false,
  },
  {
    name: "Redirection EU",
    isVisible: true,
  },
  {
    name: "Redirection CN",
    isVisible: false,
  },
];

class FilterableURLList extends React.Component {
  constructor(props) {
    super(props);

    this.handleURLsVerifications = this.handleURLsVerifications.bind(this);
    this.handleFilterColumnChange = this.handleFilterColumnChange.bind(this);
    this.handleFilterCnameChange = this.handleFilterCnameChange.bind(this);
    this.handleFilterRedirectChange =
      this.handleFilterRedirectChange.bind(this);

    this.handleDNSVerifications = this.handleDNSVerifications.bind(this);
    this.handleSSLVerifications = this.handleSSLVerifications.bind(this);
    this.handleRedirection = this.handleRedirection.bind(this);
    this.handleRedirectionCN = this.handleRedirectionCN.bind(this);

    this.handleColumnChange = this.handleColumnChange.bind(this);
    this.handleDynamicColumnChange = this.handleDynamicColumnChange.bind(this);
  }

  handleKeyPress(e) {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  }

  handleFilterColumnChange(e) {
    var columnName = e.target.placeholder;
    var columnDBName = Helper.getDBNameFromDisplayName(columnName);
    var columnsFilters = this.state.columnsFilters;
    columnsFilters[columnDBName].filter = e.target.value;
    this.setState({
      columnsFilters: columnsFilters,
    });
    this.setUpdateToFalse();
  }

  handleFilterCnameChange(e) {
    this.setState({
      cname: e.target.value,
      msg: "",
    });
    this.setUpdateToFalse();
  }

  handleFilterRedirectChange(e) {
    this.setState({
      redirectFilter: e.target.value,
      msg: "",
    });
    this.setUpdateToFalse();
  }

  handleColumnChange(columnDisplayName, isVisible) {
    var columnDBName = Helper.getDBNameFromDisplayName(columnDisplayName);
    var columnsFilters = this.state.columnsFilters;
    columnsFilters[columnDBName] = {
      isVisible: isVisible,
      filter: "",
      displayName: columnDisplayName,
    };
    this.setState({
      columnsFilters: columnsFilters,
    });
    this.setUpdateToFalse();
  }

  handleDynamicColumnChange(columnName, isVisible) {
    var dynamicColumnsFilters = this.state.dynamicColumnsFilters;
    dynamicColumnsFilters[columnName] = {
      isVisible: isVisible,
      filter: "",
      displayName: columnName,
    };
    this.setState({
      dynamicColumnsFilters: dynamicColumnsFilters,
    });
    this.setUpdateToFalse();
  }

  componentDidMount() {
    // fixed data
    var columns = Helper.getColumnsNames();
    var columnsFilters = [];
    for (var i = 0; i < columns.length; i++) {
      columnsFilters[columns[i].columnNameDB] = {
        isVisible: Helper.isColumnAlwaysVisible(columns[i].columnNameDB),
        filter: "",
        displayName: columns[i].columnNameToDisplay,
      };
    }

    // dynamic data
    var dynColumns = dynamicColumns;
    var dynamicColumnsFilters = [];
    for (var j = 0; j < dynColumns.length; j++) {
      dynamicColumnsFilters[dynColumns[j].name] = {
        isVisible: dynColumns[j].isVisible,
        filter: "",
        displayName: dynColumns[j].name,
      };
    }

    this.setState({
      columnsFilters: columnsFilters,
      dynamicColumnsFilters: dynamicColumnsFilters,
      site: "",
      environment: "",
      domain: "",
      cname: "",
      msg: "",
    });
    this.setUpdateToFalse();
  }

  componentDidUpdate() {
    // console.log("update", this.props);
  }

  isFilterActive() {
    for (var column in this.state.columnsFilters) {
      if (
        this.state.columnsFilters[column].isVisible &&
        this.state.columnsFilters[column].filter &&
        this.state.columnsFilters[column].filter.length > 0
      ) {
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
      updateRedirectionCN: false,
    });
  }

  handleURLsVerifications() {
    if (!this.isFilterActive()) {
      this.setState({
        msg: messageFilterNeedsToBeActive,
      });
      return;
    }
    this.setState({
      update: true,
    });
  }
  handleDNSVerifications() {
    if (!this.isFilterActive()) {
      this.setState({
        msg: messageFilterNeedsToBeActive,
      });
      return;
    }
    this.setState({
      updateDNS: true,
    });
  }
  handleSSLVerifications() {
    if (!this.isFilterActive()) {
      this.setState({
        msg: messageFilterNeedsToBeActive,
      });
      return;
    }
    this.setState({
      updateSSL: true,
    });
  }
  handleRedirection() {
    if (!this.isFilterActive()) {
      this.setState({
        msg: messageFilterNeedsToBeActive,
      });
      return;
    }
    this.setState({
      updateRedirection: true,
    });
  }
  handleRedirectionCN() {
    if (!this.isFilterActive()) {
      this.setState({
        msg: messageFilterNeedsToBeActive,
      });
      return;
    }
    this.setState({
      updateRedirectionCN: true,
    });
  }

  render() {
    var cnameFilter = "";
    if (this.state != null && "cname" in this.state) {
      cnameFilter = this.state.cname;
    }
    var redirectFilter = "";
    if (this.state != null && "redirectFilter" in this.state) {
      redirectFilter = this.state.redirectFilter;
    }
    var update = false;
    if (this.state != null && "update" in this.state) {
      update = this.state.update;
    }
    var updateDNS = false;
    if (this.state != null && "updateDNS" in this.state) {
      updateDNS = this.state.updateDNS;
    }
    var updateSSL = false;
    if (this.state != null && "updateSSL" in this.state) {
      updateSSL = this.state.updateSSL;
    }
    var updateRedirection = false;
    if (this.state != null && "updateRedirection" in this.state) {
      updateRedirection = this.state.updateRedirection;
    }
    var updateRedirectionCN = false;
    if (this.state != null && "updateRedirectionCN" in this.state) {
      updateRedirectionCN = this.state.updateRedirectionCN;
    }

    var checkboxes = [];
    var dynamicCheckboxes = [];
    var header1 = [];
    var header2 = [];
    var header3 = [];
    var columnsFilters = [];
    if (this.state && "columnsFilters" in this.state) {
      columnsFilters = this.state.columnsFilters;

      for (var column in this.state.columnsFilters) {
        var isVisible = this.state.columnsFilters[column].isVisible;
        if (isVisible) {
          header1.push(<td key={column}></td>);
          header2.push(
            <td key={column}>
              {this.state.columnsFilters[column].displayName}
            </td>
          );
          header3.push(
            <td key={column}>
              <Form>
                <Form.Control
                  size="sm"
                  type="text"
                  placeholder={this.state.columnsFilters[column].displayName}
                  value={this.state.columnsFilters[column].filter}
                  onChange={this.handleFilterColumnChange}
                  onKeyPress={this.handleKeyPress}
                />
              </Form>
            </td>
          );
        }
        checkboxes.push(
          <Column
            key={column}
            columnName={this.state.columnsFilters[column].displayName}
            onChange={this.handleColumnChange}
            defaultChecked={isVisible}
          />
        );
      }
    }

    var dynamicColumnsFilters = [];
    if (this.state && "dynamicColumnsFilters" in this.state) {
      dynamicColumnsFilters = this.state.dynamicColumnsFilters;
      for (column in this.state.dynamicColumnsFilters) {
        isVisible = this.state.dynamicColumnsFilters[column].isVisible;
        if (isVisible) {
          if (column === "DNS") {
            header1.push(
              <td key="headerDNS1">
                <Button
                  variant="outline-info"
                  onClick={this.handleDNSVerifications}
                >
                  Test
                </Button>
              </td>
            );
            header2.push(<td key="headerDNS2">DNS</td>);
            header3.push(
              <td key="headerDNS3">
                <Form>
                  <Form.Control
                    size="sm"
                    type="text"
                    placeholder="DNS & server"
                    value={cnameFilter}
                    onChange={this.handleFilterCnameChange}
                    onKeyPress={this.handleKeyPress}
                  />
                </Form>
              </td>
            );
          } else if (column === "SSL") {
            header1.push(
              <td key="headerSSL1">
                <Button
                  variant="outline-info"
                  onClick={this.handleSSLVerifications}
                >
                  Test
                </Button>
              </td>
            );
            header2.push(<td key="headerSSL2">SSL validity</td>);
            header3.push(<td key="headerSSL3"></td>);
          } else if (column === "Redirection EU") {
            header1.push(
              <td key="headerRedirEU1">
                <Button variant="outline-info" onClick={this.handleRedirection}>
                  Test
                </Button>
              </td>
            );
            header2.push(<td key="headerRedirEU2">Redirect EU</td>);
            header3.push(
              <td key="headerRedirEU3">
                <Form>
                  <Form.Control
                    size="sm"
                    type="text"
                    placeholder="Redirect EU"
                    value={redirectFilter}
                    onChange={this.handleFilterRedirectChange}
                    onKeyPress={this.handleKeyPress}
                  />
                </Form>
              </td>
            );
          } else if (column === "Redirection CN") {
            header1.push(
              <td key="headerRedirCN1">
                <Button
                  variant="outline-info"
                  onClick={this.handleRedirectionCN}
                >
                  Test
                </Button>
              </td>
            );
            header2.push(<td key="headerRedirCN2">Redirect CN</td>);
            header3.push(
              <td key="headerRedirCN3">
                <Form>
                  <Form.Control
                    size="sm"
                    type="text"
                    placeholder="Redirect CN"
                    value={redirectFilter}
                    onChange={this.handleFilterRedirectChange}
                    onKeyPress={this.handleKeyPress}
                  />
                </Form>
              </td>
            );
          }
        }
        dynamicCheckboxes.push(
          <Column
            key={column}
            columnName={this.state.dynamicColumnsFilters[column].displayName}
            onChange={this.handleDynamicColumnChange}
            defaultChecked={isVisible}
          />
        );
      }
    }

    return (
      <Container fluid>
        <Row>
          <Col sm={6}>
            <Form>
              <h5>Data</h5>
              {checkboxes}
            </Form>
          </Col>
          <Col sm={6}>
            <Form>
              <Button
                variant="outline-warning"
                onClick={this.handleURLsVerifications}
                className="mt-2 mb-2 main"
              >
                Test all
              </Button>
              <h5>Dynamic data</h5>
              {dynamicCheckboxes}
            </Form>
          </Col>
        </Row>
        <Row>
          {this.state && this.state.msg && this.state.msg.length > 0 && (
            <Alert variant="danger">{this.state.msg}</Alert>
          )}

          <Col sm={12}>
            <Table
              striped
              bordered
              hover
              responsive
              size="sm"
              className="stubLinks"
            >
              <thead>
                <tr>{header1}</tr>
                <tr>{header2}</tr>
                <tr>{header3}</tr>
              </thead>
              <URLList
                cnameFilter={cnameFilter}
                redirectFilter={redirectFilter}
                update={update}
                updateDNS={updateDNS}
                updateSSL={updateSSL}
                updateRedirection={updateRedirection}
                updateRedirectionCN={updateRedirectionCN}
                columnsFilters={columnsFilters}
                dynamicColumnsFilters={dynamicColumnsFilters}
                isadmin={this.props.isadmin}
              />
            </Table>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default FilterableURLList;
