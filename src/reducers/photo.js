import Immutable from "immutable";
import { Photo as types } from "../actions/ActionTypes";

const initialState = Immutable.fromJS({
  currentPage: 0,
  photos: [],
});

export default (state = initialState, action) => {
  switch(action.type) {
    case types.getNextPage:
      console.log("photo reducer, state=", state);
      const { nextPagePhotos, currentPage } = action.result;
      const photos = state.get("photos");

      return state.merge({
        currentPage: currentPage,
        photos: [...photos, nextPagePhotos],
      });

    default:
      return state;
  }
};
