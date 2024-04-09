import { TouchableOpacity } from "react-native";
import { Icon } from "react-native-magnus";
import Animated, { BounceInDown, BounceOutDown } from "react-native-reanimated";
import UIConstants from "../../../constants";

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
    <Animated.View
      entering={BounceInDown}
      exiting={BounceOutDown}
      style={{
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: UIConstants.COLORS.PRIMARY.REGULAR,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Icon
        fontSize="6xl"
        fontFamily="MaterialCommunityIcons"
        name="check"
        color={UIConstants.COLORS.PRIMARY.CONTRAST}
      />
    </Animated.View>
  </TouchableOpacity>
);

export default ConfirmSelectionButton;
