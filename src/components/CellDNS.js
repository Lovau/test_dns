import React, { useState, useEffect } from "react";
import Helper from "helpers/Helper";
import DNS from "services/api/dns";
import { useSelector, useDispatch } from "react-redux";
import { setValue } from "services/reduxServices/DomainDynamicValueService";

const cnameErrorMessage = "Doesn't exist";
const serverUnknownMessage = "Unknown server";

export default function CellDNS(props) {
	const [cname, setCname] = useState(null);
	const [server, setServer] = useState(null);
	const [otherRecords, setOtherRecords] = useState(null);
	const [displayedMsg, setDisplayedMsg] = useState(null);
	const [update, setUpdate] = useState(false);

	const reduxUpdates = useSelector((state) => state.DomainUpdate);
	const reduxValues = useSelector((state) => state.DomainDynamicValue);
	const dispatch = useDispatch();

	var dns = Helper._removeDomainProtocol(props.domain);
	if (!displayedMsg && reduxValues[dns] && reduxValues[dns][props.column]) {
		setDisplayedMsg(reduxValues[dns][props.column]);
	}

	// componentDidUpdate
	useEffect(() => {
		if (reduxUpdates[props.column] && !update && !cname && !otherRecords) {
			setUpdate(true);
			getDNSDetails();
		}
	}); // notice, no second argument

	const getDNSDetails = async () => {
		var msg = "";
		try {
			var response = await DNS.dnsExist(
				Helper._removeDomainProtocol(props.domain),
				props.isChina
			);
			console.log("DNS response", response);
			var cname, otherRecords;
			if ("CNAME" in response && response.CNAME[0]) {
				cname = response.CNAME[0];
			} else if ("otherrecords" in response) {
				otherRecords = response.otherrecords;
			} else {
				throw Error("Record not found");
			}

			var serverName;
			if (props.cnameMapping[cname]) {
				serverName = props.cnameMapping[cname];
			} else if (props.cnameMapping[cname + "."]) {
				serverName = props.cnameMapping[cname + "."];
			} else {
				serverName = serverUnknownMessage;
			}

			setServer(serverName);
			setCname(cname);
			setOtherRecords(otherRecords);

			if (cname) {
				msg = cname + "<br />" + serverName;
			} else {
				msg = otherRecords;
			}
		} catch (err) {
			setCname(cnameErrorMessage);
			msg = cnameErrorMessage;
			console.log(props.domain + ": Error", err);
		} finally {
			setDisplayedMsg(msg);
			setUpdate(false);

			dispatch(
				setValue({
					column: props.column,
					dns: Helper._removeDomainProtocol(props.domain),
					value: msg,
				})
			);
		}
	};

	// DNS cell
	var tdCnameClass = "";
	if (update) {
		tdCnameClass = "updating";
	}
	if (server === serverUnknownMessage) {
		tdCnameClass = "warningCell";
	}
	if (cname === cnameErrorMessage) {
		tdCnameClass = "errorCell";
	}

	return <td className={tdCnameClass} dangerouslySetInnerHTML={{ __html: displayedMsg }}></td>;
}
