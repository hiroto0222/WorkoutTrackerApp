import Loading from "components/base/Loading";
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
        <Div row justifyContent={"space-between"} alignItems="center">
          <Div>
            <Div row>
              <Text fontSize="6xl" mr={5} style={globalStyles.textLight}>
                Hi,
              </Text>
              <Text fontSize="6xl" style={globalStyles.textMedium}>
                {userState.user?.name.split(" ")[0]}
              </Text>
            </Div>
            <Text style={globalStyles.textMedium} fontSize="lg">
              Get some exercise in!
            </Text>
          </Div>
          <Avatar shadow={1} source={{ uri: userState.user?.photo }} />
        </Div>
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewContainer}
        >
          <Text
            textAlign="center"
            fontSize="xl"
            style={globalStyles.textMedium}
          >
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
    marginTop:
      Platform.OS === "android"
        ? UIConstants.SCREEN_MARGIN_TOP
        : UIConstants.SCREEN_MARGIN_TOP + 30,
  },
  scrollViewContainer: {
    marginTop: 50,
    flexGrow: 1,
    paddingBottom: 350,
  },
});
