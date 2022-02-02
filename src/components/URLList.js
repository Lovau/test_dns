import React from "react";
import URL from "components/URL";
// import Papa from "papaparse";
// import CSV from "../data/Rolex_URL_working_copy.csv";
// const fetch = require("node-fetch");
import cnameMapping from "data/cname_mapping.json";
import Helper from "helpers/Helper";
import DomainDataService from "services/DomainService";
import { alertService } from "services/AlertService";

class URLList extends React.Component {
  constructor(props) {
    super(props);

    //  this.state.urls[0] = {'domain': "https://qru.aptamilessensis.com", "update": false};
    //  this.state.urls[1] = {'domain': "https://qr.aptaclub.de", "update": false};
    //  this.state.urls[2] = {'domain': "https://qrG.aptaclub.de", "update": false};
    this.state = {
      domainsToCnames: {},
      dynamicValuesByDomain: {},
    };

    this.dynamicFilterCallback = this.dynamicFilterCallback.bind(this);
    this.state.loadingURLs = false;
  }

  dynamicFilterCallback(childData) {
    var dynamicValuesByDomain = { ...this.state.dynamicValuesByDomain, ...childData };
    this.setState({
      dynamicValuesByDomain: dynamicValuesByDomain,
    });
  }

  // async getURLsFromCSV() {
  //   // if (URLs && URLs.length > 0) {
  //   //  return URLs;
  //   // }
  //   var URLs = await this.readCSV();
  //   for (var i = 0; i < URLs.length; i++) {
  //     URLs[i].update = false;
  //   }

  //   console.log("URLS", URLs);

  //   this.setState({
  //     urls: URLs,
  //   });
  // }

  // async readCSV() {
  //   return fetch(CSV)
  //     .then((response) => {
  //       return response.text();
  //     })
  //     .then((text) => {
  //       var results = Papa.parse(text, { header: true, skipEmptyLines: true }); // object with { data, errors, meta }
  //       var rows = results.data; // array of objects
  //       // console.log("Results, rows", results, rows);
  //       return rows;
  //     });
  // }

  // some domains were created before new fields were introduced
  // so the fields are incomplete. Make sure we set default values here
  cleanDomainData(domain) {
    var cleanedDomain = domain;

    cleanedDomain.update = false;

    if (!Object.prototype.hasOwnProperty.call(cleanedDomain, "changesTodo")) {
      cleanedDomain.changesTodo = "N";
    }

    if (!Object.prototype.hasOwnProperty.call(cleanedDomain, "live")) {
      cleanedDomain.live = "N";
    }

    if (!Object.prototype.hasOwnProperty.call(cleanedDomain, "liveCN")) {
      cleanedDomain.liveCN = "N";
    }

    if (!cleanedDomain.expectedRedirectEU) {
      cleanedDomain.expectedRedirectEU = "";
    }

    if (!cleanedDomain.expectedRedirectCN) {
      cleanedDomain.expectedRedirectCN = "";
    }

    return cleanedDomain;
  }

