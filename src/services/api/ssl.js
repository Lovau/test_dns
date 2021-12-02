import configData from "config.json";
const fetch = require("node-fetch");

const SSL = {
	async getSSLExpiryDate(domain, isChina = false) {
		var ApiURL = isChina ? configData.API_SSL_CN : configData.API_SSL;
		return new Promise((resolve, reject) => {
			fetch(ApiURL + domain, {
				method: "GET",
				headers: {
					"x-api-key": isChina ? configData.API_KEY_CN : configData.API_KEY,
				},
			})
				.then((res) => res.json())
				.then((body) => {
					if (!body.daysRemaining) {
						console.log("getSSL err1", ApiURL + domain, body);
						return reject(body);
					}
					return resolve(body.daysRemaining);
				})
				.catch((err) => {
					console.log("getSSL err2", ApiURL + domain, err);
					reject(err);
				});
		});
	},
};

export default SSL;
