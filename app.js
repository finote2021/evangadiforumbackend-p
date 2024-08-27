const express = require("express");
const dbConnection = require("./dbConfig");
require("dotenv").config();
const path = require("path");
const app = express();
const PORT = process.env.PORT;
const cors = require("cors");

// Import routes
const userRoutes = require("./routes/userRoute");
const answerRoutes = require("./routes/answerRoute");
const questionRoutes = require("./routes/questionRoute");

// JSON middleware to extract JSON data
app.use(express.json());
const corsOptions = {
  origin: "http://localhost:5173", // Replace with the allowed origin
};

app.use(cors(corsOptions));


//user routes middleware file
app.use("/api/user", userRoutes);

// Question routes middleware
app.use("/api/question", questionRoutes);

// Answers routes middleware
app.use("/api/answer", answerRoutes);

// Catch-all handler for all other routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

const start = async () => {
  try {
    const result = await dbConnection.execute("select 'test' ");
    app.listen(PORT);
    console.log("Database connection established.");
  
    console.log(`Listening on http://localhost:${PORT}`);
  } catch (error) {
    console.log(error.message);
  }
};

start();
