import { ActivityIndicator, StyleSheet, View } from "react-native";
import UIConstants from "../../constants";

const Loading = () => {
  return (
    <View style={styles.loading}>
      <ActivityIndicator
        size="large"
        color={UIConstants.COLORS.PRIMARY.REGULAR}
      />
    </View>
  );
};

export default Loading;

const styles = StyleSheet.create({
  loading: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    opacity: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
