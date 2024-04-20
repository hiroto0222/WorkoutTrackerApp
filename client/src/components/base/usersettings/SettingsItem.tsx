import globalStyles from "components/styles";
import React from "react";
import { Div, Icon, Text } from "react-native-magnus";
import UIConstants from "../../../constants";

type Props = {
  title: string;
  input?: React.ReactNode;
  icon: string;
  isEdited: boolean;
};

const SettingsItem = ({ title, input, icon, isEdited }: Props) => {
  return (
    <Div
      row
      alignItems="center"
      borderBottomColor={UIConstants.COLORS.GRAY.LIGHT}
      borderBottomWidth={1}
      mb={10}
    >
      <Div mr={15}>
        <Icon
          color={isEdited ? UIConstants.COLORS.DANGER.REGULAR : "black"}
          fontSize="3xl"
          name={icon}
          fontFamily="MaterialCommunityIcons"
        />
      </Div>
      <Div flex={1}>
        <Text
          color={isEdited ? UIConstants.COLORS.DANGER.REGULAR : "black"}
          fontSize="lg"
          style={globalStyles.textMedium}
        >
          {title}
        </Text>
      </Div>
      {input && <>{input}</>}
    </Div>
  );
};

export default SettingsItem;
