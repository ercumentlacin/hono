import { StatusCodes } from "http-status-codes";
import { describe, expect, it } from "vitest";
import { app } from "../..";

describe("authApp", () => {
  describe("POST /register", () => {
    it('should return success false when request is bad with "Username is required"', async () => {
      const res = await app.request("/api/auth/register", {
        method: "POST",
      });
      expect(res.status).toBe(StatusCodes.BAD_REQUEST);
      expect(await res.json()).toMatchObject({
        success: false,
        message: "Username is required",
      });
    });

    it('should return success false when request is bad with "Password is required"', async () => {
      const formData = new FormData();
      formData.append("username", "test");
      const res = await app.request("/api/auth/register", {
        method: "POST",
        body: formData,
      });
      expect(res.status).toBe(StatusCodes.BAD_REQUEST);
      expect(await res.json()).toMatchObject({
        success: false,
        message: "Password is required",
      });
    });
    it('should return success false when request is bad with "Email is required"', async () => {
      const formData = new FormData();
      formData.append("username", "test");
      formData.append("password", "test");
      const res = await app.request("/api/auth/register", {
        method: "POST",
        body: formData,
      });
      expect(res.status).toBe(StatusCodes.BAD_REQUEST);
      expect(await res.json()).toMatchObject({
        success: false,
        message: "Email is required",
      });
    });

    it("should create a user and return success true", async () => {
      const formData = new FormData();
      formData.append("username", "test");
      formData.append("password", "test");
      formData.append("email", "test@mail.com");
      const res = await app.request("/api/auth/register", {
        method: "POST",
        body: formData,
      });

      expect(res.status).toBe(StatusCodes.CREATED);
    });
  });

  describe("POST /login", () => {
    it('should return success false when request is bad with "Password is required"', async () => {
      const formData = new FormData();
      formData.append("email", "test@mail.com");
      const res = await app.request("/api/auth/login", {
        method: "POST",
        body: formData,
      });
      expect(res.status).toBe(StatusCodes.BAD_REQUEST);
      expect(await res.json()).toMatchObject({
        success: false,
        message: "Password is required",
      });
    });

    it('should return success false when request is bad with "Email is required"', async () => {
      const formData = new FormData();
      formData.append("password", "test");
      const res = await app.request("/api/auth/login", {
        method: "POST",
        body: formData,
      });
      expect(res.status).toBe(StatusCodes.BAD_REQUEST);
      expect(await res.json()).toMatchObject({
        success: false,
        message: "Email is required",
      });
    });

    it("should return success false when user not found", async () => {
      const formData = new FormData();
      formData.append("email", "test@mail.com");
      formData.append("password", "test");
      const res = await app.request("/api/auth/login", {
        method: "POST",
        body: formData,
      });
      const json = await res.json();

      if (
        typeof json === "object" &&
        json !== null &&
        Object.keys(json).length > 0 &&
        Object.hasOwnProperty.call(json, "token")
      ) {
        expect(res.status).toBe(StatusCodes.OK);
        expect(json).toMatchObject({
          token: expect.any(String),
        });
      } else {
        expect(res.status).toBe(StatusCodes.NOT_FOUND);
        expect(json).toMatchObject({
          success: false,
          message: "User not found",
        });
      }
    });
  });
});
