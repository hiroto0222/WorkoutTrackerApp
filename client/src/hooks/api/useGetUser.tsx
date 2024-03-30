import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store";
import { setUser } from "store/slices/user";
import axios, { AxiosResponse, IUser } from "../../api";

const useGetUser = () => {
  const authState = useSelector((state: RootState) => state.auth);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const getUser = async () => {
      try {
        const res: AxiosResponse<IUser> = await axios.get("user/me", {
          headers: {
            Authorization: "Bearer " + authState.accessToken,
          },
        });
        const user = res.data.data;
        console.log(user);
        dispatch(setUser(user));
      } catch (err) {
        console.log(err);
        alert((err as Error).message);
      }
      setLoading(false);
    };

    getUser();
  }, []);

  return { loading };
};

export default useGetUser;
