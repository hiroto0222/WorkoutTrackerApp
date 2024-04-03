import { TouchableOpacity, View } from "react-native";
import { Icon } from "react-native-magnus";

type Props = {
  onPress: () => void;
};

const ConfirmSelectionButton = ({ onPress }: Props) => (
  <TouchableOpacity
    style={{
      position: "absolute",
      bottom: 140,
      right: 15,
    }}
    onPress={onPress}
  >
    <View
      style={{
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: "#ed8936",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Icon fontSize="6xl" fontFamily="AntDesign" name="check" color="#fff" />
    </View>
  </TouchableOpacity>
);

export default ConfirmSelectionButton;
