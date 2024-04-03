import { StyleSheet } from "react-native";
import UIConstants from "../../constants";

const globalStyles = StyleSheet.create({
  textLight: {
    fontFamily: UIConstants.FONTS.LIGHT,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  textRegular: {
    fontFamily: UIConstants.FONTS.REGULAR,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  textMedium: {
    fontFamily: UIConstants.FONTS.MEDIUM,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  textSemiBold: {
    fontFamily: UIConstants.FONTS.SEMI_BOLD,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  textBold: {
    fontFamily: UIConstants.FONTS.BOLD,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  textExtraBold: {
    fontFamily: UIConstants.FONTS.EXTRA_BOLD,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
});

export default globalStyles;
