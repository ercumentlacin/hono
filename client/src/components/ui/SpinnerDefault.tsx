import clsx from "clsx";
import { Loader2 } from "lucide-react";
import { ComponentProps } from "react";

type Props = ComponentProps<typeof Loader2>;

const SpinnerDefault = ({ className, ...props }: Props) => (
  <Loader2
    {...props}
    className={clsx("text-current animate-spin", className)}
  />
);

export default SpinnerDefault;
