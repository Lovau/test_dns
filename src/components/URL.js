import React from "react";
import { Link } from "react-router-dom";

import DomainDataService from "services/DomainService";
import Helper from "helpers/Helper";
import { alertService } from "services/AlertService";
import DNS from "services/api/dns";
import Redirect from "services/api/redirect";
import SSL from "services/api/ssl";

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

    var sgtin = Helper.getRandomSGTIN();
    this.state = {
      update: {
        everything: false,
        DnsEU: false,
        DnsCN: false,
        SslEU: false,
        SslCN: false,
        redirWithSgtinEU: false,
        redirWithSgtinCN: false,
      },
      updateInProgress: false,
      updateDNSInProgress: false,
      updateSSLInProgress: false,
      updateRedirWithSGTINInProgress: false,
      updateRedirWithoutSGTINInProgress: false,
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

  componentDidUpdate() {
    var update = this.state.update;

    // Call everything
    if (
      this.props.update === true &&
      !update.everything &&
      !this.state.cname &&
      !this.state.otherRecords
    ) {
      // || !this.state.SSLExpiryDate || !this.state.redirectWithSGTIN || !this.state.redirectWithoutSGTIN)) {

      // updateInProgress is here to avoid calling the update again while it is already called
      update = {
        everything: true,
        DnsEU: true,
        DnsCN: true,
        SslEU: true,
        SslCN: true,
        redirWithSgtinEU: true,
        redirWithoutSgtinEU: true,
        redirWithSgtinCN: true,
        redirWithoutSgtinCN: true,
      };
      this.setState({ update: update });
      this.getAllURLDetails(this.props.domain);

      // DNS call in EU
    } else if (
      this.props.updateDNS === true &&
      !update.DnsEU &&
      !this.state.cname &&
      !this.state.otherRecords
    ) {
      update.DnsEU = true;
      this.setState({ update: update });
      this.getDNSDetails(this.props.domain);

      // DNS call in CN
    } else if (
      this.props.updateDNSCN === true &&
      !update.DnsCN &&
      !this.state.cnameCN &&
      !this.state.otherRecordsCN
    ) {
      update.DnsCN = true;
      this.setState({ update: update });
      this.getDNSDetails(this.props.domain, true);

      // SSL call in EU
    } else if (this.props.updateSSL === true && !update.SslEU && !this.state.SSLExpiryDate) {
      update.SslEU = true;
      this.setState({ update: update });
      this.getSSLDetails(this.props.domain);

      // SSL call in CN
    } else if (this.props.updateSSLCN === true && !update.SslCN && !this.state.SSLExpiryDateCN) {
      update.SslCN = true;
      this.setState({ update: update });
      this.getSSLDetails(this.props.domain, true);

      // Redirection call in EU
    } else if (
      this.props.updateRedirection === true &&
      !update.redirWithSgtinEU &&
      !this.state.redirWithoutSgtinEU &&
      (typeof this.state.redirects === "undefined" ||
        typeof this.state.redirects.redirectWithSGTIN === "undefined" ||
        typeof this.state.redirects.redirectWithoutSGTIN === "undefined")
    ) {
      update.redirWithSgtinEU = true;
      update.redirWithoutSgtinEU = true;
      this.setState({ update: update });
      this.getRedirectionDetails(this.props.domain);

      // Redirection call in CN
    } else if (
      this.props.updateRedirectionCN === true &&
      !update.redirWithSgtinCN &&
      !this.state.redirWithoutSgtinCN &&
      (typeof this.state.redirectsCN === "undefined" ||
        typeof this.state.redirectsCN.redirectWithSGTIN === "undefined" ||
        typeof this.state.redirectsCN.redirectWithoutSGTIN === "undefined")
    ) {
      update.redirWithSgtinCN = true;
      update.redirWithoutSgtinCN = true;
      this.setState({ update: update });
      this.getRedirectionDetails(this.props.domain, true);
    }
  }

  // TODO : if API error, handle it and display a dedicated error message. Or even allows to retry.
  async getAllURLDetails(domain, isChina = false) {
    await this.getDNSDetails(domain, isChina);

    if ((this.state.cname || this.state.otherRecords) && this.state.cname !== cnameErrorMessage) {
      await this.getSSLDetails(domain, isChina);
      await this.getRedirectionDetails(domain, isChina);
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
    var update = {
      everything: true,
      DnsEU: false,
      DnsCN: false,
      SslEU: false,
      SslCN: false,
      redirWithSgtinEU: false,
      redirWithoutSgtinEU: false,
      redirWithSgtinCN: false,
      redirWithoutSgtinCN: false,
    };
    this.setState({
      update: update,
    });
  }

  async getDNSDetails(domain, isChina = false) {
    var domainAndCnameData = {};
    try {
      var response = await DNS.dnsExist(Helper._removeDomainProtocol(domain), isChina);
      console.log("DNS response", response);
      var cname, otherRecords;
      if ("CNAME" in response && response.CNAME[0]) {
        cname = response.CNAME[0];
      } else if ("otherrecords" in response) {
        otherRecords = response.otherrecords;
      } else {
        throw Error("Record not found");
      }

      var server;
      if (this.props.cnameMapping[cname]) {
        server = this.props.cnameMapping[cname];
      } else if (this.props.cnameMapping[cname + "."]) {
        server = this.props.cnameMapping[cname + "."];
      } else {
        server = serverUnknownMessage;
      }
      if (isChina) {
        this.setState({
          cnameCN: cname,
          otherRecordsCN: otherRecords,
          serverCN: server,
        });
      } else {
        this.setState({
          server: server,
          cname: cname,
          otherRecords: otherRecords,
        });
      }

      //TODO : do the same for CN to allow filtering
      domainAndCnameData[Helper._removeDomainProtocol(domain)] = cname + " " + server;
      this.props.parentCallback(domainAndCnameData);
    } catch (err) {
      if (isChina) {
        this.setState({
          cnameCN: cnameErrorMessage,
        });
      } else {
        this.setState({
          cname: cnameErrorMessage,
        });
      }
      domainAndCnameData[Helper._removeDomainProtocol(domain)] = cnameErrorMessage;
      this.props.parentCallback(domainAndCnameData);
      console.log(domain + ": Error", err);
    }

    var update = this.state.update;
    if (isChina) {
      update.DnsCN = false;
    } else {
      update.DnsEU = false;
    }
    this.setState({
      update: update,
    });
  }

  async getSSLDetails(domain, isChina = false) {
    try {
      var SSLExpiryDate = await SSL.getSSLExpiryDate(Helper._removeDomainProtocol(domain), isChina);
      if (isChina) {
        this.setState({
          SSLExpiryDateCN: SSLExpiryDate,
        });
      } else {
        this.setState({
          SSLExpiryDate: SSLExpiryDate,
        });
      }
    } catch (err) {
      if (isChina) {
        this.setState({
          SSLExpiryDateCN: SSLError,
        });
      } else {
        this.setState({
          SSLExpiryDate: SSLError,
        });
      }
      console.log(domain + ": Error", err);
    }

    var update = this.state.update;
    if (isChina) {
      update.SslCN = false;
    } else {
      update.SslEU = false;
    }
    this.setState({
      update: update,
    });
  }

  async getRedirectionDetails(domain, isChina = false) {
    try {
      var redirects = {};
      redirects.redirectWithSGTIN = {};
      redirects.redirectWithSGTIN = await Redirect.getRedirect(this.state.url, isChina);
      redirects.redirectWithSGTIN.msg = redirects.redirectWithSGTIN.redirect;
      if (redirects.redirectWithSGTIN.redirect === this.state.url) {
        redirects.redirectWithSGTIN.msg = NoRedirectionMessage;
      }
    } catch (err) {
      redirects.redirectWithSGTIN.msg = RedirectionError;
      console.log(domain + ": Error", err);
    }

    var update = this.state.update;
    if (isChina) {
      update.redirWithSgtinCN = false;
    } else {
      update.redirWithSgtinEU = false;
    }

    try {
      redirects.redirectWithoutSGTIN = {};
      redirects.redirectWithoutSGTIN = await Redirect.getRedirect(domain, isChina);
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

    if (isChina) {
      update.redirWithoutSgtinCN = false;
      this.setState({
        redirectsCN: redirects,
        update: update,
      });
    } else {
      update.redirWithoutSgtinEU = false;
      this.setState({
        redirects: redirects,
        update: update,
      });
    }
  }

  redirectionsWithSGTINisTheSameAsWithoutSGTIN(isChina = false) {
    var redirectKey = isChina ? "redirectsCN" : "redirects";
    if (
      !this.state[redirectKey].redirectWithoutSGTIN.redirect ||
      this.state[redirectKey].redirectWithoutSGTIN.redirect.length < 1 ||
      !this.state[redirectKey].redirectWithSGTIN.redirect ||
      this.state[redirectKey].redirectWithSGTIN.redirect.length < 1
    ) {
      return true;
    }

    if (
      this.state[redirectKey].redirectWithoutSGTIN.redirect ===
        this.state[redirectKey].redirectWithSGTIN.redirect ||
      this.state[redirectKey].redirectWithSGTIN.redirect.includes(
        this.state[redirectKey].redirectWithoutSGTIN.redirect
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
    if (this.state && this.state.update.DnsEU) {
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

    // DNS CN cell
    var tdCnameClassCN = "";
    var DNSContentCN = this.state.cnameCN;
    if (this.state && this.state.update.DnsCN) {
      tdCnameClassCN = "updating";
    }
    if (this.state.serverCN === serverUnknownMessage) {
      tdCnameClassCN = "warningCell";
    }
    if (this.state.cnameCN === cnameErrorMessage) {
      tdCnameClassCN = "errorCell";
    }
    if ("serverCN" in this.state) {
      DNSContentCN = (this.state.cnameCN ? this.state.cnameCN + "<br/>" : "") + this.state.serverCN;
    }

    // SSL cell
    var tdSSLClass = "";
    var SSLContent = "";
    if (this.state && this.state.update.SslEU) {
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

    // SSL CN cell
    var tdSSLClassCN = "";
    var SSLContentCN = "";
    if (this.state && this.state.update.SslCN) {
      tdSSLClassCN = "updating";
    }
    if (this.state.SSLExpiryDateCN === SSLError) {
      tdSSLClassCN = "errorCell";
      SSLContentCN = SSLError;
    } else if (this.state.SSLExpiryDateCN < 40) {
      tdSSLClassCN = "warningCell";
    } else if (this.state.SSLExpiryDateCN) {
      SSLContentCN = this.state.SSLExpiryDateCN + " days";
    }

    // Redirection
    var tdRedirectionClass = "";
    var RedirectionContent = "";
    var sameRedirectionsWithOrWithoutSGTIN = true;
    if (this.state && this.state.update.redirWithoutSgtinEU) {
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
    // Redirection CN
    var tdRedirectionClassCN = "";
    var RedirectionContentCN = "";
    var sameRedirectionsWithOrWithoutSGTINCN = true;
    if (this.state && this.state.update.redirWithoutSgtinCN) {
      tdRedirectionClassCN = "updating";
    }
    if (
      typeof this.state.redirectsCN !== "undefined" &&
      typeof this.state.redirectsCN.redirectWithoutSGTIN.redirect !== "undefined" &&
      typeof this.state.redirectsCN.redirectWithSGTIN.redirect !== "undefined"
    ) {
      sameRedirectionsWithOrWithoutSGTINCN =
        this.redirectionsWithSGTINisTheSameAsWithoutSGTIN(true);

      if (this.state.redirectsCN.redirectWithoutSGTIN.msg === RedirectionError) {
        tdRedirectionClassCN = "errorCell";
        RedirectionContentCN = RedirectionError;
      } else {
        RedirectionContentCN = this.state.redirectsCN.redirectWithoutSGTIN.msg;
        if (this.state.redirectsCN.redirectWithoutSGTIN.isRolex) {
          RedirectionContentCN += " - " + RolexExperienceMessage;
        }
      }
      if (!sameRedirectionsWithOrWithoutSGTINCN) {
        tdRedirectionClassCN = "warningCell";
        RedirectionContentCN =
          "Without SGTIN: " +
          RedirectionContentCN +
          "<br/>With SGTIN:" +
          this.state.redirectsCN.redirectWithSGTIN.msg;
        if (this.state.redirectsCN.redirectWithSGTIN.isRolex) {
          RedirectionContentCN += " - " + RolexExperienceMessage;
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
              <td
                key="DNSEU"
                className={tdCnameClass}
                dangerouslySetInnerHTML={{ __html: DNSContent }}
              ></td>
            );
          } else if (column === "DNS CN") {
            TDs.push(
              <td
                key="DNSCN"
                className={tdCnameClassCN}
                dangerouslySetInnerHTML={{ __html: DNSContentCN }}
              ></td>
            );
          } else if (column === "SSL EU") {
            TDs.push(
              <td key="SSLEU" className={tdSSLClass}>
                {SSLContent}
              </td>
            );
          } else if (column === "SSL CN") {
            TDs.push(
              <td key="SSLCN" className={tdSSLClassCN}>
                {SSLContentCN}
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
            TDs.push(
              <td
                key="redirectCN"
                className={tdRedirectionClassCN}
                dangerouslySetInnerHTML={{ __html: RedirectionContentCN }}
              ></td>
            );
          }

          countTD++;
        }
      }
    }

    return <tr onClick={() => this.setActiveDomain()}>{TDs}</tr>;
  }
}

export default URL;
