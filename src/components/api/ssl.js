import configData from "config.json";
const fetch = require("node-fetch");

const SSL = {
	async getSSLExpiryDate(domain) {
		return new Promise((resolve, reject) => {
			fetch(configData.API_SSL + domain, {
				method: "GET",
				headers: {
					"x-api-key": configData.API_KEY,
				},
			})
				.then((res) => res.json())
				.then((body) => {
					if (!body.daysRemaining) {
						console.log("getSSL err1", configData.API_SSL + domain, body);
						return reject(body);
					}
					return resolve(body.daysRemaining);
				})
				.catch((err) => {
					console.log("getSSL err2", configData.API_SSL + domain, err);
					reject(err);
				});
		});
	},
};

export default SSL;
