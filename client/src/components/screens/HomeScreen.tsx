import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Loading from "components/base/Loading";
import Constants from "expo-constants";
import useGetUser from "hooks/api/useGetUser";
import { UserStackParams } from "navigation/UserStack";
import React from "react";
import { SafeAreaView, ScrollView } from "react-native";
import { Avatar, Button, Div, Text } from "react-native-magnus";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store";
import { setStartWorkingOut } from "store/slices/workout";

const HomeScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<UserStackParams>>();
  const { loading: loadingGetUser } = useGetUser();
  const userState = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  const handleStartWorkout = () => {
    dispatch(setStartWorkingOut());
    navigation.navigate("Workout");
  };

  return loadingGetUser ? (
    <Loading />
  ) : (
    <SafeAreaView style={{ marginTop: Constants.statusBarHeight }}>
      <ScrollView>
        <Div px={25}>
          <Div row justifyContent={"space-between"} alignItems="center">
            <Div>
              <Div row>
                <Text fontSize="5xl" mr={5}>
                  Hi,
                </Text>
                <Text fontSize="5xl" fontWeight="bold">
                  {userState.user?.name}
                </Text>
              </Div>
              <Text fontSize="lg">Get some exercise in!</Text>
            </Div>
            <Avatar shadow={1} source={{ uri: userState.user?.photo }} />
          </Div>
          <Div mt="2xl" alignItems="center" justifyContent="center">
            <Button
              onPress={() => handleStartWorkout()}
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
          </Div>
        </Div>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
