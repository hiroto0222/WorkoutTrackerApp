import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import WorkoutsFlatList from "components/base/home/WorkoutsFlatList";
import React from "react";
import { StyleSheet, View } from "react-native";
import UIConstants from "../../../constants";

const WorkoutsListScreen = () => {
  const tabHeight = useBottomTabBarHeight();

  return (
    <View style={styles.container}>
      <WorkoutsFlatList pb={tabHeight + 20} />
    </View>
  );
};

export default WorkoutsListScreen;

const styles = StyleSheet.create({
  container: {
    marginTop: UIConstants.SCREEN_MARGIN_TOP - 5,
    flex: 1,
    paddingHorizontal: 25,
  },
});
