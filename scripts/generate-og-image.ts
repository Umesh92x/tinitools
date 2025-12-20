import sharp from 'sharp';
import { join } from 'path';

async function generateOGImage() {
  const width = 1200;
  const height = 630;
  const padding = 40;
  
  try {
    // Create a new image with a gradient background
    const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#4F46E5;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#7C3AED;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grad)"/>
        <text x="${padding}" y="${height/2 - 60}" 
              font-family="Arial" font-size="72" font-weight="bold" fill="white">
          TiniTools
        </text>
        <text x="${padding}" y="${height/2 + 20}" 
              font-family="Arial" font-size="36" fill="white" opacity="0.9">
          Free Online Utilities &amp; Tools Collection
        </text>
      </svg>
    `;

    // Convert SVG to PNG
    await sharp(Buffer.from(svg))
      .toFile(join(process.cwd(), 'public', 'og-image.jpg'));

    console.log('OG image generated successfully!');
  } catch (error) {
    console.error('Error generating OG image:', error);
  }
}

generateOGImage(); 