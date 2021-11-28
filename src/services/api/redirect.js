import configData from "config.json";

const Redirect = {
	async getRedirect(fullURL) {
		return new Promise((resolve, reject) => {
			fetch(configData.API_REDIRECT + fullURL, {
				method: "GET",
				headers: {
					"x-api-key": configData.API_KEY,
				},
			})
				.then((res) => {
					if (!res.ok) {
						console.log(
							"getRedirect err",
							configData.API_REDIRECT + fullURL,
							"Not a 200 response"
						);
						reject(res);
					}
					return res.json();
				})
				.then((body) => resolve(body))
				.catch((err) => {
					console.log("getRedirect err", configData.API_REDIRECT + fullURL, err);
					reject(err);
				});
		});
	},
};

export default Redirect;
