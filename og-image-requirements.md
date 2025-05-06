# OG Image Requirements for Social Sharing

## Optimal Specifications

Create an optimized image for social media sharing that meets these specifications:

1. **Dimensions**: 1200×630 pixels
   - This is the optimal size for Facebook, LinkedIn, and Twitter

2. **File Format**: WebP or JPEG
   - WebP for modern browsers with JPEG fallback
   - Maximum file size: 250KB

3. **Content**:
   - Include the Softworks Trading Company logo prominently
   - Use the neural network brain-tree visual as a background element
   - Add the tagline: "Automate Your Business With Practical AI Solutions"
   - Use brand colors: Deep Navy (#0A2A43) and Cyan accent (#00BCD4)

4. **Technical Requirements**:
   - Must be served over HTTPS
   - Should include proper ALT text in the meta tags
   - Must have width and height specified in OG tags
   - Should be properly cached with appropriate headers

5. **Placement**:
   - Save to: `/public/images/og-hero-image.jpg`
   - Reference in HTML with absolute URL: `https://www.softworkstrading.com/images/og-hero-image.jpg`

## Implementation Notes

The OG image is critical for achieving high engagement rates on social media. When users share your content, this image will appear in their social feeds, making it a key brand asset.

To generate this image:
1. Use the existing brand assets as a base
2. Ensure text is readable at smaller sizes (when previewed in social media feeds)
3. Test the image with the [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/), [Twitter Card Validator](https://cards-dev.twitter.com/validator), and [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)

After implementation, update the head tags to reference this new optimized image.