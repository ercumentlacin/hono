import { useMutation } from "@tanstack/react-query";
import axios, { AxiosResponse, isAxiosError } from "axios";
import { useNavigate } from "react-router-dom";

export const userLoginAction = (data: FormData) => {
  return axios.post<
    FormData,
    AxiosResponse<{ token: string }, { error: string; success: boolean }>
  >("/api/auth/login", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

const useLogin = () => {
  let errorMessage: string | null = null;

  const navigate = useNavigate();

  const { mutateAsync, error, isPending, data } = useMutation({
    mutationFn: async (e: EventTarget & HTMLFormElement) => {
      const formData = new FormData(e);
      return userLoginAction(formData);
    },
    onSuccess: ({ data }) => {
      console.log("onSuccess data", data);
      if (typeof data === "object" && typeof data.token) {
        localStorage.setItem("token", data.token);
      }
      navigate("/");
    },
  });

  if (isAxiosError(error)) {
    errorMessage = error.response?.data.message;
  }

  return { mutateAsync, errorMessage, isPending, data };
};

export default useLogin;
