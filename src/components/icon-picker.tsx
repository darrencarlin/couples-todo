import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { ControllerRenderProps } from "react-hook-form";
import { PlanCategoryFormData } from "./forms/schema";
import { Icon, ICONS } from "./icon";
import { Button } from "./ui/button";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";

interface Props {
  field: ControllerRenderProps<PlanCategoryFormData, "icon">;
}

export const IconPicker = ({ field }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number>(0);

  useEffect(() => {
    const elementWidth = ref.current?.scrollWidth || 0;
    setWidth(elementWidth);
  }, []);

  console.log({ width });
  return (
    <FormItem className="w-full">
      <FormLabel className="font-semibold">Choose an Icon</FormLabel>
      <FormControl>
        <ScrollArea className="w-[100%] whitespace-nowrap">
          <div className="flex gap-2 p-4 pl-1">
            {ICONS.map((name, index) => {
              const classname = cn("h-12 w-12 [&_svg]:size-10", {
                "outline outline-zinc-500 bg-zinc-100": field.value === name,
              });

              return (
                <Button
                  variant="ghost"
                  type="button"
                  className={classname}
                  key={index}
                  onClick={() => field.onChange(name)}
                >
                  <Icon icon={name} color="#171717" size={24} />
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
