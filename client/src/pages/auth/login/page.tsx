import { FormEvent } from "react";
import { Link } from "react-router-dom";

const LoginPage = () => {
  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    console.log({ formData, action: e.currentTarget.action });
  };

  return (
    <div className="h-full min-h-screen bg-[#0f0f0f] text-zinc-100">
      <div className="flex items-center justify-center min-h-screen">
        <form
          action="post"
          onSubmit={handleLogin}
          className="flex flex-col w-full max-w-sm gap-2 p-3 rounded-lg shadow shadow-black/10 bg-[lch(8%_0_157deg)] border-[#363636] border"
        >
          <fieldset className="space-y-1">
            <label htmlFor="email" className="text-sm text-[lch(62%_0_157deg)]">
              Email
            </label>
            <input
              name="email"
              id="email"
              type="email"
              className="w-full h-8 px-2 py-1 text-sm transition-colors border border-solid rounded shadow-sm outline-none bg-[lch(16%_0_157deg)] border-zinc-800 placeholder:text-[lch(62%_0_157deg)] text-zinc-400 placeholder:text-sm focus:border-orange-500/40 focus:shadow-orange-700/20"
              placeholder="Enter an email"
            />
          </fieldset>

          <fieldset>
            <label htmlFor="password" className="text-sm text-[lch(62%_0_157deg)]">
              Password
            </label>
            <input
              name="password"
              id="password"
              type="password"
              className="w-full h-8 px-2 py-1 text-sm transition-colors border border-solid rounded shadow-sm outline-none bg-[lch(16%_0_157deg)] border-zinc-800 placeholder:text-[lch(62%_0_157deg)] text-zinc-400 placeholder:text-sm focus:border-orange-500/40 focus:shadow-orange-700/20"
              placeholder="Enter password"
            />
          </fieldset>

          <div className="space-y-2">
            <button
              type="submit"
              className="grid w-full h-8 mt-4 text-sm transition-colors border rounded outline-none bg-[#0f0f0f] hover:bg-zinc-950 place-items-center border-zinc-800 focus:border-orange-500/40 focus:shadow-orange-700/20"
            >
              Login
            </button>
            <div className="text-sm leading-7 text-center text-[lch(36%_0_157deg)] relative before:absolute before:w-4/12 before:h-[1px] before:bg-[lch(26%_0_157deg)] before:left-0 before:top-2/4 before:-translate-y-2/4 after:absolute after:w-4/12 after:h-[1px] after:bg-[lch(26%_0_157deg)] after:right-0 after:top-2/4 after:-translate-y-2/4">
              or
            </div>
            <Link
              className="grid w-full h-8 mt-4 text-sm transition-colors bg-transparent border rounded outline-none hover:bg-zinc-950 place-items-center border-[lch(36%_0_157deg)] focus:border-orange-500/40 focus:shadow-orange-700/20"
              to="/auth/register"
              role="link"
              tabIndex={-1}
              rel="noopener noreferrer"
            >
              Register
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
