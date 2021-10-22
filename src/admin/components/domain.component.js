import React, { Component } from "react";
import DomainDataService from "../services/domain.service";
import Helper from "../../components/Helper";

export default class Domain extends Component {
  constructor(props) {
    super(props);
    this.onChangeDomain = this.onChangeDomain.bind(this);
    this.onChangeBrand = this.onChangeBrand.bind(this);
    this.onChangeEnvironment = this.onChangeEnvironment.bind(this);
    this.onChangeLive = this.onChangeLive.bind(this);
    this.onChangeComment = this.onChangeComment.bind(this);
    this.getDomain = this.getDomain.bind(this);
    this.updateDomain = this.updateDomain.bind(this);
    this.deleteDomain = this.deleteDomain.bind(this);

    this.state = {
      currentDomain: {
        uuid: null,
        domain: "",
        brand: "",
        environment: "",
        live: "N",
        comment: ""
      },
      message: ""
    };
  }

  componentDidMount() {
    this.getDomain(this.props.match.params.id);
  }

  onChangeDomain(e) {
    const domain = e.target.value;

    this.setState(function(prevState) {
      return {
        currentDomain: {
          ...prevState.currentDomain,
          domain: domain
        }
      };
    });
  }

  onChangeBrand(e) {
    const brand = e.target.value;
    
    this.setState(prevState => ({
      currentDomain: {
        ...prevState.currentDomain,
        brand: brand
      }
    }));
  }
  onChangeEnvironment(e) {
    const environment = e.target.value;
    
    this.setState(prevState => ({
      currentDomain: {
        ...prevState.currentDomain,
        environment: environment
      }
    }));
  }
  onChangeLive(e) {
    const live = e.target.value;
    
    this.setState(prevState => ({
      currentDomain: {
        ...prevState.currentDomain,
        live: live
      }
    }));
  }
  onChangeComment(e) {
    const comment = e.target.value;
    
    this.setState(prevState => ({
      currentDomain: {
        ...prevState.currentDomain,
        comment: comment
      }
    }));
  }

  getDomain(id) {
    DomainDataService.get(id)
      .then(response => {
        this.setState({
          currentDomain: response.data.Item
        });
        console.log("Getting item", response.data.Item);
      })
      .catch(e => {
        console.log(e);
      });
  }

  updateDomain() {
    console.log("Updating", this.state.currentDomain, this.state.currentDomain.uuid);
    DomainDataService.update(
      this.state.currentDomain.uuid,
      this.state.currentDomain
    )
      .then(response => {
        console.log(response.data);
        this.setState({
          message: "The domain was updated successfully!"
        });
      })
      .catch(e => {
        console.log(e);
      });
  }

  deleteDomain() {
    console.log("Deleting domain", this.state.currentDomain, this.state.currentDomain.uuid);
    DomainDataService.delete(this.state.currentDomain.uuid)
      .then(response => {
        console.log(response.data);
        this.props.history.push('/admin/domains')
        // this.setState({
        //   message: "The domain was deleted successfully!"
        // });
      })
      .catch(e => {
        console.log(e);
      });
  }

  render() {
    const { currentDomain } = this.state;

    return (
      <div>
        {currentDomain ? (
          <div className="edit-form">
            <h4>Domain</h4>
            <form>
              <div className="form-group">
                <label htmlFor="domain">Domain</label>
                <input
                  type="text"
                  className="form-control"
                  id="domain"
                  value={currentDomain.domain}
                  onChange={this.onChangeDomain}
                />
              </div>
              <div className="form-group">
                <label htmlFor="brand">Brand</label>
                <input
                  type="text"
                  className="form-control"
                  id="brand"
                  value={currentDomain.brand}
                  onChange={this.onChangeBrand}
                />
              </div>
              <div className="form-group">
                <label htmlFor="environment">Environment</label>
                <select 
                  className="custom-select" 
                  id="environment"
                  required
                  onChange={this.onChangeEnvironment}
                  value={currentDomain.environment}
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
                  value={currentDomain.live}
                  >
                  <option value="N">N</option>
                  <option value="Y">Y</option>
                </select>

              </div>
              <div className="form-group">
                <label htmlFor="comment">Comment</label>
                <textarea id="comment" className="form-control" onChange={this.onChangeComment} value={currentDomain.comment}>
                </textarea>
              </div>
            </form>

            <div className="deletebutton" >
              <button
                className="badge badge-danger mr-2"
                onClick={this.deleteDomain}
              >
                Delete
              </button>
            </div>
            <div className="validatebutton" >
              <button
                type="submit"
                className="badge badge-success"
                onClick={this.updateDomain}
              >
                Update
              </button>
            </div>
            {this.state.message ?(
              <div className="alert alert-success msgValidation">
                <p>{this.state.message}</p>
              </div>
            ): ("")}
          </div>
        ) : (
          <div className="alert alert-primary"><b>The domain has not been found.</b></div>
        )}
      </div>
    );
  }
}
