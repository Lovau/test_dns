import React, { Component } from "react";
import DomainDataService from "../services/domain.service";
import Helper from "../../components/Helper";
const isValidDomain = require('is-valid-domain');

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
    this.saveDomain = this.saveDomain.bind(this);
    this.newDomain = this.newDomain.bind(this);
  }

  componentDidMount() {
    this.newDomain();
  }

  onChangeDomain(e) {
    this.setState({
      domain: e.target.value
    });
  }
  onChangeBrand(e) {
    this.setState({
      brand: e.target.value
    });
  }
  onChangeEnvironment(e) {
    this.setState({
      environment: e.target.value
    });
  }
  onChangeLive(e) {
    this.setState({
      live: e.target.value
    });
  }
  onChangeComment(e) {
    this.setState({
      comment: e.target.value
    });
  }

  saveDomain() {
    var id = Helper._randomstring(12);

    var URL = this.state.domain;

    // clean the domain
    URL = URL.toLowerCase();
    URL = URL.trim();
    
    // remove trailing slash
    URL = URL.replace(/\/$/, "");
    
    // check for https
    if (!URL.startsWith("https://")) {
      console.log("["+URL+"] should start with \"https://\".");
      this.setState({
        validationMsg: "["+URL+"] should start with \"https://\"."
      });
      return;
    }

    // check if DNS is correct
    var domain = URL.replace("https://", "");
    if (!isValidDomain(domain)) {
      console.log("["+domain+"] is not a valid domain.");
      this.setState({
        validationMsg: "["+domain+"] is not a valid domain."
      });
      return;
    }

    // Check the brand exists
    if (!this.state.brand) {
      console.log("The brand should not be empty.");
      this.setState({
        validationMsg: "The brand should not be empty."
      });
      return;
    }

    this.setState({
      validationMsg: ""
    });

    var data = {
      uuid: id,
      domain: URL,
      brand: this.state.brand.trim(),
      environment: this.state.environment,
      live: this.state.live,
      comment: this.state.comment.trim(),
    };

    console.log("Adding domain", data);

    DomainDataService.create(data)
      .then(response => {
        data.submitted = true;
        this.setState(data);
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  newDomain() {
    this.setState({
      id: null,
      domain: "",
      brand: "",
      environment: "RC",
      live: "N",
      comment: "",

      validationMsg: "",
      submitted: false
    });
  }


  render() {

    var domain = "";
    var brand = "";
    var comment = "";

    if (this.state) {
      domain = this.state.domain;
      brand = this.state.brand;
      comment = this.state.comment;      
    }

    return (
      <div className="submit-form">
        {this.state && this.state.validationMsg && 
          <div className="alert alert-danger">{this.state.validationMsg}</div>
        }
        {this.state && this.state.hide && 
          <p>{this.props.domain} has been saved.</p>
        }
        {this.state && !(this.state.hide) && this.state.submitted ? (
          <div>
            <h4>You submitted successfully!</h4>
            <button className="btn btn-success" onClick={this.newDomain}>
              Add another
            </button>
          </div>
        ) : (
          <div>
            <div className="form-group">
              <label htmlFor="domain">Domain</label>
              <input
                type="text"
                className="form-control"
                id="domain"
                required
                value={domain}
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
                value={brand}
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
                >
                {Helper.getEnvironmentList().map((option) => (
                  <option value={option}>{option}</option>
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
                >
                  <option value="N">N</option>
                  <option value="Y">Y</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="comment">Comment</label>
              <input
                type="text"
                className="form-control"
                id="comment"
                required
                value={comment}
                onChange={this.onChangeComment}
                name="comment"
              />
            </div>

            <button onClick={this.saveDomain} className="btn btn-success">
              Submit
            </button>
          </div>
        )}

      </div>
    );
  }
}
