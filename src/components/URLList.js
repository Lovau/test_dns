import React from "react";
import Papa from "papaparse";
import URL from "./URL";
// import CSV from "../data/urls.csv";
import CSV from "../data/Rolex_URL_working_copy.csv";
import cnameMapping from "../data/cname_mapping.json";
import Helper from "./Helper";
import DomainDataService from "../admin/services/domain.service";

const fetch = require("node-fetch");

class URLList extends React.Component {
  constructor(props) {
    super(props);

    //  this.state.urls[0] = {'domain': "https://qru.aptamilessensis.com", "update": false};
    //  this.state.urls[1] = {'domain': "https://qr.aptaclub.de", "update": false};
    //  this.state.urls[2] = {'domain': "https://qrG.aptaclub.de", "update": false};
    this.state = {
      domainsToCnames: {},
    };

    this.handleCallback = this.handleCallback.bind(this);
    this.state.loadingURLs = false;
  }

  handleCallback(childData) {
    var domainsToCnames = { ...this.state.domainsToCnames, ...childData };

    this.setState({
      domainsToCnames: domainsToCnames,
    });
  }

  async getURLsFromCSV() {
    // if (URLs && URLs.length > 0) {
    //  return URLs;
    // }
    var URLs = await this.readCSV();
    for (var i = 0; i < URLs.length; i++) {
      URLs[i].update = false;
    }

    console.log("URLS", URLs);

    this.setState({
      urls: URLs,
    });
  }

  async readCSV() {
    return fetch(CSV)
      .then((response) => {
        return response.text();
      })
      .then((text) => {
        var results = Papa.parse(text, { header: true, skipEmptyLines: true }); // object with { data, errors, meta }
        var rows = results.data; // array of objects
        // console.log("Results, rows", results, rows);
        return rows;
      });
  }

  async retrieveDomains() {
    this.setState({
      loadingURLs: true,
    });

    await DomainDataService.getAll()
      .then((response) => {
        var URLs = response.data.Items;
        for (var i = 0; i < URLs.length; i++) {
          URLs[i].update = false;
          if (URLs[i].changesTodo) {
            URLs[i].changesTodo = "Y";
          } else {
            URLs[i].changesTodo = "N";
          }
        }

        this.setState({
          domains: URLs,
          loadingURLs: false,
        });

        this.orderDomains();
      })
      .catch((e) => {
        console.log(e);
      });
  }

  orderDomains() {
    if (this.state && this.state.domains && this.state.domains.length > 0) {
      this.setState({
        domains: this.state.domains.sort((a, b) => {
          var brandcompare = a.brand.localeCompare(b.brand);
          if (brandcompare !== 0) {
            return brandcompare;
          }
          return a.environment.localeCompare(b.environment);
        }),
      });
    }
  }

  componentDidMount() {
    // this.getURLsFromCSV();
    this.retrieveDomains();
  }

  URLisFiltered(domain) {
    var dns = Helper._removeDomainProtocol(domain.brand);
    if (
      this.props.cnameFilter.length > 0 &&
      (!(dns in this.state.domainsToCnames) ||
        !this.state.domainsToCnames[dns]
          .toLowerCase()
          .includes(this.props.cnameFilter.toLowerCase()))
    ) {
      return true;
    }

    for (var column in this.props.columnsFilters) {
      if (
        this.props.columnsFilters[column].isVisible &&
        this.props.columnsFilters[column].filter &&
        this.props.columnsFilters[column].filter.length > 0 &&
        (!domain[column] ||
          !domain[column]
            .toLowerCase()
            .includes(this.props.columnsFilters[column].filter.toLowerCase()))
      ) {
        return true;
      }
    }

    return false;
  }

  render() {
    // if (!this.state || !("urls" in this.state) || this.state.urls.length < 1) {
    if (this.state && this.state.loadingURLs) {
      return (
        <tbody>
          <tr>
            <td key="loading">Loading the URLs ...</td>
          </tr>
        </tbody>
      );
    } else if (
      !this.state ||
      !("domains" in this.state) ||
      this.state.domains.length < 1
    ) {
      return (
        <tbody>
          <tr>
            <td key="No URLs">No URLs provided.</td>
          </tr>
        </tbody>
      );
    }

    var redirectFilter = this.props.redirectFilter;

    // const listUrls = this.state.urls.map((domain) => {
    const listUrls = this.state.domains.map((domain) => {
      var update = this.props.update;
      var updateDNS = this.props.updateDNS;
      var updateSSL = this.props.updateSSL;
      var updateRedirection = this.props.updateRedirection;
      var updateRedirectionCN = this.props.updateRedirectionCN;
      var display = true;
      if (this.URLisFiltered(domain)) {
        update = false;
        updateDNS = false;
        updateSSL = false;
        updateRedirection = false;
        updateRedirectionCN = false;
        display = false;
      }

      domain.brand = domain.brand.trim();

      return (
        <URL
          key={domain.domain}
          uuid={domain.uuid}
          domain={domain.domain}
          brand={domain.brand} // dynamic field
          environment={domain.environment} // dynamic field
          live={domain.live} // dynamic field
          comment={domain.comment} // dynamic field
          updated={domain.updated} // dynamic field
          expectedRedirectEU={domain.expectedRedirectEU} // dynamic field
          expectedRedirectCN={domain.expectedRedirectCN} // dynamic field
          changesTodo={domain.changesTodo} // dynamic field
          redirectFilter={redirectFilter}
          cnameMapping={cnameMapping}
          update={update}
          updateDNS={updateDNS}
          updateSSL={updateSSL}
          updateRedirection={updateRedirection}
          updateRedirectionCN={updateRedirectionCN}
          display={display}
          parentCallback={this.handleCallback}
          columnsFilters={this.props.columnsFilters}
          dynamicColumnsFilters={this.props.dynamicColumnsFilters}
          isadmin={this.props.isadmin}
        />
      );
    });

    return <tbody>{listUrls}</tbody>;
  }
}

export default URLList;
