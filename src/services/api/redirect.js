import configData from "config.json";

const Redirect = {
	async getRedirect(fullURL, isChina = false) {
		var ApiURL = isChina ? configData.API_REDIRECT_CN : configData.API_REDIRECT;
		return new Promise((resolve, reject) => {
			fetch(ApiURL + fullURL, {
				method: "GET",
				headers: {
					"x-api-key": isChina ? configData.API_KEY_CN : configData.API_KEY,
				},
			})
				.then((res) => {
					if (!res.ok) {
						console.log("getRedirect err", ApiURL + fullURL, "Not a 200 response");
						reject(res);
					}
					return res.json();
				})
				.then((body) => resolve(body))
				.catch((err) => {
					console.log("getRedirect err", ApiURL + fullURL, err);
					reject(err);
				});
		});
	},
};

export default Redirect;
