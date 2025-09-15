import { ThemeConfig } from "antd";

export const getThemeConfig = (): ThemeConfig | undefined => {
  return {
    token: {
      colorPrimary: "#c5d86d",
      borderRadius: 5,
      colorBorder: "#f05d23",
    },
    components: {
      Input: {
        colorBgContainer: "#F4F6FA",
        colorBorder: "white",
        fontFamily: "Raleway",
      
      },
      Select: {
        colorBgContainer: "#F4F6FA",
        colorBorder: "white",
        fontFamily: "Raleway",
      },
      DatePicker: {
        colorBgContainer: "#F4F6FA",
        colorBorder: "white",
      },

      Table: {
        fontFamily: "Raleway",
      },
      Button: {
        fontFamily: "Raleway",
      },
      Form: {
        fontFamily: "Raleway",
      },
     
    },
  };
};
