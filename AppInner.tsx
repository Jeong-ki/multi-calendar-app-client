import React, {useEffect} from 'react';
import {useUserStore} from '@/stores';
import AppStack from '@/navigation/app-stack';
import LoginStack from '@/navigation/login-stack';
import {loadRefreshToken, removeRefreshToken, saveRefreshToken} from '@/utils';
import {refreshUser} from '@/api/auth';

export default function AppInner() {
  const {user, setUser, logout} = useUserStore();

  useEffect(() => {
    const rememberMe = async () => {
      try {
        const refreshToken = await loadRefreshToken();
        if (!refreshToken) {
          // SplashScreen.hide(); TODO: SplashScreen 구현 필요
          return;
        }
        const response = await refreshUser(refreshToken);
        const {
          id,
          email,
          newAccessToken: accessToken,
          newRefreshToken,
        } = response;
        await saveRefreshToken(newRefreshToken);
        setUser({id, email, accessToken});
      } catch (error) {
        console.error('Fail RememberMe: ', error);
        await removeRefreshToken();
        logout();
      } finally {
        // SplashScreen.hide(); TODO: SplashScreen 구현 필요
      }
    };
    rememberMe();
  }, [logout, setUser]);

  return user ? <AppStack /> : <LoginStack />;
}
