import clsx from "clsx";
import { ComponentPropsWithoutRef, FormEvent, Suspense } from "react";
import { Link } from "react-router-dom";
import Alert from "../ui/Alert";
import FormField from "../ui/FormField";
import InputLabel from "../ui/InputLabel";
import SpinnerDefault from "../ui/SpinnerDefault";
import TextField from "../ui/TextField";

type Props = ComponentPropsWithoutRef<"form"> & {
  handleLogin: (e: FormEvent<HTMLFormElement>) => Promise<void>;
  disabled: boolean;
  error: string | null;
};

const LoginForm = ({ handleLogin, disabled, error }: Props) => (
  <form onSubmit={handleLogin} className="flex flex-col space-y-4">
    <FormField>
      <InputLabel htmlFor="email">Email</InputLabel>
      <TextField
        name="email"
        id="email"
        type="email"
        placeholder="Enter email"
      />
    </FormField>
    <FormField>
      <InputLabel htmlFor="password">Password</InputLabel>
      <TextField
        name="password"
        id="password"
        type="password"
        placeholder="Enter password"
      />
    </FormField>

    {error && <Alert>{error}</Alert>}

    <button
      disabled={disabled}
      type="submit"
      className="flex justify-center px-4 py-2 font-bold text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
    >
      {disabled ? (
        <Suspense fallback={null}>
          <SpinnerDefault />
        </Suspense>
      ) : (
        "Login"
      )}
    </button>
    <div className="flex items-center my-4 after:content-[''] after:flex-1 after:h-[1px] after:bg-white before:content-[''] before:flex-1 before:h-[1px] before:bg-white">
      <div className="mx-2 text-center text-gray-400">or</div>
    </div>
    <Link
      className={clsx(
        "px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-md text-center",
        disabled && "pointer-events-none"
      )}
      to="/auth/register"
      role="link"
      tabIndex={-1}
      rel="noopener noreferrer"
    >
      Register
    </Link>
  </form>
);

export default LoginForm;
