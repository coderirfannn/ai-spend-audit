import "server-only";

import mongoose from "mongoose";

const mongoUri = process.env.MONGODB_URI;
const mongoDbName = process.env.MONGODB_DB;

type MongoConnectionCache = {
  promise: Promise<typeof mongoose> | null;
  connection: typeof mongoose | null;
};

declare global {
  // eslint-disable-next-line no-var
  var __mongoConnectionCache: MongoConnectionCache | undefined;
}

const cachedConnection: MongoConnectionCache = global.__mongoConnectionCache ?? {
  promise: null,
  connection: null,
};

global.__mongoConnectionCache = cachedConnection;

function getMongoConfig(): { mongoUri: string; mongoDbName: string } {
  if (!mongoUri) {
    throw new Error("Missing MONGODB_URI environment variable.");
  }

  if (!mongoDbName) {
    throw new Error("Missing MONGODB_DB environment variable.");
  }

  return { mongoUri, mongoDbName };
}

export async function connectToDatabase(): Promise<typeof mongoose> {
  const { mongoUri: connectionUri, mongoDbName: databaseName } = getMongoConfig();

  if (cachedConnection.connection) {
    return cachedConnection.connection;
  }

  if (!cachedConnection.promise) {
    cachedConnection.promise = mongoose.connect(connectionUri, {
      dbName: databaseName,
      bufferCommands: false,
    });
  }

  cachedConnection.connection = await cachedConnection.promise;
  return cachedConnection.connection;
}

export async function disconnectFromDatabase(): Promise<void> {
  if (!cachedConnection.connection) {
    return;
  }

  await mongoose.disconnect();
  cachedConnection.connection = null;
  cachedConnection.promise = null;
}