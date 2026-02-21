import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';
import Spinner from '../components/Spinner';
import { getUser } from './reducer/authReducer';

const PrivateRoute = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo, loading, error } = useSelector((state) => state.auth);
  const [ok, setOk] = useState(true);

  // Memoize the userInfo processing to avoid unnecessary computations
  const processedUserInfo = useMemo(() => {
    return userInfo ? userInfo : null;
  }, [userInfo]);

  useEffect(() => {
    if (!processedUserInfo) {
      dispatch(getUser());
    }
  }, [dispatch, processedUserInfo]);

  useEffect(() => {
    setOk(!!processedUserInfo);
  }, [processedUserInfo]);

  useEffect(() => {
    if (error && !loading) {
      localStorage.removeItem('auth');
      navigate('/');
    }
  }, [error, loading, navigate]);

  return ok ? <Outlet /> : <Spinner />;
};

export default PrivateRoute;
