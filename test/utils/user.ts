import baseUserEvent from "@testing-library/user-event";

// Types without waiting between keystrokes, which keeps the antd form tests fast
export const userEvent = baseUserEvent.setup({ delay: null });
