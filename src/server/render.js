import React from "react";
import HtmlDocument from "../components/HtmlDocument/HtmlDocument";
import DocumentTitle from "react-document-title";
import Router from "react-router";
import Location from "react-router/lib/Location";
import routes from "../routes";
import createAsyncStore from "../createAsyncStore";
import createAPI from "../createAPI";
import { apiServer } from "../../config";
import request from "superagent";
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

const store = createAsyncStore(api);


function render(req, res, next) {
  console.log("render", req.path, req.query);
  try {
    const location = new Location(req.path, req.query);

    Router.run(routes, location, async (error, routerState) => {
      const { components, params } = routerState;

      console.log("fetching data");
      await * components
        .filter(component => component.fetchData)
        .map(component => {
          console.log("component.fetchData", component.fetchData);
          component.fetchData({ store, params, location });
        });

      console.log("rendering markup, state=", store.getState());
      const markup = React.renderToString(
        <Provider store={store}>
          {() =>
            <Router {...{...routerState, location, history}} />
          }
        </Provider>
      );

      console.log("rendering html");
      const doctype = "<!DOCTYPE html>";
      // The application component is rendered to static markup (like
      // renderToString but without the react specific attrs) and sent as
      // response.
      const html = React.renderToStaticMarkup(
        <HtmlDocument
          state={store.getState()}
          title={DocumentTitle.rewind()}
          markup={markup} />
      );

      console.log("sending response", html);
      res.send(doctype + html);
    });
  } catch (e) {
    next(e);
  }
}

export default render;
