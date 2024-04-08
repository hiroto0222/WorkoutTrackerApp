import React from "react";
import { Animated, I18nManager, StyleSheet } from "react-native";
import {
  GestureHandlerRootView,
  RectButton,
  Swipeable,
} from "react-native-gesture-handler";
import { Icon } from "react-native-magnus";
import UIConstants from "../../../../constants";
import { tableStyles } from "./TableStyles";

type Props = {
  isDeletable: boolean;
  onDelete: () => void;
  children: React.ReactNode;
};

const SwipeDelete = ({ isDeletable, onDelete, children }: Props) => {
  const renderRightActions = (
    _progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>
  ) => {
    const scale = dragX.interpolate({
      inputRange: [-80, 0],
      outputRange: [1, 0],
      extrapolate: "clamp",
    });
    return (
      <RectButton style={styles.rightAction} onPress={onDelete}>
        <Animated.View
          style={[tableStyles.columnOne, { transform: [{ scale }] }]}
        >
          <Icon
            fontSize="4xl"
            fontFamily="MaterialCommunityIcons"
            name="delete"
            color="#fff"
          />
        </Animated.View>
      </RectButton>
    );
  };

  return (
    <GestureHandlerRootView>
      <Swipeable
        enabled={isDeletable}
        renderRightActions={renderRightActions}
        rightThreshold={30}
      >
        {children}
      </Swipeable>
    </GestureHandlerRootView>
  );
};

export default SwipeDelete;

const styles = StyleSheet.create({
  rightAction: {
    alignItems: "center",
    flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
    backgroundColor: UIConstants.COLORS.PRIMARY.REGULAR,
    flex: 1,
    justifyContent: "flex-end",
  },
});
