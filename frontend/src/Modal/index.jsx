import React from "react";
import "./index.css";
const Modal = ({ imageUrl, closeModal }) => {
  return (
    <>
      <div className="modal" onClick={closeModal}>
        <div className="modal-container">
          <img className="modal-icon" src={imageUrl || ""} alt="none" />
        </div>
      </div>
    </>
  );
};

export default Modal;
