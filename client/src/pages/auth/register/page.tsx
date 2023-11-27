import axios, { AxiosError } from "axios";
import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useState,
  useTransition,
} from "react";
import { redirect } from "react-router-dom";
import RegisterForm from "../../../components/forms/RegisterForm";

const userRegisterService = async (
  formData: FormData,
  setError: Dispatch<SetStateAction<string | null>>
) => {
  setError(null);
  try {
    const { data } = await axios({
      url: "/api/auth/register",
      method: "post",
      data: formData,
    });

    if (typeof data?.token === "string") {
      localStorage.setItem("token", data.token);
      redirect("/");
    }
  } catch (e) {
    console.log(e);
    if (
      e instanceof AxiosError &&
      e.response?.data &&
      typeof e.response.data === "object" &&
      e.response.data !== null &&
      "message" in e.response.data &&
      typeof e.response.data.message === "string"
    ) {
      setError(e.response.data.message);
    }
  }
};

const RegisterPage = () => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<null | string>(null);

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    startTransition(() => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      userRegisterService(formData, setError);
    });
  };

  return (
    <div className="flex items-center justify-center h-screen text-white bg-gray-900">
      <div className="w-full max-w-sm p-8 bg-gray-800 rounded-lg shadow-lg">
        <div>
          <h2 className="my-6 text-3xl font-extrabold text-center text-white">
            Please sign in
          </h2>
        </div>
        <RegisterForm
          handleRegister={handleRegister}
          disabled={isPending}
          error={error}
        />
      </div>
    </div>
  );
};

export default RegisterPage;
