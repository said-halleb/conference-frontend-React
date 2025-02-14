// components/Banner.js
import React from 'react';
import './Banner.scss'; 

const Banner = ({ title, backgroundImage }) => {
  return (
    <div className="banner" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <h1 className="banner-title">{title}</h1>
    </div>
  );
};

export default Banner;
