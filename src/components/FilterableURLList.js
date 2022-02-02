import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
// import Alert from "react-bootstrap/Alert";
import URLList from "components/URLList";
import Container from "react-bootstrap/Container";
import Helper from "helpers/Helper";
import Column from "components/Column";
import { Alert } from "components/Alert";
import { alertService } from "services/AlertService";
import { userService } from "services/UserService";
import configData from "config.json";

const dynamicColumns = configData.dynamicColumns;
const messageFilterNeedsToBeActive =
  "Too many URLs to proceed, please use the filters below first. If too many requests are triggered at the same time, some results may be wrong.";

var subscription;

class FilterableURLList extends React.Component {
  constructor(props) {
    super(props);

    this.handleURLsVerifications = this.handleURLsVerifications.bind(this);
    this.handleFilterColumnChange = this.handleFilterColumnChange.bind(this);
    this.handleFilterCnameChange = this.handleFilterCnameChange.bind(this);
    this.handleFilterRedirectChange = this.handleFilterRedirectChange.bind(this);
    this.handleDynamicFilterChange = this.handleDynamicFilterChange.bind(this);

    this.handleDNSVerifications = this.handleDNSVerifications.bind(this);
    this.handleDNSVerificationsCN = this.handleDNSVerificationsCN.bind(this);
    this.handleSSLVerifications = this.handleSSLVerifications.bind(this);
    this.handleSSLVerificationsCN = this.handleSSLVerificationsCN.bind(this);
    this.handleRedirection = this.handleRedirection.bind(this);
    this.handleRedirectionCN = this.handleRedirectionCN.bind(this);
    this.handleAEMFolder = this.handleAEMFolder.bind(this);
    this.handleAEMFolderCN = this.handleAEMFolderCN.bind(this);
    this.onHeaderClick = this.onHeaderClick.bind(this);

    this.handleColumnChange = this.handleColumnChange.bind(this);
    this.handleDynamicColumnChange = this.handleDynamicColumnChange.bind(this);
    this.isAdmin = this.isAdmin.bind(this);
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

  handleDynamicFilterChange(e) {
    var dynamicColumnsFilters = this.state.dynamicColumnsFilters;
    dynamicColumnsFilters[e.target.placeholder] = {
      isVisible: true,
      filter: e.target.value,
      displayName: e.target.placeholder,
    };
    this.setState({
      dynamicColumnsFilters: dynamicColumnsFilters,
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

  isAdmin() {
    if (
      !this.state ||
      !this.state.user ||
      !Object.prototype.hasOwnProperty.call(this.state.user, "uuid")
    ) {
      return false;
    }
    return true;
  }

  componentWillUnmount() {
    return () => subscription.unsubscribe();
  }

  componentDidMount() {
    subscription = userService.user.subscribe((x) =>
      this.setState({
        user: x,
      })
    );

    this.setState({
      sort: null,
    });

    // fixed data
    var columns = configData.columnsName;
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
    if (this.state && this.state.msg && this.state.msg.length > 0) {
      alertService.warn(this.state.msg, { autoClose: true });
      this.setState({
        msg: null,
      });
    }
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
      updateDNSCN: false,
      updateSSL: false,
      updateSSLCN: false,
      updateRedirection: false,
      updateRedirectionCN: false,
      updateAEMFolder: false,
      updateAEMFolderCN: false,
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
  handleDNSVerificationsCN() {
    if (!this.isFilterActive()) {
      this.setState({
        msg: messageFilterNeedsToBeActive,
      });
      return;
    }
    this.setState({
      updateDNSCN: true,
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
  handleSSLVerificationsCN() {
    if (!this.isFilterActive()) {
      this.setState({
        msg: messageFilterNeedsToBeActive,
      });
      return;
    }
    this.setState({
      updateSSLCN: true,
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
  handleAEMFolder() {
    if (!this.isFilterActive()) {
      this.setState({
        msg: messageFilterNeedsToBeActive,
      });
      return;
    }
    this.setState({
      updateAEMFolder: true,
    });
  }
  handleAEMFolderCN() {
    if (!this.isFilterActive()) {
      this.setState({
        msg: messageFilterNeedsToBeActive,
      });
      return;
    }
    this.setState({
      updateAEMFolderCN: true,
    });
  }

  onHeaderClick(e) {
    if (this.state.sort && this.state.sort.column === e.target.dataset.column) {
      this.setState({
        sort: {
          column: e.target.dataset.column,
          order: this.state.sort.order === "DESC" ? "ASC" : "DESC",
        },
      });
    } else {
      this.setState({
        sort: {
          column: e.target.dataset.column,
          order: "ASC",
        },
      });
    }
  }

  render() {
    var cnameFilter = "";
    if (this.state != null && "cname" in this.state) {
      cnameFilter = this.state.cname;
    }
    var aemFolderFilter = "";
    if (this.state != null && "aemFolderFilter" in this.state) {
      aemFolderFilter = this.state.aemFolderFilter;
    }
    var update = false;
    if (this.state != null && "update" in this.state) {
      update = this.state.update;
    }
    var updateDNS = false;
    if (this.state != null && "updateDNS" in this.state) {
      updateDNS = this.state.updateDNS;
    }
    var updateDNSCN = false;
    if (this.state != null && "updateDNSCN" in this.state) {
      updateDNSCN = this.state.updateDNSCN;
    }
    var updateSSL = false;
    if (this.state != null && "updateSSL" in this.state) {
      updateSSL = this.state.updateSSL;
    }
    var updateSSLCN = false;
    if (this.state != null && "updateSSLCN" in this.state) {
      updateSSLCN = this.state.updateSSLCN;
    }
    var updateRedirection = false;
    if (this.state != null && "updateRedirection" in this.state) {
      updateRedirection = this.state.updateRedirection;
    }
    var updateRedirectionCN = false;
    if (this.state != null && "updateRedirectionCN" in this.state) {
      updateRedirectionCN = this.state.updateRedirectionCN;
    }
    var updateAEMFolder = false;
    if (this.state != null && "updateAEMFolder" in this.state) {
      updateAEMFolder = this.state.updateAEMFolder;
    }
    var updateAEMFolderCN = false;
    if (this.state != null && "updateAEMFolderCN" in this.state) {
      updateAEMFolderCN = this.state.updateAEMFolderCN;
    }

    var checkboxes = [];
    var dynamicCheckboxes = [];
    var header1 = [];
    var header2 = [];
    var header3 = [];
    var columnsFilters = [];
    var classes;
    var sortData = this.state && this.state.sort ? this.state.sort : null;
    var sortOrder;
    if (this.state && "columnsFilters" in this.state) {
      columnsFilters = this.state.columnsFilters;

      for (var column in this.state.columnsFilters) {
        var isVisible = this.state.columnsFilters[column].isVisible;
        if (isVisible) {
          classes = "";
          sortOrder = "";
          if (column === "comment") {
            classes = "comment";
          }
          if (sortData && sortData.column === column) {
            sortOrder = sortData.order === "ASC" ? "asc" : "desc";
          }

          header1.push(<th className={classes} key={column}></th>);
          header2.push(
            <th className={classes} key={column}>
              <div
                className={`th-inner sortable both ${sortOrder}`}
                data-column={column}
                onClick={this.onHeaderClick}
              >
                {this.state.columnsFilters[column].displayName}
              </div>
            </th>
          );
          header3.push(
            <th className={classes} key={column}>
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
            </th>
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

      for (column in dynamicColumnsFilters) {
        isVisible = dynamicColumnsFilters[column].isVisible;
        if (isVisible) {
          if (column === "DNS EU") {
            header1.push(
              <th key="headerDNS1">
                <Button variant="outline-info" onClick={this.handleDNSVerifications}>
                  Test
                </Button>
              </th>
            );
            header2.push(<th key="headerDNS2">DNS EU</th>);
            header3.push(
              <th key="headerDNS3">
                <Form>
                  <Form.Control
                    size="sm"
                    type="text"
                    placeholder={column}
                    value={dynamicColumnsFilters[column].filter}
                    onChange={this.handleDynamicFilterChange}
                    onKeyPress={this.handleKeyPress}
                  />
                </Form>
              </th>
            );
          } else if (column === "DNS CN") {
            header1.push(
              <th key="headerDNSCN1">
                <Button variant="outline-info" onClick={this.handleDNSVerificationsCN}>
                  Test
                </Button>
              </th>
            );
            header2.push(<th key="headerDNSCN2">DNS CN</th>);
            header3.push(
              <th key="headerDNSCN3">
                <Form>
                  <Form.Control
                    size="sm"
                    type="text"
                    placeholder={column}
                    value={dynamicColumnsFilters[column].filter}
                    onChange={this.handleDynamicFilterChange}
                    onKeyPress={this.handleKeyPress}
                  />
                </Form>
              </th>
            );
          } else if (column === "SSL EU") {
            header1.push(
              <th key="headerSSL1">
                <Button variant="outline-info" onClick={this.handleSSLVerifications}>
                  Test
                </Button>
              </th>
            );
            header2.push(<th key="headerSSL2">SSL validity in EU</th>);
            header3.push(<th key="headerSSL3"></th>);
          } else if (column === "SSL CN") {
            header1.push(
              <th key="headerSSLCN1">
                <Button variant="outline-info" onClick={this.handleSSLVerificationsCN}>
                  Test
                </Button>
              </th>
            );
            header2.push(<th key="headerSSLCN2">SSL validity in CN</th>);
            header3.push(<th key="headerSSLCN3"></th>);
          } else if (column === "Redirection EU") {
            header1.push(
              <th key="headerRedirEU1">
                <Button variant="outline-info" onClick={this.handleRedirection}>
                  Test
                </Button>
              </th>
            );
            header2.push(<th key="headerRedirEU2">Redirection EU</th>);
            header3.push(
              <th key="headerRedirEU3">
                <Form>
                  <Form.Control
                    size="sm"
                    type="text"
                    placeholder={column}
                    value={dynamicColumnsFilters[column].filter}
                    onChange={this.handleDynamicFilterChange}
                    onKeyPress={this.handleKeyPress}
                  />
                </Form>
              </th>
            );
          } else if (column === "Redirection CN") {
            header1.push(
              <th key="headerRedirCN1">
                <Button variant="outline-info" onClick={this.handleRedirectionCN}>
                  Test
                </Button>
              </th>
            );
            header2.push(<th key="headerRedirCN2">Redirection CN</th>);
            header3.push(
              <th key="headerRedirCN3">
                <Form>
                  <Form.Control
                    size="sm"
                    type="text"
                    placeholder={column}
                    value={dynamicColumnsFilters[column].filter}
                    onChange={this.handleDynamicFilterChange}
                    onKeyPress={this.handleKeyPress}
                  />
                </Form>
              </th>
            );
          } else if (column === "AEM Folder EU") {
            header1.push(
              <th key="headerAEMFolderEU1">
                <Button variant="outline-info" onClick={this.handleAEMFolder}>
                  Test
                </Button>
              </th>
            );
            header2.push(<th key="headerAEMFolderEU2">AEM Folder EU</th>);
            header3.push(
              <th key="headerAEMFolderEU3">
                <Form>
                  <Form.Control
                    size="sm"
                    type="text"
                    placeholder={column}
                    value={dynamicColumnsFilters[column].filter}
                    onChange={this.handleDynamicFilterChange}
                    onKeyPress={this.handleKeyPress}
                  />
                </Form>
              </th>
            );
          } else if (column === "AEM Folder CN") {
            header1.push(
              <th key="headerAEMFolderCN1">
                <Button variant="outline-info" onClick={this.handleAEMFolderCN}>
                  Test
                </Button>
              </th>
            );
            header2.push(<th key="headerAEMFolderCN2">AEM Folder CN</th>);
            header3.push(
              <th key="headerAEMFolderCN3">
                <Form>
                  <Form.Control
                    size="sm"
                    type="text"
                    placeholder={column}
                    value={dynamicColumnsFilters[column].filter}
                    onChange={this.handleDynamicFilterChange}
                    onKeyPress={this.handleKeyPress}
                  />
                </Form>
              </th>
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
                className="mt-2 mb-2 main testAllButton"
              >
                Test all
              </Button>
              <h5>Dynamic data</h5>
              {dynamicCheckboxes}
            </Form>
          </Col>
        </Row>
        <Alert autoClose={false} />
        <Row className="bootstrap-table">
          <Col sm={12} className="fixed-table-container">
            <Table striped bordered hover size="sm" className="table URLList">
              <thead>
                <tr>{header1}</tr>
                <tr>{header2}</tr>
                <tr>{header3}</tr>
              </thead>
              <URLList
                cnameFilter={cnameFilter}
                update={update}
                updateDNS={updateDNS}
                updateDNSCN={updateDNSCN}
                updateSSL={updateSSL}
                updateSSLCN={updateSSLCN}
                updateRedirection={updateRedirection}
                updateRedirectionCN={updateRedirectionCN}
                updateAEMFolder={updateAEMFolder}
                updateAEMFolderCN={updateAEMFolderCN}
                columnsFilters={columnsFilters}
                dynamicColumnsFilters={dynamicColumnsFilters}
                isadmin={this.isAdmin()}
                sort={sortData}
              />
            </Table>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default FilterableURLList;
