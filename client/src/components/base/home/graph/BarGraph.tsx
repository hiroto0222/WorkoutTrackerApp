import { Poppins_500Medium } from "@expo-google-fonts/poppins";
import { useNavigation } from "@react-navigation/native";
import { Canvas, Group, Text, useFont } from "@shopify/react-native-skia";
import { IWorkoutsResponse } from "api/types";
import * as d3 from "d3";
import { useCallback, useEffect } from "react";
import { GestureResponderEvent, useWindowDimensions } from "react-native";
import { useSharedValue, withTiming } from "react-native-reanimated";
import UIConstants from "../../../../constants";
import BarPath from "./BarPath";
import XAxisText from "./XAxisText";

export interface BarGraphData {
  label: string;
  value: IWorkoutsResponse[];
}

type Props = {
  data: BarGraphData[];
  setSelectedWorkoutData: React.Dispatch<
    React.SetStateAction<BarGraphData | null>
  >;
  isEmptyData: boolean;
};

const BarGraph = ({ data, setSelectedWorkoutData, isEmptyData }: Props) => {
  const font = useFont(Poppins_500Medium, 16);
  const emptyDataText = "No workouts";
  const textWidth = font?.getTextWidth(emptyDataText);

  const navigation = useNavigation();
  const selectedBar = useSharedValue<string | null>(null);

  const { width } = useWindowDimensions();
  const progress = useSharedValue(0);

  const canvasWidth = width;
  const canvasHeight = 200;

  const graphWidth = width;
  const graphMargin = 25;
  const graphHeight = canvasHeight - graphMargin;

  const barWidth = 30;

  const xRange = [0, graphWidth];
  const xDomain = data.map((dataPoint) => dataPoint.label);
  const x = d3.scalePoint().domain(xDomain).range(xRange).padding(1);

  const yRange = [0, graphHeight - 10];
  const yDomain = [
    0,
    d3.max(data, (yDataPoint: BarGraphData) => yDataPoint.value.length)!,
  ];
  const y = d3.scaleLinear().domain(yDomain).range(yRange);

  const playAnimation = useCallback(() => {
    progress.value = 0;
    progress.value = withTiming(1, { duration: 1000 });
  }, []);

  const touchHandler = (e: GestureResponderEvent) => {
    const touchX = e.nativeEvent.locationX;
    const touchY = e.nativeEvent.locationY;

    const index = Math.floor((touchX - barWidth / 2) / x.step());

    if (index >= 0 && index < data.length) {
      const { label, value } = data[index];

      if (
        touchX > x(label)! - barWidth / 2 &&
        touchX < x(label)! + barWidth / 2 &&
        touchY > graphHeight - y(value.length) &&
        touchY < graphHeight
      ) {
        selectedBar.value = label;
        setSelectedWorkoutData({
          label,
          value,
        });
      } else {
        selectedBar.value = null;
        setSelectedWorkoutData(null);
      }
    }
  };

  useEffect(() => {
    // play animation on first transition
    playAnimation();
    // play animation on focus
    const unsubscribe = navigation.addListener("focus", playAnimation);
    return () => {
      unsubscribe();
    };
  }, [navigation, playAnimation]);

  return (
    <Canvas
      onTouchStart={touchHandler}
      style={{
        width: canvasWidth,
        height: canvasHeight,
      }}
    >
      {data.map((dataPoint: BarGraphData, index) => (
        <Group key={index}>
          <BarPath
            x={x(dataPoint.label)!}
            y={!isEmptyData ? y(dataPoint.value.length) : 0}
            barWidth={barWidth}
            graphHeight={graphHeight}
            progress={progress}
            label={dataPoint.label}
            selectedBar={selectedBar}
          />
          <XAxisText
            x={x(dataPoint.label)!}
            y={canvasHeight}
            text={dataPoint.label}
            selectedBar={selectedBar}
          />
        </Group>
      ))}
      {isEmptyData && (
        <Text
          font={font}
          color={UIConstants.COLORS.GRAY.REGULAR}
          x={canvasWidth / 2 - textWidth! / 2}
          y={canvasHeight / 2}
          text={emptyDataText}
        />
      )}
    </Canvas>
  );
};

export default BarGraph;
