import apiRequest from "@/controller/api/config/config";
import { activity } from "@/controller/api/constant/apiLink";
import { CreateActivity, ResponseActivities, ResponseActivity } from "@/types";
import axios from "axios";

export const _getActivity = async (
  token: string,
  filters?: {
    limit?: number;
    page?: number;
    search?: string;
  },
): Promise<ResponseActivities> => {
  try {
    const endpoint = activity?.get;
    const queryParams = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const params = queryParams.toString() ? `?${queryParams.toString()}` : "";

    const response = await apiRequest<undefined, ResponseActivities>({
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

export const _addActivity = async (
  itemData: CreateActivity,
  token: string,
): Promise<ResponseActivity | undefined> => {
  try {
    const response = await apiRequest<CreateActivity, ResponseActivity>({
      method: "POST",
      endpoint: `${activity?.get}`,
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

export const _updateActivity = async (
  itemData: CreateActivity,
  token: string,
  id: string,
): Promise<ResponseActivities | undefined> => {
  try {
    const response = await apiRequest<CreateActivity, ResponseActivities>({
      method: "PUT",
      endpoint: `${activity.update}`,
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
// export const _deleteRole = async (
//   token: string,
//   id: string,
// ): Promise<ResponseRole> => {
//   try {
//     const response = await apiRequest<undefined, ResponseRole>({
//       method: "DELETE",
//       endpoint: `${role?.get}`,
//       token: token,
//       id: id,
//     });

//     return response.data;
//   } catch (error) {
//     if (axios.isAxiosError(error)) {
//       if (error.response) {
//         throw new Error(error.response.data.message || "Auth error");
//       } else if (error.request) {
//         throw new Error(error.message);
//       }
//     }

//     throw new Error("error server");
//   }
// };
