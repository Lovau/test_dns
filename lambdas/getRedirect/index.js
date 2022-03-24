exports.handler = async (event) => {
    var response;
    var URL = "";
    var responseHeaders = {
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
    };

    if (event.queryStringParameters && event.queryStringParameters.URL) {
        console.log("Received name: " + event.queryStringParameters.URL);
        URL = event.queryStringParameters.URL;
    } else {
        response = {
            statusCode: 400,
            headers: responseHeaders,
            body: JSON.stringify({
                err: "URL parameter is missing",
                event: event,
            }),
        };
        return response;
    }

    try {
        var response = await getRedirect(URL);
        if (!response.redirect) {
            throw Error("No redirection found");
        }

        response = {
            statusCode: 200,
            headers: responseHeaders,
            body: JSON.stringify(response),
        };
    } catch (err) {
        response = {
            statusCode: 404,
            headers: responseHeaders,
            body: JSON.stringify(err),
        };
    }

    return response;
};

async function getRedirect(fullURL) {
    const request = require("request");
    const { parse } = require("node-html-parser");

    return new Promise((resolve, reject) => {
        const options = {
            //"rejectUnauthorized": false, // to avoid the UNABLE_TO_VERIFY_LEAF_SIGNATURE error on some domains
            strictSSL: false,
            url: fullURL,
            method: "GET",
        };

        var r = request(options, function (err, res, body) {
            if (err) {
                reject(err);
            } else {
                // console.log(r.uri.href);
                // console.log(res.request.uri.href);
                // console.log(this.uri.href);

                const root = parse(body);
                const html = root.querySelector("html");
                const aemFolder = html.getAttribute("data-root");
                const aemLanguage = html.getAttribute("data-languagenode");
                const aemBrand = html.getAttribute("data-brand");

                var isRolex = function (body) {
                    return (body.match(/rolex/g) || []).length > 1;
                };
                var response = {
                    redirect: res.request.uri.href,
                    isRolex: isRolex(body),
                    AEM: {
                        folder: aemFolder,
                        language: aemLanguage,
                        brand: aemBrand,
                    },
                };
                resolve(response);
            }
        });
    });
}
// local test
(async () => {
    var res = await getRedirect("https://qrt.aptaclub.it/0539152247310228NQ3MNSX35");
    console.log("res", res);
})();
