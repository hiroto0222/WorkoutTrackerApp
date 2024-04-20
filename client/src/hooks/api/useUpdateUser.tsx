import globalStyles from "components/styles";
import { showMessage } from "react-native-flash-message";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store";
import { setUserInfo } from "store/slices/user";
import axios, { API_ENDPOINTS } from "../../api";

const useUpdateUser = () => {
  const dispatch = useDispatch();

  const authState = useSelector((state: RootState) => state.auth);

  const updateUser = async (name: string, weight: string, height: string) => {
    try {
      const data = {
        name,
        weight: parseInt(weight),
        height: parseInt(height),
      };

      await axios.put(API_ENDPOINTS.USERS.PUT, data, {
        headers: {
          Authorization: "Bearer " + authState.accessToken,
        },
      });

      dispatch(setUserInfo(data));

      showMessage({
        message: "Saved user settings.",
        type: "success",
        titleStyle: globalStyles.textMedium,
      });
    } catch (err) {
      showMessage({
        message: "Failed to save user settings.",
        type: "danger",
        titleStyle: globalStyles.textMedium,
      });
    }
  };

  const validateUserSettings = (
    name: string,
    weight: string,
    height: string
  ) => {
    const nameRegex = /^[a-zA-Z\s]+$/; // Only allows alphabets and spaces
    const numRegex = /^[0-9]+$/; // Only allows numbers

    if (!nameRegex.test(name)) {
      showMessage({
        message: "Name should contain only alphabets and spaces.",
        type: "danger",
        titleStyle: globalStyles.textMedium,
      });
      return false;
    }

    if (!numRegex.test(weight)) {
      showMessage({
        message: "Weight should contain only numbers.",
        type: "danger",
        titleStyle: globalStyles.textMedium,
      });
      return false;
    }

    if (!numRegex.test(height)) {
      showMessage({
        message: "Height should contain only numbers.",
        type: "danger",
        titleStyle: globalStyles.textMedium,
      });
      return false;
    }

    return true;
  };

  return { validateUserSettings, updateUser };
};

export default useUpdateUser;
