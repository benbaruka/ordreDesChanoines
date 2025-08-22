import { useAlert } from "@/context/AlertProvider";
import { CreateTrans, ResponseUpdateTrans } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { _addTrans, _updateTrans } from "./trans.service";

export const useTransaction = (token: string) => {
  const query = useQueryClient();
  const { showAlert } = useAlert();
  return useMutation({
    mutationFn: (credentials: CreateTrans) => _addTrans(credentials, token),
    onSuccess: (data) => {
      showAlert({
        variant: "success",
        title: "Opération réussie",
        message: "role ajouter avec succès.",
      });
      query.invalidateQueries({ queryKey: ["trans"] });
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

export const useUpdateTransaction = (token: string) => {
  const query = useQueryClient();
  const { showAlert } = useAlert();
  return useMutation({
    mutationFn: ({
      credentials,
      id,
    }: {
      credentials: ResponseUpdateTrans;
      id: string;
    }) => _updateTrans(credentials, token, id),
    onSuccess: (data) => {
      showAlert({
        variant: "success",
        title: "Opération réussie",
        message: "role ajouter avec succès.",
      });
      query.invalidateQueries({ queryKey: ["trans"] });
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
