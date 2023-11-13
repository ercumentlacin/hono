import { describe, expect, it } from "vitest";
import { CustomHttpException } from "../CustomHttpException";

describe("CustomHttpException", () => {
  it("should be defined", () => {
    expect(CustomHttpException).toBeDefined();
  });

  it("should have message and status", () => {
    const error = new CustomHttpException("test", 100);
    expect(error).haveOwnProperty("message");
    expect(error).haveOwnProperty("status");
  });

  it('name should be "CustomHttpException"', () => {
    const error = new CustomHttpException("test", 100);
    expect(error.name).toBe("CustomHttpException");
  });
});
