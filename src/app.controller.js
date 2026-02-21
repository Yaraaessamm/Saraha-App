import express from 'express';
import { authMiddleware } from "./common/middleware/auth.service.js";
import { authRouter, userOperationRouter } from './modules/userModule/user.controller.js';
import { connectionDB } from "./DB/connectionDB.js";
import cors from "cors"
const app = express()
const port = 3000

export const bootStrap = () =>{
app.use(cors(),express.json());
app.get("/", (req, res) => res.send("Hello World!"));

connectionDB();

app.use("/auth",authRouter);
app.use("/user", authMiddleware,userOperationRouter);



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