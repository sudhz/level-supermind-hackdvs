import React from 'react';

const SlideIndicators = ({ count, currentIndex, onDotClick }) => {
  return (
    <div className="slide-indicators">
      {[...Array(count)].map((_, index) => (
        <button
          key={index}
          className={`dot ${currentIndex === index ? 'active' : ''}`}
          onClick={() => onDotClick(index)}
        />
      ))}
    </div>
  );
};

export default SlideIndicators; 