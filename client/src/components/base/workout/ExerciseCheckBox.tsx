import { IExercise } from "api/types";
import globalStyles from "components/styles";
import { Checkbox, Div, Text } from "react-native-magnus";

type Props = {
  value: IExercise;
  disabled: boolean;
  handleOnChecked: (checked: boolean, exercise: IExercise) => void;
};

const ExerciseCheckBox = ({ value, disabled, handleOnChecked }: Props) => (
  <Checkbox
    value={value}
    disabled={disabled}
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
          <Text
            fontSize="2xl"
            color={checked ? "white" : "gray800"}
            style={globalStyles.textRegular}
          >
            {value.name}
          </Text>
          <Text
            fontSize="sm"
            color={checked ? "white" : "gray800"}
            style={globalStyles.textLight}
          >
            {value.log_type}
          </Text>
        </Div>
      </Div>
    )}
  </Checkbox>
);

export default ExerciseCheckBox;
