import React from "react";

class UploadPreview extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.resetFile = this.resetFile.bind(this);
  }
  onChange(event) {
    const file = event.target.files[0];
    this.props.getFileFromUploadedImage({
      url: URL.createObjectURL(file),
      file: file,
    });
  }

  resetFile(event) {
    event.preventDefault();
    this.setState({ file: null });
  }
  render() {
    return (
      <div className="upload-container">
        <label className="upload-button">
          <span>Upload an Image</span>
          <input type="file" accept="image/*" onChange={this.onChange} />
        </label>
      </div>
    );
  }
}

export default UploadPreview;
