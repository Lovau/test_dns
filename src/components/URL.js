import React from "react";
import { Link } from "react-router-dom";

import DomainDataService from "services/DomainService";
import Helper from "helpers/Helper";
import { alertService } from "services/AlertService";
import CellDNS from "components/CellDNS";
import CellSSL from "components/CellSSL";
import CellRedirect from "components/CellRedirect";

// curl --location --request https://tj4k759l15.execute-api.eu-west-1.amazonaws.com/test/dnslookup?DNS=qrt.aptaclub.de --header 'x-api-key: 44XlITH2DCdahKjpe4401eT5070UwdK9xBFCJMR6'
// curl --location --request https://fd902g59y1.execute-api.eu-west-1.amazonaws.com/prod/dnslookup?DNS=qrt.aptaclub.de --header 'x-api-key: ARISr1o5Cp5ElA4GyfbWeR4hgrZeINBaeLTuJZ04'

// const API_DNS = "https://tj4k759l15.execute-api.eu-west-1.amazonaws.com/test/dnslookup?DNS="; // sandbox
// const API_SSL = "https://tj4k759l15.execute-api.eu-west-1.amazonaws.com/test/getsslexpirydate?DNS="; // sandbox
// const API_REDIRECT = "https://tj4k759l15.execute-api.eu-west-1.amazonaws.com/test/getredirect?URL="; // sandbox
// const API_KEY = "44XlITH2DCdahKjpe4401eT5070UwdK9xBFCJMR6"; //sandbox

export default class URL extends React.Component {
  constructor(props) {
    super(props);

    this.setActiveDomain = this.setActiveDomain.bind(this);
    this.setEditMode = this.setEditMode.bind(this);
    this.cancelEditMode = this.cancelEditMode.bind(this);
    this.validateComment = this.validateComment.bind(this);
    this.validateChangesTodo = this.validateChangesTodo.bind(this);
    this.onChangeComment = this.onChangeComment.bind(this);
    this.onChangeChangesTodo = this.onChangeChangesTodo.bind(this);

    var sgtin = Helper.getRandomSGTIN();
    this.state = {
      sgtin: sgtin,
      url: props.domain + "/" + sgtin,
      isSelected: false,
      editMode: false,
    };
  }

  setEditMode() {
    if (this.props.isadmin && !this.state.editMode) {
      this.setState({
        editMode: true,
      });
    }
  }

  onChangeComment(e) {
    this.setState({
      comment: e.target.value,
    });
  }

  onChangeChangesTodo() {
    var val = this.props.changesTodo;
    if (this.state && this.state.changesTodo) {
      val = this.state.changesTodo;
    }
    this.setState({
      changesTodo: val === "Y" ? "N" : "Y",
    });
  }

  cancelEditMode() {
    this.setState({
      editMode: false,
      comment: null,
    });
  }

  validateComment() {
    this.setState({
      editMode: false,
    });
    if (!this.state.comment) {
      return;
    }

    var domain = Object.assign({}, this.props);
    domain.comment = this.state.comment;

    this.updateDomain(domain);
  }

  validateChangesTodo() {
    this.setState({
      editMode: false,
    });
    if (!("changesTodo" in this.state)) {
      return;
    }

    var domain = Object.assign({}, this.props);
    domain.changesTodo = this.state.changesTodo === "Y" ? true : false;

    this.updateDomain(domain);
  }

  updateDomain(domain) {
    DomainDataService.update(domain.uuid, domain)
      .then(() => {
        alertService.success(
          `The domain <b>[${Helper._removeDomainProtocol(
            domain.domain
          )}]</b> was updated successfully!`
        );
      })
      .catch((e) => {
        console.log(e);
        alertService.error(e.toString());
      });
  }

  setActiveDomain() {
    this.setState({
      isSelected: !this.state.isSelected,
    });
  }

