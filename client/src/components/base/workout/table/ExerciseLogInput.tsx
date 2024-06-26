import { Input } from "react-native-magnus";
import UIConstants from "../../../../constants";
import { tableStyles } from "./TableStyles";

type Props = {
  isCompleted: boolean;
  value: string;
  handleOnChangeText: (value: string) => void;
};

const ExerciseLogInput = ({
  isCompleted,
  value,
  handleOnChangeText,
}: Props) => (
  <Input
    color={
      isCompleted
        ? UIConstants.COLORS.PRIMARY.CONTRAST
        : UIConstants.COLORS.GRAY.LIGHT_CONTRAST
    }
    editable={!isCompleted}
    value={value}
    onChangeText={handleOnChangeText}
    keyboardType="numeric"
    fontSize="xl"
    borderWidth={0}
    textAlign="center"
    style={tableStyles.input}
    maxLength={6}
    bg={
      isCompleted
        ? UIConstants.COLORS.PRIMARY.LIGHT
        : UIConstants.COLORS.GRAY.LIGHT
    }
  />
);

export default ExerciseLogInput;
