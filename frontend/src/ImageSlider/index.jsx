import React, { useState, useEffect } from "react";
import "./index.css";
import Modal from "../Modal";

const defaultImg =
  "https://images.unsplash.com/photo-1612178537253-bccd437b730e?q=80&w=1000&auto=format&fit=crop";

const ImageSlide = ({ url }) => {
  const [imgClicked, setImageClicked] = useState("");
  const [isShowModal, setIsShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const img = new Image();
    img.src = url;
    img.onload = () => {
      setIsLoading(false);
    };
  }, [url]);

  const imageClicked = (e) => {
    setImageClicked(e.target.src);
    setIsShowModal(true);
  };

  return (
    <>
      {isShowModal && (
        <Modal imageUrl={imgClicked} closeModal={() => setIsShowModal(false)} />
      )}
      <div
        onClick={imageClicked}
        className={`image-container ${isLoading ? "loading" : ""}`}
      >
        <img
          className="image-slide"
          src={url}
          alt="carousel slide"
          style={{ opacity: isLoading ? 0 : 1 }}
        />
      </div>
    </>
  );
};

export default ImageSlide;
