import bcrypt from "bcrypt";
import { sign } from "hono/jwt";
import { StatusCodes } from "http-status-codes";
import { FilterQuery } from "mongoose";
import { ZodError } from "zod";
import { CustomHttpException } from "../../helpers/CustomHttpException";
import { IUser, User as UserModel } from "../user/model";

interface IRegister {
  User?: typeof UserModel;
  username: string;
  email: string;
  password: string;
  _checkUserExists?: typeof checkUserExists;
  _hashedPassword?: typeof hashPassword;
  _insertUser?: typeof insertUser;
  _createToken?: typeof createToken;
}

interface ILogin {
  email: string;
  password: string;
  User?: typeof UserModel;
  _checkUserExists?: typeof checkUserExists;
  _createToken?: typeof createToken;
  _comparePassword?: typeof comparePassword;
}

export const checkUserExists = async (
  query: FilterQuery<IUser>[] | undefined,
  User: IRegister["User"]
) => {
  const user = await User?.findOne({
    $or: query,
  });
  return user;
};

export const hashPassword = async (password: string) => {
  const hashedPassword = await bcrypt.hash(password, 12);
  return hashedPassword;
};

export const insertUser = async ({
  username,
  email,
  hashedPassword,
  User,
}: Omit<IRegister, "password"> & { hashedPassword: string }) => {
  const user = await User?.create({
    username,
    email,
    password: hashedPassword,
  });

  if (!user) {
    throw new CustomHttpException(
      "Something went wrong",
      StatusCodes.BAD_REQUEST
    );
  }

  return user;
};

export const createToken = async (user: IUser): Promise<string> | never => {
  if (!process.env.JWT_SECRET) {
    throw new Error("process.env.JWT_SECRET is required");
  }
  const token = await sign({ id: user._id }, process.env.JWT_SECRET);
  return token;
};

export const comparePassword = async (
  password: string,
  hashedPassword: string
) => {
  const isMatch = await bcrypt.compare(password, hashedPassword);
  if (!isMatch) {
    throw new CustomHttpException(
      "Invalid credentials",
      StatusCodes.UNAUTHORIZED
    );
  }
  return isMatch;
};

export const handleRegister = async ({
  User: Model = UserModel,
  username,
  email,
  password,
  _checkUserExists = checkUserExists,
  _hashedPassword = hashPassword,
  _insertUser = insertUser,
  _createToken = createToken,
}: IRegister) => {
  const userExists = await _checkUserExists([{ email }, { username }], Model);
  if (userExists) {
    throw new CustomHttpException("User already exist", StatusCodes.CONFLICT);
  }
  const hashedPassword = await _hashedPassword(password);

  const user = await _insertUser({
    username,
    email,
    hashedPassword,
    User: Model,
  });

  const token = await _createToken(user);

  return { token };
};

export const handleLogin = async ({
  email,
  password,
  User: Model = UserModel,
  _checkUserExists = checkUserExists,
  _createToken = createToken,
  _comparePassword = comparePassword,
}: ILogin) => {
  const user = await _checkUserExists([{ email }], Model);
  if (!user) {
    throw new CustomHttpException("User does not exist", StatusCodes.GONE);
  }

  await _comparePassword(password, user.password);

  const token = await _createToken(user);

  return { token };
};

export const defaultHook = (
  result:
    | {
        success: false;
        error: ZodError<any>;
      }
    | {
        success: true;
        data: any;
      }
) => {
  if (!result.success && result.error.issues.length > 0) {
    throw new CustomHttpException(
      result.error.issues[0].message,
      StatusCodes.BAD_REQUEST
    );
  }
};
