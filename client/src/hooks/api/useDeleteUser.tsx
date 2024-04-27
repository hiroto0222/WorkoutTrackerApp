import axios, { API_ENDPOINTS, AxiosResponse } from "api";
import globalStyles from "components/styles";
import { showMessage } from "react-native-flash-message";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store";
import { setAuth } from "store/slices/auth";

const useDeleteUser = () => {
  const dispatch = useDispatch();

  const authState = useSelector((state: RootState) => state.auth);

  const deleteUser = async () => {
    try {
      const res: AxiosResponse = await axios.delete(
        API_ENDPOINTS.USERS.DELETE,
        {
          headers: {
            Authorization: "Bearer " + authState.accessToken,
          },
        }
      );

      console.log(res.data.message);

      dispatch(setAuth({}));
    } catch (err) {
      showMessage({
        message: (err as Error).message,
        type: "danger",
        titleStyle: globalStyles.textMedium,
      });
    }
  };

  return { deleteUser };
};

export default useDeleteUser;
