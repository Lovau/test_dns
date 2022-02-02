import React from "react";
import Helper from "helpers/Helper";
import DNS from "services/api/dns";
const cnameErrorMessage = "Doesn't exist";
const serverUnknownMessage = "Unknown server";

export default class CellDNS extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			update: false,
			cname: null,
			otherRecords: null,
		};
	}

	componentDidUpdate() {
		if (
			this.props.update === true &&
			!this.state.update &&
			!this.state.cname &&
			!this.state.otherRecords
		) {
			this.setState({ update: true });
			this.getDNSDetails(this.props.domain);
		}
	}

	async getDNSDetails(domain) {
		var filter = {};
		var filterValue = "";
		try {
			var response = await DNS.dnsExist(
				Helper._removeDomainProtocol(domain),
				this.props.isChina
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

			var server;
			if (this.props.cnameMapping[cname]) {
				server = this.props.cnameMapping[cname];
			} else if (this.props.cnameMapping[cname + "."]) {
				server = this.props.cnameMapping[cname + "."];
			} else {
				server = serverUnknownMessage;
			}

			this.setState({
				server: server,
				cname: cname,
				otherRecords: otherRecords,
			});

			filterValue = cname + " " + server;
		} catch (err) {
			this.setState({
				cname: cnameErrorMessage,
			});
			filterValue = cnameErrorMessage;
			console.log(domain + ": Error", err);
		} finally {
			var filterKey = "DNS " + (this.props.isChina ? "CN" : "EU");
			filter[Helper._removeDomainProtocol(this.props.domain)] = {
				[filterKey]: filterValue,
			};
			this.props.dynamicFilterCallback(filter);
		}

		this.setState({
			update: false,
		});
	}

	render() {
		// DNS cell
		var tdCnameClass = "";
		var DNSContent = this.state.cname;
		if (this.state.update) {
			tdCnameClass = "updating";
		}
		if (this.state.server === serverUnknownMessage) {
			tdCnameClass = "warningCell";
		}
		if (this.state.cname === cnameErrorMessage) {
			tdCnameClass = "errorCell";
		}
		if ("server" in this.state) {
			DNSContent += "<br/>" + this.props.server;
		}

		return <td className={tdCnameClass} dangerouslySetInnerHTML={{ __html: DNSContent }}></td>;
	}
}
