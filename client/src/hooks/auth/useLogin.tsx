import globalStyles from "components/styles";
import { auth } from "config/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { showMessage } from "react-native-flash-message";
import { useDispatch } from "react-redux";
import { setAuth, setIsAuthenticating } from "store/slices/auth";

const useLogin = () => {
  const dispatch = useDispatch();

  const login = async (email: string, password: string) => {
    try {
      // set isAuthenticating to true
      dispatch(setIsAuthenticating(true));

      const userCreds = await signInWithEmailAndPassword(auth, email, password);
      const user = userCreds.user;
      const accessToken = await user.getIdToken();
      dispatch(
        setAuth({
          userId: user.uid,
          accessToken,
        })
      );
    } catch (err) {
      showMessage({
        message: (err as Error).message,
        type: "danger",
        titleStyle: globalStyles.textMedium,
      });
      dispatch(setIsAuthenticating(false));
    }
  };

  return { login };
};

export default useLogin;
