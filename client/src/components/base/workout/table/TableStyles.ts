import { StyleSheet } from "react-native";

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
    backgroundColor: "#9ae6b4",
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
});
