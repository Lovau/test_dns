import React from "react";
import Redirect from "services/api/redirect";

const RedirectionError = "Unable to get the redirection";
const NoRedirectionMessage = "No redirection";
const RolexExperienceMessage = "<span class='rolex-experience' >Rolex experience</span>";

export default class CellRedirect extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			update: false,
		};
	}

	componentDidUpdate() {
		if (
			this.props.update === true &&
			!this.state.update &&
			!this.state.redirWithoutSgtin &&
			(typeof this.state.redirects === "undefined" ||
				typeof this.state.redirects.redirectWithSGTIN === "undefined" ||
				typeof this.state.redirects.redirectWithoutSGTIN === "undefined")
		) {
			this.setState({
				update: {
					redirWithSgtin: true,
					redirWithoutSgtin: true,
				},
			});
			this.getRedirectionDetails(this.props.domain, this.isChina);
		}
	}

	async getRedirectionDetails(domain, isChina = false) {
		try {
			var redirects = {};
			redirects.redirectWithSGTIN = {};
			redirects.redirectWithSGTIN = await Redirect.getRedirect(this.props.url, isChina);
			redirects.redirectWithSGTIN.msg = redirects.redirectWithSGTIN.redirect;
			if (redirects.redirectWithSGTIN.redirect === this.props.url) {
				redirects.redirectWithSGTIN.msg = NoRedirectionMessage;
			}
		} catch (err) {
			redirects.redirectWithSGTIN.msg = RedirectionError;
			console.log(domain + ": redir Error" + (isChina ? " from CN" : " from EU"), err);
		}

		var update = this.state.update;
		update.redirWithSgtin = false;

		try {
			redirects.redirectWithoutSGTIN = {};
			redirects.redirectWithoutSGTIN = await Redirect.getRedirect(domain, isChina);
			redirects.redirectWithoutSGTIN.msg = redirects.redirectWithoutSGTIN.redirect;
			if (
				redirects.redirectWithoutSGTIN.redirect === domain ||
				redirects.redirectWithoutSGTIN.redirect === domain + "/" ||
				redirects.redirectWithoutSGTIN.redirect + "/" === domain
			) {
				redirects.redirectWithoutSGTIN.msg = NoRedirectionMessage;
			}
		} catch (err) {
			redirects.redirectWithoutSGTIN.msg = RedirectionError;
			console.log(domain + ": redir Error" + (isChina ? " from CN" : " from EU"), err);
		}

		update.redirWithoutSgtin = false;
		this.setState({
			redirects: redirects,
			update: update,
		});
	}

	redirectionsWithSGTINisTheSameAsWithoutSGTIN(isChina = false) {
		var redirectKey = isChina ? "redirectsCN" : "redirects";
		if (
			!this.state[redirectKey].redirectWithoutSGTIN.redirect ||
			this.state[redirectKey].redirectWithoutSGTIN.redirect.length < 1 ||
			!this.state[redirectKey].redirectWithSGTIN.redirect ||
			this.state[redirectKey].redirectWithSGTIN.redirect.length < 1
		) {
			return true;
		}

		if (
			this.state[redirectKey].redirectWithoutSGTIN.redirect ===
				this.state[redirectKey].redirectWithSGTIN.redirect ||
			this.state[redirectKey].redirectWithSGTIN.redirect.includes(
				this.state[redirectKey].redirectWithoutSGTIN.redirect
			)
		) {
			return true;
		}
		return false;
	}

	render() {
		// Redirection
		var tdRedirectionClass = "";
		var RedirectionContent = "";
		var sameRedirectionsWithOrWithoutSGTIN = true;
		if (this.state && this.state.update.redirWithoutSgtin) {
			tdRedirectionClass = "updating";
		}
		if (typeof this.state.redirects !== "undefined") {
			sameRedirectionsWithOrWithoutSGTIN =
				this.redirectionsWithSGTINisTheSameAsWithoutSGTIN();

			if (this.state.redirects.redirectWithoutSGTIN.msg === RedirectionError) {
				tdRedirectionClass = "errorCell";
				RedirectionContent = RedirectionError;
			} else {
				RedirectionContent = this.state.redirects.redirectWithoutSGTIN.msg;
				if (this.state.redirects.redirectWithoutSGTIN.isRolex) {
					RedirectionContent += " - " + RolexExperienceMessage;
				}
			}
			if (!sameRedirectionsWithOrWithoutSGTIN) {
				tdRedirectionClass = "warningCell";
				RedirectionContent =
					"Without SGTIN: " +
					RedirectionContent +
					"<br/>With SGTIN:" +
					this.state.redirects.redirectWithSGTIN.msg;
				if (this.state.redirects.redirectWithSGTIN.isRolex) {
					RedirectionContent += " - " + RolexExperienceMessage;
				}
			}
		}

		return (
			<td
				key="redirectEU"
				className={tdRedirectionClass}
				dangerouslySetInnerHTML={{ __html: RedirectionContent }}
			></td>
		);
	}
}
