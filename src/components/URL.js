import React, { useState } from "react";
import { Link } from "react-router-dom";

import DomainDataService from "services/DomainService";
import Helper from "helpers/Helper";
import { alertService } from "services/AlertService";
import CellDNS from "components/CellDNS";
import CellSSL from "components/CellSSL";
import CellRedirect from "components/CellRedirect";
import CellAEMFolder from "components/CellAEMFolder";

// curl --location --request https://tj4k759l15.execute-api.eu-west-1.amazonaws.com/test/dnslookup?DNS=qrt.aptaclub.de --header 'x-api-key: 44XlITH2DCdahKjpe4401eT5070UwdK9xBFCJMR6'
// curl --location --request https://fd902g59y1.execute-api.eu-west-1.amazonaws.com/prod/dnslookup?DNS=qrt.aptaclub.de --header 'x-api-key: ARISr1o5Cp5ElA4GyfbWeR4hgrZeINBaeLTuJZ04'

// const API_DNS = "https://tj4k759l15.execute-api.eu-west-1.amazonaws.com/test/dnslookup?DNS="; // sandbox
// const API_SSL = "https://tj4k759l15.execute-api.eu-west-1.amazonaws.com/test/getsslexpirydate?DNS="; // sandbox
// const API_REDIRECT = "https://tj4k759l15.execute-api.eu-west-1.amazonaws.com/test/getredirect?URL="; // sandbox
// const API_KEY = "44XlITH2DCdahKjpe4401eT5070UwdK9xBFCJMR6"; //sandbox

export default function URL(props) {
  const [url, setUrl] = useState(props.domain + "/" + Helper.getRandomSGTIN());
  const [comment, setComment] = useState("");
  const [isSelected, setIsSelected] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [changesTodo, setChangesTodo] = useState(false);
  // var sgtin = Helper.getRandomSGTIN();
  // state = {
  //   sgtin: sgtin,
  //   url: props.domain + "/" + sgtin,
  // };

  const toggleEditMode = () => {
    setEditMode(props.isadmin);
  };

  const onChangeComment = (e) => {
    setComment(e.target.value);
  };

  const onChangeChangesTodo = () => {
    var val = props.changesTodo;
    if (changesTodo) {
      val = changesTodo;
    }
    setChangesTodo(val === "Y" ? "N" : "Y");
  };

  const cancelEditMode = () => {
    setEditMode(false);
    setComment(null);
  };

  const validateComment = () => {
    setEditMode(false);
    if (!comment) {
      return;
    }

    var domain = Object.assign({}, props);
    domain.comment = comment;

    updateDomain(domain);
  };

  const validateChangesTodo = () => {
    setEditMode(false);
    if (!changesTodo) {
      return;
    }

    var domain = Object.assign({}, props);
    domain.changesTodo = changesTodo === "Y" ? true : false;

    updateDomain(domain);
  };

  const updateDomain = (domain) => {
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
  };

  const setActiveDomain = () => {
    setIsSelected(!isSelected);
  };

  if (!props.display) {
    return null;
  }

  //TODO : display a message when a domain is successfully updated or if the update has an error
  var TDs = [];
  var countTD = 0;
  var value;
  var editLink = "";

  if (props && "columnsFilters" in props) {
    for (var column in props.columnsFilters) {
      if (props.columnsFilters[column].isVisible) {
        value = "";
        editLink = "";
        if (column in props) {
          value = props[column];
        }
        if (column === "domain") {
          value +=
            "<a href='" +
            props[column] +
            "/0123456789129000OCVALID?stubapi' target='_blank' class='URLLink'></a>";
        }
        if (column === "liveCN" && !props.liveCN) {
          value = "N";
        }
        if (column === "comment" && comment) {
          value = comment;
        }
        if (column === "changesTodo" && changesTodo) {
          value = changesTodo;
        }
        if (column === "changesTodo" && editMode) {
          value = value === "Y" ? true : false;
        }
        if (column === "comment" && !editMode) {
          value = value.replace(/(?:\r\n|\r|\n)/g, "<br>");
        }

        // if it is the 1st cell, we display here the edit button
        if (props.isadmin && countTD === 0 && isSelected) {
          editLink = (
            <>
              <Link
                to={"/admin/update/" + props.uuid}
                className="edit badge badge-warning"
                target="_blank"
              >
                Edit
              </Link>
            </>
          );
        }
        countTD++;
        if (column === "comment" && editMode) {
          TDs.push(
            <td key={column}>
              <textarea
                name="comment"
                id="comment"
                className="form-control"
                onChange={onChangeComment}
                defaultValue={value}
                rows="3"
              ></textarea>
              <button onClick={cancelEditMode} className="badge badge-warning comment">
                Cancel
              </button>
              <button onClick={validateComment} className="badge badge-success comment">
                Submit
              </button>
            </td>
          );
        } else if (column === "changesTodo" && editMode) {
          TDs.push(
            <td key={column}>
              <span className="changesTodoForm mt-1">
                <input
                  type="checkbox"
                  name="changesTodo"
                  id="changesTodo"
                  className="form-control"
                  onChange={onChangeChangesTodo}
                  checked={value}
                />
                <button onClick={cancelEditMode} className="badge badge-warning comment">
                  Cancel
                </button>
                <button onClick={validateChangesTodo} className="badge badge-success comment">
                  Submit
                </button>
              </span>
            </td>
          );
        } else if (column === "comment" || column === "changesTodo") {
          TDs.push(
            <td
              key={column}
              onClick={toggleEditMode}
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

  if (props && "dynamicColumnsFilters" in props) {
    for (column in props.dynamicColumnsFilters) {
      if (props.dynamicColumnsFilters[column].isVisible) {
        if (column === "DNS EU" || column === "DNS CN") {
          TDs.push(
            <CellDNS
              key={column}
              column={column}
              domain={props.domain}
              isChina={column === "DNS CN"}
              cnameMapping={props.cnameMapping}
            />
          );
        } else if (column === "SSL EU" || column === "SSL CN") {
          TDs.push(
            <CellSSL
              key={column}
              column={column}
              domain={props.domain}
              isChina={column === "SSL CN"}
            />
          );
        } else if (column === "Redirection EU" || column === "Redirection CN") {
          TDs.push(
            <CellRedirect
              key={column}
              column={column}
              url={url}
              domain={props.domain}
              isChina={column === "Redirection CN"}
            />
          );
        } else if (column === "AEM Folder EU" || column === "AEM Folder CN") {
          TDs.push(
            <CellAEMFolder
              key={column}
              column={column}
              domain={props.domain}
              url={url}
              isChina={column === "AEM Folder CN"}
            />
          );
        }

        countTD++;
      }
    }
  }

  return (
    <tr onClick={() => setActiveDomain()} className={props.display ? "" : "hide"}>
      {TDs}
    </tr>
  );
}
