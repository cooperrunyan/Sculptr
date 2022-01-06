import React from 'react';
import Head from 'next/head';

import '../style/base.scss';
import '../style/index.scss';

function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>New Sculptr App</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1, minimum-scale=1" />
        <meta name="description" content="DESCRIPTION" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default App;
