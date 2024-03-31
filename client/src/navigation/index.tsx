import Loading from "components/base/Loading";
import usePersistenceAuth from "hooks/auth/usePersistenceAuth";
import { useSelector } from "react-redux";
import { RootState } from "store";
import AuthStack from "./AuthStack";
import UserStack from "./UserStack";

const RootNavigation = () => {
  const { loading } = usePersistenceAuth();
  const authState = useSelector((state: RootState) => state.auth);

  return loading || authState.isAuthenticating ? (
    <Loading />
  ) : authState.userId ? (
    <UserStack />
  ) : (
    <AuthStack />
  );
};

export default RootNavigation;
