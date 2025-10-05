/**
 * File Cleaner to Fix Duplication Issues
 * 
 * This script can be used to check for and remove duplicate HTML closing tags
 * and other repeated content in HTML files.
 */

// Function to check if a file has duplicate closing tags
function checkForDuplicateClosingTags(htmlContent) {
    // Count number of </body> tags
    const bodyClosingCount = (htmlContent.match(/<\/body>/g) || []).length;
    // Count number of </html> tags
    const htmlClosingCount = (htmlContent.match(/<\/html>/g) || []).length;
    
    return {
        hasDuplicateBody: bodyClosingCount > 1,
        hasDuplicateHtml: htmlClosingCount > 1,
        bodyCount: bodyClosingCount,
        htmlCount: htmlClosingCount
    };
}

// Function to clean up duplicate content
function cleanHtmlFile(htmlContent) {
    // Keep only the first </body> and first </html> tag
    let cleanedContent = htmlContent;
    
    // Find first occurrence of </body>
    const firstBodyClosing = htmlContent.indexOf('</body>');
    if (firstBodyClosing > 0) {
        // Get everything up to and including the first </body> tag
        cleanedContent = htmlContent.substring(0, firstBodyClosing + 7);
        // Add closing HTML tag
        cleanedContent += '\n</html>';
    }
    
    return cleanedContent;
}

// Example usage (for demonstration purposes)
// In a real environment, you'd use this with file system operations
console.log(`
How to use:
1. Copy the content of a duplicated HTML file
2. Call checkForDuplicateClosingTags(htmlContent) to check if there are duplicates
3. If duplicates are found, call cleanHtmlFile(htmlContent) to clean it
4. Save the cleaned content back to the file
`);
