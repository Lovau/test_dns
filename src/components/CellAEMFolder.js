import React from "react";
import Redirect from "services/api/redirect";
import Helper from "helpers/Helper";

const AEMFolderNotFoundMessage = "Not found";

export default class CellAEMFolder extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			update: false,
		};
	}

	componentDidUpdate() {
		if (this.props.update === true && !this.state.update && !this.state.aemFolder) {
			this.setState({
				update: true,
			});
			this.getRedirectionDetails(this.props.url, this.props.isChina);
		}
	}

	async getRedirectionDetails(domain, isChina = false) {
		var aemFolder;
		try {
			var result = await Redirect.getRedirect(this.props.url, isChina);
			aemFolder = AEMFolderNotFoundMessage;
			if (result.AEM && result.AEM.folder) {
				aemFolder = result.AEM.folder;
			}
		} catch (err) {
			aemFolder = AEMFolderNotFoundMessage;
			console.log(domain + ": redir Error" + (isChina ? " from CN" : " from EU"), err);
		} finally {
			this.setState({
				aemFolder: aemFolder,
				update: false,
			});
			var filter = {};
			var filterKey = "AEM Folder " + (this.props.isChina ? "CN" : "EU");
			filter[Helper._removeDomainProtocol(this.props.domain)] = {
				[filterKey]: aemFolder,
			};
			this.props.dynamicFilterCallback(filter);
		}
	}

	render() {
		var tdCnameClass = "";
		if (this.state.update) {
			tdCnameClass = "updating";
		}

		return <td className={tdCnameClass}>{this.state?.aemFolder}</td>;
	}
}
