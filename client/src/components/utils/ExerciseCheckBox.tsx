import { IExercise } from "api";
import { Checkbox, Div, Text } from "react-native-magnus";

type Props = {
  value: IExercise;
  handleOnChecked: (checked: boolean, exercise: IExercise) => void;
};

const ExerciseCheckBox = ({ value, handleOnChecked }: Props) => (
  <Checkbox
    value={value}
    onChecked={(checked) => handleOnChecked(checked, value)}
  >
    {({ checked }) => (
      <Div
        flex={1}
        bg={checked ? "orange600" : "orange100"}
        px="xl"
        py="lg"
        mr="md"
        mb="sm"
        rounded="circle"
      >
        <Div>
          <Text fontSize="2xl" color={checked ? "white" : "gray800"}>
            {value.name}
          </Text>
          <Text fontSize="sm" color={checked ? "white" : "gray800"}>
            {value.log_type}
          </Text>
        </Div>
      </Div>
    )}
  </Checkbox>
);

export default ExerciseCheckBox;
