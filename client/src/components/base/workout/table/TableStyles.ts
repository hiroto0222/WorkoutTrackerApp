import { StyleSheet } from "react-native";
import UIConstants from "../../../../constants";

export const tableStyles = StyleSheet.create({
  tableHeader: {
    marginBottom: 5,
    flexDirection: "row",
  },
  columnOne: {
    justifyContent: "center",
    alignItems: "center",
    width: "25%",
  },
  columnTwo: {
    justifyContent: "center",
    alignItems: "center",
    width: "50%",
  },
  tableRowInComplete: {
    paddingVertical: 5,
    flexDirection: "row",
  },
  tableRowComplete: {
    paddingVertical: 5,
    flexDirection: "row",
    backgroundColor: UIConstants.COLORS.PRIMARY.LIGHT,
  },
  columnOneInput: {
    justifyContent: "center",
    alignItems: "center",
    width: "25%",
    padding: 5,
  },
  columnTwoInput: {
    justifyContent: "center",
    alignItems: "center",
    width: "50%",
    padding: 5,
  },
  input: {
    borderRadius: 10,
    paddingVertical: 3,
  },
});
