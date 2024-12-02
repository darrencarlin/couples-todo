import { cn } from "@/lib/utils";

interface Props {
  as: "ul" | "ol";
  className?: string;
  children: React.ReactNode;
}

export const List = ({ as, className, children }: Props) => {
  switch (as) {
    case "ul":
      return (
        <ul className={cn("space-y-2 list-disc pl-6 mb-4", className)}>
          {children}
        </ul>
      );
    case "ol":
      return (
        <ol className={cn("space-y-2 list-decimal pl-6 mb-4", className)}>
          {children}
        </ol>
      );
    default:
      return null;
  }
};
