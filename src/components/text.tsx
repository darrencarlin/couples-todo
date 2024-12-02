import { cn } from "@/lib/utils";

interface Props {
  className?: string;
  children: React.ReactNode;
}

export const Text = ({ className, children }: Props) => {
  const classname = cn("mb-4", className);
  return <p className={classname}>{children}</p>;
};
