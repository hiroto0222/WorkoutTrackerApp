import globalStyles from "components/styles";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-magnus";
import UIConstants from "../../../constants";

type Props = {
  title: string;
  width: string;
};

const Card = ({ title, width }: Props) => (
  <View style={[styles.container, { width }]}>
    <Text mb={5} fontSize="lg" style={globalStyles.textLight}>
      {title}
    </Text>
    <Text fontSize="lg" style={globalStyles.textMedium}>
      {12.36}s
    </Text>
  </View>
);

export default Card;

const styles = StyleSheet.create({
  container: {
    backgroundColor: UIConstants.COLORS.GRAY.LIGHT,
    borderRadius: 20,
    marginVertical: 10,
    paddingVertical: 20,
    paddingHorizontal: 15,
    alignItems: "flex-start",
  },
});
