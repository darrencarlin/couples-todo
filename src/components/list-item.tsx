import { cn } from "@/lib/utils";

interface Props {
  className?: string;
  children: React.ReactNode;
}

export const ListItem = ({ className, children }: Props) => {
  const classname = cn("", className);

  return <li className={classname}>{children}</li>;
};
