import clsx from "clsx";
import { ComponentPropsWithoutRef, ReactNode } from "react";

type Props = ComponentPropsWithoutRef<"p"> & {
  children: ReactNode;
  variant?: "error" | "success" | "info" | "warning";
};

const Alert = ({ children, className, variant = "error", ...props }: Props) => (
  <p
    {...props}
    className={clsx(
      "px-4 py-1 mb-4 rounded select-none",

      variant === "error" && "text-red-300 bg-red-800 border border-red-700",
      variant === "success" &&
        "text-green-300 bg-green-800 border border-green-700",
      variant === "info" && "text-blue-300 bg-blue-800 border border-blue-700",
      variant === "warning" &&
        "text-yellow-300 bg-yellow-800 border border-yellow-700",

      className
    )}
  >
    {children}
  </p>
);

export default Alert;
