import { Connection, createConnection, getConnectionOptions } from "typeorm";
import dotenv from "dotenv";
dotenv.config();

export default async (): Promise<Connection> => {
  const defafultOptions = await getConnectionOptions();

  const isTest = process.env.JEST_WORKER_ID;
  const databasePath = isTest
    ? "./src/database/database.test.sqlite"
    : defafultOptions.database;

  return createConnection(
    Object.assign(defafultOptions, {
      database: databasePath,
    })
  );
};
