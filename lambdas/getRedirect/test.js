
async function getRedirect(fullURL, isAPICall = false) {
    const request = require('request');

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
			}
			else {
				// console.log(r.uri.href);
				// console.log(res.request.uri.href);
				// console.log(this.uri.href);
		
				var isRolex = function(body) {
					return (body.match(/rolex/g) || []).length > 1;
				}
		        var response = {
		            redirect: res.request.uri.href,
		            isRolex: isRolex(body)
		        }

                if (isAPICall) {
                    console.log(JSON.parse(body));
                } else  {
                    console.log(response);
                }

				resolve(response);
			}
		});
	});
}



var result = getRedirect("https://rolex-aptamil-afr-prod-64.content.digital4danone.com/123456789123?pagestatus");
var result = getRedirect("https://rolex-aptamil-afr-prod-64.content.digital4danone.com/ReferencePage/r_product_ref.productdetails.aptamilaf.en_za.json?sku=123456789123&country=FR&open_valid=false", true);
