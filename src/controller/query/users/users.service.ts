import axios from "axios";
import apiRequest from "../../api/config/config";
import { me, users } from "@/controller/api/constant/apiLink";
import {
  ResponseUser
} from "@/types";

export const _getAllUser = async (
  token: string,
  filters?: {
    q?: string;
    limit?: number;
    page?: number;
  },
): Promise<ResponseUser> => {
  try {
    const endpoint = users?.getAll;
    const queryParams = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const params = queryParams.toString() ? `?${queryParams.toString()}` : "";

    const response = await apiRequest<undefined, ResponseUser>({
      method: "GET",
      endpoint: `${endpoint}${params}`,
      token: token,
    });

    return response?.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw new Error(
          error.response.data.message ||
            "Erreur lors de la récupération des étudiants",
        );
      } else if (error.request) {
        throw new Error(error.message);
      }
    }
    throw new Error("Erreur serveur lors de la récupération des étudiants");
  }
};
