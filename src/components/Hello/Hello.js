import React, { PropTypes } from "react";
import DocumentTitle from "react-document-title";

if (process.env.BROWSER) {
  require("./Hello.sass");
}

class Hello extends React.Component {
  static propTypes = {
    name: PropTypes.string,
  };
  static defaultProps = {
    name: "World"
  };

  render() {
    const text = `Hello, ${this.props.name}!`;

    return (
      <DocumentTitle title={text}>
        <div className="Hello">
          <p>{text}</p>
        </div>
      </DocumentTitle>
    );
  }
}

export default Hello;
