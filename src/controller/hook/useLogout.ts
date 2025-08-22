import { useRouter } from "next/navigation";
import { deleteCookie } from "cookies-next";
import { useAuth } from "@/context/AuthProvider";
import { useAlert } from "@/context/AlertProvider";
import { useQueryClient } from "@tanstack/react-query";

export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setIsAuthenticated, setUser } = useAuth();
  const { showAlert } = useAlert();

  const logout = async () => {
    // 1. Nettoyage des données (auth + cache)
    deleteCookie("authToken");
    localStorage.removeItem("authToken");
    localStorage.removeItem("user-session");
    setIsAuthenticated(false);
    setUser(null);
    queryClient.clear();

    // 2. Affichage de l'alerte
    showAlert({
      variant: "success",
      title: "Déconnexion",
      message: "Vous avez été déconnecté avec succès.",
    });

    // 3. Redirection après un petit délai (facultatif)
    setTimeout(() => {
      router.replace("/signin");
    }, 100); // petit délai pour laisser l'alerte s'afficher
  };

  return logout;
};
