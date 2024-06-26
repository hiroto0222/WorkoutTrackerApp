import globalStyles from "components/styles";
import React from "react";
import { TouchableOpacity } from "react-native";
import { Text } from "react-native-magnus";
import UIConstants from "../../../constants";

type ButtonType = "lg" | "md" | "sm";

type Props = {
  buttonType: ButtonType;
  bg: string;
  color: string;
  text: string;
  fontSize: string;
  onPress: () => void;
  marginVertical?: number;
  width?: string;
};

const Button = ({
  buttonType,
  bg,
  color,
  text,
  fontSize,
  marginVertical,
  width,
  onPress,
}: Props) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: bg,
        borderRadius: UIConstants.STYLES.BORDER_RADIUS,
        paddingVertical:
          buttonType === "lg" ? 15 : buttonType === "md" ? 10 : 5,
        width: width || "100%",
        marginVertical,
      }}
    >
      <Text
        textAlign="center"
        fontSize={fontSize}
        color={color}
        style={globalStyles.textMedium}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
};

export default Button;
