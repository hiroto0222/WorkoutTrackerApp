import Loading from "components/base/Loading";
import Card from "components/base/home/Card";
import globalStyles from "components/styles";
import useGetUser from "hooks/api/useGetUser";
import React from "react";
import { Platform, ScrollView, StyleSheet, View } from "react-native";
import { Avatar, Div, Text } from "react-native-magnus";
import { useSelector } from "react-redux";
import { RootState } from "store";
import UIConstants from "../../../constants";

const HomeScreen = () => {
  const { loading: loadingGetUser } = useGetUser();
  const userState = useSelector((state: RootState) => state.user);

  return loadingGetUser ? (
    <Loading />
  ) : (
    <View style={styles.container}>
      <Div px={25}>
        <Div row style={styles.topContainer}>
          <Div>
            <Div row>
              <Text fontSize="6xl" mr={5} style={globalStyles.textLight}>
                Hi,
              </Text>
              <Text fontSize="6xl" style={globalStyles.textMedium}>
                {userState.user?.name.split(" ")[0]}
              </Text>
            </Div>
            <Div row>
              <Text
                color={UIConstants.COLORS.PRIMARY.REGULAR}
                mr={5}
                style={globalStyles.textExtraBold}
                fontSize="lg"
              >
                31
              </Text>
              <Text style={globalStyles.textMedium} fontSize="lg">
                Days since your last workout
              </Text>
            </Div>
          </Div>
          <Avatar shadow={1} source={{ uri: userState.user?.photo }} />
        </Div>
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewContainer}
        >
          <Text fontSize="3xl" style={globalStyles.textMedium}>
            This week
          </Text>
          <Div row justifyContent="space-between">
            <Card title="Workouts" width={"30%"} />
            <Card title="Time" width={"30%"} />
            <Card title="Workouts" width={"30%"} />
          </Div>
          <Div row justifyContent="center">
            <Card title="Graph" width={"100%"} />
          </Div>
          <Text mt={10} fontSize="3xl" style={globalStyles.textMedium}>
            History
          </Text>
        </ScrollView>
      </Div>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    marginTop:
      Platform.OS === "android"
        ? UIConstants.SCREEN_MARGIN_TOP
        : UIConstants.SCREEN_MARGIN_TOP + 30,
  },
  topContainer: {
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 50,
  },
  scrollViewContainer: {
    flexGrow: 1,
    paddingBottom: 350,
  },
  cardsContainer: {
    justifyContent: "space-between",
    marginBottom: 30,
  },
});
