import apiRequest from "@/controller/api/config/config";
import { dash } from "@/controller/api/constant/apiLink";
import {
  ResponseState,
  DashboardLineData,
  ResponseLastIn,
  ResponseTrans,
  DataResponseTrans,
  ResponsePie,
  ResponseYears,
} from "@/types";
import axios from "axios";

export const _getState = async (
  token: string,
  filters?: {
    activity_id?: string;
    end_at?: string;
    start_at?: string;
    user_id?: string;
  },
): Promise<ResponseState> => {
  try {
    const endpoint = dash?.getState;
    const queryParams = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const params = queryParams.toString() ? `?${queryParams.toString()}` : "";

    const response = await apiRequest<undefined, ResponseState>({
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

export const _getLine = async (
  token: string,
  filters?: {
    activity_id?: string;
    end_at?: string;
    start_at?: string;
    user_id?: string;
  },
): Promise<DashboardLineData> => {
  try {
    const endpoint = dash?.getLine;
    const queryParams = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const params = queryParams.toString() ? `?${queryParams.toString()}` : "";

    const response = await apiRequest<undefined, DashboardLineData>({
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
export const _getPie = async (
  token: string,
  filters?: {
    activity_id?: string;
    end_at?: string;
    start_at?: string;
    user_id?: string;
  },
): Promise<ResponsePie> => {
  try {
    const endpoint = dash?.getPie;
    const queryParams = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const params = queryParams.toString() ? `?${queryParams.toString()}` : "";

    const response = await apiRequest<undefined, ResponsePie>({
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

export const _getLastIn = async (
  token: string,
  filters?: {
    activity_id?: string;
    limit?: number;
    user_id?: string;
  },
): Promise<DataResponseTrans> => {
  try {
    const endpoint = dash?.getLast;
    const queryParams = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const params = queryParams.toString() ? `?${queryParams.toString()}` : "";

    const response = await apiRequest<undefined, DataResponseTrans>({
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
export const _getYear = async (
  token: string,
  filters?: {
    activity_id?: string;
    limit?: number;
    user_id?: string;
  },
): Promise<ResponseYears> => {
  try {
    const endpoint = dash?.years;
    const queryParams = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const params = queryParams.toString() ? `?${queryParams.toString()}` : "";

    const response = await apiRequest<undefined, ResponseYears>({
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
