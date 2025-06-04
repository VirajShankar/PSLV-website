require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
connectDB();

// Routes
app.use("/api", require("./routes/api"));

// Define a different default port to avoid conflicts
const PORT = process.env.PORT || 5055;

// Start Server with error handling
const startServer = () => {
    const server = app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
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

// Display environment info
console.log("🔧 Environment:", process.env.NODE_ENV || 'development');
console.log("🔌 Using Port:", process.env.PORT || PORT);
