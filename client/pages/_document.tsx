import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
    render() {
        return (
            <Html lang='en'>
                <Head>
                    <link rel='icon' href='/arcade/favicon.png' />
                    {/* <link rel='apple-touch-icon' href='logoManifest.png' /> */}
                    {/* <link rel='manifest' href='manifest.json' /> */}
                    <link rel='preconnect' href='https://fonts.gstatic.com' />
                    <link href='https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap' rel='stylesheet' />
                    <script type='module' src='/arcade/canvas.js'></script>
                </Head>
                <body>
                    <canvas width='1920' height='1080'></canvas>
                    <div id='modal-root' />
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

export default MyDocument;
