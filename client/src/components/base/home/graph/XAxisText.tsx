import { Poppins_500Medium } from "@expo-google-fonts/poppins";
import { Text, useFont } from "@shopify/react-native-skia";
import React from "react";
import {
  SharedValue,
  useDerivedValue,
  withTiming,
} from "react-native-reanimated";
import UIConstants from "../../../../constants";

type Props = {
  x: number;
  y: number;
  text: string;
  selectedBar: SharedValue<string | null>;
};

const XAxisText = ({ x, y, text, selectedBar }: Props) => {
  const font = useFont(Poppins_500Medium, 16);
  const textWidth = font?.getTextWidth(text);

  const color = useDerivedValue(() => {
    if (selectedBar.value === text) {
      return withTiming(UIConstants.COLORS.GRAY.LIGHT_CONTRAST);
    } else if (selectedBar.value === null) {
      return withTiming(UIConstants.COLORS.GRAY.LIGHT_CONTRAST);
    } else {
      return withTiming(UIConstants.COLORS.GRAY.LIGHT);
    }
  });

  if (!font) {
    return null;
  }

  return (
    <Text font={font} x={x - textWidth! / 2} y={y} text={text} color={color} />
  );
};

export default XAxisText;
