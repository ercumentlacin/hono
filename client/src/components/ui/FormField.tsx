import clsx from "clsx";
import { ComponentPropsWithoutRef, ReactNode, forwardRef } from "react";

type FieldsetProps = ComponentPropsWithoutRef<"fieldset">;

interface Props extends FieldsetProps {
  children?: ReactNode;
}
export type Ref = HTMLFieldSetElement;

const FormField = forwardRef<Ref, Props>(
  ({ className, children, ...props }, ref) => (
    <fieldset ref={ref} {...props} className={clsx("space-y-1.5", className)}>
      {children}
    </fieldset>
  )
);

export default FormField;
