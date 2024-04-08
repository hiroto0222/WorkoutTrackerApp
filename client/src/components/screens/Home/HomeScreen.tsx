import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Loading from "components/base/common/Loading";
import SummaryCard from "components/base/home/SummaryCard";
import WorkoutsFlatList from "components/base/home/WorkoutsFlatList";
import globalStyles from "components/styles";
import useGetUser from "hooks/api/useGetUser";
import useGetWorkoutsData from "hooks/api/useGetWorkoutsData";
import React from "react";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import { Avatar, Div, Icon, Text } from "react-native-magnus";
import { useSelector } from "react-redux";
import { RootState } from "store";
import UIConstants from "../../../constants";
import { HomeStackParams } from "./HomeScreenStack";

const HomeScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackParams>>();

  const userState = useSelector((state: RootState) => state.user);
  const workoutState = useSelector((state: RootState) => state.workout);

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
        <Div
          row
          justifyContent="space-between"
          alignItems="center"
          style={{ marginVertical: 10 }}
        >
          <Text fontSize="3xl" style={globalStyles.textMedium}>
            History
          </Text>
          <TouchableOpacity
            style={{ flexDirection: "row", alignItems: "center" }}
            onPress={() => navigation.navigate("WorkoutsList")}
          >
            <Text
              color={UIConstants.COLORS.GRAY.REGULAR}
              mr={10}
              fontSize="lg"
              style={globalStyles.textRegular}
            >
              See all
            </Text>
            <View
              style={{
                width: 20,
                height: 20,
                borderRadius: 35,
                backgroundColor: UIConstants.COLORS.GRAY.LIGHT,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon
                fontSize="2xl"
                fontFamily="MaterialCommunityIcons"
                name="chevron-right"
                color="#000"
              />
            </View>
          </TouchableOpacity>
        </Div>
        <WorkoutsFlatList pb={1000} />
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
    marginBottom: 10,
  },
  cardsContainer: {
    justifyContent: "space-between",
    marginBottom: 30,
  },
});
