import React, { Component } from "react";
import DomainDataService from "admin/services/domain.service";
import Helper from "helpers/Helper";
import { Alert } from "components/Alert";
import { RedirectIfNotLoggedIn } from "admin/RedirectIfNotLoggedIn";
import { alertService } from "services/AlertService";
const isValidDomain = require("is-valid-domain");

//TODO : make comment a textarea
// Merge the update & add
// change the design a bit

export default class AddDomain extends Component {
  constructor(props) {
    super(props);
    this.onChangeDomain = this.onChangeDomain.bind(this);
    this.onChangeBrand = this.onChangeBrand.bind(this);
    this.onChangeEnvironment = this.onChangeEnvironment.bind(this);
    this.onChangeLive = this.onChangeLive.bind(this);
    this.onChangeLiveCN = this.onChangeLiveCN.bind(this);
    this.onChangeComment = this.onChangeComment.bind(this);
    this.onChangeExpectedRedirectEU = this.onChangeExpectedRedirectEU.bind(this);
    this.onChangeExpectedRedirectCN = this.onChangeExpectedRedirectCN.bind(this);
    this.onChangeChangesTodo = this.onChangeChangesTodo.bind(this);
    this.createNewDomain = this.createNewDomain.bind(this);
    this.updateDomain = this.updateDomain.bind(this);
    this.deleteDomain = this.deleteDomain.bind(this);
    this.newDomain = this.newDomain.bind(this);

    this.state = {
      currentDomain: {
        uuid: null,
        domain: "",
        brand: "",
        environment: "RC",
        live: "N",
        liveCN: "N",
        comment: "",
        expectedRedirectEU: "",
        expectedRedirectCN: "",
        changesTodo: false,
      },
      submitted: false,
    };
  }

  componentDidMount() {
    if (this.props.match.params.id) {
      console.log("update page");
      this.setState({
        submitted: false,
        isNew: false,
      });
      this.loadDomain(this.props.match.params.id);
    } else {
      console.log("creation page");
      this.newDomain();
    }
  }

  componentDidUpdate() {
    // Update: domain not found
    if (
      this.state &&
      !this.state.loading &&
      !this.state.isNew &&
      (!this.state.currentDomain || !this.state.currentDomain.uuid)
    ) {
      alertService.warn("<b>The domain has not been found.</b>");
    }

    // Creation ok
    if (this.state && this.state.isNew && this.state.submitted) {
      alertService.success(
        `The domain <b>${this.state.currentDomain.domain}</b> has been successfully created!`
      );
    }

    // Update ok
    if (this.state && !this.state.isNew && this.state.submitted) {
      alertService.success(
        `The domain <b>${this.state.currentDomain.domain}</b> has been successfully updated!`
      );
    }
  }

  newDomain() {
    this.setState({
      currentDomain: {
        uuid: null,
        domain: "",
        brand: "",
        environment: "RC",
        live: "N",
        liveCN: "N",
        comment: "",
        expectedRedirectEU: "",
        expectedRedirectCN: "",
        changesTodo: false,
      },

      submitted: false,
      isNew: true,
    });
  }

  loadDomain(id) {
    this.setState({
      loading: true,
    });
    DomainDataService.get(id)
      .then((response) => {
        this.setState({
          currentDomain: response.data.Item,
        });
        console.log("Getting item", response.data.Item);
        this.setState({
          loading: false,
        });
      })
      .catch((e) => {
        console.log(e);
        this.setState({
          loading: false,
        });
      });
  }

  validateAndCleanDomain(URL) {
    // Check the domain is not empty
    if (!URL) {
      throw new Error("The domain should not be empty.");
    }

    // clean the domain
    URL = URL.toLowerCase();
    URL = URL.trim();

    // remove trailing slash
    URL = URL.replace(/\/$/, "");

    // check for https
    if (!URL.startsWith("https://")) {
      throw new Error("[" + URL + '] should start with "https://".');
    }

    // check if DNS is correct
    var domain = URL.replace("https://", "");
    if (!isValidDomain(domain)) {
      throw new Error("[" + domain + "] is not a valid domain name.");
    }

    return URL;
  }

  validateBrand(brand) {
    // Check the brand exists
    if (!brand) {
      throw new Error("The brand should not be empty.");
    }
  }

