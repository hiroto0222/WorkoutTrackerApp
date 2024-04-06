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
  <TouchableOpacity
    onPress={isComplete ? onEdit : onComplete}
    style={{
      paddingVertical: 5,
      paddingHorizontal: 15,
    }}
  >
    <View
      style={{
        width: 40,
        height: 30,
        borderRadius: UIConstants.STYLES.BORDER_RADIUS,
        backgroundColor: isComplete
          ? UIConstants.COLORS.GRAY.LIGHT
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
          color="#000"
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
