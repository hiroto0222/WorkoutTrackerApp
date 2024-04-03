import Loading from "components/base/Loading";
import useGetUser from "hooks/api/useGetUser";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Avatar, Div, Text } from "react-native-magnus";
import { useSelector } from "react-redux";
import { RootState } from "store";
import Constants from "../../../constants";

const HomeScreen = () => {
  const { loading: loadingGetUser } = useGetUser();
  const userState = useSelector((state: RootState) => state.user);

  return loadingGetUser ? (
    <Loading />
  ) : (
    <View style={styles.container}>
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
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewContainer}
        >
          <Text textAlign="center" fontSize="xl">
            looks empty...
          </Text>
        </ScrollView>
      </Div>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    marginTop: Constants.SCREEN_MARGIN_TOP,
  },
  scrollViewContainer: {
    marginTop: 50,
    flexGrow: 1,
    paddingBottom: 350,
  },
});
