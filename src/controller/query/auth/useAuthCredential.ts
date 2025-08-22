import { useRouter } from "next/navigation";
import { _login } from "./auth.service";
import { setCookie } from "cookies-next"; // 👈 Assure-toi que ceci est bien présent
import { useMutation } from "@tanstack/react-query";
import { saveAuthToken } from "../../hook/authToken";
import { useAuth } from "@/context/AuthProvider";
import { CreadentialsAuthWithPwd } from "@/types";
import { useAlert } from "@/context/AlertProvider";

export const useLogin = () => {
  const router = useRouter();
  const { showAlert } = useAlert();
  const { setIsAuthenticated, setUser, setShouldRedirect } = useAuth();

  return useMutation({
    mutationFn: (credentials: CreadentialsAuthWithPwd) => _login(credentials),
    onSuccess: (data) => {
      const token = data?.data?.token?.token;
      saveAuthToken(token!);
      localStorage.setItem("user-session", JSON.stringify(data));
      setIsAuthenticated(true);
      setUser(data!);

      setCookie("authToken", token, {
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
        sameSite: "lax",
      });

      router.push("/dashboard");
      setShouldRedirect(true);
      showAlert({
        variant: "success",
        title: "Opération réussie",
        message: "Connecté avec succès.",
      });
    },
    onError: (error: any) => {
      showAlert({
        variant: "error",
        title: "Opération echoué",
        message: `Une erreur lors de l'authentification. ${error}`,
      });
    },
  });
};
