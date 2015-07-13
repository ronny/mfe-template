import keyMirror from "react/lib/keyMirror";

export default {
  Photo: keyMirror({
    getNextPage: null,
  }),
  User: keyMirror({
    findByUsername: null,
  })
};
