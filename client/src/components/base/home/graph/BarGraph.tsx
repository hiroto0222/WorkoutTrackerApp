import { useNavigation } from "@react-navigation/native";
import { Canvas, Group } from "@shopify/react-native-skia";
import * as d3 from "d3";
import { useCallback, useEffect } from "react";
import { GestureResponderEvent, useWindowDimensions } from "react-native";
import { useSharedValue, withTiming } from "react-native-reanimated";
import BarPath from "./BarPath";
import XAxisText from "./XAxisText";

interface Data {
  label: string;
  day: string;
  value: number;
}

const data: Data[] = [
  { label: "2/18", day: "Monday", value: 3 },
  { label: "2/25", day: "Tuesday", value: 4 },
  { label: "3/3", day: "Wednesday", value: 2 },
  { label: "3/10", day: "Thursday", value: 6 },
  { label: "3/17", day: "Friday", value: 4 },
  { label: "3/24", day: "Saturday", value: 0 },
  { label: "3/31", day: "Sunday", value: 1 },
];

const BarGraph = () => {
  const navigation = useNavigation();

  const { width } = useWindowDimensions();
  const progress = useSharedValue(0);
  const selectedBar = useSharedValue<string | null>(null);

  const canvasWidth = width;
  const canvasHeight = 200;

  const graphWidth = width;
  const graphMargin = 25;
  const graphHeight = canvasHeight - graphMargin;

  const barWidth = 30;

  const xRange = [0, graphWidth];
  const xDomain = data.map((dataPoint) => dataPoint.label);
  const x = d3.scalePoint().domain(xDomain).range(xRange).padding(1);

  const yRange = [0, graphHeight];
  const yDomain = [0, d3.max(data, (yDataPoint: Data) => yDataPoint.value)!];
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
      const { label, value, day } = data[index];

      if (
        touchX > x(label)! - barWidth / 2 &&
        touchX < x(label)! + barWidth / 2 &&
        touchY > graphHeight - y(value) &&
        touchY < graphHeight
      ) {
        selectedBar.value = label;
        console.log({ label, value, day });
      } else {
        selectedBar.value = null;
        console.log("outside");
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
      {data.map((dataPoint: Data, index) => (
        <Group key={index}>
          <BarPath
            x={x(dataPoint.label)!}
            y={y(dataPoint.value)}
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
    </Canvas>
  );
};

export default BarGraph;
