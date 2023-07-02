import useAuth from "hooks/useAuth";
import { useSelector } from "react-redux";
import { RootState } from "store";
import AuthStack from "./AuthStack";
import UserStack from "./UserStack";

const RootNavigation = () => {
  useAuth();
  const user = useSelector((state: RootState) => state.auth);
  return user.userId ? <UserStack /> : <AuthStack />;
};

export default RootNavigation;
