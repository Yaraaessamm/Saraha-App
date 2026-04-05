import express from 'express';
import { authMiddleware } from "./common/middleware/auth.service.js";
import { authRouter, userOperationRouter } from './modules/userModule/user.controller.js';
import { connectionDB } from "./DB/connectionDB.js";
import { messageRouter } from './modules/messageModule/message.controller.js';
import cors from "cors"
import { allowOrigins, port } from './config/env.services.js';
import { connectRedis } from './DB/redis/redis.DB.js';
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";


const app = express()

const corsOptions = {
  origin: function (origin, callback) {
   if ([...allowOrigins,undefined].includes(origin)) {
    callback(null, true);
   }
    else {callback(new Error("Not allowed by CORS"));
   }
  },
};
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 60,
  requestPropertyName:"rateLimit",
  handler: (req, res,next) => {
   return res.status(400).json({ message: "Too many requests, please try again later." });
  },
  legacyHeaders: false,
});
export const bootStrap = () =>{
app.use(
  cors(corsOptions),
  express.json(),
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: false,
    crossOriginResourcePolicy: false,
    dnsPrefetchControl: false,
    frameguard: false,
    hidePoweredBy: false,
    hsts: false,
    ieNoOpen: false,
    noSniff: false,
    originAgentCluster: false,
    permittedCrossDomainPolicies: false,
    referrerPolicy: false,
    xssFilter: false,
  }),limiter,
);
app.get("/", (req, res) => res.send("Hello World!"));

connectionDB();
connectRedis();

app.use("/auth",authRouter);
app.use("/user",userOperationRouter);
app.use("/message", messageRouter);


app.use("/{*demo}", (req, res) => {
  res.send("Router not found");
});

  app.use((err, req, res, next) => {
    res
      .status(err.cause || 500)
      .json({ message: err.message, stack: err.stack });
  });
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
}