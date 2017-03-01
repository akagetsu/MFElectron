/* jshint esversion: 6 */
let postForm = (function () {
  let Http = require('http');

  function getFormDataForPost(fields) {
    let post_data = [],
      length = 0,
      boundary = Math.random().toString();

    function encodeFieldPart(boundary, name, value) {

      let return_part = "------WebKitFormBoundary" + boundary +
        "\r\nContent-Disposition: form-data; name=\"" + name + "\"\r\n\r\n" + value;
      return return_part;
    }

    if (fields) {
      for (let key in fields) {
        let value = fields[key];
        post_data.push(encodeFieldPart(boundary, key, value));
        post_data.push("\r\n------WebKitFormBoundary" + boundary + "--");
      }
    }

    for (let i = 0; i < post_data.length; i++) {
      length += post_data[i].length;
    }

    let params = {
      postdata: post_data,
      headers: {
        'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundary' + boundary,
        'Content-Length': length
      }
    };
    return params;
  }

  const postData = function (fields, options, headers) {
    return new Promise(function (resolve, reject) {

      let headerparams = getFormDataForPost(fields),
        totalheaders = headerparams.headers;

      for (let key in headers) {
        totalheaders[key] = headers[key];
      }

      options.headers = totalheaders;

      let request = Http.request(options, function (response) {
        response.body = '';
        response.setEncoding(options.encoding);

        response.on('data', function (chunk) {
          response.body += chunk;
        });

        response.on('end', function () {
          resolve(response);
        });
      });

      for (let i = 0; i < headerparams.postdata.length; i++) {
        request.write(headerparams.postdata[i]);
      }
      request.end();
    });
  };

  return {
    postData: postData
  };

})();


module.exports = postForm;