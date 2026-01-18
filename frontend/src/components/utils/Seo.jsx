import React from 'react';
import { Helmet } from 'react-helmet-async';

const Seo = ({ title, description, type = 'website' }) => {
  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{title} | DocAppoint</title>
      <meta name='description' content={description} />
      
      {/* Facebook / Open Graph (Crucial for social sharing) */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      
      {/* Twitter Cards */}
      <meta name="twitter:creator" content="@docappoint" />
      <meta name="twitter:card" content="summary_large_image" />
    </Helmet>
  );
};

export default Seo;