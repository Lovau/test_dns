import React, { Component } from "react";
import DomainDataService from "../services/domain.service";
import { Link } from "react-router-dom";
import FuzzySearch from "react-fuzzy/dist/index.js";
import Helper from "../../components/Helper";

export default class DomainsList extends Component {
  constructor(props) {
    super(props);
    // this.onChangeSearch = this.onChangeSearch.bind(this);
    this.retrieveDomains = this.retrieveDomains.bind(this);
    this.refreshList = this.refreshList.bind(this);
    this.setActiveDomain = this.setActiveDomain.bind(this);
    // this.search = this.search.bind(this);

    this.state = {
      domains: [],
      currentDomain: null,
      currentIndex: -1,
      search: "",
      fuzzySelected: null
    };
  }

  componentDidMount() {
    var columns = Helper.getColumnsNames();
    var columnsFilters = [];
    for (var i = 0; i < columns.length; i++) {
      columnsFilters[columns[i]] = {
        isVisible: "true",//Helper.isColumnAlwaysVisible(columns[i]),
        filter: '',
      };
    }
    this.setState({
      columnsFilters: columnsFilters,
    });

    this.retrieveDomains();
  }

  // onChangeSearch(e) {
  //   const search = e.target.value;

  //   this.setState({
  //     search: search
  //   });
  // }

  retrieveDomains() {
    DomainDataService.getAll()
      .then(response => {

        this.setState({
          domains: response.data.Items
        });
        this.orderDomains();
        this.defineFuzzySearchList();
        console.log("All domains", response.data.Items);
      })
      .catch(e => {
        console.log(e);
      });
  }

  defineFuzzySearchList() {
    var fuzzylist = [];
    for (var i = 0; i < this.state.domains.length; i++) {
      fuzzylist.push({
        'brand': this.state.domains[i].brand,
        'environment': this.state.domains[i].environment,
        'domain': this.state.domains[i].domain,
        'live': this.state.domains[i].live,
        'comment': this.state.domains[i].comment,
      });
    }

    this.setState({
      fuzzylist: fuzzylist
    });
  }

  setSelectedItem(selectedItem) {
    console.log("setSelectedItem", selectedItem);
    this.setState({
      fuzzySelected: selectedItem
    });
  }

  refreshList() {
    this.retrieveDomains();
    this.orderDomains();
    this.setState({
      currentDomain: null,
      currentIndex: -1
    });
  }

  setActiveDomain(domain, index) {
    this.setState({
      currentDomain: domain,
      currentIndex: index
    });
    console.log("Active domain", domain, index);
  }
  
  orderDomains() {
    this.setState({
      domains: this.state.domains.sort((a, b) => (a.brand.localeCompare(b.brand)))
    });
    console.log("order");
  }

  search() {
    // this.setState({
    //   currentDomain: null,
    //   currentIndex: -1
    // });

    // DomainDataService.findByTitle(this.state.search)
    //   .then(response => {
    //     this.setState({
    //       domains: response.data
    //     });
    //     console.log(response.data);
    //   })
    //   .catch(e => {
    //     console.log(e);
    //   });
  }

  getClassNameTR(domain, index) {
    var className = "";
    if (index === this.state.currentIndex) {
      className = "table-primary";
    }
    else {
      className = "notselected";
    }
    if (this.state.fuzzySelected && this.state.fuzzySelected.domain === domain.domain) {
      className += " fuzzyresult";
    } else if (this.state.fuzzySelected && this.state.fuzzySelected.domain !== domain.domain) {
      className += " fuzzyresultNotSelected";
    }

    return className;
  }

  render() {
    const { domains, currentDomain, currentIndex, fuzzylist } = this.state;

    return (
      <div className="list row">
        <div className="col-md-8">
          <div className="input-group mb-3">
          <FuzzySearch
            list={fuzzylist}
            keys={['brand', 'environment', 'live']}
            width={430}
            onSelect={(newSelectedItem) => {
              this.setSelectedItem(newSelectedItem)
            }}
            options={{ 
              threshold: 0.6,
              maxResults: 15
            }}
            resultsTemplate={(props, state, styles, clickHandler) => {
              return state.results.map((val, i) => {
                const style = state.selectedIndex === i ? styles.selectedResultStyle : styles.resultsStyle;
                return (
                  <div
                    key={i}
                    style={style}
                    onClick={() => clickHandler(i)}
                  >
                    {val.brand} | {val.environment} | {val.domain} | {val.live} {(val.comment && val.comment.length > 0 ? "| {val.comment}" : "" )}
                  </div>
                );
              });
            }}
          />
        </div>
        </div>
        <div className="col-md-3">
          <h4 className="adminTitle">Domains List</h4>
        </div>

          <table className="table table-hover table-striped table-sm adminTable ">
            <thead>
              <tr>
                <th scope="col">Brand</th>
                <th scope="col">Environment</th>
                <th scope="col">Domain</th>
                <th scope="col">Live</th>
                <th scope="col">Comment</th>
              </tr>
            </thead>
            <tbody>

          {domains && domains.length > 0 && domains.map((domain, index) => (
              <tr onClick={() => this.setActiveDomain(domain, index)} key={index} className={ this.getClassNameTR(domain, index) }>
                <td>{domain.brand}</td>
                <td>{domain.environment}</td>
                <td>{domain.domain}</td>
                <td>{domain.live}</td>
                <td >{domain.comment}
                {currentDomain && currentIndex === index ? (
                    <Link
                      to={"/isadmin/update/" + currentDomain.uuid}
                      className="badge badge-warning"
                    >
                      Edit
                    </Link>
                ) : ("")}
                </td>
              </tr>
          ))}
            </tbody>
          </table>
      </div>
    );
  }
}
