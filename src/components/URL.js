import React from "react";
import { Link } from "react-router-dom";

import DomainDataService from "admin/services/domain.service";
import Helper from "helpers/Helper";
import { alertService } from "services/AlertService";
import DNS from "components/api/dns";
import Redirect from "components/api/redirect";
import SSL from "components/api/ssl";

const cnameErrorMessage = "Doesn't exist";
const serverUnknownMessage = "Unknown server";
const SSLError = "Unable to get SSL";
const RedirectionError = "Unable to get the redirection";
const NoRedirectionMessage = "No redirection";
const RolexExperienceMessage = "<span class='rolex-experience' >Rolex experience</span>";

// curl --location --request https://tj4k759l15.execute-api.eu-west-1.amazonaws.com/test/dnslookup?DNS=qrt.aptaclub.de --header 'x-api-key: 44XlITH2DCdahKjpe4401eT5070UwdK9xBFCJMR6'
// curl --location --request https://fd902g59y1.execute-api.eu-west-1.amazonaws.com/prod/dnslookup?DNS=qrt.aptaclub.de --header 'x-api-key: ARISr1o5Cp5ElA4GyfbWeR4hgrZeINBaeLTuJZ04'

// const API_DNS = "https://tj4k759l15.execute-api.eu-west-1.amazonaws.com/test/dnslookup?DNS="; // sandbox
// const API_SSL = "https://tj4k759l15.execute-api.eu-west-1.amazonaws.com/test/getsslexpirydate?DNS="; // sandbox
// const API_REDIRECT = "https://tj4k759l15.execute-api.eu-west-1.amazonaws.com/test/getredirect?URL="; // sandbox
// const API_KEY = "44XlITH2DCdahKjpe4401eT5070UwdK9xBFCJMR6"; //sandbox

class URL extends React.Component {
  constructor(props) {
    super(props);

    this.setActiveDomain = this.setActiveDomain.bind(this);
    this.setEditMode = this.setEditMode.bind(this);
    this.cancelEditMode = this.cancelEditMode.bind(this);
    this.validateComment = this.validateComment.bind(this);
    this.validateChangesTodo = this.validateChangesTodo.bind(this);
    this.onChangeComment = this.onChangeComment.bind(this);
    this.onChangeChangesTodo = this.onChangeChangesTodo.bind(this);

    this.state = {
      updateInProgress: false,
      updateDNSInProgress: false,
      updateSSLInProgress: false,
      updateRedirWithSGTINInProgress: false,
      updateRedirWithoutSGTINInProgress: false,
      sgtin: Helper.getRandomSGTIN(),
    };

    this.state = {
      url: props.domain + "/" + this.state.sgtin,
      isSelected: false,
      editMode: false,
    };
  }

  setEditMode() {
    console.log("edit domain", this.props);
    if (!this.state.editMode) {
      this.setState({
        editMode: true,
      });
    }
  }

  onChangeComment(e) {
    console.log("comment updated");
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
    console.log("Cancel comment");
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
    console.log("validate comment", domain);

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
    console.log("validate changesTodo", domain);

    this.updateDomain(domain);
  }

