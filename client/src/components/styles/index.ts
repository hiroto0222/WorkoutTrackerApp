import { StyleSheet } from "react-native";
import Constants from "../../constants";

const globalStyles = StyleSheet.create({
  textLight: {
    fontFamily: Constants.FONTS.LIGHT,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  textRegular: {
    fontFamily: Constants.FONTS.REGULAR,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  textMedium: {
    fontFamily: Constants.FONTS.MEDIUM,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  textSemiBold: {
    fontFamily: Constants.FONTS.SEMI_BOLD,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  textBold: {
    fontFamily: Constants.FONTS.BOLD,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  textExtraBold: {
    fontFamily: Constants.FONTS.EXTRA_BOLD,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
});

export default globalStyles;
