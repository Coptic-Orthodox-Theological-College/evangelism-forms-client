import React from "react";

const WaveSvg = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    viewBox="0 24 150 28"
    preserveAspectRatio="none"
    className="svg"
  >
    <defs>
      <path
        id="gentle-wave"
        d="M-160 44c30 0 
        58-18 88-18s
        58 18 88 18 
        58-18 88-18 
        58 18 88 18
        v44h-352z"
      />
    </defs>
    <g className="waves">
      <use
        xlinkHref="#gentle-wave"
        x="50"
        y="0"
        fill="#05325f"
        fillOpacity=".3"
      />
      <use
        xlinkHref="#gentle-wave"
        x="50"
        y="3"
        fill="#3b71ca"
        fillOpacity=".3"
      />
      <use
        xlinkHref="#gentle-wave"
        x="50"
        y="6"
        fill="#fff"
        fillOpacity=".3"
      />
    </g>
  </svg>
);

export default WaveSvg;