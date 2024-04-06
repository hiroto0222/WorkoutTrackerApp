import { IExerciseResponse } from "api/types";
import globalStyles from "components/styles";
import { Checkbox, Div, Text } from "react-native-magnus";
import UIConstants from "../../../constants";

type Props = {
  value: IExerciseResponse;
  disabled: boolean;
  handleOnChecked: (checked: boolean, exercise: IExerciseResponse) => void;
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
        bg={
          checked
            ? UIConstants.COLORS.PRIMARY.REGULAR
            : UIConstants.COLORS.GRAY.LIGHT
        }
        px="xl"
        py="lg"
        mr="md"
        mb="sm"
        rounded="circle"
      >
        <Div>
          <Text
            fontSize="2xl"
            color={checked ? "white" : "black"}
            style={globalStyles.textRegular}
          >
            {value.name}
          </Text>
          <Text
            fontSize="sm"
            color={checked ? "white" : "black"}
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
