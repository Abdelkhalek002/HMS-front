import React from 'react';
import { Helmet } from 'react-helmet';
import notFound from '../../images/notfound.jpg';

export default function NotFound() {
  return (
    <>
      <Helmet>
        <title>Not Found</title>
        <meta name="description" content="HSH application" />
      </Helmet>
      <div className="err-img" style={{ display: "flex", justifyContent: "center", marginTop: "30px" }}>
        <img src={notFound} alt="notFound" style={{ height: "600px", width: "600px", maxWidth: "100%" }} />
      </div>
    </>
  );
}
