"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ColorPicker } from "../color-picker";
import { IconPicker } from "../icon-picker";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { CreatePlanCategorySchema, PlanCategoryFormData } from "./schema";

interface Props {
  setOpen: (open: boolean) => void;
}

export const NewPlanCategoryForm = ({ setOpen }: Props) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<PlanCategoryFormData>({
    resolver: zodResolver(CreatePlanCategorySchema),
    defaultValues: {
      category: "",
      icon: "",
      color: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof CreatePlanCategorySchema>) => {
    setLoading(true);

    const response = await fetch("/api/category", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    const data = await response.json();

    console.log({ data });

    if (response.ok) {
      router.refresh();
    }
    setLoading(false);
    setOpen(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Name */}
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold">Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter a name for the category."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Icon */}
        <FormField
          control={form.control}
          name="icon"
          render={({ field }) => <IconPicker field={field} />}
        />

        {/* Color */}
        <FormField
          control={form.control}
          name="color"
          render={({ field }) => <ColorPicker field={field} />}
        />

        <div className="flex justify-center">
          <Button type="submit" className="font-medium w-full">
            {loading ? "Adding..." : "Add Category"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
