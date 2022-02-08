import React, { useState, useEffect } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import URLList from "components/URLList";
import Container from "react-bootstrap/Container";
import Helper from "helpers/Helper";
import Column from "components/Column";
import { Alert } from "components/Alert";
import { alertService } from "services/AlertService";
import { userService } from "services/UserService";
import configData from "config.json";
import { useSelector, useDispatch } from "react-redux";
import { setFilter } from "services/reduxServices/DomainFilterService";
import { setDynamicFilter } from "services/reduxServices/DomainDynamicFilterService";
import { setUpdates } from "services/reduxServices/DomainUpdateService";

const messageFilterNeedsToBeActive =
  "Too many URLs to proceed, please use the filters below first. If too many requests are triggered at the same time, some results may be wrong.";

var subscription;

function FilterableURLList(props) {
  const [user, setUser] = useState({});
  const [msg, setMsg] = useState({});
  const [sort, setSort] = useState({
    order: "ASC",
    column: "brand",
  });

  // From Redux
  const reduxFilter = useSelector((state) => state.DomainFilter);
  const reduxDynamicFilters = useSelector((state) => state.DomainDynamicFilter);
  // const reduxUpdates = useSelector((state) => state.DomainUpdate);
  const dispatch = useDispatch();

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  const handleFilterColumnChange = (e) => {
    var columnName = e.target.placeholder;
    var columnDBName = Helper.getDBNameFromDisplayName(columnName);
    dispatch(
      setFilter({
        column: columnDBName,
        filter: {
          isVisible: reduxFilter[columnDBName].isVisible,
          filter: e.target.value,
          displayName: reduxFilter[columnDBName].displayName,
        },
      })
    );
    setUpdateToFalse();
  };

  const handleDynamicFilterChange = (e) => {
    dispatch(
      setDynamicFilter({
        column: e.target.placeholder,
        filter: {
          isVisible: true,
          filter: e.target.value,
          displayName: e.target.placeholder,
        },
      })
    );

    setUpdateToFalse();
  };

  const handleColumnChange = (columnDisplayName, isVisible) => {
    var columnDBName = Helper.getDBNameFromDisplayName(columnDisplayName);
    dispatch(
      setFilter({
        column: columnDBName,
        filter: {
          isVisible: isVisible,
          filter: "",
          displayName: columnDisplayName,
        },
      })
    );
    setUpdateToFalse();
  };

  const handleDynamicColumnChange = (columnName, isVisible) => {
    dispatch(
      setDynamicFilter({
        column: columnName,
        filter: {
          isVisible: isVisible,
          filter: "",
          displayName: columnName,
        },
      })
    );
    setUpdateToFalse();
  };

  const isAdmin = () => {
    // console.log("isAdmin", user);
    if (!user || !Object.prototype.hasOwnProperty.call(user, "uuid")) {
      return false;
    }
    return true;
  };

  //same as componentDidMount
  useEffect(() => {
    subscription = userService.user.subscribe((x) => setUser(x));

    // fixed data
    var columns = configData.columnsName;
    for (var i = 0; i < columns.length; i++) {
      dispatch(
        setFilter({
          column: columns[i].columnNameDB,
          filter: {
            isVisible: Helper.isColumnAlwaysVisible(columns[i].columnNameDB),
            filter: "",
            displayName: columns[i].columnNameToDisplay,
          },
        })
      );
    }

    // dynamic data
    var dynColumns = configData.dynamicColumns;
    for (var j = 0; j < dynColumns.length; j++) {
      dispatch(
        setDynamicFilter({
          column: dynColumns[j].name,
          filter: {
            isVisible: dynColumns[j].isVisible,
            filter: "",
            displayName: dynColumns[j].name,
          },
        })
      );
    }

    setMsg("");
    setUpdateToFalse();

    // same as componentWillUnmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // same as componentDidUpdate
  useEffect(() => {
    if (msg && msg.length > 0) {
      alertService.warn(msg, { autoClose: true });
      setMsg(null);
    }
  });

  //TODO move in redux
  const isFilterActive = () => {
    for (var column in reduxFilter) {
      if (
        reduxFilter[column].isVisible &&
        reduxFilter[column].filter &&
        reduxFilter[column].filter.length > 0
      ) {
        return true;
      }
    }
    return false;
  };

  const setUpdateToFalse = () => {
    var dynColumns = configData.dynamicColumns;
    for (var j = 0; j < dynColumns.length; j++) {
      dispatch(
        setUpdates({
          column: dynColumns[j].name,
          updating: false,
        })
      );
    }
  };

  const updating = (column) => {
    if (!isFilterActive()) {
      setMsg(messageFilterNeedsToBeActive);
      return;
    }
    dispatch(
      setUpdates({
        column: column,
        updating: true,
      })
    );
  };

  const onHeaderClick = (e) => {
    if (sort && sort.column === e.target.dataset.column) {
      setSort({
        column: e.target.dataset.column,
        order: sort.order === "DESC" ? "ASC" : "DESC",
      });
    } else {
      setSort({
        column: e.target.dataset.column,
        order: "ASC",
      });
    }
  };

  var checkboxes = [];
  var dynamicCheckboxes = [];
  var header1 = [];
  var header2 = [];
  var header3 = [];
  var classes;
  var sortData = sort ? sort : null;
  var sortOrder;

  for (var column in reduxFilter) {
    var isVisible = reduxFilter[column].isVisible;
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
            onClick={onHeaderClick}
          >
            {reduxFilter[column].displayName}
          </div>
        </th>
      );
      header3.push(
        <th className={classes} key={column}>
          <Form>
            <Form.Control
              size="sm"
              type="text"
              placeholder={reduxFilter[column].displayName}
              value={reduxFilter[column].filter}
              onChange={handleFilterColumnChange}
              onKeyPress={handleKeyPress}
            />
          </Form>
        </th>
      );
    }
    checkboxes.push(
      <Column
        key={column}
        columnName={reduxFilter[column].displayName}
        onChange={handleColumnChange}
        defaultChecked={isVisible}
      />
    );
  }

  for (column in reduxDynamicFilters) {
    isVisible = reduxDynamicFilters[column].isVisible;
    if (isVisible) {
      if (column === "DNS EU") {
        header1.push(
          <th key="headerDNS1">
            <Button
              variant="outline-info"
              data-column={column}
              onClick={(e) => updating(e.target.dataset.column)}
            >
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
                value={reduxDynamicFilters[column].filter}
                onChange={handleDynamicFilterChange}
                onKeyPress={handleKeyPress}
              />
            </Form>
          </th>
        );
      } else if (column === "DNS CN") {
        header1.push(
          <th key="headerDNSCN1">
            <Button
              variant="outline-info"
              data-column={column}
              onClick={(e) => updating(e.target.dataset.column)}
            >
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
                value={reduxDynamicFilters[column].filter}
                onChange={handleDynamicFilterChange}
                onKeyPress={handleKeyPress}
              />
            </Form>
          </th>
        );
      } else if (column === "SSL EU") {
        header1.push(
          <th key="headerSSL1">
            <Button
              variant="outline-info"
              data-column={column}
              onClick={(e) => updating(e.target.dataset.column)}
            >
              Test
            </Button>
          </th>
        );
        header2.push(<th key="headerSSL2">SSL validity in EU</th>);
        header3.push(<th key="headerSSL3"></th>);
      } else if (column === "SSL CN") {
        header1.push(
          <th key="headerSSLCN1">
            <Button
              variant="outline-info"
              data-column={column}
              onClick={(e) => updating(e.target.dataset.column)}
            >
              Test
            </Button>
          </th>
        );
        header2.push(<th key="headerSSLCN2">SSL validity in CN</th>);
        header3.push(<th key="headerSSLCN3"></th>);
      } else if (column === "Redirection EU") {
        header1.push(
          <th key="headerRedirEU1">
            <Button
              variant="outline-info"
              data-column={column}
              onClick={(e) => updating(e.target.dataset.column)}
            >
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
                value={reduxDynamicFilters[column].filter}
                onChange={handleDynamicFilterChange}
                onKeyPress={handleKeyPress}
              />
            </Form>
          </th>
        );
      } else if (column === "Redirection CN") {
        header1.push(
          <th key="headerRedirCN1">
            <Button
              variant="outline-info"
              data-column={column}
              onClick={(e) => updating(e.target.dataset.column)}
            >
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
                value={reduxDynamicFilters[column].filter}
                onChange={handleDynamicFilterChange}
                onKeyPress={handleKeyPress}
              />
            </Form>
          </th>
        );
      } else if (column === "AEM Folder EU") {
        header1.push(
          <th key="headerAEMFolderEU1">
            <Button
              variant="outline-info"
              data-column={column}
              onClick={(e) => updating(e.target.dataset.column)}
            >
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
                value={reduxDynamicFilters[column].filter}
                onChange={handleDynamicFilterChange}
                onKeyPress={handleKeyPress}
              />
            </Form>
          </th>
        );
      } else if (column === "AEM Folder CN") {
        header1.push(
          <th key="headerAEMFolderCN1">
            <Button
              variant="outline-info"
              data-column={column}
              onClick={(e) => updating(e.target.dataset.column)}
            >
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
                value={reduxDynamicFilters[column].filter}
                onChange={handleDynamicFilterChange}
                onKeyPress={handleKeyPress}
              />
            </Form>
          </th>
        );
      }
    }
    dynamicCheckboxes.push(
      <Column
        key={column}
        columnName={reduxDynamicFilters[column].displayName}
        onChange={handleDynamicColumnChange}
        defaultChecked={isVisible}
      />
    );
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
              columnsFilters={reduxFilter}
              dynamicColumnsFilters={reduxDynamicFilters}
              isadmin={isAdmin()}
              sort={sortData}
            />
          </Table>
        </Col>
      </Row>
    </Container>
  );
}

export default FilterableURLList;
