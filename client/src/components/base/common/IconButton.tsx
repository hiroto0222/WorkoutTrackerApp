import React from "react";
import { TouchableOpacity } from "react-native";
import { Icon } from "react-native-magnus";
import UIConstants from "../../../constants";

type ButtonType = "lg" | "md" | "sm";

type Props = {
  buttonType: ButtonType;
  bg: string;
  color: string;
  name: string;
  fontSize: string;
  onPress: () => void;
  marginVertical?: number;
};

const IconButton = ({
  buttonType,
  bg,
  color,
  name,
  fontSize,
  marginVertical,
  onPress,
}: Props) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: bg,
        borderRadius: UIConstants.STYLES.BORDER_RADIUS,
        paddingVertical: buttonType === "lg" ? 15 : buttonType === "md" ? 7 : 5,
        paddingHorizontal:
          buttonType === "lg" ? 80 : buttonType === "md" ? 40 : 20,
        marginVertical,
      }}
    >
      <Icon
        fontSize={fontSize}
        fontFamily="MaterialCommunityIcons"
        name={name}
        color={color}
      />
    </TouchableOpacity>
  );
};

export default IconButton;
