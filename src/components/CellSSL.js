import React from "react";
import Helper from "helpers/Helper";
import SSL from "services/api/ssl";
const SSLError = "Unable to get SSL";

export default class CellSSL extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			update: false,
			SSLExpiryDate: null,
		};
	}

	componentDidUpdate() {
		// SSL call in EU
		if (this.props.update === true && !this.state.update && !this.state.SSLExpiryDate) {
			this.setState({ update: true });
			this.getSSLDetails(this.props.domain, this.props.isChina);
		}
	}

	async getSSLDetails(domain, isChina = false) {
		try {
			var SSLExpiryDate = await SSL.getSSLExpiryDate(
				Helper._removeDomainProtocol(domain),
				isChina
			);
			this.setState({
				SSLExpiryDate: SSLExpiryDate,
			});
		} catch (err) {
			this.setState({
				SSLExpiryDate: SSLError,
			});
			console.log(domain + ": SSL Error" + (isChina ? " from CN" : " from EU"), err);
		}

		this.setState({
			update: false,
		});
	}

	render() {
		// SSL cell
		var tdSSLClass = "";
		var SSLContent = "";
		if (this.state && this.state.update) {
			tdSSLClass = "updating";
		} else if (this.state.SSLExpiryDate === SSLError) {
			tdSSLClass = "errorCell";
			SSLContent = SSLError;
		} else if (this.state.SSLExpiryDate < 40) {
			tdSSLClass = "warningCell";
		} else if (this.state.SSLExpiryDate) {
			SSLContent = this.state.SSLExpiryDate + " days";
		}

		return <td className={tdSSLClass}>{SSLContent}</td>;
	}
}
