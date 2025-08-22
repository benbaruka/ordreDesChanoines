import apiRequest from "@/controller/api/config/config";
import { trans } from "@/controller/api/constant/apiLink";
import {
  CreateTrans,
  ResponseBilan,
  ResponseTrans,
  ResponseUpdateTrans,
} from "@/types";
import axios from "axios";

export const _addTrans = async (
  itemData: CreateTrans,
  token: string,
): Promise<Response | undefined> => {
  try {
    const response = await apiRequest<CreateTrans, Response>({
      method: "POST",
      endpoint: `${trans?.get}`,
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

export const _updateTrans = async (
  itemData: ResponseUpdateTrans,
  token: string,
  id: string,
): Promise<Response | undefined> => {
  try {
    const response = await apiRequest<ResponseUpdateTrans, Response>({
      method: "PUT",
      endpoint: `${trans.update}`,
      data: itemData,
      token: token,
      id: id,
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

export const _getTrans = async (
  token: string,
  filters?: {
    activity_id?: string;
    end_at?: string;
    max_amount?: number;
    min_amount?: number;
    q?: string;
    start_at?: string;
    type?: number;
    user_id?: string;
  },
): Promise<ResponseTrans> => {
  try {
    const endpoint = trans?.get;
    const queryParams = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach((item) => {
              queryParams.append(key, item); // Ex: ?products=123&products=456
            });
          } else {
            queryParams.append(key, value.toString());
          }
        }
      });
    }

    const params = queryParams.toString() ? `?${queryParams.toString()}` : "";

    const response = await apiRequest<undefined, ResponseTrans>({
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
            "Erreur lors de la récupération des stocks",
        );
      } else if (error.request) {
        throw new Error(error.message);
      }
    }
    throw new Error("Erreur serveur lors de la récupération des stocks");
  }
};
export const _getBilan = async (
  token: string,
  filters?: {
    month?: string;
    year?: string;
  },
): Promise<ResponseBilan> => {
  try {
    const endpoint = trans?.bilan;
    const queryParams = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach((item) => {
              queryParams.append(key, item); // Ex: ?products=123&products=456
            });
          } else {
            queryParams.append(key, value.toString());
          }
        }
      });
    }

    const params = queryParams.toString() ? `?${queryParams.toString()}` : "";

    const response = await apiRequest<undefined, ResponseBilan>({
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
            "Erreur lors de la récupération des stocks",
        );
      } else if (error.request) {
        throw new Error(error.message);
      }
    }
    throw new Error("Erreur serveur lors de la récupération des stocks");
  }
};
