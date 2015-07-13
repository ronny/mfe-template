import isFunction from "lodash/Lang/isFunction";
import { createStore, applyMiddleware, compose } from "redux";
// import * as reducers from "./reducers";

function promiseMiddleware(api, getState) {
  return next =>
    function _r(action) {
      if (action && isFunction(action.then)) {
        return action.then(_r);
      }

      if (isFunction(action)) {
        return _r(action(api, getState));
      }

      return next(action);
    };
}

function consoleLoggerMiddleware() {
  return next => action => {
    console.log(action);
    return next(action);
  };
}

const createAsyncStore = compose(
  applyMiddleware(promiseMiddleware, consoleLoggerMiddleware),
  createStore,
);

export default createAsyncStore;

//     composeReducers(reducers),
//     getState => [
//       // thunkMiddleware(getState),
//       promiseMiddleware(api, getState),
//       consoleLoggerMiddleware()
//     ]
//   );
//   const redux = createStore(dispatcher, intialState);

//   return store;
// }
