import { TouchableOpacity, View } from "react-native";
import { Icon } from "react-native-magnus";

type Props = {
  onPress: () => void;
};

const ExerciseLogInputConfirmButton = ({ onPress }: Props) => (
  <TouchableOpacity onPress={onPress}>
    <View
      style={{
        width: 40,
        height: 40,
        borderRadius: 35,
        backgroundColor: "#ed8936",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Icon fontSize="3xl" fontFamily="AntDesign" name="check" color="#fff" />
    </View>
  </TouchableOpacity>
);

export default ExerciseLogInputConfirmButton;
