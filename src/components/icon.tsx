import {
  Beer,
  CalendarDays,
  Clapperboard,
  Drama,
  Gem,
  NotebookPen,
  StickyNote,
  Tv,
  Volleyball,
} from "lucide-react";

export const ICONS = [
  "Volleyball",
  "Beer",
  "Drama",
  "Gem",
  "StickyNote",
  "NotebookPen",
  "Tv",
  "Clapperboard",
];

interface Props {
  icon: string | null | undefined;
  color?: string;
  size?: number;
}

export const Icon = ({ icon, color = "#ffffff", size = 16 }: Props) => {
  switch (icon) {
    case "Volleyball":
      return <Volleyball size={size} color={color} strokeWidth={1} />;
    case "Beer":
      return <Beer size={size} color={color} strokeWidth={1} />;
    case "Drama":
      return <Drama size={size} color={color} strokeWidth={1} />;
    case "Gem":
      return <Gem size={size} color={color} strokeWidth={1} />;
    case "StickyNote":
      return <StickyNote size={size} color={color} strokeWidth={1} />;
    case "NotebookPen":
      return <NotebookPen size={size} color={color} strokeWidth={1} />;
    case "Tv":
      return <Tv size={size} color={color} strokeWidth={1} />;
    case "Clapperboard":
      return <Clapperboard size={size} color={color} strokeWidth={1} />;
    default:
      return <CalendarDays size={size} color={color} strokeWidth={1} />;
  }
};
