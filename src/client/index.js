import React from "react";
import { history } from "react-router/lib/BrowserHistory";
import Router from "react-router";
import routes from "../routes";
import createAsyncStore from "../createAsyncStore";
import { Provider } from "redux/react";
import createAPI from "../createAPI";
import request from "superagent";
import { apiServer } from "../../config";
import qs from "qs";

const api = createAPI(
  ({ method, headers = {}, pathname, query = {}, body = {} }) => {
    let pathnameWithNoHost = pathname.replace(new RegExp(`^${apiServer.urlPrefix}`), '');
    let url = `${apiServer.urlPrefix}${pathnameWithNoHost}`;

    return request(method, url)
      .query(qs.stringify(query))
      .set(headers)
      .send(body);
  }
);

import { combineReducers } from "redux";
const store = createAsyncStore(api, window.__INITIAL_STATE__);

React.render(
  <Provider store={store}>
    {() =>
      <Router history={history} children={routes}/>
    }
  </Provider>,
  document.getElementById("app")
);
