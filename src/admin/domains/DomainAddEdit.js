import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";

import DomainDataService from "services/DomainService";
import { Alert } from "components/Alert";
import { RedirectIfNotLoggedIn } from "admin/RedirectIfNotLoggedIn";
import { alertService } from "services/AlertService";
import Helper from "helpers/Helper";
import configData from "config.json";
const isValidDomain = require("is-valid-domain");

export { DomainAddEdit };

function DomainAddEdit(props) {
  const domain = props?.domain;
  const isAddMode = !domain;

  const [submitted, setSubmitted] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const history = useHistory();

  // form validation rules
  const validationSchema = Yup.object().shape({
    domain: Yup.string().required("Domain is required").trim().lowercase(),
    brand: Yup.string().required("Brand is required").trim(),
    environment: Yup.string().required("Environment is required"),
    live: Yup.string().required("Live is required"),
    liveCN: Yup.string().required("LiveCN is required"),
    comment: Yup.string().trim(),
    expectedRedirectEU: Yup.string().trim(),
    expectedRedirectCN: Yup.string().trim(),
    changesTodo: Yup.boolean(),
  });
  const formOptions = { resolver: yupResolver(validationSchema) };

  // set default form values if in edit mode
  if (!isAddMode) {
    formOptions.defaultValues = props.domain;
  }

  // get functions to build form with useForm() hook
  const { register, handleSubmit, reset, formState } = useForm(formOptions);
  const { errors } = formState;

  function onSubmit(data) {
    return isAddMode ? createNewDomain(data) : updateDomain(data);
  }

  // equivalent of componentDidMount
  useEffect(() => {
    if (isAddMode) {
      setIsNew(true);
    }

    // equivalent of componentDidUnmount
    // return () => {
    //   console.log("component will unmount");
    // };
  }, []); //notice the empty array here

  // equivalent of componentDidUpdate
  useEffect(() => {
    // Creation ok
    if (isNew && submitted) {
      alertService.success(`The domain <b>${domain.domain}</b> has been successfully created!`);
    }

    // Update ok
    if (!isNew && submitted) {
      alertService.success(`The domain <b>${domain.domain}</b> has been successfully updated!`);
    }
  }); // notice, no second argument

  const validateAndCleanDomain = (URL) => {
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
  };

  const validateBrand = (brand) => {
    // Check the brand exists
    if (!brand) {
      throw new Error("The brand should not be empty.");
    }
  };

  const validateAndCleanData = (domain) => {
    var URL = domain.domain;

    try {
      URL = validateAndCleanDomain(URL);
      validateBrand(domain.brand);

      // Check the domain that the domain doesn't already exist in the DB
      //TODO
    } catch (e) {
      console.log(e.message);
      alertService.error(e.message);
      return null;
    }

    var data = {
      uuid: domain.uuid ? domain.uuid : Helper._randomstring(12),
      domain: URL,
      brand: domain.brand.trim(),
      environment: domain.environment,
      live: domain.live ? domain.live : "N",
      liveCN: domain.liveCN ? domain.liveCN : "N",
      comment: domain.comment ? domain.comment.trim() : "",
      expectedRedirectEU: domain.expectedRedirectEU ? domain.expectedRedirectEU.trim() : "",
      expectedRedirectCN: domain.expectedRedirectCN ? domain.expectedRedirectCN.trim() : "",
      changesTodo: domain.changesTodo ? domain.changesTodo : false,
    };

    return data;
  };

  const createNewDomain = (newDomain) => {
    var data = validateAndCleanData(newDomain);
    if (!data) {
      console.log("No data - not creating anything");
      return;
    }
    console.log("Creating ...", data);

    DomainDataService.create(data)
      .then((response) => {
        console.log("Creation response", response);
        alertService.success("Domain added", { keepAfterRouteChange: true });
        history.push("/");
      })
      .catch(alertService.error);
  };

  const updateDomain = (updatedDomain) => {
    var data = validateAndCleanData(updatedDomain);
    if (!data) {
      console.log("No data - not creating anything");
      return;
    }

    console.log("Updating", data);
    DomainDataService.update(data.uuid, data)
      .then((response) => {
        console.log(response);
        setSubmitted(true);
      })
      .catch(alertService.error);
  };

  const deleteDomain = () => {
    console.log("Deleting domain", domain, domain.uuid);
    DomainDataService.delete(domain.uuid)
      .then((response) => {
        console.log(response);
        history.push("/");
        alertService.success("The domain was deleted successfully!");
      })
      .catch(alertService.error);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="userform pt-3">
      <RedirectIfNotLoggedIn />
      <Alert />

      <div className="row addEdit">
        <div className="offset-md-2 col-3 mt-2 label">
          <label htmlFor="domain">Domain</label>
        </div>
        <div className="col-4 mt-2">
          <input
            type="text"
            name="domain"
            {...register("domain")}
            className={`form-control ${errors.domain ? "is-invalid" : ""}`}
          />
        </div>
        <div className="offset-5 invalid-feedback">{errors.domain?.message}</div>

        <div className="offset-md-2 col-3 mt-2 label">
          <label htmlFor="brand">Brand</label>
        </div>
        <div className="col-4 mt-2">
          <input
            type="text"
            name="brand"
            {...register("brand")}
            className={`form-control ${errors.brand ? "is-invalid" : ""}`}
          />
        </div>
        <div className="offset-5 invalid-feedback">{errors.brand?.message}</div>

        <div className="offset-md-2 col-3 mt-2 label">
          <label htmlFor="environment">Environment</label>
        </div>
        <div className="col-4 mt-2">
          <select
            name="environment"
            {...register("environment")}
            className={`custom-select ${errors.environment ? "is-invalid" : ""}`}
          >
            {configData.environments.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div className="offset-5 invalid-feedback">{errors.environment?.message}</div>

        <div className="offset-md-2 col-3 mt-2 label">
          <label htmlFor="live">Live EU</label>
        </div>
        <div className="col-4 mt-2">
          <select
            name="live"
            {...register("live")}
            className={`custom-select ${errors.live ? "is-invalid" : ""}`}
          >
            <option value="N">N</option>
            <option value="Y">Y</option>
          </select>
        </div>
        <div className="offset-5 invalid-feedback">{errors.live?.message}</div>

        <div className="offset-md-2 col-3 mt-2 label">
          <label htmlFor="liveCN">Live CN</label>
        </div>
        <div className="col-4 mt-2">
          <select
            name="liveCN"
            {...register("liveCN")}
            className={`custom-select ${errors.liveCN ? "is-invalid" : ""}`}
          >
            <option value="N">N</option>
            <option value="Y">Y</option>
          </select>
        </div>
        <div className="offset-5 invalid-feedback">{errors.liveCN?.message}</div>

        <div className="offset-md-2 col-3 mt-2 label">
          <label htmlFor="comment">Comment</label>
        </div>
        <div className="col-4 mt-2">
          <textarea
            rows="6"
            name="comment"
            {...register("comment")}
            className={`form-control ${errors.comment ? "is-invalid" : ""}`}
          />
        </div>
        <div className="offset-5 invalid-feedback">{errors.comment?.message}</div>

        <div className="offset-md-2 col-3 mt-2 label">
          <label htmlFor="expectedRedirectEU">Expected redirection in EU</label>
        </div>
        <div className="col-4 mt-2">
          <textarea
            rows="2"
            name="expectedRedirectEU"
            {...register("expectedRedirectEU")}
            className={`form-control ${errors.expectedRedirectEU ? "is-invalid" : ""}`}
          />
        </div>
        <div className="offset-5 invalid-feedback">{errors.expectedRedirectEU?.message}</div>

        <div className="offset-md-2 col-3 mt-2 label">
          <label htmlFor="expectedRedirectCN">Expected redirection in CN</label>
        </div>
        <div className="col-4 mt-2">
          <textarea
            rows="2"
            name="expectedRedirectCN"
            {...register("expectedRedirectCN")}
            className={`form-control ${errors.expectedRedirectCN ? "is-invalid" : ""}`}
          />
        </div>
        <div className="offset-5 invalid-feedback">{errors.expectedRedirectCN?.message}</div>

        <div className="offset-md-2 col-3 mt-2 label">
          <label htmlFor="changesTodo">Changes in progress</label>
        </div>
        <div className="col-4 mt-2">
          <input
            type="checkbox"
            name="changesTodo"
            {...register("changesTodo")}
            className={`form-control ${errors.changesTodo ? "is-invalid" : ""}`}
          />
        </div>
        <div className="offset-5 invalid-feedback">{errors.expectedRedirectCN?.message}</div>
      </div>

      <div className="form-row mb-3">
        <div className="col-4 offset-6 mt-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              deleteDomain();
            }}
            type="button"
            disabled={formState.isSubmitting}
            className="btn btn-danger"
          >
            Delete
          </button>
          <Link to="/admin" className="btn btn-link">
            Cancel
          </Link>
          <button
            onClick={() => reset(formOptions.defaultValues)}
            type="button"
            disabled={formState.isSubmitting}
            className="btn btn-secondary mr-2"
          >
            Reset
          </button>
          <button type="submit" disabled={formState.isSubmitting} className="btn btn-primary mr-2">
            {formState.isSubmitting && <span className="spinner-border spinner-border-sm"></span>}
            Save
          </button>
        </div>
      </div>
    </form>
  );
}