  updateDomain(domain) {
    DomainDataService.update(domain.uuid, domain)
      .then((response) => {
        console.log(response.data);
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

  componentDidUpdate() {
    if (
      this.props.update === true &&
      !this.state.updateInProgress &&
      !this.state.cname &&
      !this.state.otherRecords
    ) {
      // || !this.state.SSLExpiryDate || !this.state.redirectWithSGTIN || !this.state.redirectWithoutSGTIN)) {

      // updateInProgress is here to avoid calling the update again while it is already called
      this.setState({
        updateInProgress: true,
        updateDNSInProgress: true,
        updateSSLInProgress: true,
        updateRedirWithSGTINInProgress: true,
        updateRedirWithoutSGTINInProgress: true,
      });
      this.getAllURLDetails(this.props.domain);
    } else if (
      this.props.updateDNS === true &&
      !this.state.updateDNSInProgress &&
      !this.state.cname &&
      !this.state.otherRecords
    ) {
      this.setState({
        updateDNSInProgress: true,
      });
      this.getDNSDetails(this.props.domain);
    } else if (
      this.props.updateSSL === true &&
      !this.state.updateSSLInProgress &&
      !this.state.SSLExpiryDate
    ) {
      this.setState({
        updateSSLInProgress: true,
      });
      this.getSSLDetails(this.props.domain);
    } else if (
      this.props.updateRedirection === true &&
      !this.state.updateRedirWithoutSGTINInProgress &&
      !this.state.updateRedirWithSGTINInProgress &&
      (typeof this.state.redirects === "undefined" ||
        typeof this.state.redirects.redirectWithSGTIN === "undefined" ||
        typeof this.state.redirects.redirectWithoutSGTIN === "undefined")
    ) {
      this.setState({
        updateRedirWithoutSGTINInProgress: true,
        updateRedirWithSGTINInProgress: true,
      });
      this.getRedirectionDetails(this.props.domain);
    }
  }

  // TODO : if API error, handle it and display a dedicated error message. Or even allows to retry.
  async getAllURLDetails(domain) {
    await this.getDNSDetails(domain);

    if ((this.state.cname || this.state.otherRecords) && this.state.cname !== cnameErrorMessage) {
      await this.getSSLDetails(domain);
      await this.getRedirectionDetails(domain);
    } else {
      this.setState({
        SSLExpiryDate: SSLError,
        redirects: {
          redirectWithoutSGTIN: {
            msg: RedirectionError,
          },
          redirectWithSGTIN: {
            msg: RedirectionError,
          },
        },
      });
    }
    this.setState({
      updateInProgress: false,
      updateDNSInProgress: false,
      updateSSLInProgress: false,
      updateRedirWithoutSGTINInProgress: false,
      updateRedirWithSGTINInProgress: false,
    });
  }

  async getDNSDetails(domain) {
    var domainAndCnameData = {};
    try {
      var response = await DNS.dnsExist(Helper._removeDomainProtocol(domain));
      console.log("DNS response", response);
      var cname, otherRecords;
      if ("CNAME" in response && response.CNAME[0]) {
        cname = response.CNAME[0];
      } else if ("otherrecords" in response) {
        otherRecords = response.otherrecords;
      } else {
        throw Error("Record not found");
      }

      this.setState({
        cname: cname,
        otherRecords: otherRecords,
      });

      var server;
      if (this.props.cnameMapping[cname]) {
        server = this.props.cnameMapping[cname];
      } else if (this.props.cnameMapping[cname + "."]) {
        server = this.props.cnameMapping[cname + "."];
      } else {
        server = serverUnknownMessage;
      }
      this.setState({
        server: server,
      });
      domainAndCnameData[Helper._removeDomainProtocol(domain)] = cname + " " + server;
      this.props.parentCallback(domainAndCnameData);
    } catch (err) {
      this.setState({
        cname: cnameErrorMessage,
      });
      domainAndCnameData[Helper._removeDomainProtocol(domain)] = cnameErrorMessage;
      this.props.parentCallback(domainAndCnameData);
      console.log(domain + ": Error", err);
    }

    this.setState({
      updateDNSInProgress: false,
    });
  }

  async getSSLDetails(domain) {
    try {
      var SSLExpiryDate = await SSL.getSSLExpiryDate(Helper._removeDomainProtocol(domain));
      this.setState({
        SSLExpiryDate: SSLExpiryDate,
      });
    } catch (err) {
      this.setState({
        SSLExpiryDate: SSLError,
      });
      console.log(domain + ": Error", err);
    }

    this.setState({
      updateSSLInProgress: false,
    });
  }

  async getRedirectionDetails(domain) {
    try {
      var redirects = {};
      redirects.redirectWithSGTIN = {};
      redirects.redirectWithSGTIN = await Redirect.getRedirect(this.state.url);
      redirects.redirectWithSGTIN.msg = redirects.redirectWithSGTIN.redirect;
      if (redirects.redirectWithSGTIN.redirect === this.state.url) {
        redirects.redirectWithSGTIN.msg = NoRedirectionMessage;
      }
    } catch (err) {
      redirects.redirectWithSGTIN.msg = RedirectionError;
      console.log(domain + ": Error", err);
    }

    this.setState({
      updateRedirWithSGTINInProgress: false,
    });

    try {
      redirects.redirectWithoutSGTIN = {};
      redirects.redirectWithoutSGTIN = await Redirect.getRedirect(domain);
      redirects.redirectWithoutSGTIN.msg = redirects.redirectWithoutSGTIN.redirect;
      if (
        redirects.redirectWithoutSGTIN.redirect === domain ||
        redirects.redirectWithoutSGTIN.redirect === domain + "/" ||
        redirects.redirectWithoutSGTIN.redirect + "/" === domain
      ) {
        redirects.redirectWithoutSGTIN.msg = NoRedirectionMessage;
      }
    } catch (err) {
      redirects.redirectWithoutSGTIN.msg = RedirectionError;
      console.log(domain + ": Error", err);
    }

    this.setState({
      redirects: redirects,
      updateRedirWithoutSGTINInProgress: false,
    });
  }

  redirectionsWithSGTINisTheSameAsWithoutSGTIN() {
    if (
      !this.state.redirects.redirectWithoutSGTIN.redirect ||
      this.state.redirects.redirectWithoutSGTIN.redirect.length < 1 ||
      !this.state.redirects.redirectWithSGTIN.redirect ||
      this.state.redirects.redirectWithSGTIN.redirect.length < 1
    ) {
      return true;
    }

    if (
      this.state.redirects.redirectWithoutSGTIN.redirect ===
        this.state.redirects.redirectWithSGTIN.redirect ||
      this.state.redirects.redirectWithSGTIN.redirect.includes(
        this.state.redirects.redirectWithoutSGTIN.redirect
      )
    ) {
      return true;
    }
    return false;
  }

  render() {
    if (!this.props.display) {
      return null;
    }

    // DNS cell
    var tdCnameClass = "";
    var DNSContent = this.state.cname;
    if (this.state.updateDNSInProgress) {
      tdCnameClass = "updating";
    }
    if (this.state.server === serverUnknownMessage) {
      tdCnameClass = "warningCell";
    }
    if (this.state.cname === cnameErrorMessage) {
      tdCnameClass = "errorCell";
    }
    if ("server" in this.state) {
      DNSContent = (this.state.cname ? this.state.cname + "<br/>" : "") + this.state.server;
    }

    // SSL cell
    var tdSSLClass = "";
    var SSLContent = "";
    if (this.state.updateSSLInProgress) {
      tdSSLClass = "updating";
    }
    if (this.state.SSLExpiryDate === SSLError) {
      tdSSLClass = "errorCell";
      SSLContent = SSLError;
    } else if (this.state.SSLExpiryDate < 40) {
      tdSSLClass = "warningCell";
    } else if (this.state.SSLExpiryDate) {
      SSLContent = this.state.SSLExpiryDate + " days";
    }

    // Redirection
    var tdRedirectionClass = "";
    var RedirectionContent = "";
    var sameRedirectionsWithOrWithoutSGTIN = true;
    if (this.state.updateRedirWithoutSGTINInProgress) {
      tdRedirectionClass = "updating";
    }
    if (
      typeof this.state.redirects !== "undefined" &&
      typeof this.state.redirects.redirectWithoutSGTIN.redirect !== "undefined" &&
      typeof this.state.redirects.redirectWithSGTIN.redirect !== "undefined"
    ) {
      sameRedirectionsWithOrWithoutSGTIN = this.redirectionsWithSGTINisTheSameAsWithoutSGTIN();

      if (this.state.redirects.redirectWithoutSGTIN.msg === RedirectionError) {
        tdRedirectionClass = "errorCell";
        RedirectionContent = RedirectionError;
      } else {
        RedirectionContent = this.state.redirects.redirectWithoutSGTIN.msg;
        if (this.state.redirects.redirectWithoutSGTIN.isRolex) {
          RedirectionContent += " - " + RolexExperienceMessage;
        }
      }
      if (!sameRedirectionsWithOrWithoutSGTIN) {
        tdRedirectionClass = "warningCell";
        RedirectionContent =
          "Without SGTIN: " +
          RedirectionContent +
          "<br/>With SGTIN:" +
          this.state.redirects.redirectWithSGTIN.msg;
        if (this.state.redirects.redirectWithSGTIN.isRolex) {
          RedirectionContent += " - " + RolexExperienceMessage;
        }
      }
    }

    // Filter
    if (
      "redirectFilter" in this.props &&
      this.props.redirectFilter.length > 0 &&
      (RedirectionContent.length < 1 ||
        !RedirectionContent.toLowerCase().includes(this.props.redirectFilter.toLowerCase()))
    ) {
      return "";
    }

    var message = "";
    // Display a message after a domain is updated
    //           submitted: true,
    // updateError: false,
    // message
    // Update success
    if (this.state && this.state.message && !this.state.updateError) {
      message = (
        <div className="toast" role="alert" aria-live="assertive" aria-atomic="true">
          <div className="toast-header">
            <img src="..." className="rounded me-2" alt="..." />
            <strong className="me-auto">Bootstrap</strong>
            <small>11 mins ago</small>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="toast"
              aria-label="Close"
            ></button>
          </div>
          <div className="toast-body">Hello, world! This is a toast message.</div>
        </div>
      );
    }
    // Update error
    else if (this.state && this.state.message && this.state.updateError) {
      console.log("ERROR");
    }

    var TDs = [];
    var countTD = 0;
    var value;
    var editLink = "";

    if (this.props && "columnsFilters" in this.props) {
      for (var column in this.props.columnsFilters) {
        if (this.props.columnsFilters[column].isVisible) {
          value = "";
          editLink = "";
          // console.log("column", column, this.props[column]);
          if (column in this.props) {
            value = this.props[column];
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
                {message}
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
          if (column === "DNS") {
            TDs.push(
              <td
                key="DNS"
                className={tdCnameClass}
                dangerouslySetInnerHTML={{ __html: DNSContent }}
              ></td>
            );
          } else if (column === "SSL") {
            TDs.push(
              <td key="SSL" className={tdSSLClass}>
                {SSLContent}
              </td>
            );
          } else if (column === "Redirection EU") {
            TDs.push(
              <td
                key="redirectEU"
                className={tdRedirectionClass}
                dangerouslySetInnerHTML={{ __html: RedirectionContent }}
              ></td>
            );
          } else if (column === "Redirection CN") {
            TDs.push(<td></td>);
          }

          countTD++;
        }
      }
    }

    return <tr onClick={() => this.setActiveDomain()}>{TDs}</tr>;
  }
}

export default URL;
