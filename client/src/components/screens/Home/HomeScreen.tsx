import Loading from "components/base/Loading";
import SummaryCard from "components/base/home/SummaryCard";
import WorkoutDetailCard from "components/base/home/WorkoutDetailCard";
import globalStyles from "components/styles";
import useGetUser from "hooks/api/useGetUser";
import useGetWorkoutsData from "hooks/api/useGetWorkoutsData";
import React from "react";
import { FlatList, Platform, StyleSheet, View } from "react-native";
import { Avatar, Div, Text } from "react-native-magnus";
import { useSelector } from "react-redux";
import { RootState } from "store";
import UIConstants from "../../../constants";

const HomeScreen = () => {
  const userState = useSelector((state: RootState) => state.user);
  const workoutDataState = useSelector((state: RootState) => state.workoutData);

  const { loading: loadingGetUser } = useGetUser();
  const { loading: loadingGetWorkouts } = useGetWorkoutsData();

  return loadingGetUser || loadingGetWorkouts ? (
    <Loading />
  ) : (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
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
          </Div>
          <Avatar shadow={1} source={{ uri: userState.user?.photo }} />
        </Div>
      </View>
      <SummaryCard />
      <View style={styles.contentContainer}>
        <Text mt={10} fontSize="3xl" style={globalStyles.textMedium}>
          History
        </Text>
        <FlatList
          contentContainerStyle={styles.flatListContainer}
          data={workoutDataState.workouts}
          renderItem={({ item }) => <WorkoutDetailCard workout={item} />}
          keyExtractor={(item) => item.id}
        />
      </View>
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
  contentContainer: {
    paddingHorizontal: 25,
  },
  topContainer: {
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },
  flatListContainer: {
    flexGrow: 1,
    paddingBottom: 500,
  },
  cardsContainer: {
    justifyContent: "space-between",
    marginBottom: 30,
  },
});
