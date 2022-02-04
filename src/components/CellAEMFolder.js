import React, { useState, useEffect } from "react";
import Redirect from "services/api/redirect";
import Helper from "helpers/Helper";
import { useSelector, useDispatch } from "react-redux";
import { setValue } from "services/reduxServices/DomainDynamicValueService";

const AEMFolderNotFoundMessage = "Not found";

export default function CellAEMFolder(props) {
	const [update, setUpdate] = useState(false);
	const [aemFolder, setAemFolder] = useState(null);

	const reduxUpdates = useSelector((state) => state.DomainUpdate);
	const reduxValues = useSelector((state) => state.DomainDynamicValue);
	const dispatch = useDispatch();

	var dns = Helper._removeDomainProtocol(props.domain);
	if (!aemFolder && reduxValues[dns] && reduxValues[dns][props.column]) {
		setAemFolder(reduxValues[dns][props.column]);
	}

	// componentDidUpdate
	useEffect(() => {
		if (reduxUpdates[props.column] && !update && !aemFolder) {
			setUpdate(true);
			getRedirectionDetails();
		}
	}); // notice, no second argument

	const getRedirectionDetails = async () => {
		var aemFolder;
		try {
			var result = await Redirect.getRedirect(props.url, props.isChina);
			aemFolder = AEMFolderNotFoundMessage;
			if (result.AEM && result.AEM.folder) {
				aemFolder = result.AEM.folder;
			}
		} catch (err) {
			aemFolder = AEMFolderNotFoundMessage;
			console.log(
				props.url + ": redir Error" + (props.isChina ? " from CN" : " from EU"),
				err
			);
		} finally {
			setUpdate(false);

			dispatch(
				setValue({
					column: props.column,
					dns: Helper._removeDomainProtocol(props.domain),
					value: aemFolder,
				})
			);
			setAemFolder(aemFolder);
		}
	};

	var tdCnameClass = "";
	if (update) {
		tdCnameClass = "updating";
	}

	return <td className={tdCnameClass}>{aemFolder}</td>;
}
