import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLazyGetProfileQuery } from "../../redux/api/users";
import {
  logout,
  setAuthChecked,
  setCredentials,
} from "../../redux/features/auth/authSlice";

const AuthBootstrap = () => {
  const dispatch = useDispatch();
  const [getProfile, { data, isSuccess, isError, error }] =
    useLazyGetProfileQuery();

  useEffect(() => {
    dispatch(setAuthChecked(false));
    getProfile();
  }, [dispatch, getProfile]);

  useEffect(() => {
    if (isSuccess && data) {
      dispatch(setCredentials(data));
    }
  }, [data, dispatch, isSuccess]);

  useEffect(() => {
    if (!isError) {
      return;
    }

    if (error?.status === 401 || error?.status === 403) {
      dispatch(logout());
      return;
    }

    dispatch(setAuthChecked(true));
  }, [dispatch, error, isError]);

  return null;
};

export default AuthBootstrap;
