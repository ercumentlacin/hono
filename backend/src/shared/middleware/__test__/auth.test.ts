import { Hono } from "hono";
import { sign } from "hono/jwt";
import { StatusCodes } from "http-status-codes";
import { describe, expect, it, vi } from "vitest";
import { CustomHttpException } from "../../../helpers/CustomHttpException";
import { authenticateToken } from "../auth";

const mocks = vi.hoisted(() => ({
  getCookie: vi.fn(),
}));

const app = new Hono();
app.onError((err, c) => {
  console.log({ err });
  let message = "something went wrong";
  let status = 500;

  if (err instanceof CustomHttpException) {
    message = err.message;
    status = err.status;
  }

  return c.json(
    {
      success: false,
      message,
    },
    status
  );
});

app.use("*", authenticateToken);

app.get("/authenticateToken", (c) => c.text("authenticateToken"));

describe("authenticateToken", () => {
  it("should be defined", () => {
    expect(authenticateToken).toBeDefined();
  });

  it("should throw an error when token not found", async () => {
    const error = new CustomHttpException(
      "Token not found",
      StatusCodes.UNAUTHORIZED
    );
    const res = await app.request("/authenticateToken");
    const json = await res.json();
    expect(json).haveOwnProperty("success");
    expect(json).haveOwnProperty("message");
    if (typeof json === "object" && json !== null && Object.keys(json)) {
      if ("success" in json && "message" in json) {
        expect(json.success).toBe(false);
        expect(json.message).toBe(error.message);
      }
    }
  });

  it("should throw an error when JWT_SECRET not found", async () => {
    vi.mock("hono/cookie", async (importActual) => {
      const actual = await importActual<typeof import("hono/cookie")>();
      return {
        ...actual,
        getCookie: mocks.getCookie,
      };
    });

    delete process.env.JWT_SECRET;

    const error = new CustomHttpException(
      "process.env.JWT_SECRET is required",
      StatusCodes.UNAUTHORIZED
    );

    const payload = {
      sub: "user123",
      role: "admin",
    };
    const secret = "mySecretKey";
    const token = await sign(payload, secret);

    mocks.getCookie.mockImplementationOnce(() => token);

    const res = await app.request("/authenticateToken");
    const json = await res.json();
    expect(json).haveOwnProperty("success");
    expect(json).haveOwnProperty("message");
    if (typeof json === "object" && json !== null && Object.keys(json)) {
      if ("success" in json && "message" in json) {
        expect(json.success).toBe(false);
        expect(json.message).toBe(error.message);
      }
    }
  });

  it("should throw an error when token is invalid", async () => {
    vi.mock("hono/cookie", async (importActual) => {
      const actual = await importActual<typeof import("hono/cookie")>();
      return {
        ...actual,
        getCookie: mocks.getCookie,
      };
    });

    const error = new CustomHttpException(
      "Token is invalid",
      StatusCodes.UNAUTHORIZED
    );

    const payload = {
      sub: "user123",
      role: "admin",
    };
    const secret = "mySecretKey";
    const token = await sign(payload, secret);
    process.env.JWT_SECRET = "asd";

    mocks.getCookie.mockImplementationOnce(() => token);

    const res = await app.request("/authenticateToken");
    const json = await res.json();
    expect(json).haveOwnProperty("success");
    expect(json).haveOwnProperty("message");
    if (typeof json === "object" && json !== null && Object.keys(json)) {
      if ("success" in json && "message" in json) {
        expect(json.success).toBe(false);
        expect(json.message).toBe(error.message);
      }
    }
  });
});
