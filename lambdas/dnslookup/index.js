exports.handler = async (event) => {
    var response;
    var responseHeaders = {
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
    };
    var DNS;
    
    if (event.queryStringParameters && event.queryStringParameters.DNS) {
        console.log("Received name: " + event.queryStringParameters.DNS);
        DNS = event.queryStringParameters.DNS;
    } else {
        response = {
          statusCode: 400,
          headers: responseHeaders,
          body: JSON.stringify({
            error: "DNS parameter is missing"
          })
      };
        return response;
    }

    try {
        var record = await dnsExist(DNS, true);
        
        response = {
            statusCode: 200,
            headers: responseHeaders,
            body: JSON.stringify({
                CNAME: record.CNAME
            })
        };
    } catch(err) {
        
        try {
            record = await dnsExist(DNS, false);
        
            response = {
                statusCode: 200,
                headers: responseHeaders,
                body: JSON.stringify({
                    otherrecords: record.toString()
                })
            };  
        } catch (e) {
            response = {
                statusCode: 404,
                headers: responseHeaders,
                body: JSON.stringify({
                    error: err
                })
            };             
        }
    } 
    
    return response;
};

async function dnsExist(domain, checkForCNAME) {
    const dns = require('dns');

    if (checkForCNAME) {
        return new Promise((resolve, reject) => {

            dns.resolve(domain, "CNAME", function(err, records) {
                if (err) {
                    // console.log("err", err);
                    if (err.errno) {
                        reject(err.errno);
                    } else {
                        reject(err);
                    }
                } else {
                    resolve({CNAME: records});
                }
            });
        });
    }

    return new Promise((resolve, reject) => {
        dns.resolve4(domain, function(err, records) {
            if (err) {
                // console.log("err", err);
                if (err.errno) {
                    reject(err.errno);
                } else {
                    reject(err);
                }
            } else {
                resolve(records);
            }
        });
    });
};



