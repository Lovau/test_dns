import React, { Component } from "react";
import DomainDataService from "../services/domain.service";
import Helper from "../../components/Helper";
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
    this.onChangeComment = this.onChangeComment.bind(this);
    this.onChangeExpectedRedirectEU =
      this.onChangeExpectedRedirectEU.bind(this);
    this.onChangeExpectedRedirectCN =
      this.onChangeExpectedRedirectCN.bind(this);
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
        comment: "",
        expectedRedirectEU: "",
        expectedRedirectCN: "",
        changesTodo: false,
      },
      validationMsg: "",
      submitted: false,
    };
  }

  componentDidMount() {
    if (this.props.match.params.id) {
      console.log("update page");
      this.setState({
        validationMsg: "",
        submitted: false,
        isNew: false,
      });
      this.loadDomain(this.props.match.params.id);
    } else {
      console.log("creation page");
      this.newDomain();
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
        comment: "",
        expectedRedirectEU: "",
        expectedRedirectCN: "",
        changesTodo: false,
      },

      validationMsg: "",
      submitted: false,
      isNew: true,
    });
  }

  loadDomain(id) {
    DomainDataService.get(id)
      .then((response) => {
        this.setState({
          currentDomain: response.data.Item,
        });
        console.log("Getting item", response.data.Item);
      })
      .catch((e) => {
        console.log(e);
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
      this.setState({
        validationMsg: e.message,
      });
      return null;
    }

    this.setState({
      validationMsg: "",
    });

    var data = {
      uuid: this.state.currentDomain.uuid
        ? this.state.currentDomain.uuid
        : Helper._randomstring(12),
      domain: URL,
      brand: this.state.currentDomain.brand.trim(),
      environment: this.state.currentDomain.environment,
      live: this.state.currentDomain.live,
      comment: this.state.currentDomain.comment
        ? this.state.currentDomain.comment.trim()
        : "",
      expectedRedirectEU: this.state.currentDomain.expectedRedirectEU
        ? this.state.currentDomain.expectedRedirectEU.trim()
        : "",
      expectedRedirectCN: this.state.currentDomain.expectedRedirectCN
        ? this.state.currentDomain.expectedRedirectCN.trim()
        : "",
      changesTodo: this.state.currentDomain.changesTodo,
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
          message: "The domain was updated successfully!",
        });
      })
      .catch((e) => {
        console.log(e);
      });
  }

  deleteDomain() {
    console.log(
      "Deleting domain",
      this.state.currentDomain,
      this.state.currentDomain.uuid
    );
    DomainDataService.delete(this.state.currentDomain.uuid)
      .then((response) => {
        console.log(response.data);
        this.props.history.push("/isadmin");
        // this.setState({
        //   message: "The domain was deleted successfully!"
        // });
      })
      .catch((e) => {
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

    return (
      <div className="submit-form">
        {/* Validation */}
        {this.state && this.state.validationMsg && (
          <div className="alert alert-danger">{this.state.validationMsg}</div>
        )}

        {/* Update: domain not found */}
        {this.state &&
          !this.state.isNew &&
          (!currentDomain || !currentDomain.uuid) && (
            <div className="alert alert-primary">
              <b>The domain has not been found.</b>
            </div>
          )}

        {/* Creation ok */}
        {this.state && this.state.isNew && this.state.submitted && (
          <div>
            <div className="alert alert-success">
              The domain <b>&quot;{currentDomain.domain}&quot;</b> has been
              successfully created!
            </div>
            <button className="btn btn-success" onClick={this.newDomain}>
              Add another
            </button>
          </div>
        )}

        {/* Update ok */}
        {this.state && !this.state.isNew && this.state.submitted && (
          <div>
            <div className="alert alert-success">
              The domain <b>{currentDomain.domain}</b> has been successfully
              updated!
            </div>
          </div>
        )}

        {/* Display the form */}
        {this.state &&
          currentDomain &&
          (!this.state.isNew ||
            (this.state.isNew && !this.state.submitted)) && (
            <div>
              <div className="form-group">
                <label htmlFor="domain">Domain</label>
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
              <div className="form-group">
                <label htmlFor="brand">Brand</label>
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
              <div className="form-group">
                <label htmlFor="environment">Environment</label>
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
              <div className="form-group">
                <label htmlFor="live">Live</label>
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
              <div className="form-group">
                <label htmlFor="comment">Comment</label>
                <textarea
                  name="comment"
                  id="comment"
                  className="form-control"
                  onChange={this.onChangeComment}
                  defaultValue={currentDomain.comment}
                  rows="6"
                ></textarea>
              </div>
              <div className="form-group">
                <label htmlFor="expectedRedirectEU">
                  Expected redirection in EU
                </label>
                <textarea
                  name="expectedRedirectEU"
                  id="expectedRedirectEU"
                  className="form-control"
                  onChange={this.onChangeExpectedRedirectEU}
                  defaultValue={currentDomain.expectedRedirectEU}
                  rows="2"
                ></textarea>
              </div>
              <div className="form-group">
                <label htmlFor="expectedRedirectCN">
                  Expected redirection in CN
                </label>
                <textarea
                  name="expectedRedirectCN"
                  id="expectedRedirectCN"
                  className="form-control"
                  onChange={this.onChangeExpectedRedirectCN}
                  defaultValue={currentDomain.expectedRedirectCN}
                  rows="2"
                ></textarea>
              </div>

              <div className="form-group">
                <label htmlFor="changesTodo">Changes in progress</label>

                <input
                  type="checkbox"
                  checked={currentDomain.changesTodo}
                  name="changesTodo"
                  id="changesTodo"
                  className="form-control"
                  onChange={this.onChangeChangesTodo}
                />
              </div>

              {/* Creation validation button */}
              {this.state && this.state.isNew && !this.state.submitted && (
                <button
                  onClick={this.createNewDomain}
                  className="btn btn-success"
                >
                  Submit
                </button>
              )}

              {/* Update validation button */}
              {this.state && !this.state.isNew && (
                <>
                  <div className="deletebutton">
                    <button
                      className="badge badge-danger mr-2"
                      onClick={this.deleteDomain}
                    >
                      Delete
                    </button>
                  </div>
                  <div className="validatebutton">
                    <button
                      type="submit"
                      className="badge badge-success"
                      onClick={this.updateDomain}
                    >
                      Update
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
      </div>
    );
  }
}
