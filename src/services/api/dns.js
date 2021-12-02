import configData from "config.json";

const DNS = {
	async dnsExist(domain, isChina = false) {
		var ApiURL = isChina ? configData.API_DNS_CN : configData.API_DNS;
		return new Promise((resolve, reject) => {
			fetch(ApiURL + domain, {
				method: "GET",
				headers: {
					"x-api-key": isChina ? configData.API_KEY_CN : configData.API_KEY,
				},
			})
				.then((res) => res.json())
				.then((body) => {
					resolve(body);
				})
				.catch((err) => {
					console.log("getDNS err2", ApiURL + domain, err);
					reject(err);
				});
		});
	},
};

export default DNS;
