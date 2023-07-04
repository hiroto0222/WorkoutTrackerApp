import { auth } from "config/firebase";
import { signOut } from "firebase/auth";
import React, { useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store";
import { setAuth } from "store/slices/auth";
import axios from "../../config/axios";

const HomeScreen = () => {
  const user = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    axios
      .get("user/me", {
        headers: {
          Authorization: "Bearer " + user.accessToken,
        },
      })
      .then((val) => console.log(val.data))
      .catch((err) => console.log(err));
  }, []);

  const handleLogout = () => {
    signOut(auth);
    dispatch(setAuth({}));
  };

  return (
    <View style={styles.container}>
      <Text>HomeScreen</Text>
      <Text>Welcome: {user.userId}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={handleLogout}
          style={[styles.button, styles.buttonOutline]}
        >
          <Text style={styles.buttonOutlineText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    width: "60%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  button: {
    backgroundColor: "#0782F9",
    width: "100%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonOutline: {
    backgroundColor: "white",
    marginTop: 5,
    borderColor: "#0782F9",
    borderWidth: 2,
  },
  buttonOutlineText: {
    color: "#0782F9",
    fontWeight: "700",
    fontSize: 16,
  },
});