  validateAndCleanData() {
    var URL = this.state.currentDomain.domain;

    try {
      URL = this.validateAndCleanDomain(URL);
      this.validateBrand(this.state.currentDomain.brand);

      // Check the domain that the domain doesn't already exist in the DB
      //TODO
    } catch (e) {
      console.log(e.message);
      alertService.error(e.message);
      return null;
    }

    var data = {
      uuid: this.state.currentDomain.uuid
        ? this.state.currentDomain.uuid
        : Helper._randomstring(12),
      domain: URL,
      brand: this.state.currentDomain.brand.trim(),
      environment: this.state.currentDomain.environment,
      live: this.state.currentDomain.live ? this.state.currentDomain.live : "N",
      liveCN: this.state.currentDomain.liveCN ? this.state.currentDomain.liveCN : "N",
      comment: this.state.currentDomain.comment ? this.state.currentDomain.comment.trim() : "",
      expectedRedirectEU: this.state.currentDomain.expectedRedirectEU
        ? this.state.currentDomain.expectedRedirectEU.trim()
        : "",
      expectedRedirectCN: this.state.currentDomain.expectedRedirectCN
        ? this.state.currentDomain.expectedRedirectCN.trim()
        : "",
      changesTodo: this.state.currentDomain.changesTodo ? true : false,
    };

    return data;
  }

  createNewDomain() {
    var data = this.validateAndCleanData();
    if (!data) {
      console.log("No data - not creating anything");
      return;
    }
    console.log("Creating ...", data);

    DomainDataService.create(data)
      .then((response) => {
        this.setState({
          currentDomain: data,
          submitted: true,
        });
        console.log(response.data);
      })
      .catch((e) => {
        alertService.error(e.toString());
        console.log(e);
      });
  }

  updateDomain() {
    var data = this.validateAndCleanData();
    if (!data) {
      console.log("No data - not creating anything");
      return;
    }

    console.log("Updating", data, data.uuid);
    DomainDataService.update(data.uuid, data)
      .then((response) => {
        console.log(response.data);
        this.setState({
          submitted: true,
        });
      })
      .catch((e) => {
        alertService.error(e.toString());
        console.log(e);
      });
  }

  deleteDomain() {
    console.log("Deleting domain", this.state.currentDomain, this.state.currentDomain.uuid);
    DomainDataService.delete(this.state.currentDomain.uuid)
      .then((response) => {
        console.log(response.data);
        this.props.history.push("/admin");
        alertService.success("The domain was deleted successfully!");
      })
      .catch((e) => {
        alertService.error(e.toString());
        console.log(e);
      });
  }

  onChangeDomain(e) {
    var currentDomain = this.state.currentDomain;
    currentDomain.domain = e.target.value;
    this.setState({
      currentDomain: currentDomain,
    });
  }

  onChangeBrand(e) {
    var currentDomain = this.state.currentDomain;
    currentDomain.brand = e.target.value;
    this.setState({
      currentDomain: currentDomain,
    });
  }

  onChangeEnvironment(e) {
    var currentDomain = this.state.currentDomain;
    currentDomain.environment = e.target.value;
    this.setState({
      currentDomain: currentDomain,
    });
  }

  onChangeLive(e) {
    var currentDomain = this.state.currentDomain;
    currentDomain.live = e.target.value;
    this.setState({
      currentDomain: currentDomain,
    });
  }

  onChangeLiveCN(e) {
    var currentDomain = this.state.currentDomain;
    currentDomain.liveCN = e.target.value;
    this.setState({
      currentDomain: currentDomain,
    });
  }

  onChangeComment(e) {
    var currentDomain = this.state.currentDomain;
    currentDomain.comment = e.target.value;
    this.setState({
      currentDomain: currentDomain,
    });
  }

  onChangeExpectedRedirectEU(e) {
    var currentDomain = this.state.currentDomain;
    currentDomain.expectedRedirectEU = e.target.value;
    this.setState({
      currentDomain: currentDomain,
    });
  }

  onChangeExpectedRedirectCN(e) {
    var currentDomain = this.state.currentDomain;
    currentDomain.expectedRedirectCN = e.target.value;
    this.setState({
      currentDomain: currentDomain,
    });
  }

  onChangeChangesTodo() {
    var currentDomain = this.state.currentDomain;
    if (this.state.changesTodo === "on") {
      currentDomain.changesTodo = true;
    }

    currentDomain.changesTodo = !currentDomain.changesTodo;
    this.setState({
      currentDomain: currentDomain,
    });
  }

