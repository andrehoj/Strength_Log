import { ColorSchemeProvider, MantineProvider } from "@mantine/core";
import { useHotkeys, useLocalStorage } from "@mantine/hooks";
import { Notifications } from "@mantine/notifications";
import { createContext, useEffect } from "react";
import Layout from "./components/Layout";
import RouteContainer from "./routes/routes";

import auth from "./utils/auth/auth";
import ScrollToTop from "./components/ScrollToTop";

export const UserContext = createContext();

export function App() {
  const [colorScheme, setColorScheme] = useLocalStorage({
    key: "mantine-color-scheme",
  });

  const themeStyles = {
    components: {
      Button: {
        defaultProps: {
          variant: "outline",
        },
      },

      Modal: {
        styles: {
          root: {
            border: "1px gray solid",
          },
        },
      },
    },

    globalStyles: (theme) => ({}),
    fontFamily: "Inter",
    colorScheme: colorScheme,
    loader: "bars",
    colors: {
      brand: myColors.yellow,
      dark: [
        "#E2E2E2",
        "#AFAFAF",
        "#888888",
        "#616161",
        "#454545",
        "#313131",
        "#232323",
        "#191919",
        "#111111",
      ],
    },

    primaryColor: "brand",
  };

  useHotkeys([["ctrl+K", () => toggleColorScheme()]]);

  const toggleColorScheme = () =>
    setColorScheme(colorScheme === "dark" ? "light" : "dark");

  //stops useless error when resizing browser
  useEffect(() => {
    window.addEventListener("error", (e) => {
      if (e.message === "ResizeObserver loop limit exceeded") {
        const resizeObserverErrDiv = document.getElementById(
          "webpack-dev-server-client-overlay-div"
        );
        const resizeObserverErr = document.getElementById(
          "webpack-dev-server-client-overlay"
        );
        if (resizeObserverErr) {
          resizeObserverErr.setAttribute("style", "display: none");
        }
        if (resizeObserverErrDiv) {
          resizeObserverErrDiv.setAttribute("style", "display: none");
        }
      }
    });
  }, []);

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider withNormalizeCSS withGlobalStyles theme={themeStyles}>
        <Notifications position="bottom-right" limit={5} />
        <UserContext.Provider value={auth.getInfo()}>
          <Layout>
            <RouteContainer />
            <ScrollToTop />
          </Layout>
        </UserContext.Provider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}

let myColors = {
  alizarin: [
    "#FFCCC4",
    "#FF7D6B",
    "#FF5A47",
    "#FF0000",
    "#FF0000",
    "#D20000",
    "#AA0000",
    "#8A0000",
    "#6F0000",
  ],
  peterriver: [
    "#E0F7FF",
    "#A4E6FF",
    "#8BD1FF",
    "#38C8FF",
    "#08BBFF",
    "#00AFFF",
    "#00A2FF",
    "#0090FF",
    "#0080F5",
  ],
  nephritis: [
    "#B4FFD7",
    "#6CFFAC",
    "#3EF58B",
    "#20E071",
    "#27AE60",
    "#15954B",
    "#07813B",
    "#00712D",
    "#006024",
    "#004C1C",
    "#003D17",
  ],

  teal: [
    "#B3FFF5",
    "#63FFEB",
    "#20FFE2",
    "#00FFCC",
    "#00DFAF",
    "#00B38C",
    "#008F70",
    "#00725A",
    "#005B48",
    "#004939",
  ],

  pink: [
    "#FFD2FF",
    "#FF9DFF",
    "#FF6EFF",
    "#FF59FD",
    "#FF18FF",
    "#FF00FF",
    "#FF00FF",
    "#F500F2",
    "#DA00D7",
    "#C200BF",
  ],

  yellow: [
    "#FFF6D2",
    "#FFEC9D",
    "#FFE26E",
    "#FFD059",
    "#FFD118",
    "#FFCA00",
    "#FFBC00",
    "#F5A700",
    "#DA9500",
    "#C28500",
  ],
};
