import clsx from "clsx";
import { ComponentPropsWithoutRef, FormEvent, Suspense, lazy } from "react";
import { Link } from "react-router-dom";
import Alert from "../ui/Alert";
import FormField from "../ui/FormField";
import InputLabel from "../ui/InputLabel";
import TextField from "../ui/TextField";

const SpinnerDefault = lazy(() => import("../ui/SpinnerDefault"));

type Props = ComponentPropsWithoutRef<"form"> & {
  handleRegister: (e: FormEvent<HTMLFormElement>) => Promise<void>;
  disabled: boolean;
  error: string | null;
};

const RegisterForm = ({ error, disabled, handleRegister }: Props) => (
  <form onSubmit={handleRegister} className="flex flex-col space-y-4">
    <FormField disabled={disabled}>
      <InputLabel htmlFor="username">Username</InputLabel>
      <TextField
        name="username"
        id="username"
        placeholder="Enter an username"
      />
    </FormField>

    <FormField disabled={disabled}>
      <InputLabel htmlFor="email">Email</InputLabel>
      <TextField
        name="email"
        id="email"
        type="email"
        placeholder="Enter an email"
      />
    </FormField>

    <FormField disabled={disabled}>
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
        "Register"
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
      to="/auth/login"
      role="link"
      tabIndex={-1}
      rel="noopener noreferrer"
    >
      Login
    </Link>
  </form>
);

export default RegisterForm;
