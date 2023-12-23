import mongoose from "mongoose";
import { afterEach, describe, expect, it, vi } from "vitest";
import { connectToDatabase, disconnectDatabase } from "./database";

vi.mock("mongoose");

describe("database", () => {
  afterEach(() => {
    vi.resetAllMocks();
  });
  describe("connectToDatabase", () => {
    it("should connect to database", async () => {
      process.env.MONGO_URL = "mongodb://localhost:27017/test";

      vi.mocked(mongoose.connect).mockImplementationOnce(
        () =>
          ({
            connection: {
              host: "localhost",
            },
          }) as any
      );

      vi.mocked(mongoose).connections = [
        {
          readyState: 0,
        },
      ] as any;

      const consoleMock = vi
        .spyOn(console, "log")
        .mockImplementationOnce(() => undefined);

      await connectToDatabase();

      expect(consoleMock).toHaveBeenLastCalledWith(
        "MongoDB connected: localhost"
      );

      expect(mongoose.connect).toBeCalledTimes(1);
    });

    it("should throw an error if MONGO_URL is not founded", async () => {
      process.env.MONGO_URL = "";

      await expect(connectToDatabase()).rejects.toThrow(
        "MONGO_URL not founded"
      );
    });

    it("not start connection if mongoose.connections[0].readyState is truthy", async () => {
      process.env.MONGO_URL = "mongodb://localhost:27017/test";

      vi.mocked(mongoose.connect).mockImplementationOnce(
        () =>
          ({
            connection: {
              host: "localhost",
            },
          }) as any
      );

      vi.mocked(mongoose).connections = [
        {
          readyState: 1,
        },
      ] as any;

      await connectToDatabase();

      expect(mongoose.connect).not.toBeCalled();
    });
  });

  describe("disconnectDatabase", () => {
    it("should disconnect from database", async () => {
      mongoose.connection.close = vi.fn();

      await disconnectDatabase();

      expect(mongoose.connection.close).toBeCalledTimes(1);
    });

    it("should stop mongod if it's running", async () => {
      const close = vi.fn();
      mongoose.connection.close = close;

      close.mockRejectedValueOnce(new Error("error"));

      const consoleMock = vi.spyOn(console, "log");

      await disconnectDatabase().catch((e) => {
        expect(consoleMock).toHaveBeenLastCalledWith(e);
      });

      expect(mongoose.connection.close).toBeCalledTimes(1);
    });
  });
});
