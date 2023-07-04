import usePersistenceAuth from "hooks/usePersistenceAuth";
import { ActivityIndicator, StyleSheet } from "react-native";
import { View } from "react-native-animatable";
import { useSelector } from "react-redux";
import { RootState } from "store";
import AuthStack from "./AuthStack";
import UserStack from "./UserStack";

const RootNavigation = () => {
  const { loading } = usePersistenceAuth();
  const user = useSelector((state: RootState) => state.auth);
  return loading ? (
    <View style={styles.loading}>
      <ActivityIndicator size="large" color="#fff" />
    </View>
  ) : user.userId ? (
    <UserStack />
  ) : (
    <AuthStack />
  );
};

const styles = StyleSheet.create({
  loading: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    opacity: 0.2,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default RootNavigation;
