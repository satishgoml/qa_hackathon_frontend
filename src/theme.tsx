import { extendTheme } from "@chakra-ui/react"

const disabledStyles = {
  _disabled: {
    backgroundColor: "ui.main",
    opacity: 0.6,
  },
}

const theme = extendTheme({
  colors: {
    ui: {
      main: "#ffbd59",
      secondary: "#FFF3E0",
      success: "#4CAF50",
      danger: "#F44336",
      light: "#FFFFFF",
      dark: "#333333",
      darkSlate: "#4A4A4A",
      dim: "#9E9E9E",
    },
  },
  components: {
    Button: {
      variants: {
        primary: {
          backgroundColor: "ui.main",
          color: "ui.dark",
          _hover: {
            backgroundColor: "#FFA726",
          },
          _disabled: {
            ...disabledStyles,
            _hover: {
              ...disabledStyles,
            },
          },
        },
        danger: {
          backgroundColor: "ui.danger",
          color: "ui.light",
          _hover: {
            backgroundColor: "#D32F2F",
          },
        },
      },
    },
    Tabs: {
      variants: {
        enclosed: {
          tab: {
            _selected: {
              color: "ui.main",
              borderColor: "ui.main",
            },
          },
        },
      },
    },
  },
})

export default theme
