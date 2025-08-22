'use client';

// import Cookies from "js-cookie";

const useAuth = () => {
  const token = localStorage.getItem('authToken');
  const User = JSON.parse(localStorage.getItem('user-session')!);
  // React Query to manage session state
  const idRole = User?.data?.role;
  const nameUser = User?.data?.username;
  const avatarUser = User?.data?.avatar;

  return {
    token,
    idRole,
    User,
    nameUser,
    avatarUser,
  };
};

export default useAuth;
