export const getToken = () => {
  let token: string | null;
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('authToken');
  }
  console.log(token!);
  return token!;
};
