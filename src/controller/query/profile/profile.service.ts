import apiRequest from "@/controller/api/config/config";
import { me } from "@/controller/api/constant/apiLink";
import { ResponseMe } from "@/types";
import axios from "axios";
import { AnyARecord } from "node:dns";

export const _getMe = async (token: string): Promise<ResponseMe> => {
  try {
    const endpoint = me?.getAll;

    const response = await apiRequest<undefined, ResponseMe>({
      method: "GET",
      endpoint: `${endpoint}`,
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

export const _updateProfilUser = async (
  itemData: any,
  token: string,
): Promise<ResponseMe | undefined> => {
  try {
    const response = await apiRequest<any, ResponseMe>({
      method: "PUT",
      endpoint: `${me?.update}`,
      data: itemData,
      token: token,
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw new Error(error.response.data.message || "Auth error");
      } else if (error.request) {
        throw new Error(error.message);
      }
    }

    throw new Error("error server");
  }
};
export const _updatePwd = async (
  token: string,
  itemData: AnyARecord,
): Promise<ResponseMe> => {
  try {
    const response = await apiRequest<any, ResponseMe>({
      method: "PUT",
      endpoint: `${me?.pwd}`,
      data: itemData,
      token: token,
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw new Error(error.response.data.message || "Auth error");
      } else if (error.request) {
        throw new Error(error.message);
      }
    }

    throw new Error("error server");
  }
};
