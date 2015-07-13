import isObject from "lodash/Lang/isObject";
import assign from "lodash/Object/assign";
import qs from "qs";
import URL from "url";

export default function createAPI(createRequest) {
  return async function api(path, method = "GET", params = {}) {
    var { pathname, query: queryStr } = URL.parse(path);
    var query, headers, body;

    if (isObject(method)) {
      params = method;
      method = "GET";
    }

    query = qs.parse(queryStr);

    if (method === "GET") {
      if (isObject(params)) {
        assign(query, params);
      }

    } else {
      body = params;
    }

    return await new Promise((resolve, reject) => {
      createRequest({ method, headers, pathname, query, body })
        .end((err, res) => {
          if (err) {
            return reject(err);
          }

          return resolve(res);
        });
    });
  };
}
