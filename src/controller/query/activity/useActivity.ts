import { useAlert } from "@/context/AlertProvider";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { _addActivity, _updateActivity } from "./activity.service";
import { CreateActivity } from "@/types";

export const useActivity = (token: string) => {
  const query = useQueryClient();
  const { showAlert } = useAlert();
  return useMutation({
    mutationFn: (credentials: CreateActivity) =>
      _addActivity(credentials, token),
    onSuccess: (data) => {
      showAlert({
        variant: "success",
        title: "Opération réussie",
        message: "role ajouter avec succès.",
      });
      query.invalidateQueries({ queryKey: ["Activity"] });
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

export const useUpadateActivity = (token: string) => {
  const query = useQueryClient();
  const { showAlert } = useAlert();
  return useMutation({
    mutationFn: ({
      credentials,
      id,
    }: {
      credentials: CreateActivity;
      id: string;
    }) => _updateActivity(credentials, token, id),
    onSuccess: (data) => {
      showAlert({
        variant: "success",
        title: "Opération réussie",
        message: "role ajouter avec succès.",
      });
      query.invalidateQueries({ queryKey: ["Activity"] });
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
