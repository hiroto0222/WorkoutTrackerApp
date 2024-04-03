import { TouchableOpacity, View } from "react-native";
import { Icon } from "react-native-magnus";
import UIConstants from "../../../../constants";

type Props = {
  isComplete: boolean;
  onComplete: () => void;
  onEdit: () => void;
};

const ExerciseLogInputConfirmButton = ({
  isComplete,
  onComplete,
  onEdit,
}: Props) => (
  <TouchableOpacity onPress={isComplete ? onEdit : onComplete}>
    <View
      style={{
        width: 50,
        height: 30,
        borderRadius: 20,
        backgroundColor: isComplete
          ? UIConstants.COLORS.GRAY.REGULAR
          : UIConstants.COLORS.PRIMARY.REGULAR,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {isComplete ? (
        <Icon
          fontSize="3xl"
          fontFamily="MaterialCommunityIcons"
          name="pencil"
          color="#fff"
        />
      ) : (
        <Icon
          fontSize="3xl"
          fontFamily="MaterialCommunityIcons"
          name="check"
          color="#fff"
        />
      )}
    </View>
  </TouchableOpacity>
);

export default ExerciseLogInputConfirmButton;