  render() {
    //TODO : pass this display props to Cells and let the Cell handle the display,
    // to avoid a filter emptying the dynamic values
    if (!this.props.display) {
      return null;
    }

    // Filter
    // TODO: why was this filter here ? move it elswhere
    // if (
    //   "redirectFilter" in this.props &&
    //   this.props.redirectFilter.length > 0 &&
    //   (RedirectionContent.length < 1 ||
    //     !RedirectionContent.toLowerCase().includes(this.props.redirectFilter.toLowerCase()))
    // ) {
    //   return "";
    // }

    //TODO : display a message when a domain is successfully updated or if the update has an error
    var TDs = [];
    var countTD = 0;
    var value;
    var editLink = "";

    if (this.props && "columnsFilters" in this.props) {
      for (var column in this.props.columnsFilters) {
        if (this.props.columnsFilters[column].isVisible) {
          value = "";
          editLink = "";
          if (column in this.props) {
            value = this.props[column];
          }
          if (column === "domain") {
            value +=
              "<a href='" +
              this.props[column] +
              "/0123456789129000OCVALID?stubapi' target='_blank' class='URLLink'></a>";
          }
          if (column === "liveCN" && !this.props.liveCN) {
            value = "N";
          }
          if (column === "comment" && this.state.comment) {
            value = this.state.comment;
          }
          if (column === "changesTodo" && this.state.changesTodo) {
            value = this.state.changesTodo;
          }
          if (column === "changesTodo" && this.state.editMode) {
            value = value === "Y" ? true : false;
          }
          if (column === "comment" && !this.state.editMode) {
            value = value.replace(/(?:\r\n|\r|\n)/g, "<br>");
          }

          // if it is the 1st cell, we display here the edit button
          if (this.props.isadmin && countTD === 0 && this.state && this.state.isSelected) {
            editLink = (
              <>
                <Link
                  to={"/admin/update/" + this.props.uuid}
                  className="edit badge badge-warning"
                  target="_blank"
                >
                  Edit
                </Link>
              </>
            );
          }
          countTD++;
          if (column === "comment" && this.state.editMode) {
            TDs.push(
              <td key={column} onClick={this.setEditMode}>
                <textarea
                  name="comment"
                  id="comment"
                  className="form-control"
                  onChange={this.onChangeComment}
                  defaultValue={value}
                  rows="3"
                ></textarea>
                <button onClick={this.cancelEditMode} className="badge badge-warning comment">
                  Cancel
                </button>
                <button onClick={this.validateComment} className="badge badge-success comment">
                  Submit
                </button>
              </td>
            );
          } else if (column === "changesTodo" && this.state.editMode) {
            TDs.push(
              <td key={column} onClick={this.setEditMode}>
                <span className="changesTodoForm mt-1">
                  <input
                    type="checkbox"
                    name="changesTodo"
                    id="changesTodo"
                    className="form-control"
                    onChange={this.onChangeChangesTodo}
                    checked={value}
                  />
                  <button onClick={this.cancelEditMode} className="badge badge-warning comment">
                    Cancel
                  </button>
                  <button
                    onClick={this.validateChangesTodo}
                    className="badge badge-success comment"
                  >
                    Submit
                  </button>
                </span>
              </td>
            );
          } else if (column === "comment" || column === "changesTodo") {
            TDs.push(
              <td
                key={column}
                onClick={this.setEditMode}
                dangerouslySetInnerHTML={{ __html: value }}
              ></td>
            );
          } else if (column === "domain") {
            TDs.push(<td key={column} dangerouslySetInnerHTML={{ __html: value }}></td>);
          } else {
            TDs.push(
              <td key={column}>
                {editLink}
                {value}
              </td>
            );
          }
        }
      }
    }

    if (this.props && "dynamicColumnsFilters" in this.props) {
      for (column in this.props.dynamicColumnsFilters) {
        if (this.props.dynamicColumnsFilters[column].isVisible) {
          value = "";
          if (column === "DNS EU") {
            TDs.push(
              <CellDNS
                key="DNSEU"
                domain={this.props.domain}
                isChina={false}
                updateDNS={this.props.updateDNS}
                cnameMapping={this.props.cnameMapping}
                parentCallback={this.props.parentCallback}
              />
            );
          } else if (column === "DNS CN") {
            TDs.push(
              <CellDNS
                key="DNSCN"
                domain={this.props.domain}
                isChina={true}
                update={this.props.updateDNSCN}
                cnameMapping={this.props.cnameMapping}
                parentCallback={this.props.parentCallback}
              />
            );
          } else if (column === "SSL EU") {
            TDs.push(
              <CellSSL
                key="SSLEU"
                domain={this.props.domain}
                isChina={false}
                update={this.props.updateSSL}
              />
            );
          } else if (column === "SSL CN") {
            TDs.push(
              <CellSSL
                key="SSLCN"
                domain={this.props.domain}
                isChina={true}
                update={this.props.updateSSLCN}
              />
            );
          } else if (column === "Redirection EU") {
            TDs.push(
              <CellRedirect
                key="redirectEU"
                url={this.state.url}
                domain={this.props.domain}
                isChina={false}
                update={this.props.updateRedirection}
              />
            );
          } else if (column === "Redirection CN") {
            TDs.push(
              <CellRedirect
                key="redirectCN"
                url={this.state.url}
                domain={this.props.domain}
                isChina={true}
                update={this.props.updateRedirectionCN}
              />
            );
          }

          countTD++;
        }
      }
    }

    return <tr onClick={() => this.setActiveDomain()}>{TDs}</tr>;
  }
}
