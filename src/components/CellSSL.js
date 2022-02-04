import React, { useState, useEffect } from "react";
import Helper from "helpers/Helper";
import SSL from "services/api/ssl";
import { useSelector, useDispatch } from "react-redux";
import { setValue } from "services/reduxServices/DomainDynamicValueService";

const SSLError = "Unable to get SSL";

export default function CellSSL(props) {
	const [SSLExpiryDate, setSSLExpiryDate] = useState(null);
	const [update, setUpdate] = useState(false);

	const reduxUpdates = useSelector((state) => state.DomainUpdate);
	const reduxValues = useSelector((state) => state.DomainDynamicValue);
	const dispatch = useDispatch();

	var dns = Helper._removeDomainProtocol(props.domain);
	if (!SSLExpiryDate && reduxValues[dns] && reduxValues[dns][props.column]) {
		setSSLExpiryDate(reduxValues[dns][props.column]);
	}

	// componentDidUpdate
	useEffect(() => {
		if (reduxUpdates[props.column] && !update && !SSLExpiryDate) {
			setUpdate(true);
			getSSLDetails();
		}
	}); // notice, no second argument

	const getSSLDetails = async () => {
		var SSLValue;
		try {
			var SSLExpiryDate = await SSL.getSSLExpiryDate(
				Helper._removeDomainProtocol(props.domain),
				props.isChina
			);
			SSLValue = SSLExpiryDate;
		} catch (err) {
			SSLValue = SSLError;
			console.log(
				props.domain + ": SSL Error" + (props.isChina ? " from CN" : " from EU"),
				err
			);
		} finally {
			setSSLExpiryDate(SSLValue);
			setUpdate(false);

			dispatch(
				setValue({
					column: props.column,
					dns: Helper._removeDomainProtocol(props.domain),
					value: SSLValue,
				})
			);
		}
	};

	var tdSSLClass = "";
	var SSLContent = "";
	if (update) {
		tdSSLClass = "updating";
	} else if (SSLExpiryDate === SSLError) {
		tdSSLClass = "errorCell";
		SSLContent = SSLError;
	} else if (SSLExpiryDate < 40) {
		tdSSLClass = "warningCell";
	} else if (SSLExpiryDate) {
		SSLContent = SSLExpiryDate + " days";
	}

	return <td className={tdSSLClass}>{SSLContent}</td>;
}
