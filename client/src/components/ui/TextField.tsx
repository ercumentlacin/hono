import clsx from "clsx";
import { ComponentPropsWithoutRef, forwardRef } from "react";

type InputProps = ComponentPropsWithoutRef<"input">;

interface Props extends InputProps {}

type Ref = HTMLInputElement;

const TextField = forwardRef<Ref, Props>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    {...props}
    className={clsx(
      "mt-1 px-3 py-2 bg-gray-700 text-white block w-full border-gray-600 rounded-md",
      className
    )}
  />
));

export default TextField;
