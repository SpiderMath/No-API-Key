import express from "express";

const app = express();

app.listen(process.env.port || 6969, () => console.log(`Listening for API calls on Port: ${process.env.port || 6969}`));