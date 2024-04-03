import { TouchableOpacity, View } from "react-native";
import { Icon } from "react-native-magnus";
import UIConstants from "../../../../constants";

type Props = {
  onPress: () => void;
};

const ExerciseLogInputConfirmButton = ({ onPress }: Props) => (
  <TouchableOpacity onPress={onPress}>
    <View
      style={{
        width: 50,
        height: 30,
        borderRadius: 20,
        backgroundColor: UIConstants.COLORS.PRIMARY.REGULAR,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Icon fontSize="3xl" fontFamily="AntDesign" name="check" color="#fff" />
    </View>
  </TouchableOpacity>
);

export default ExerciseLogInputConfirmButton;
