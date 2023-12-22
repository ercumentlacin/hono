import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongod: MongoMemoryServer;

export const connectToDatabase = async () => {
  try {
    if (!process.env.MONGO_URL) {
      throw new Error("MONGO_URL not founded");
    }

    let dbUrl = process.env.MONGO_URL;
    const isTestingEnv = process.env.NODE_ENV === "test";

    if (isTestingEnv) {
      mongod = await MongoMemoryServer.create();
      dbUrl = mongod.getUri();
    }

    const { connections }  = mongoose;

    if (connections[0].readyState) return;

    const connection = await mongoose.connect(dbUrl);

    console.log(`MongoDB connected: ${connection.connection.host}`);
  } catch (err) {
    console.log("connectToDatabase error",err);

    process.exit(1);
  }
};

export const disconnectDatabase = async () => {
  try {
    await mongoose.connection.close();
    if (mongod) {
      await mongod.stop();
    }
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};
