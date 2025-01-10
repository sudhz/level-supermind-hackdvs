import React, { useEffect, useState } from "react";
import ImageSlider from "./ImageSlider";
import Arrow from "./Arrow";
import "./index.css";
import UploadImage from "./uploadPreview";
import SlideIndicators from "./SlideIndicators";
import LoadingSpinner from "./LoadingSpinner";

const defaultImg =
  "https://community.softr.io/uploads/db9110/original/2X/7/74e6e7e382d0ff5d7773ca9a87e6f6f8817a68a6.jpeg";

const App = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [images, setImages] = useState([defaultImg]);
  const [caption, setCaption] = useState("");
  const [imageFiles, setImageFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState("");

  const previousSlide = () => {
    const lastIndex = images.length - 1;
    const shouldResetIndex = currentImageIndex === 0;
    const index = shouldResetIndex ? lastIndex : currentImageIndex - 1;
    setCurrentImageIndex(index);
  };

  const nextSlide = () => {
    const lastIndex = images.length - 1;
    const shouldResetIndex = currentImageIndex === lastIndex;
    const index = shouldResetIndex ? 0 : currentImageIndex + 1;
    setCurrentImageIndex(index);
  };

  const getFileFromImage = (imgData) => {
    setImages(
      [...images, imgData.url].filter(
        (url) =>
          url !=
          "https://community.softr.io/uploads/db9110/original/2X/7/74e6e7e382d0ff5d7773ca9a87e6f6f8817a68a6.jpeg"
      )
    );
    setImageFiles([...imageFiles, imgData.file]);
  };

  const handleSubmit = async () => {
    try {
      if (images[0] === defaultImg && images.length === 1) {
        alert("Please upload at least one image");
        return;
      }

      setIsLoading(true);
      setAiResponse("");

      const formData = new FormData();
      formData.append("caption", caption);
      imageFiles.forEach((file, index) => {
        formData.append(`files`, file);
      });

      const response = await fetch("http://localhost:8176/data", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      // Parse the AI response
      const aiText = data.outputs[0].outputs[0].results.message.data.text;
      setAiResponse(aiText);
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to submit data");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <header>
        <h1>Social Media Insights Generator</h1>
      </header>
      <div className="wrapper">
        <div className="carousel-container">
          <Arrow clickFunction={previousSlide} glyph="&#9664;" />
          <ImageSlider url={images[currentImageIndex]} />
          <Arrow clickFunction={nextSlide} glyph="&#9654;" />
        </div>
        <SlideIndicators
          count={images.length}
          currentIndex={currentImageIndex}
          onDotClick={setCurrentImageIndex}
        />
        <UploadImage getFileFromUploadedImage={getFileFromImage} />
        <div className="caption-input">
          <label htmlFor="caption">Caption:</label>
          <input
            type="text"
            id="caption"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />
          <button className="submit-button" onClick={handleSubmit}>
            Get Insights
          </button>
        </div>
        {isLoading && <LoadingSpinner />}
        {aiResponse && (
          <div className="ai-response">
            <h3>AI Insights</h3>
            <p>{aiResponse}</p>
          </div>
        )}
      </div>
    </>
  );
};

export default App;
