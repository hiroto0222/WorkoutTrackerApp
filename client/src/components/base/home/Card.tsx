import globalStyles from "components/styles";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-magnus";
import UIConstants from "../../../constants";

type Props = {
  title: string;
  width: string;
  children: React.ReactNode;
};

const Card = ({ title, width, children }: Props) => (
  <View style={[styles.container, { width }]}>
    <Text mb={5} fontSize="xl" style={globalStyles.textLight}>
      {title}
    </Text>
    {children}
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
