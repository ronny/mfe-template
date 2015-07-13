import React, { PropTypes } from "react";
import Hello from "../Hello/Hello";
import DocumentTitle from "react-document-title";
import { connect } from "redux/react";
import fetchData from "../fetchData";
import * as PhotoActionCreators from "../../actions/PhotoActions";

@fetchData(async ({ store }) => {
  return await store.dispatch(PhotoActionCreators.getNextPage());
})
@connect(state => ({Photo: state.Photo}))
class App extends React.Component {
  static propTypes = {
    initialName: PropTypes.string,
    Photo: PropTypes.object,
  };
  static defaultProps = {
    initialName: "World",
  };
  state = {
    name: this.props.initialName,
  };

  onNameChange = (event) => {
    this.setState({name: event.currentTarget.value});
  }

  onNextPageLinkClick = (event) => {
    event.preventDefault();
    this.props.dispatch(PhotoActionCreators.getNextPage());
  }

  render() {
    console.log("App render");
    const photos = this.props.Photo.getNextPage();

    return (
      <DocumentTitle title="Sample App">
        <div className="App">
          <Hello name={this.state.name} />
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={this.state.name}
            onChange={this.onNameChange} />
        </div>

        <hr />

        {photos ? <PhotoList {...{ photos }} /> : "Loading..."}

        <a href="#" onClick={this.onNextPageLinkClick} />
      </DocumentTitle>
    );
  }
}

export default App;
