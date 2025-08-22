import { useAlert } from "@/context/AlertProvider";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { _updateProfilUser, _updatePwd } from "./profile.service";

export const useProfileUser = (token: string) => {
  const query = useQueryClient();
  const { showAlert } = useAlert();
  return useMutation({
    mutationFn: ({ credentials }: { credentials: any }) =>
      _updateProfilUser(credentials, token),
    onSuccess: (data) => {
      showAlert({
        variant: "success",
        title: "Opération réussie",
        message: "role ajouter avec succès.",
      });
      query.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (error: any) => {
      showAlert({
        variant: "error",
        title: "Opération echoué",
        message: `Une erreur lors de l'ajout. ${error}`,
      });
    },
  });
};
export const useUpdateChangePwd = (token: string) => {
  const query = useQueryClient();
  const { showAlert } = useAlert();
  return useMutation({
    mutationFn: ({ credentials }: { credentials: any }) =>
      _updatePwd(token, credentials),
    onSuccess: () => {
      showAlert({
        variant: "success",
        title: "Suppression réussie",
        message: "Le role a été supprimé avec succès.",
      });
      query.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (error: any) => {
      showAlert({
        variant: "error",
        title: "Erreur de suppression",
        message: `Une erreur est survenue lors de la suppression. ${error}`,
      });
    },
  });
};
