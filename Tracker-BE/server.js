import http from "http";
import https from "https";
import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import ip from "ip";
import frameGuard from "frameguard";
import passport from "passport";
import cors from "cors";

import dotenv from "dotenv";
import databaseConnect from "@/database/connection";
import config from "@/config";
import routes from "@/routes";
import morgan from "morgan";

const app = express();

app.use(
  cors({
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    origin: ["http://localhost:5173", "http://localhost:3000"],
  })
);

app.use(bodyParser.urlencoded({ extended: true, limit: "16kb" }))
app.use(bodyParser.json({ limit: "16kb" }))
app.use(cookieParser())
app.use(frameGuard({ action: "sameorigin" }));
app.use(morgan("dev"))

app.use(passport.initialize());
require("./security/passport").userAuthMiddleware(passport);

const serverIP = ip.address();
console.log("\x1b[91mDo not populate clientId field anywhere...");
console.log(`\x1b[95mSERVER IP: ${serverIP}`);

app.get("/", (req, res) => res.json({ status: "UP", message: "Server runs" }));
app.use("/api", routes);

const server = http.createServer(app);

databaseConnect((isConnect) => {
  if (isConnect) {
    server.listen(config.PORT, () => {
      console.log(`\x1b[33mServer runs in port ${config.PORT}...`);
      console.log(`\x1b[38;5;201mAPI HOST - http://${serverIP}:${config.PORT} or http://127.0.0.1:${config.PORT} or ${config.API_HOST} \n`);
    });
  }
});

module.exports = server;



