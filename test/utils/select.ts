import { screen, within } from "@testing-library/react";
import { userEvent } from "./user";

// Opens an antd Select by its accessible name and picks an option by its label
export const chooseOption = async (
  selectName: string | RegExp,
  optionLabel: string,
  container: HTMLElement = document.body,
) => {
  const combobox = within(container).getByRole("combobox", {
    name: selectName,
  });
  await userEvent.click(combobox);
  // antd renders options in a portal, so look in the whole document
  const options = await screen.findAllByTitle(optionLabel);
  await userEvent.click(options[options.length - 1]);
};
