/* eslint-disable @typescript-eslint/naming-convention */
import bcrypt from "bcrypt";
import { StatusCodes } from "http-status-codes";
import { Mock, beforeEach, describe, expect, it, vi } from "vitest";
import { ZodError } from "zod";
import { CustomHttpException } from "../../helpers/CustomHttpException";
import { User } from "../user/model";
import {
  checkUserExists,
  comparePassword,
  createToken,
  defaultHook,
  handleLogin,
  handleRegister,
  hashPassword,
  insertUser,
} from "./handlers";

const UserModelMock = vi.hoisted(() => {
  const Model = {
    findOne: vi.fn(),
    save: vi.fn(),
    create: vi.fn(),
  };
  return Model as unknown as typeof User;
});

describe("auth handlers", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe("handleRegister", () => {
    describe("check user", () => {
      it("should return null or undefined if user not exists", async () => {
        const email = "test@mail.com";
        const username = "test";
        (UserModelMock.findOne as Mock).mockReturnValue(null);
        const user = await checkUserExists(
          [{ email }, { username }],
          UserModelMock
        );

        expect(UserModelMock.findOne).toBeCalledTimes(1);
        expect(user).toBeNull();
      });

      it("should return user if user exists", async () => {
        const email = "test@mail.com";
        const username = "test";
        const user = {
          email,
          username,
        };
        (UserModelMock.findOne as Mock).mockReturnValue(user);
        const userExists = await checkUserExists(
          [{ email }, { username }],
          UserModelMock
        );

        expect(UserModelMock.findOne).toBeCalledTimes(1);
        expect(userExists).toEqual(user);
      });
    });

    it("should return hashed password", async () => {
      const password = "test";
      vi.spyOn(bcrypt, "hash").mockImplementation(() => "hashedPassword");
      const hashedPassword = await hashPassword(password);
      expect(hashedPassword).not.toEqual(password);
    });

    describe("insertUser", () => {
      it("should create user and return them", async () => {
        const username = "test";
        const email = "test@mail.com";
        const password = "test";
        const hashedPassword = await hashPassword(password);

        (UserModelMock.create as unknown as Mock).mockReturnValue({
          save: vi.fn(),
          username,
          email,
          password: hashedPassword,
        });
        const user = await insertUser({
          username,
          email,
          hashedPassword,
          User: UserModelMock,
        });

        expect(UserModelMock.create).toBeCalledTimes(1);
        expect(user.username).toEqual(username);
        expect(user.email).toEqual(email);
        expect(user.password).toEqual(hashedPassword);
      });

      it("should throw an error if user not created", async () => {
        const username = "test";
        const email = "test@mail.com";
        const password = "test";
        const hashedPassword = await hashPassword(password);

        (UserModelMock.create as unknown as Mock).mockReturnValue(null);
        try {
          await insertUser({
            username,
            email,
            hashedPassword,
            User: UserModelMock,
          });
        } catch (error) {
          expect(error).toBeInstanceOf(CustomHttpException);
          if (error instanceof CustomHttpException) {
            expect(error.message).toEqual("Something went wrong");
          }
        }
      });
    });

    describe("create a token", () => {
      it("should return a token", async () => {
        const user = {
          _id: "123",
        } as any;
        process.env.JWT_SECRET = "test";
        const token = await createToken(user);
        expect(token).toBeDefined();
      });

      it("should throw an error if JWT_SECRET is not defined", async () => {
        const user = {
          _id: "123",
        } as any;
        process.env.JWT_SECRET = "";
        await expect(createToken(user)).rejects.toThrow();
      });
    });

    it("should return a token", async () => {
      const email = "test@mail.com";
      const username = "test";
      const user = {
        email,
        username,
      };
      const _checkUserExists = vi.fn().mockReturnValue(null);
      const _createToken = vi.fn().mockReturnValue("token");
      const _hashedPassword = vi.fn().mockReturnValue("hashedPassword");
      const _insertUser = vi.fn().mockReturnValue({
        ...user,
        _id: "123",
      });

      try {
        const { token } = await handleRegister({
          email: "test@mail.com",
          password: "test",
          username: "test",
          User: UserModelMock,
          _checkUserExists,
          _createToken,
          _hashedPassword,
          _insertUser,
        });

        expect(token).toBeDefined();
      } catch (error) {
        if (error instanceof CustomHttpException) {
          expect(error.message).toEqual("User already exist");
        }
        expect(error).instanceOf(CustomHttpException);
      }
    });

    it("should throw an error if user already exists", async () => {
      const email = "test@mail.com";
      const username = "test";
      const user = {
        email,
        username,
      };
      const _checkUserExists = vi.fn().mockReturnValue(user);
      const _createToken = vi.fn().mockReturnValue("token");
      const _hashedPassword = vi.fn().mockReturnValue("hashedPassword");
      const _insertUser = vi.fn().mockReturnValue({
        ...user,
        _id: "123",
      });

      try {
        const { token } = await handleRegister({
          email,
          password: "test",
          username,
          User: UserModelMock,
          _checkUserExists,
          _createToken,
          _hashedPassword,
          _insertUser,
        });

        expect(token).toBeDefined();
      } catch (error) {
        if (error instanceof CustomHttpException) {
          expect(error.message).toEqual("User already exist");
        }
        expect(error).instanceOf(CustomHttpException);
      }
    });
  });

  describe("handleLogin", () => {
    describe("compare password", () => {
      it("should return true if password is correct", async () => {
        const password = "test";
        vi.spyOn(bcrypt, "compare").mockImplementationOnce(() => true);
        const hashedPassword = await hashPassword(password);
        const isMatch = await comparePassword(password, hashedPassword);
        expect(isMatch).toBeTruthy();
      });

      it("should throw an error if password is incorrect", async () => {
        const password = "test";

        const hashedPassword = await hashPassword(password);
        try {
          await comparePassword("test2", hashedPassword);
        } catch (error) {
          expect(error).toBeInstanceOf(CustomHttpException);
          if (error instanceof CustomHttpException) {
            expect(error.message).toEqual("Invalid credentials");
          }
        }
      });
    });

    it('should be return error with message "User does not exist"', async () => {
      const email = "test@mail.com";
      const password = "test";
      const _checkUserExists = vi.fn().mockReturnValue(null);
      const _comparePassword = vi.fn().mockReturnValue(true);
      const _createToken = vi.fn().mockReturnValue("token");

      try {
        const { token } = await handleLogin({
          email,
          password,
          User: UserModelMock,
          _checkUserExists,
          _comparePassword,
          _createToken,
        });
        expect(token).toBeDefined();
      } catch (error) {
        if (error instanceof CustomHttpException) {
          expect(error.message).toEqual("User does not exist");
        }
        expect(error).instanceOf(CustomHttpException);
      }
    });

    it('should be return error with message "Invalid credentials"', async () => {
      const email = "test@mail.com";
      const password = "test";
      const _checkUserExists = vi.fn().mockReturnValue(true);
      const _comparePassword = vi.fn().mockReturnValue(false);
      const _createToken = vi.fn().mockReturnValue("token");

      try {
        const { token } = await handleLogin({
          email,
          password,
          User: UserModelMock,
          _checkUserExists,
          _comparePassword,
          _createToken,
        });
        expect(token).toBeDefined();
      } catch (error) {
        if (error instanceof CustomHttpException) {
          expect(error.message).toEqual("Invalid credentials");
        }
        expect(error).instanceOf(CustomHttpException);
      }
    });
  });

  describe("defaultHook", () => {
    it("should throw an error when result is not success", async () => {
      const zodError = new ZodError([
        {
          path: ["test"],
          message: "test",
          code: "custom",
          params: {},
        },
      ]);
      const result = {
        success: false as const,
        error: zodError,
      };
      const error = new CustomHttpException(
        result.error.issues[0].message,
        StatusCodes.BAD_REQUEST
      );
      expect(() => defaultHook(result)).toThrowError(error);
    });
  });
});
