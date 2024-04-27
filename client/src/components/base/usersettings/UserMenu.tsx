import globalStyles from "components/styles";
import { auth } from "config/firebase";
import { signOut } from "firebase/auth";
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Icon, Text } from "react-native-magnus";
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
  renderers,
} from "react-native-popup-menu";
import { useDispatch } from "react-redux";
import { setAuth } from "store/slices/auth";
import UIConstants from "../../../constants";

const UserMenu = () => {
  const dispatch = useDispatch();

  const [opened, setOpened] = useState(false);

  const openPopUpMenu = () => {
    setOpened(true);
  };

  const closePopUpMenu = () => {
    setOpened(false);
  };

  const handleLogout = () => {
    signOut(auth);
    dispatch(setAuth({}));
  };

  return (
    <Menu
      opened={opened}
      onBackdropPress={() => closePopUpMenu()}
      renderer={renderers.ContextMenu}
    >
      <MenuTrigger>
        <TouchableOpacity
          style={{ padding: 10 }}
          onPress={() => openPopUpMenu()}
        >
          <Icon
            color="black"
            fontSize="4xl"
            name="dots-vertical"
            fontFamily="MaterialCommunityIcons"
          />
        </TouchableOpacity>
      </MenuTrigger>
      <MenuOptions
        customStyles={{
          optionsContainer: {
            padding: 5,
            borderRadius: 15,
          },
        }}
      >
        <MenuOption>
          <TouchableOpacity
            style={styles.optionContainer}
            onPress={() => handleLogout()}
          >
            <Icon
              fontSize="2xl"
              color={UIConstants.COLORS.GRAY.REGULAR}
              name="logout"
              fontFamily="MaterialCommunityIcons"
            />
            <Text
              fontSize="lg"
              color={UIConstants.COLORS.GRAY.REGULAR}
              style={globalStyles.textBold}
            >
              Logout
            </Text>
          </TouchableOpacity>
        </MenuOption>
        <MenuOption>
          <TouchableOpacity
            style={styles.optionContainer}
            onPress={() => alert("delete account")}
          >
            <Icon
              fontSize="2xl"
              color={UIConstants.COLORS.DANGER.REGULAR}
              name="trash-can"
              fontFamily="MaterialCommunityIcons"
            />
            <Text
              fontSize="lg"
              color={UIConstants.COLORS.DANGER.REGULAR}
              style={globalStyles.textBold}
            >
              Delete Account
            </Text>
          </TouchableOpacity>
        </MenuOption>
      </MenuOptions>
    </Menu>
  );
};

export default UserMenu;

const styles = StyleSheet.create({
  optionContainer: {
    flex: 1,
    padding: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
