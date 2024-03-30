import Loading from "components/base/Loading";
import { auth } from "config/firebase";
import Constants from "expo-constants";
import { signOut } from "firebase/auth";
import useGetUser from "hooks/api/useGetUser";
import useStartWorkout from "hooks/api/useStartWorkout";
import React from "react";
import { SafeAreaView, StatusBar } from "react-native";
import { Button, Div, Image, Text } from "react-native-magnus";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store";
import { setAuth } from "store/slices/auth";

const HomeScreen = () => {
  const { loading: loadingGetUser } = useGetUser();
  const { loading: loadingStartWorkout, startWorkout } = useStartWorkout();
  const authState = useSelector((state: RootState) => state.auth);
  const userState = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  const handleLogout = () => {
    signOut(auth);
    dispatch(setAuth({}));
  };

  return loadingGetUser ? (
    <Loading />
  ) : (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={{ flex: 1, marginTop: Constants.statusBarHeight }}>
        <Text mt="sm" mx="xl" w="70%" fontWeight="bold" fontSize="5xl">
          HomeScreen
        </Text>
        <Div mt="2xl" alignItems="center" justifyContent="center">
          <Image
            h={50}
            w={50}
            rounded="circle"
            source={{
              uri: userState.user?.photo,
            }}
          />
          <Text>Name: {userState.user?.name}</Text>
          <Text>Email: {userState.user?.email}</Text>
          <Button
            loading={loadingStartWorkout}
            onPress={() => startWorkout()}
            mx="xl"
            mt="xl"
            mb="xl"
            py="lg"
            bg="orange500"
            rounded="circle"
            block
          >
            Start Workout
          </Button>
          <Button
            onPress={() => handleLogout()}
            mx="xl"
            mt="sm"
            mb="xl"
            py="lg"
            bg="gray300"
            rounded="circle"
            block
            color="black"
          >
            Sign Out
          </Button>
        </Div>
      </SafeAreaView>
    </>
  );
};

export default HomeScreen;
