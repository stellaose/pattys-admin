// !OPTIONS
export const genderOptions = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
];

// # MESSAGES
export const firstNameRule = [
  {
    required: true,
    message: "First Name is required",
  },
];

export const lastNameRule = [
  {
    required: true,
    message: "Last Name is required",
  },
];

export const usernameRule = [
  {
    required: true,
    message: "Last Name is required",
  },
];

export const phoneNumberRule = [
  { required: true, message: "Phone number is required" },
  {
    pattern: new RegExp("[0]{1}[7-9]{1}[0-9]{9}"),
    message: "Phone number must start with 07 or 08 or 09",
  },
];

export const emailRule = [
  {
    required: true,
    message: "E-mail is required",
  },
  {
    type: "email" as const,
    message: "Enter a valid e-mail",
  },
];

export const otpRule = [
  {
    required: true,
    message: "Verification code is required",
  },
  {
    len: 6,
    message: "Enter the 6-digit code",
  },
];

export const genderRule = [
  {
    required: true,
    message: "Gender is required",
  },
];

export const passwordRule = [
  {
    required: true,
    message: "Password is required",
  },
  {
    pattern: new RegExp(
      "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!.%*?&])[A-Za-z\\d@$!.%*?&]{8,}$",
    ),
    message:
      "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character",
  },
];

export const confirmPasswordRule = [
  {
    required: true,
    message: "Confirm password is required",
  },
  ({ getFieldValue }: { getFieldValue: any }) => ({
    validator(_: any, value: any) {
      if (!value || getFieldValue("password") === value) {
        return Promise.resolve();
      }
      return Promise.reject(new Error("Passwords do not match"));
    },
  }),
];

export const loginPasswordRule = [
  {
    required: true,
    message: "Password is required",
  },
];

export const blogTitleRule = [
  {
    required: true,
    message: "Title is required",
  },
];

export const blogCategoryRule = [
  {
    required: true,
    message: "Category is required",
  },
];

export const blogDescriptionRule = [
  {
    required: true,
    message: "Description is required",
  },
];

export const currentPasswordRule = [
  {
    required: true,
    message: "Current password is required",
  },
];

export const fullNameRule = [
  {
    required: true,
    message: "Your name is required",
  },
];

export const contactTopicRule = [
  {
    required: true,
    message: "Please choose a topic",
  },
];

export const contactMessageRule = [
  {
    required: true,
    message: "Message is required",
  },
];
