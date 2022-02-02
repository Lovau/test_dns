import React from "react";
import Redirect from "services/api/redirect";
import Helper from "helpers/Helper";

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
			this.getRedirectionDetails();
		}
	}

	getRedirectionDisplayedContent() {
		var tdRedirectionClass = "";
		var RedirectionContent = "";
		var sameRedirectionsWithOrWithoutSGTIN = true;
		if (this.state && this.state.update.redirWithoutSgtin) {
			tdRedirectionClass = "updating";
		}
		if (
			typeof this.state.redirects !== "undefined" &&
			typeof this.state.redirects.redirectWithoutSGTIN !== "undefined" &&
			typeof this.state.redirects.redirectWithSGTIN !== "undefined"
		) {
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

		return {
			className: tdRedirectionClass,
			content: RedirectionContent,
		};
	}

	async getRedirectionDetails() {
		try {
			var redirects = {};
			redirects.redirectWithSGTIN = {};
			redirects.redirectWithSGTIN = await Redirect.getRedirect(
				this.props.url,
				this.props.isChina
			);
			redirects.redirectWithSGTIN.msg = redirects.redirectWithSGTIN.redirect;
			if (redirects.redirectWithSGTIN.redirect === this.props.url) {
				redirects.redirectWithSGTIN.msg = NoRedirectionMessage;
			}
		} catch (err) {
			redirects.redirectWithSGTIN.msg = RedirectionError;
			console.log(
				this.props.domain +
					": redir Error" +
					(this.props.isChina ? " from CN" : " from EU"),
				err
			);
		}

		var update = this.state.update;
		update.redirWithSgtin = false;

		try {
			redirects.redirectWithoutSGTIN = {};
			redirects.redirectWithoutSGTIN = await Redirect.getRedirect(
				this.props.domain,
				this.props.isChina
			);
			redirects.redirectWithoutSGTIN.msg = redirects.redirectWithoutSGTIN.redirect;
			if (
				redirects.redirectWithoutSGTIN.redirect === this.props.domain ||
				redirects.redirectWithoutSGTIN.redirect === this.props.domain + "/" ||
				redirects.redirectWithoutSGTIN.redirect + "/" === this.props.domain
			) {
				redirects.redirectWithoutSGTIN.msg = NoRedirectionMessage;
			}
		} catch (err) {
			redirects.redirectWithoutSGTIN.msg = RedirectionError;
			console.log(
				this.props.domain +
					": redir Error" +
					(this.props.isChina ? " from CN" : " from EU"),
				err
			);
		}

		update.redirWithoutSgtin = false;
		this.setState({
			redirects: redirects,
			update: update,
		});

		var displayedContent = this.getRedirectionDisplayedContent();
		var filter = {};
		var filterKey = "Redirection " + (this.props.isChina ? "CN" : "EU");
		filter[Helper._removeDomainProtocol(this.props.domain)] = {
			[filterKey]: displayedContent.content,
		};
		this.props.dynamicFilterCallback(filter);
	}

	redirectionsWithSGTINisTheSameAsWithoutSGTIN() {
		if (
			!this.state.redirects.redirectWithoutSGTIN.redirect ||
			this.state.redirects.redirectWithoutSGTIN.redirect.length < 1 ||
			!this.state.redirects.redirectWithSGTIN.redirect ||
			this.state.redirects.redirectWithSGTIN.redirect.length < 1
		) {
			return true;
		}

		if (
			this.state.redirects.redirectWithoutSGTIN.redirect ===
				this.state.redirects.redirectWithSGTIN.redirect ||
			this.state.redirects.redirectWithSGTIN.redirect.includes(
				this.state.redirects.redirectWithoutSGTIN.redirect
			)
		) {
			return true;
		}
		return false;
	}

	render() {
		var content = this.getRedirectionDisplayedContent();

		return (
			<td
				key="redirectEU"
				className={content.className}
				dangerouslySetInnerHTML={{ __html: content.content }}
			></td>
		);
	}
}