  render() {
    const { currentDomain } = this.state;

    if (currentDomain.changesTodo === "on") {
      currentDomain.changesTodo = true;
    }

    if (!this.state || !currentDomain || this.state.submitted) {
      return (
        <>
          <Alert />
        </>
      );
    }

    /*
    {this.state &&
      currentDomain &&
      (!this.state.isNew || (this.state.isNew && !this.state.submitted)) && (
     */

    return (
      <>
        <RedirectIfNotLoggedIn />
        <Alert />

        <div className="row addEdit">
          <div className="offset-md-2 col-3 mt-2 label">
            <label htmlFor="domain">Domain</label>
          </div>
          <div className="col-4 mt-2">
            <input
              type="text"
              className="form-control"
              id="domain"
              required
              defaultValue={currentDomain.domain}
              onChange={this.onChangeDomain}
              name="domain"
            />
          </div>
          <div className="offset-md-2 col-3 mt-2 label">
            <label htmlFor="brand">Brand</label>
          </div>
          <div className="col-4 mt-2">
            <input
              type="text"
              className="form-control"
              id="brand"
              required
              defaultValue={currentDomain.brand}
              onChange={this.onChangeBrand}
              name="brand"
            />
          </div>
          <div className="offset-md-2 col-3 mt-2 label">
            <label htmlFor="environment">Environment</label>
          </div>
          <div className="col-4 mt-2">
            <select
              className="custom-select"
              id="environment"
              required
              onChange={this.onChangeEnvironment}
              name="environment"
              value={currentDomain.environment}
            >
              {Helper.getEnvironmentList().map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="offset-md-2 col-3 mt-2 label">
            <label htmlFor="live">Live EU</label>
          </div>
          <div className="col-4 mt-2">
            <select
              className="custom-select"
              id="live"
              required
              onChange={this.onChangeLive}
              name="live"
              value={currentDomain.live}
            >
              <option value="N">N</option>
              <option value="Y">Y</option>
            </select>
          </div>
          <div className="offset-md-2 col-3 mt-2 label">
            <label htmlFor="liveCN">Live CN</label>
          </div>
          <div className="col-4 mt-2">
            <select
              className="custom-select"
              id="liveCN"
              required
              onChange={this.onChangeLiveCN}
              name="liveCN"
              value={currentDomain.liveCN}
            >
              <option value="N">N</option>
              <option value="Y">Y</option>
            </select>
          </div>
          <div className="offset-md-2 col-3 mt-2 label">
            <label htmlFor="comment">Comment</label>
          </div>
          <div className="col-4 mt-2">
            <textarea
              name="comment"
              id="comment"
              className="form-control"
              onChange={this.onChangeComment}
              defaultValue={currentDomain.comment}
              rows="6"
            ></textarea>
          </div>
          <div className="offset-md-2 col-3 mt-2 label">
            <label htmlFor="expectedRedirectEU">Expected redirection in EU</label>
          </div>
          <div className="col-4 mt-2">
            <textarea
              name="expectedRedirectEU"
              id="expectedRedirectEU"
              className="form-control"
              onChange={this.onChangeExpectedRedirectEU}
              defaultValue={currentDomain.expectedRedirectEU}
              rows="2"
            ></textarea>
          </div>
          <div className="offset-md-2 col-3 mt-2 label">
            <label htmlFor="expectedRedirectCN">Expected redirection in CN</label>
          </div>
          <div className="col-4 mt-2">
            <textarea
              name="expectedRedirectCN"
              id="expectedRedirectCN"
              className="form-control"
              onChange={this.onChangeExpectedRedirectCN}
              defaultValue={currentDomain.expectedRedirectCN}
              rows="2"
            ></textarea>
          </div>

          <div className="offset-md-2 col-3 mt-2 label">
            <label htmlFor="changesTodo">Changes in progress</label>
          </div>
          <div className="col-4 mt-2">
            <input
              type="checkbox"
              checked={currentDomain.changesTodo}
              name="changesTodo"
              id="changesTodo"
              className="form-control"
              onChange={this.onChangeChangesTodo}
            />
          </div>
        </div>

        {/* Creation validation button */}
        {this.state && this.state.isNew && !this.state.submitted && (
          <div className="row">
            <div className="offset-md-8 col-4">
              <button onClick={this.createNewDomain} className="btn btn-success">
                Submit
              </button>
            </div>
          </div>
        )}

        {/* Update validation button */}
        {this.state && !this.state.isNew && (
          <div className="row">
            <div className="offset-md-5 col-4">
              <div className="deletebutton">
                <button className="badge badge-danger mr-2" onClick={this.deleteDomain}>
                  Delete
                </button>
              </div>
              <div className="validatebutton">
                <button type="submit" className="badge badge-success" onClick={this.updateDomain}>
                  Update
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }
}
