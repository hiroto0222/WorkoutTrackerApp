import Loading from "components/base/Loading";
import usePersistenceAuth from "hooks/auth/usePersistenceAuth";
import { useSelector } from "react-redux";
import { RootState } from "store";
import RootStack from "./RootStack";
import WelcomeStack from "./WelcomeStack";

const RootNavigation = () => {
  const { loading } = usePersistenceAuth();
  const authState = useSelector((state: RootState) => state.auth);

  return loading || authState.isAuthenticating ? (
    <Loading />
  ) : authState.userId ? (
    <RootStack />
  ) : (
    <WelcomeStack />
  );
};

export default RootNavigation;
