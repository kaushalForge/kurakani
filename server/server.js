// import env
import dotenv from "dotenv";
dotenv.config();

// import necessary libraries
import express from "express";
import cors from "cors";

// setup app
const app = express();

// const allowedOrigins = ["http://localhost:3000", "http://192.168.1.65:3000"];

// app.use(
//   cors({
//     origin: function (origin, callback) {
//       if (!origin) return callback(null, true);
//       if (allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     credentials: true, // allow cookies/auth headers
//   })
// );

app.use(cors({ origin: "*", credentials: true }));

// parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// import routes
import homeRoute from "./routes/homeRoute.js";
import userRoute from "./routes/userRoute.js";

// handle routing
app.use("/", homeRoute);
app.use("/api/user", userRoute);

// start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on port:", PORT);
});
