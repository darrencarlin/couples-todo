import { cn } from "@/lib/utils";

interface Props {
  as: "h1" | "h2" | "h3" | "h4";
  className?: string;
  children: React.ReactNode;
}

export const Heading = ({ as, className, children }: Props) => {
  switch (as) {
    case "h1":
      return (
        <h1 className={cn("text-3xl mb-2 font-bold", className)}>{children}</h1>
      );
    case "h2":
      return <h2 className={cn("text-2xl mb-2", className)}>{children}</h2>;
    case "h3":
      return <h3 className={cn("text-xl mb-2", className)}>{children}</h3>;
    case "h4":
      return <h4 className={cn("text-lg mb-2", className)}>{children}</h4>;
    default:
      return null;
  }
};
