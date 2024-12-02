"use client";

import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { ControllerRenderProps } from "react-hook-form";
import { PlanCategoryFormData } from "./forms/schema";
import { Button } from "./ui/button";

interface Props {
  field: ControllerRenderProps<PlanCategoryFormData, "color">;
}

const COLORS = [
  "#64748b",
  "#6b7280",
  "#71717a",
  "#737373",
  "#78716c",
  "#ef4444",
  "#f97316",
  "#f59e0b",
  "#eab308",
  "#84cc16",
  "#22c55e",
  "#10b981",
  "#14b8a6",
  "#06b6d4",
  "#0ea5e9",
  "#3b82f6",
  "#6366f1",
  "#8b5cf6",
  "#a855f7",
  "#d946ef",
  "#ec4899",
  "#f43f5e",
];

export const ColorPicker = ({ field }: Props) => {
  return (
    <FormItem>
      <FormLabel className="font-semibold">Choose a Color</FormLabel>
      <FormControl>
        <ScrollArea className="w-[100%] whitespace-nowrap">
          <div className="flex gap-2 p-4 pl-1">
            {COLORS.map((name, index) => {
              const classname = cn("h-12 w-12 [&_svg]:size-10 p-0", {
                "outline outline-zinc-500 bg-zinc-300": field.value === name,
              });

              return (
                <Button
                  variant="ghost"
                  type="button"
                  className={classname}
                  key={index}
                  onClick={() => field.onChange(name)}
                >
                  <div
                    className="w-10 h-10 rounded-full"
                    style={{ backgroundColor: name }}
                  />
                </Button>
              );
            })}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
};
