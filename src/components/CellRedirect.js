import React, { useState, useEffect } from "react";
import Redirect from "services/api/redirect";
import Helper from "helpers/Helper";
import { useSelector, useDispatch } from "react-redux";
import { setValue } from "services/reduxServices/DomainDynamicValueService";

const RedirectionError = "Unable to get the redirection";
const NoRedirectionMessage = "No redirection";
const RolexExperienceMessage = "<span class='rolex-experience' >Rolex experience</span>";

export default function CellRedirect(props) {
	const [update, setUpdate] = useState(null);
	const [redirects, setRedirects] = useState(false);
	const [displayedMsg, setDisplayedMsg] = useState(false);

	const reduxUpdates = useSelector((state) => state.DomainUpdate);
	const reduxValues = useSelector((state) => state.DomainDynamicValue);
	const dispatch = useDispatch();

	var dns = Helper._removeDomainProtocol(props.domain);
	if (!displayedMsg && reduxValues[dns] && reduxValues[dns][props.column]) {
		setDisplayedMsg(reduxValues[dns][props.column]);
	}

	// componentDidUpdate
	useEffect(() => {
		if (
			reduxUpdates[props.column] &&
			!update &&
			(typeof redirects === "undefined" ||
				typeof redirects.redirectWithSGTIN === "undefined" ||
				typeof redirects.redirectWithoutSGTIN === "undefined")
		) {
			setUpdate({
				redirWithSgtin: true,
				redirWithoutSgtin: true,
			});
			getRedirectionDetails();
		}
	}); // notice, no second argument

	const getRedirectionDetails = async () => {
		var newUpdate = { ...update };
		try {
			var redirects = {};
			redirects.redirectWithSGTIN = {};
			redirects.redirectWithSGTIN = await Redirect.getRedirect(props.url, props.isChina);
			redirects.redirectWithSGTIN.msg = redirects.redirectWithSGTIN.redirect;
			if (redirects.redirectWithSGTIN.redirect === props.url) {
				redirects.redirectWithSGTIN.msg = NoRedirectionMessage;
			}
		} catch (err) {
			redirects.redirectWithSGTIN.msg = RedirectionError;
			console.log(
				props.domain + ": redir Error" + (props.isChina ? " from CN" : " from EU"),
				err
			);
		} finally {
			newUpdate.redirWithSgtin = false;
			setUpdate(newUpdate);
		}

		try {
			redirects.redirectWithoutSGTIN = {};
			redirects.redirectWithoutSGTIN = await Redirect.getRedirect(
				props.domain,
				props.isChina
			);
			redirects.redirectWithoutSGTIN.msg = redirects.redirectWithoutSGTIN.redirect;
			if (
				redirects.redirectWithoutSGTIN.redirect === props.domain ||
				redirects.redirectWithoutSGTIN.redirect === props.domain + "/" ||
				redirects.redirectWithoutSGTIN.redirect + "/" === props.domain
			) {
				redirects.redirectWithoutSGTIN.msg = NoRedirectionMessage;
			}
		} catch (err) {
			redirects.redirectWithoutSGTIN.msg = RedirectionError;
			console.log(
				props.domain + ": redir Error" + (props.isChina ? " from CN" : " from EU"),
				err
			);
		} finally {
			newUpdate = { ...update };
			newUpdate.redirWithoutSgtin = false;
			setUpdate(newUpdate);
			setRedirects(redirects);
		}
	};

	const getRedirectionDisplayedContent = () => {
		var tdRedirectionClass = "";
		var RedirectionContent = "";
		var sameRedirectionsWithOrWithoutSGTIN = true;
		if (update && update.redirWithoutSgtin) {
			tdRedirectionClass = "updating";
		}
		if (
			typeof redirects !== "undefined" &&
			typeof redirects.redirectWithoutSGTIN !== "undefined" &&
			typeof redirects.redirectWithSGTIN !== "undefined"
		) {
			sameRedirectionsWithOrWithoutSGTIN = redirectionsWithSGTINisTheSameAsWithoutSGTIN();

			if (redirects.redirectWithoutSGTIN.msg === RedirectionError) {
				tdRedirectionClass = "errorCell";
				RedirectionContent = RedirectionError;
			} else {
				RedirectionContent = redirects.redirectWithoutSGTIN.msg;
				if (redirects.redirectWithoutSGTIN.isRolex) {
					RedirectionContent += " - " + RolexExperienceMessage;
				}
			}
			if (!sameRedirectionsWithOrWithoutSGTIN) {
				tdRedirectionClass = "warningCell";
				RedirectionContent =
					"Without SGTIN: " +
					RedirectionContent +
					"<br/>With SGTIN:" +
					redirects.redirectWithSGTIN.msg;
				if (redirects.redirectWithSGTIN.isRolex) {
					RedirectionContent += " - " + RolexExperienceMessage;
				}
			}
		}

		return {
			className: tdRedirectionClass,
			content: RedirectionContent,
		};
	};

	const redirectionsWithSGTINisTheSameAsWithoutSGTIN = () => {
		if (
			!redirects.redirectWithoutSGTIN.redirect ||
			redirects.redirectWithoutSGTIN.redirect.length < 1 ||
			!redirects.redirectWithSGTIN.redirect ||
			redirects.redirectWithSGTIN.redirect.length < 1
		) {
			return true;
		}

		if (
			redirects.redirectWithoutSGTIN.redirect === redirects.redirectWithSGTIN.redirect ||
			redirects.redirectWithSGTIN.redirect.includes(redirects.redirectWithoutSGTIN.redirect)
		) {
			return true;
		}
		return false;
	};

	var msg = "";
	var className = "";
	if (displayedMsg) {
		msg = displayedMsg;
	} else {
		var content = getRedirectionDisplayedContent();
		msg = content.content;
		className = content.className;
		if (content.content.length > 0) {
			setDisplayedMsg(content.content);
			dispatch(
				setValue({
					column: props.column,
					dns: Helper._removeDomainProtocol(props.domain),
					value: content.content,
				})
			);
		}
	}

	return (
		<td key="redirectEU" className={className} dangerouslySetInnerHTML={{ __html: msg }}></td>
	);
}
