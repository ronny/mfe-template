import React, { PropTypes } from "react";

export default function fetchData(fetchFn) {

  return DecoratedComponent =>
    class PrepareRouteDecorator extends React.Component {

      static fetchData = fetchFn;

      static contextTypes = {
        store: PropTypes.object.isRequired
      }

      render() {
        return (
          <DecoratedComponent {...this.props} />
        );
      }

      componentDidMount() {
        const {
          context: { store },
          props: { params, location }
        } = this;

        console.log("componentDidMount", fetchFn, store, params, location);

        fetchFn({ store, params, location });
      }
    };
}
