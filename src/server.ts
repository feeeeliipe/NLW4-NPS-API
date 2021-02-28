import { app } from "./app";

import dotenv from "dotenv";
dotenv.config();

const port = process.env.PORT;
app.listen(port, () => {
  console.log("Enviroment: ", process.env.NODE_ENV);
  console.info(`[Server]: Net Promoter Score API is running on port: ${port}`);
});
