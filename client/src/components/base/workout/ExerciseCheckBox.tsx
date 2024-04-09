import { IExerciseResponse } from "api/types";
import globalStyles from "components/styles";
import { useState } from "react";
import { TouchableOpacity } from "react-native";
import { Div, Text } from "react-native-magnus";
import UIConstants from "../../../constants";

type Props = {
  value: IExerciseResponse;
  disabled: boolean;
  handleOnChecked: (checked: boolean, exercise: IExerciseResponse) => void;
};

const ExerciseCheckBox = ({ value, disabled, handleOnChecked }: Props) => {
  const [checked, setChecked] = useState(false);

  const handleOnPress = () => {
    handleOnChecked(!checked, value);
    setChecked((prevChecked) => !prevChecked);
  };

  return (
    <TouchableOpacity
      disabled={disabled}
      style={{
        backgroundColor: disabled
          ? UIConstants.COLORS.GRAY.REGULAR
          : checked
          ? UIConstants.COLORS.PRIMARY.REGULAR
          : UIConstants.COLORS.GRAY.LIGHT,
        width: "100%",
        borderRadius: UIConstants.STYLES.BORDER_RADIUS,
        paddingVertical: 10,
        paddingHorizontal: 15,
        marginBottom: 10,
      }}
      onPress={handleOnPress}
    >
      <Div>
        <Text
          fontSize="2xl"
          color={
            disabled
              ? UIConstants.COLORS.GRAY.REGULAR_CONTRAST
              : UIConstants.COLORS.PRIMARY.CONTRAST
          }
          style={globalStyles.textRegular}
        >
          {value.name}
        </Text>
        <Text
          fontSize="sm"
          color={
            disabled
              ? UIConstants.COLORS.GRAY.REGULAR_CONTRAST
              : UIConstants.COLORS.PRIMARY.CONTRAST
          }
          style={globalStyles.textLight}
        >
          Category
        </Text>
      </Div>
    </TouchableOpacity>
  );
};

export default ExerciseCheckBox;
