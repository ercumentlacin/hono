import clsx from "clsx";
import { ComponentPropsWithoutRef, ReactNode, forwardRef } from "react";

type InputProps = ComponentPropsWithoutRef<"label">;

interface Props extends InputProps {
  children?: ReactNode;
}
export type Ref = HTMLLabelElement;

const InputLabel = forwardRef<Ref, Props>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    {...props}
    className={clsx("block text-sm font-medium text-gray-300", className)}
  />
));

export default InputLabel;
