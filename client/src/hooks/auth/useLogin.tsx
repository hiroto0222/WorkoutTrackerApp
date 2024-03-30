import { auth } from "config/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useDispatch } from "react-redux";
import { setAuth } from "store/slices/auth";

const useLogin = () => {
  const dispatch = useDispatch();

  const login = async (email: string, password: string) => {
    try {
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
      alert((err as Error).message);
    }
  };

  return { login };
};

export default useLogin;
