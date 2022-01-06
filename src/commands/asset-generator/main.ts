import exec from '../build/utils/exec.ts';
import * as fs from 'https://deno.land/std/node/fs.ts';

export default async function generate({ logo = 'public/logo.png', manifest = 'public/manifest.json' }: { logo: string; manifest: string }): Promise<void> {
  fs.writeFileSync('public/_sculptr-pwa-assets-temp.html', '');
  const command = `npx pwa-asset-generator ${logo} public/icons --manifest ${manifest} --index public/_sculptr-pwa-assets-temp.html`;
  await exec(command);
  const res = fs.readFileSync('public/_sculptr-pwa-assets-temp.html', 'utf8');
  fs.unlinkSync('public/_sculptr-pwa-assets-temp.html');
  const links = res.split(`<head>`)[1].split(`</head>`)[0].trim().split('">').join('"/>');
  // check if theres a file at pages/_document.jsx
  const srcExists: boolean = fs.existsSync('src');

  if (!srcExists) await exec('mkdir ./src');

  const ext = fs.existsSync('pages/_app.jsx') ? 'jsx' : fs.existsSync('pages/_app.tsx') ? 'tsx' : fs.existsSync('pages/_app.ts') ? 'ts' : 'js';

  fs.writeFileSync(
    `src/PWAAssets.${ext}`,
    `import React from 'react';

  export default function PWAAssets()${ext.startsWith('ts') ? ': JSX.Element' : ''} {
    return (
      <>
        ${links}
      </>
    )
  }`,
  );

  await exec(`npx prettier --write src/PWAAssets.${ext}`);

  const documentExists: boolean = fs.existsSync(`pages/_document.${ext}`);
  if (!documentExists) {
    fs.writeFileSync(
      `pages/_document.${ext}`,
      `import React from 'react';
import { Html, Head, Main, NextScript } from 'next/document';
import PWAAssets from '../src/PWAAssets';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <link rel="shortcut icon" type="image/x-icon" href="./favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="icons/apple-icon-180.png" />
        <PWAAssets />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}`,
    );
  } else {
    let doc = fs.readFileSync(`pages/_document.${ext}`, 'utf8');
    if (!doc.includes('<PWAAssets />')) {
      if (!doc.includes('PWAAssets')) doc = `import PWAAssets from '../src/PWAAssets';\n` + doc;

      if (!doc.includes('Head')) {
        if (doc.includes("} from 'next/document'")) doc = doc.replace(`} from 'next/document'`, `,Head } from 'next/document'`);
        else if (doc.includes(" from 'next/document'")) doc = doc.replace(` from 'next/document'`, `, { Head } from 'next/document'`);
        else doc = 'import { Head } from "next/document";\n' + doc;
      }

      if (doc.includes('</Head>')) {
        doc = doc.replace(/<\/Head>/, `<PWAAssets />\n</Head>`);
      } else {
        doc = doc.replace(/<Html lang="en">/, `<Html lang="en"><Head><PWAAssets /></Head>`);
      }
    }

    doc = doc.split('{" "}').join('');

    fs.writeFileSync(`pages/_document.${ext}`, doc);
  }

  await exec(`npx prettier --write pages/_document.${ext}`);
}
