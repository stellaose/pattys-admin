import { FormInstance } from "antd";
import { RuleObject } from "antd/es/form";
import {
  confirmPasswordRule,
  emailRule,
  otpRule,
  passwordRule,
} from "#/utils/messages";

const findRule = (rules: unknown[], key: string) =>
  rules.find((rule) => typeof rule === "object" && key in (rule as object)) as
    | Record<string, any>
    | undefined;

describe("validation rules", () => {
  // Requires an e-mail value and configures e-mail format validation.
  it("requires an e-mail and checks its format", () => {
    expect(findRule(emailRule, "required")?.required).toBe(true);
    expect(findRule(emailRule, "type")?.type).toBe("email");
  });

  // Requires an OTP value containing exactly six characters.
  it("requires exactly six digits for the code", () => {
    expect(findRule(otpRule, "required")?.required).toBe(true);
    expect(findRule(otpRule, "len")?.len).toBe(6);
  });

  describe("password strength", () => {
    const pattern: RegExp = findRule(passwordRule, "pattern")?.pattern;

    // Accepts sample passwords that satisfy the configured strength pattern.
    it.each(["Secret@123", "Admin.2026", "Xy9!abcd"])("accepts %s", (value) => {
      expect(pattern.test(value)).toBe(true);
    });

    // Rejects passwords that each miss one required strength condition.
    it.each([
      ["too short", "Se@1abc"],
      ["no uppercase", "secret@123"],
      ["no lowercase", "SECRET@123"],
      ["no number", "Secret@abc"],
      ["no special character", "Secret1234"],
    ])("rejects a password with %s", (_, value) => {
      expect(pattern.test(value)).toBe(false);
    });
  });

  describe("confirm password", () => {
    const matchRule = confirmPasswordRule[1] as (
      form: Pick<FormInstance, "getFieldValue">,
    ) => RuleObject;
    const validate = (password: string, confirm: string) =>
      matchRule({ getFieldValue: () => password }).validator!(
        {} as RuleObject,
        confirm,
        () => {},
      );

    // Resolves validation successfully when the confirmation matches the password.
    it("passes when both passwords match", async () => {
      await expect(validate("Secret@123", "Secret@123")).resolves.toBeUndefined();
    });

    // Rejects validation when the confirmation differs from the password.
    it("fails when the passwords differ", async () => {
      await expect(validate("Secret@123", "Secret@999")).rejects.toThrow(
        "Passwords do not match",
      );
    });
  });
});
