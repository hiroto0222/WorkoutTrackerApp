import { ICreateUserRequest } from "api/types";
import { HttpStatusCode } from "axios";
import { auth } from "config/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useDispatch } from "react-redux";
import { setAuth } from "store/slices/auth";
import axios, { API_ENDPOINTS } from "../../api";

const useSignUp = () => {
  const dispatch = useDispatch();

  const signUp = async (email: string, password: string) => {
    try {
      const userCreds = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCreds.user;
      const accessToken = await user.getIdToken();

      const data: ICreateUserRequest = {
        id: user.uid,
        name: user.displayName || "no name",
        email: user.email || undefined,
        role: "user",
        photo: user.photoURL || "",
        verified: user.emailVerified,
        provider: "email",
        weight: 67.0,
        height: 180.0,
      };

      console.log(data);

      const res = await axios.post(API_ENDPOINTS.USERS.CREATE, data, {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      });

      if (res.status != HttpStatusCode.Created) {
        throw new Error(res.data);
      }

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

  return { signUp };
};

export default useSignUp;
