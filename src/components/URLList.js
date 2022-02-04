import React, { useState, useEffect } from "react";
import URL from "components/URL";
// import Papa from "papaparse";
// import CSV from "../data/Rolex_URL_working_copy.csv";
// const fetch = require("node-fetch");
import cnameMapping from "data/cname_mapping.json";
import Helper from "helpers/Helper";
import DomainDataService from "services/DomainService";
import { alertService } from "services/AlertService";
import { useSelector } from "react-redux";

function URLList(props) {
  const [domains, setDomains] = useState([]);
  const [loadingURLs, setLoadingURLs] = useState({});
  // const [dynamicValuesByDomain, setDynamicValuesByDomain] = useState({});

  const reduxDynamicValues = useSelector((state) => state.DomainDynamicValue);

  // For testing purpose, we might want to load the URLs from a CSV file
  // async getURLsFromCSV() {
  //   // if (URLs && URLs.length > 0) {
  //   //  return URLs;
  //   // }
  //   var URLs = await readCSV();
  //   for (var i = 0; i < URLs.length; i++) {
  //     URLs[i].update = false;
  //   }

  //   console.log("URLS", URLs);

  //   setState({
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
  const cleanDomainData = (domain) => {
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
  };

  const retrieveDomains = async () => {
    setLoadingURLs(true);

    await DomainDataService.getAll()
      .then((response) => {
        // console.log("domain response", response);
        var URLs = response.Items;
        for (var i = 0; i < URLs.length; i++) {
          URLs[i] = cleanDomainData(URLs[i]);
        }

        setDomains(URLs);
        setLoadingURLs(false);
        orderDomains();
      })
      .catch(alertService.error);
  };

  const orderDomains = () => {
    if (domains && domains.length > 0) {
      setDomains(
        domains.sort((a, b) => {
          var brandcompare = a.brand.localeCompare(b.brand);
          if (brandcompare !== 0) {
            return brandcompare;
          }
          return a.environment.localeCompare(b.environment);
        })
      );
    }
  };

  // componentDidMount equivalent
  useEffect(() => {
    // getURLsFromCSV();
    retrieveDomains();
  }, []);

  const URLisFiltered = (domain) => {
    var dns = Helper._removeDomainProtocol(domain.domain);

    for (var column in props.dynamicColumnsFilters) {
      if (
        props.dynamicColumnsFilters[column].isVisible &&
        props.dynamicColumnsFilters[column].filter &&
        props.dynamicColumnsFilters[column].filter.length > 0 &&
        reduxDynamicValues &&
        reduxDynamicValues[dns] &&
        reduxDynamicValues[dns][column] &&
        !reduxDynamicValues[dns][column]
          .toLowerCase()
          .includes(props.dynamicColumnsFilters[column].filter.toLowerCase())
      ) {
        return true;
      }
    }

    for (column in props.columnsFilters) {
      if (
        Object.prototype.hasOwnProperty.call(domain, column) &&
        typeof domain[column] === "boolean"
      ) {
        domain[column] = domain[column] ? "Y" : "N";
      }

      if (
        props.columnsFilters[column].isVisible &&
        props.columnsFilters[column].filter &&
        props.columnsFilters[column].filter.length > 0 &&
        (!domain[column] ||
          !domain[column].toLowerCase().includes(props.columnsFilters[column].filter.toLowerCase()))
      ) {
        return true;
      }
    }

    return false;
  };

  if (loadingURLs) {
    return (
      <tbody>
        <tr>
          <td key="loading">Loading the URLs ...</td>
        </tr>
      </tbody>
    );
  } else if (domains.length < 1) {
    return (
      <tbody>
        <tr>
          <td key="No URLs">No URLs provided.</td>
        </tr>
      </tbody>
    );
  }

  // const filteredURLs = state.domains.filter((domain) => {
  //   if (!URLisFiltered(domain)) {
  //     return domain;
  //   }
  // });

  if (props.sort && props.sort.column) {
    var sortOrder = props.sort.order === "ASC" ? "" : "-";
    // filteredURLs.sort(Helper.dynamicSort(sortOrder + props.sort.column));
    domains.sort(Helper.dynamicSort(sortOrder + props.sort.column));
  }

  const listUrls = domains.map((domain) => {
    var display = true;
    if (URLisFiltered(domain)) {
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
        cnameMapping={cnameMapping}
        display={display}
        columnsFilters={props.columnsFilters}
        dynamicColumnsFilters={props.dynamicColumnsFilters}
        isadmin={props.isadmin}
      />
    );
  });

  return <tbody>{listUrls}</tbody>;
}

export default URLList;
