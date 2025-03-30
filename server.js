const express = require('express');
const path = require('path');

// Create Express app
const app = express();

// Define port
const PORT = process.env.PORT || 5055;

// Serve static files from the root directory
app.use(express.static(path.join(__dirname)));

// Redirect all routes to index.html for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server with error handling
const startServer = () => {
  const server = app.listen(PORT, () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
    console.log(`📂 Open your browser and navigate to http://localhost:${PORT}`);
  });

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`❌ Port ${PORT} is already in use. Trying alternative port...`);
      // Try using a different port
      const newPort = parseInt(PORT) + 1;
      console.log(`🔄 Attempting to use port ${newPort} instead...`);
      
      // Update the PORT variable for future use
      process.env.PORT = newPort;
      
      // Retry with new port
      setTimeout(() => {
        server.close();
        startServer();
      }, 1000);
    } else {
      console.error('❌ Server Error:', error.message);
    }
  });
};

// Initialize server
startServer();
