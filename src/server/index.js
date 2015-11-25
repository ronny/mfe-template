import path from "path";
import express from "express";
import compression from "compression";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import favicon from "serve-favicon";
import morgan from "morgan";
import validate from "../validate";

const server = express();

server.use(morgan(server.get("env") === "production" ? "combined" : "dev"));
server.use(bodyParser.json());
server.use(cookieParser());
server.use(compression());
server.use(favicon(path.resolve(__dirname, "../../public/favicon.png")));

/////////////////////////////////////////////////////////////////////

// too lazy to bother with real request now
const itemTypesJSON = JSON.parse('{"data":[{"id":"9e6f1928-6354-421a-9b5c-2550e8ccc081","type":"item_types","attributes":{"uuid":"9e6f1928-6354-421a-9b5c-2550e8ccc081","name":"Graphic","itemCategories":["Print","Product Mockups","Websites","UI Kits","UX Kits","Infographics","Logos"],"attributeDefinitions":[{"id":"4b8f3eb9-757a-405f-ad74-c1af313d889e","label":"License","icon":"legal","options":[{"type":"select","label":"choose:","options":["MIT"]}]},{"id":"51481de3-11a2-4eab-832b-f7caf33b50af","label":"Vector","icon":"image","options":[{"type":"boolean"}]},{"id":"1952c21a-91ac-4a02-aaa6-b3b92275a60d","label":"Layered","icon":"bars","options":[{"type":"boolean"}]},{"id":"7f4f01f3-5a1e-4638-bb47-44eb475760c1","label":"Color Space","icon":"paint-brush","options":[{"type":"select"}]},{"id":"3e40dc74-5ea8-4a1d-bed1-029b9d0af41d","label":"Tileable","icon":"th","options":[{"type":"boolean"}]},{"id":"b04c37f6-25e0-46a0-accb-2c172f869253","label":"DPI","icon":"image","options":[{"type":"integer"},{"type":"select","options":["px","in","cm"]}]},{"id":"bc0e1cbf-444a-4a75-a153-25f1d93920e7","label":"Dimensions","icon":"arrows-alt","options":[{"type":"integer"},{"type":"select","options":["px","in","cm"]}]},{"id":"3220ede8-fad6-4050-b31c-50a72ad5a197","label":"Requirements","icon":"check","options":[{"type":"select","options":["Adobe CS6+"]}]},{"id":"71e8710a-6943-41c9-839f-f3f21fb5b14c","label":"Documentation","icon":"file-word-o","options":[{"type":"boolean"}]}]}}]}');

// On production, use the public directory for static files
// This directory is created by webpack on build time.
if (server.get("env") === "production") {
  server.use(express.static(path.resolve(__dirname, "../public"), {
    maxAge: 365 * 24 * 60 * 60
  }));
}

/////////////////////////////////////////////////////////////////////
// Render the app server-side and send it as response
// import render from "./render.generated.js";
// server.use(render);

// // TODO: remove this when server rendering works again
// server.use((req, res, next) => { // eslint-disable-line no-unused-vars
//   res.set("Content-Type", "text/html");
//   res.send(fs.readFileSync(path.resolve(__dirname, "../../public/index.html")));
// });

// Generic server errors (e.g. not caught by components)
server.use((err, req, res, next) => {  // eslint-disable-line no-unused-vars
  console.error("Error on request %s %s", req.method, req.url);
  console.error(err.stack);

  let msg = [
    "500 Internal Server Error",
    server.get("env") !== "production" ? err.stack : null,
  ].filter(item => item !== null).join("\n\n");

  res.status(500)
    .set({"Content-Type": "text/plain"})
    .send(msg);
});

server.post('/validate.json', function(req, res) {
    const {itemSubmission, rules} = req.body.data;
    const itemTypes = itemTypesJSON.data.map((itemType => itemType.attributes));
    res.json(validate(itemSubmission, rules, itemTypes));
});


/////////////////////////////////////////////////////////////////////
// Finally, start the express server
server.set("port", process.env.PORT || 3000);

server.listen(server.get("port"), (err) => {
  if (err) {
    console.error("Error while starting express:", err);
  }

  console.info(`Express ${server.get("env")} server listening on http://localhost:${server.get("port")}`);
});
