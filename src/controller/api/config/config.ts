import axios, {
  AxiosRequestConfig,
  AxiosResponse,
  Method,
  AxiosResponseHeaders,
} from "axios";
import { baseURL } from "./baseUrl";

// Définir un type générique pour la réponse attendue
interface ApiResponse<ResponseType> {
  data: ResponseType;
  status: number;
  statusText: string;
  headers: AxiosResponseHeaders;
  config: AxiosRequestConfig;
  request?: unknown;
}

// Configuration initiale d'Axios avec support des cookies (sessions)
const api = axios.create({
  baseURL: `${baseURL}`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // ✅ Important : permet d'envoyer/recevoir les cookies (sessions)
});

// Interface pour les paramètres de requête
interface ApiRequestParams<RequestType> {
  method: Method;
  endpoint: string;
  data?: RequestType;
  params?: Record<string, string | number | boolean>;
  id?: string | number;
  token?: string;
}

// Fonction générique pour exécuter toutes les requêtes HTTP
const apiRequest = async <RequestType, ResponseType>({
  method,
  endpoint,
  data,
  params,
  id,
  token,
}: ApiRequestParams<RequestType>): Promise<ApiResponse<ResponseType>> => {
  const url = id ? `${endpoint}/${id}` : endpoint;

  const headers: Record<string, string> = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const config: AxiosRequestConfig = {
    method,
    url,
    headers,
    data,
    params,
    withCredentials: true, // ✅ Encore ici au cas où une requête soit faite sans passer par `api`
  };

  try {
    const response: AxiosResponse<ResponseType> = await api(config);
    return {
      data: response.data,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers as AxiosResponseHeaders,
      config: response.config,
      request: response.request,
    };
  } catch (error) {
    throw error;
  }
};

export default apiRequest;
