import { ANDROID_CLIENT_ID, IOS_CLIENT_ID } from "@env";
import { ICreateUserRequest } from "api/types";
import { HttpStatusCode } from "axios";
import globalStyles from "components/styles";
import { auth } from "config/firebase";
import * as Google from "expo-auth-session/providers/google";
import {
  GoogleAuthProvider,
  getAdditionalUserInfo,
  signInWithCredential,
} from "firebase/auth";
import { useEffect } from "react";
import { showMessage } from "react-native-flash-message";
import { useDispatch } from "react-redux";
import { setAuth, setIsAuthenticating } from "store/slices/auth";
import axios, { API_ENDPOINTS } from "../../api";

const useGoogleLogin = () => {
  const [_, response, promptAsync] = Google.useAuthRequest({
    iosClientId: IOS_CLIENT_ID,
    androidClientId: ANDROID_CLIENT_ID,
  });
  const dispatch = useDispatch();

  useEffect(() => {
    const handleResponse = async () => {
      if (response?.type == "success") {
        try {
          // set isAuthenticating to true
          dispatch(setIsAuthenticating(true));

          // authenticate with Google
          const { id_token } = response.params;
          const credential = GoogleAuthProvider.credential(id_token);
          const userCreds = await signInWithCredential(auth, credential);
          const user = userCreds.user;
          const accessToken = await user.getIdToken();
          const firstTime = getAdditionalUserInfo(userCreds)?.isNewUser;

          // if first time login, POST /user/create
          if (firstTime) {
            const data: ICreateUserRequest = {
              id: user.uid,
              name: user.displayName || "",
              email: user.email || undefined,
              role: "user",
              photo: user.photoURL || "",
              verified: user.emailVerified,
              provider: "google.com",
              weight: 67.0,
              height: 180.0,
            };
            const res = await axios.post(API_ENDPOINTS.USERS.CREATE, data, {
              headers: {
                Authorization: "Bearer " + accessToken,
              },
            });
            if (res.status != HttpStatusCode.Created) {
              throw new Error(res.data);
            }
          }

          dispatch(
            setAuth({
              userId: user.uid,
              userCreds: user,
            })
          );
        } catch (err) {
          console.log((err as Error).message);
          showMessage({
            message: (err as Error).message,
            type: "danger",
            titleStyle: globalStyles.textMedium,
          });
          dispatch(setIsAuthenticating(false));
        }
      }
    };

    if (response) {
      handleResponse();
    }
  }, [response]);

  return { promptAsync };
};

export default useGoogleLogin;
