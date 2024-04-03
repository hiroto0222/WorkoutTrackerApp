import Loading from "components/base/Loading";
import Constants from "expo-constants";
import useGetUser from "hooks/api/useGetUser";
import React from "react";
import { SafeAreaView, ScrollView, View } from "react-native";
import { Avatar, Div, Text } from "react-native-magnus";
import { useSelector } from "react-redux";
import { RootState } from "store";

const HomeScreen = () => {
  const { loading: loadingGetUser } = useGetUser();
  const userState = useSelector((state: RootState) => state.user);

  return loadingGetUser ? (
    <Loading />
  ) : (
    <View>
      <SafeAreaView
        style={{ flex: 1, marginTop: Constants.statusBarHeight + 30 }}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: 350,
        }}
      >
        <Div px={25}>
          <Div row justifyContent={"space-between"} alignItems="center">
            <Div>
              <Div row>
                <Text fontSize="5xl" mr={5}>
                  Hi,
                </Text>
                <Text fontSize="5xl" fontWeight="bold">
                  {userState.user?.name.split(" ")[0]}
                </Text>
              </Div>
              <Text fontSize="lg">Get some exercise in!</Text>
            </Div>
            <Avatar shadow={1} source={{ uri: userState.user?.photo }} />
          </Div>
        </Div>
      </ScrollView>
    </View>
  );
};

export default HomeScreen;
