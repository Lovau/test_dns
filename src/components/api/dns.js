import configData from "../../config.json";

const DNS = {
	async dnsExist(domain) {
		return new Promise((resolve, reject) => {
			fetch(configData.API_DNS + domain, {
				method: "GET",
				headers: {
					"x-api-key": configData.API_KEY,
				},
			})
				.then((res) => res.json())
				.then((body) => {
					resolve(body);
				})
				.catch((err) => {
					console.log(
						"getDNS err2",
						configData.API_DNS + domain,
						err
					);
					reject(err);
				});
		});
	},
};

export default DNS;
