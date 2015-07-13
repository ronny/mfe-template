import React, { PropTypes } from "react";
import Immutable from "immutable";

class PhotoList extends React.Component {
  static propTypes = {
    photos: PropTypes.instanceOf(Immutable.List).isRequired,
  };

  render() {
    return (
      <ol>
        {this.props.photos.map(photo =>
          <PhotoListItem key={photo.get("id")} {...{ photo }} />
        )}
      </ol>
    );
  }
}

export default PhotoList;
