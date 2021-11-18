import React from "react";
import PropTypes from "prop-types";

import { history } from "../helpers/History";
import { alertService, alertType } from "../services/AlertService";

const propTypes = {
    id: PropTypes.string,
    fade: PropTypes.bool,
};

const defaultProps = {
    id: "default-alert",
    fade: true,
};

/**
 * From https://jasonwatmore.com/post/2020/02/17/react-alert-toaster-notifications
 */

class Alert extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            alerts: [],
        };
    }

    componentDidMount() {
        // subscribe to new alert notifications
        this.subscription = alertService.onAlert(this.props.id).subscribe((alert) => {
            // clear alerts when an empty alert is received
            if (!alert.message) {
                // filter out alerts without 'keepAfterRouteChange' flag
                const alerts = this.state.alerts.filter((x) => x.keepAfterRouteChange);

                // remove 'keepAfterRouteChange' flag on the rest
                alerts.forEach((x) => delete x.keepAfterRouteChange);

                this.setState({ alerts });
                return;
            }

            // add alert to array
            this.setState({ alerts: [...this.state.alerts, alert] });

            // auto close alert if required
            if (this.props.autoClose || alert.autoClose) {
                setTimeout(() => this.removeAlert(alert), 3000);
            }
        });

        // clear alerts on location change
        this.historyUnlisten = history.listen(() => {
            alertService.clear(this.props.id);
        });
    }

    componentWillUnmount() {
        // unsubscribe & unlisten to avoid memory leaks
        this.subscription.unsubscribe();
        this.historyUnlisten();
    }

    removeAlert(alert) {
        if (this.props.fade) {
            // fade out alert
            const alertWithFade = { ...alert, fade: true };
            this.setState({
                alerts: this.state.alerts.map((x) => (x === alert ? alertWithFade : x)),
            });

            // remove alert after faded out
            setTimeout(() => {
                this.setState({ alerts: this.state.alerts.filter((x) => x !== alertWithFade) });
            }, 250);
        } else {
            // remove alert
            this.setState({ alerts: this.state.alerts.filter((x) => x !== alert) });
        }
    }

    cssClasses(alert) {
        if (!alert) return;

        const classes = ["alert", "alert-dismissable"];

        const alertTypeClass = {
            [alertType.success]: "alert alert-success",
            [alertType.error]: "alert alert-danger",
            [alertType.info]: "alert alert-info",
            [alertType.warning]: "alert alert-warning",
        };

        classes.push(alertTypeClass[alert.type]);

        if (alert.fade) {
            classes.push("fade");
        }

        return classes.join(" ");
    }

    render() {
        const { alerts } = this.state;
        if (!alerts.length) return null;
        return (
            <div className="row justify-content-center">
                <div className="m-3 col-10">
                    {alerts.map((alert, index) => (
                        <div key={index} className={this.cssClasses(alert)}>
                            <a
                                className="close"
                                onClick={() => this.removeAlert(alert)}
                                style={{ cursor: "pointer" }}
                            >
                                &times;
                            </a>
                            <span dangerouslySetInnerHTML={{ __html: alert.message }}></span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

Alert.propTypes = propTypes;
Alert.defaultProps = defaultProps;
export { Alert };
