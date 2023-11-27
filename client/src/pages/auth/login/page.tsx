import { FormEvent } from "react";
import LoginForm from "../../../components/forms/LoginForm";
import useLogin from "./helpers/hook/useLogin";

const LoginPage = () => {
  const { errorMessage, isPending, mutateAsync } = useLogin();

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutateAsync(e.currentTarget);
  };

  return (
    <div className="flex items-center justify-center h-screen text-white bg-gray-900">
      <div className="w-full max-w-sm p-8 bg-gray-800 rounded-lg shadow-lg">
        <div>
          <h2 className="my-6 text-3xl font-extrabold text-center text-white">
            Please sign up
          </h2>
        </div>
        <LoginForm
          handleLogin={handleLogin}
          disabled={isPending}
          error={errorMessage}
        />
      </div>
    </div>
  );
};

export default LoginPage;