  async retrieveDomains() {
    this.setState({
      loadingURLs: true,
    });

    await DomainDataService.getAll()
      .then((response) => {
        // console.log("domain response", response);
        var URLs = response.Items;
        for (var i = 0; i < URLs.length; i++) {
          URLs[i] = this.cleanDomainData(URLs[i]);
        }

        this.setState({
          domains: URLs,
          loadingURLs: false,
        });
        this.orderDomains();
      })
      .catch(alertService.error);
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
    var dns = Helper._removeDomainProtocol(domain.domain);
    // if (
    //   this.props.cnameFilter.length > 0 &&
    //   (!(dns in this.state.domainsToCnames) ||
    //     !this.state.domainsToCnames[dns]
    //       .toLowerCase()
    //       .includes(this.props.cnameFilter.toLowerCase()))
    // ) {
    //   return true;
    // }

    //TODO filter based on this.props.dynamicColumnsFilters
    for (var column in this.props.dynamicColumnsFilters) {
      if (
        this.props.dynamicColumnsFilters[column].isVisible &&
        this.props.dynamicColumnsFilters[column].filter &&
        this.props.dynamicColumnsFilters[column].filter.length > 0
      ) {
        // DNS
        // if (
        //   (column === "DNS EU" || column === "DNS CN") &&
        //   (!(dns in this.state.domainsToCnames) ||
        //     !this.state.domainsToCnames[dns]
        //       .toLowerCase()
        //       .includes(this.props.cnameFilter.toLowerCase()))
        // ) {
        //   return true;
        // }

        if (
          this.state.dynamicValuesByDomain &&
          this.state.dynamicValuesByDomain[dns] &&
          this.state.dynamicValuesByDomain[dns][column] &&
          !this.state.dynamicValuesByDomain[dns][column]
            .toLowerCase()
            .includes(this.props.dynamicColumnsFilters[column].filter.toLowerCase())
        ) {
          return true;
        }
      }
    }

    for (column in this.props.columnsFilters) {
      if (
        Object.prototype.hasOwnProperty.call(domain, column) &&
        typeof domain[column] === "boolean"
      ) {
        domain[column] = domain[column] ? "Y" : "N";
      }

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
    // console.log("cnamefilter", this.props.cnameFilter);
    // console.log("dynamicfilter", this.props.dynamicColumnsFilters);

    return false;
  }

  render() {
    if (this.state && this.state.loadingURLs) {
      return (
        <tbody>
          <tr>
            <td key="loading">Loading the URLs ...</td>
          </tr>
        </tbody>
      );
    } else if (!this.state || !("domains" in this.state) || this.state.domains.length < 1) {
      return (
        <tbody>
          <tr>
            <td key="No URLs">No URLs provided.</td>
          </tr>
        </tbody>
      );
    }

    var redirectFilter = this.props.redirectFilter;

    // const filteredURLs = this.state.domains.filter((domain) => {
    //   if (!this.URLisFiltered(domain)) {
    //     return domain;
    //   }
    // });

    if (this.props.sort && this.props.sort.column) {
      var sortOrder = this.props.sort.order === "ASC" ? "" : "-";
      // filteredURLs.sort(Helper.dynamicSort(sortOrder + this.props.sort.column));
      this.state.domains.sort(Helper.dynamicSort(sortOrder + this.props.sort.column));
    }

    const listUrls = this.state.domains.map((domain) => {
      var update = this.props.update;
      var updateDNS = this.props.updateDNS;
      var updateDNSCN = this.props.updateDNSCN;
      var updateSSL = this.props.updateSSL;
      var updateSSLCN = this.props.updateSSLCN;
      var updateRedirection = this.props.updateRedirection;
      var updateRedirectionCN = this.props.updateRedirectionCN;
      var updateAEMFolder = this.props.updateAEMFolder;
      var updateAEMFolderCN = this.props.updateAEMFolderCN;
      var display = true;
      if (this.URLisFiltered(domain)) {
        update = false;
        updateDNS = false;
        updateDNSCN = false;
        updateSSL = false;
        updateSSLCN = false;
        updateRedirection = false;
        updateRedirectionCN = false;
        updateAEMFolder = false;
        updateAEMFolderCN = false;
        display = false;
      }

      domain.brand = domain.brand.trim();
      return (
        <URL
          key={domain.domain}
          uuid={domain.uuid}
          domain={domain.domain}
          brand={domain.brand}
          environment={domain.environment}
          live={domain.live}
          liveCN={domain.liveCN}
          comment={domain.comment}
          updated={domain.updated}
          expectedRedirectEU={domain.expectedRedirectEU}
          expectedRedirectCN={domain.expectedRedirectCN}
          changesTodo={domain.changesTodo}
          redirectFilter={redirectFilter}
          cnameMapping={cnameMapping}
          update={update}
          updateDNS={updateDNS}
          updateDNSCN={updateDNSCN}
          updateSSL={updateSSL}
          updateSSLCN={updateSSLCN}
          updateRedirection={updateRedirection}
          updateRedirectionCN={updateRedirectionCN}
          updateAEMFolder={updateAEMFolder}
          updateAEMFolderCN={updateAEMFolderCN}
          display={display}
          dynamicFilterCallback={this.dynamicFilterCallback}
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
