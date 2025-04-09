// api/frame.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { songsByDecade, Song } from '../src/data.js'; // Import data and Song type

// Helper function to select a random item
function getRandomElement<T>(arr: T[] | undefined): T | null {
    if (!arr || arr.length === 0) {
        return null;
    }
    return arr[Math.floor(Math.random() * arr.length)];
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // --- Correctly construct base URLs ---
    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const host = req.headers['x-forwarded-host'] || req.headers.host; // Fallback for local dev
    // FIX: Use correct template literal syntax for appUrl
    const appUrl = `${protocol}://${host}`;
    const frameApiUrl = `${appUrl}/api/frame`; // URL for this endpoint itself
    // FIX: Use correct template literal syntax for imageUrl.
    // REMINDER: Ensure 'og_image.png' exists in your /public folder!
    // const imageUrl = `${appUrl}/og_image.png`; // Comment out or delete old line
    const imageUrl = "/og_image.png"; // Use a relative path starting with /

    try {
        if (req.method === 'POST') {
            const body = req.body;
            const buttonIndex = body?.untrustedData?.buttonIndex;

            let decadeKey: keyof typeof songsByDecade | null = null;
            if (buttonIndex === 1) decadeKey = '50s';
            else if (buttonIndex === 2) decadeKey = '60s';
            else if (buttonIndex === 3) decadeKey = '70s';
            else if (buttonIndex === 4) decadeKey = '80s';
            else if (buttonIndex === 5) decadeKey = '90s';
            else if (buttonIndex === 6) decadeKey = '00s';
            else if (buttonIndex === 7) decadeKey = '10s';

            let song: Song | null = null;
            if (decadeKey && songsByDecade[decadeKey]) {
                const decadeSongs: Song[] | undefined = songsByDecade[decadeKey];
                song = getRandomElement<Song>(decadeSongs);
            }

            let htmlResponse = '';
            if (song && decadeKey) {
                // --- Response with Song ---
                // FIX: Use correct template literal syntax and standard YouTube URL
                const youtubeUrl = `https://www.youtube.com/watch?v=${song.youtubeId}`;

                // FIX: Cleaned up HTML structure, added missing spaces, corrected variable syntax
                htmlResponse = `
                    <!DOCTYPE html>
                    <html><head>
                        <title>Throwback Tunes: ${song.title}</title>
                        <meta property="og:title" content="${decadeKey} Pick: ${song.title}" />
                        <meta property="fc:frame" content="vNext" />
                        <meta property="fc:frame:image" content="${imageUrl}" />
                        <meta property="og:image" content="${imageUrl}" />
                        <meta property="fc:frame:post_url" content="${frameApiUrl}" />
                        <meta property="fc:frame:button:1" content="Listen: ${song.artist} - ${song.title}" />
                        <meta property="fc:frame:button:1:action" content="link" />
                        <meta property="fc:frame:button:1:target" content="${youtubeUrl}" />
                        <meta property="fc:frame:button:2" content="Try ${String(decadeKey)} Again" />
                    </head><body>Recommended: ${song.title} by ${song.artist}</body></html>
                `;
            } else {
                // --- Error or Go Back Response (Same as Initial Frame) ---
                // Pass correct variables to the helper function
                htmlResponse = generateInitialFrameHtml(frameApiUrl, imageUrl);
            }
            res.setHeader('Content-Type', 'text/html');
            res.status(200).send(htmlResponse);

        } else if (req.method === 'GET') {
            // Process the initial GET request
            // Pass correct variables to the helper function
            const initialHtml = generateInitialFrameHtml(frameApiUrl, imageUrl);
            res.setHeader('Content-Type', 'text/html');
            res.status(200).send(initialHtml);

        } else {
            res.setHeader('Allow', ['GET', 'POST']);
            res.status(405).send('Method Not Allowed');
        }
    } catch (error) {
        console.error("Error in frame handler:", error);
        res.status(500).send('Error generating frame');
    }
}

// Helper function to generate the initial Frame HTML
function generateInitialFrameHtml(postUrl: string, imageUrl: string): string {
    // FIX: Cleaned up HTML structure, corrected variable syntax, added missing buttons
    return `
        <!DOCTYPE html>
        <html><head>
            <title>Throwback Tunes Frame</title>
            <meta property="og:title" content="Throwback Tunes Frame" />
            <meta property="fc:frame" content="vNext" />
            <meta property="fc:frame:image" content="${imageUrl}" />
            <meta property="og:image" content="${imageUrl}" />
            <meta property="fc:frame:post_url" content="${postUrl}" />
            <meta property="fc:frame:button:1" content="50s" />
            <meta property="fc:frame:button:2" content="60s" />
            <meta property="fc:frame:button:3" content="70s" />
            <meta property="fc:frame:button:4" content="80s" />
            <meta property="fc:frame:button:5" content="90s" />
            <meta property="fc:frame:button:6" content="00s" />
            <meta property="fc:frame:button:7" content="10s" />
        </head><body>
            <h1>Throwback Tunes Frame</h1>
            <p>Cast this URL on Farcaster!</p>
        </body></html>
    `;
}