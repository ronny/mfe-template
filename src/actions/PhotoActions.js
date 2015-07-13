import ActionTypes from "./ActionTypes";

export function getNextPage() {
  console.log("photo action getNextPage");

  return async (api, getState) => {
    console.log("photo action getNextPage inner function", api, getState());
    const nextPage = getState().get("currentPage") + 1;
    console.log("nextPage =", nextPage);

    // API endpoint:
    // https://github.com/500px/api-documentation/blob/master/endpoints/photo/GET_photos.md

    return {
      type: ActionTypes.Photo.getNextPage,
      response: await api("/photos", {page: nextPage}),
    };
  };

}
