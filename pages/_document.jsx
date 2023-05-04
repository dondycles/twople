import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <title>Twouple | Know each other more</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Acme&display=swap"
          rel="stylesheet"
        />
        <script type="text/javascript" src="/qr/jquery.min.js" />
        <script type="text/javascript" src="/qr/qrcode.js" />
        <script src="https://cdn.jsdelivr.net/npm/es6-promise@4/dist/es6-promise.min.js" />
        <script src="https://cdn.jsdelivr.net/npm/es6-promise@4/dist/es6-promise.auto.min.js" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
