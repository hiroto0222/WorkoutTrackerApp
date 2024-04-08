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
    paddingTop: 2,
    flexDirection: "row",
    backgroundColor: "#fff",
  },
  tableRowComplete: {
    paddingTop: 2,
    flexDirection: "row",
    backgroundColor: UIConstants.COLORS.SUCCESS.REGULAR,
  },
  columnOneInput: {
    justifyContent: "center",
    alignItems: "center",
    width: "25%",
    paddingHorizontal: 5,
  },
  columnTwoInput: {
    justifyContent: "center",
    alignItems: "center",
    width: "50%",
    paddingHorizontal: 5,
  },
  input: {
    borderRadius: 10,
    paddingVertical: 3,
  },
});
