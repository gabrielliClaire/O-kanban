// Load environnement variables
require("dotenv/config");

// Third party dependencies
const express = require("express");
const cors = require("cors");

// Local dependencies
const router = require("./app/router");

// Create app
const app = express();

// Add CORS middleware
app.use(cors("*")); // On allègue la politique des Cross Origin Request afin que n'importe quel front puisse appeler notre backend

// Serve front assets
app.use(express.static("dist"));


// Add body parsers
app.use(express.urlencoded({ extended: true })); // Body encoded : x-www-urlencoded
app.use(express.json()); // Body encoded : application/json

// Plug router
app.use(router);

// Start application
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Listening at http://localhost:${PORT}`);
});
