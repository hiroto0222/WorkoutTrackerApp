import { auth } from "config/firebase";
import { User, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setAuth } from "store/slices/auth";

const useAuth = () => {
  const dispath = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleOnAuthStateChanged = async (user: User | null) => {
      if (user) {
        const accessToken = await user.getIdToken();
        dispath(
          setAuth({
            accessToken,
            userId: user.uid,
          })
        );
        console.log("user is logged in, access token obtained");
      } else {
        console.log("user is not logged in");
        dispath(setAuth({}));
      }
      setLoading(false);
    };

    const unsub = onAuthStateChanged(auth, handleOnAuthStateChanged);

    // unsub after launch onAuthStateChanged called
    // auth state changed handle through hook
    return unsub();
  }, []);

  return { loading };
};

export default useAuth;
