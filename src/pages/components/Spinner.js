import React from 'react';

const Spinner = () => {
  return (
    <div className="grid-container">
      <div className="sk-cube-grid">
        {[...Array(9).keys()].map(i => (
          <div key={i} className={`sk-cube sk-cube-${i + 1}`}></div>
        ))}
      </div>
    </div>
  );
}

export default Spinner;
