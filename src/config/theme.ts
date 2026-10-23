import { ThemeConfig } from "antd";

// Same values as --color-green / --color-red / --color-yellow in theme.css
export const chartColors = {
  green: "#268941",
  red: "#d32f2f",
  yellow: "#fbbc05",
};

export const getThemeConfig = (): ThemeConfig | undefined => {
  return {
    token: {
      colorPrimary: "#4527a0",
      borderRadius: 5,
      colorBorder: "#dedde2",
    },
    components: {
      Input: {
        fontFamily: "Epilogue",
      },
      Select: {
        fontFamily: "Epilogue",
      },

      Table: {
        fontFamily: "Epilogue",
      },
      Button: {
        fontFamily: "Epilogue",
      },
      Form: {
        fontFamily: "Epilogue",
      },
      Dropdown: {
        controlItemBgActive: "#DBE1C1",
        controlItemBgHover: "#DBE1C1",
      },
    },
  };
};
