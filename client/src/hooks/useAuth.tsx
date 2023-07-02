import { auth } from "config/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setAuth } from "store/slices/auth";

const useAuth = () => {
  const dispath = useDispatch();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("user is logged in");
        user.getIdToken().then((accessToken) => {
          dispath(
            setAuth({
              accessToken,
              userId: user.uid,
              displayName: user.displayName || undefined,
              photoURL: user.photoURL || undefined,
            })
          );
        });
      } else {
        console.log("user is not logged in");
        dispath(setAuth({}));
      }
    });

    return unsub;
  }, []);
};

export default useAuth;
