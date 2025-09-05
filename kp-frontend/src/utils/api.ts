import axios, { AxiosRequestConfig, AxiosError } from "axios";

export const strapi = (token?: string) => {
  return axios.create({
    baseURL: process.env.API_BASE_URL || "http://localhost:1337/api",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token ?? process.env.API_READ_TOKEN}`,
    },
  });
};

const request = async <T>(
  method: "get" | "post" | "put" | "delete",
  path: string,
  config?: AxiosRequestConfig<any> | undefined,
  token?: string
): Promise<ApiResponse<T>> => {
  try {
    const { status, data } = await strapi(token).request({
      withCredentials: true,
      ...config,
      method,
      url: path,
    });
    return { status, success: true, data, message: "Success" };
  } catch (error) {
    return {
      status: error instanceof AxiosError ? error.response?.status ?? 500 : 500,
      success: false,
      message:
        error instanceof AxiosError
          ? error.response?.data.error.message || error.message
          : "Unknown error",
      data: null,
    };
  }
};

export const api = {
  get: <T>(path: string, config?: AxiosRequestConfig<any>, token?: string) =>
    request<T>("get", path, config, token),
  post: <T>(
    path: string,
    data: {},
    config?: AxiosRequestConfig<any>,
    token?: string
  ) => request<T>("post", path, { data, ...config }, token),
  put: <T>(
    path: string,
    data: {},
    config?: AxiosRequestConfig<any>,
    token?: string
  ) => request<T>("put", path, { data, ...config }, token),
  delete: (path: string, config?: AxiosRequestConfig<any>, token?: string) =>
    request("delete", path, config, token),
};

// ============================ Types ============================

type ApiResponseSuccess<T> = {
  status: number;
  success: true;
  data: T;
  message?: string;
};

type ApiResponseError = {
  status: number;
  success: false;
  data: null;
  message: string;
};

export type ApiResponse<T = any> = ApiResponseSuccess<T> | ApiResponseError;
