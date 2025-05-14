const fs = require('fs');
const { createCanvas, loadImage } = require('canvas');

// Function to create a white version of the logo
async function createWhiteLogo() {
  try {
    // Path to the original logo
    const originalLogoPath = 'client/public/assets/images/logo/logo.png';
    
    // Check if original logo exists
    if (!fs.existsSync(originalLogoPath)) {
      console.log('Original logo not found at:', originalLogoPath);
      
      // Try alternative path
      const altPath = 'attached_assets/logo.png';
      if (fs.existsSync(altPath)) {
        console.log('Using logo from attached_assets');
        fs.copyFileSync(altPath, originalLogoPath);
      } else {
        console.error('No logo file found');
        return;
      }
    }
    
    // Load the original logo
    const image = await loadImage(originalLogoPath);
    
    // Create a canvas with the same dimensions as the image
    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext('2d');
    
    // Draw the image onto the canvas
    ctx.drawImage(image, 0, 0, image.width, image.height);
    
    // Get the image data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    // Convert to white (keeping transparency)
    for (let i = 0; i < data.length; i += 4) {
      // Check if pixel is not transparent
      if (data[i + 3] > 0) {
        // Get the average of RGB values to determine brightness
        const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
        
        // If pixel is darker (like text or outlines), make it white
        // If it's already bright (like cyan), keep it as is
        if (brightness < 200) {
          data[i] = 255; // R
          data[i + 1] = 255; // G
          data[i + 2] = 255; // B
        }
      }
    }
    
    // Put the modified image data back on the canvas
    ctx.putImageData(imageData, 0, 0);
    
    // Save the white version of the logo
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync('client/public/assets/images/logo/logo-white.png', buffer);
    
    console.log('White logo created successfully');
  } catch (error) {
    console.error('Error creating white logo:', error);
  }
}

createWhiteLogo();