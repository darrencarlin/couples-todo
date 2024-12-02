"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, PlusCircle } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

import { cn } from "@/lib/utils";
import { PlanCategory } from "@prisma/client";
import { useState } from "react";
import { Heading } from "../heading";
import { MetadataFields } from "./metadata-fields";
import { NewPlanCategoryForm } from "./new-plan-category-form";
import { CreatePlanSchema, PlanFormData } from "./schema";

interface Props {
  categories: Partial<PlanCategory>[];
}

export const NewPlanForm = ({ categories }: Props) => {
  const [open, setOpen] = useState(false);
  const [fields, setFields] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const form = useForm<PlanFormData>({
    resolver: zodResolver(CreatePlanSchema),
    defaultValues: {
      name: "",
      date: new Date(),
      categoryId: "",
      metadata: {},
    },
  });

  async function onSubmit(values: z.infer<typeof CreatePlanSchema>) {
    setLoading(true);

    const metadata = fields.reduce((acc: Record<string, any>, field) => {
      switch (field) {
        case "name":
          acc[field] = "";
          break;
        case "description":
          acc[field] = "";
          break;
        case "date":
          acc[field] = new Date();
          break;
        case "location":
          acc[field] = "";
          break;
        case "people":
          acc[field] = "";
          break;
        case "budget":
          acc[field] = "";
          break;
        case "comments":
          acc[field] = "";
          break;
        default:
          acc[field] = "";
      }
      return acc;
    }, {});

    const data = {
      ...values,
      metadata,
    };

    console.log({ data });

    const response = await fetch("/api/plans", {
      method: "POST",
      body: JSON.stringify(data),
    });

    const json = await response.json();

    console.log({ json });

    setLoading(false);
  }

  return (
    <div>
      <Heading as="h3" className="font-bold">
        New Plan
      </Heading>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter a name for the plan." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Date */}
          <Controller
            control={form.control}
            name="date"
            render={({ field: dateField }) => (
              <FormItem>
                <FormLabel className="font-semibold">Date</FormLabel>
                <FormControl>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal border border-primary/50",
                          !dateField.value && "text-muted-foreground"
                        )}
                      >
                        {dateField.value ? (
                          format(dateField.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={dateField.value || undefined}
                        onSelect={(date) => {
                          // Ensure date is not null/undefined before onChange
                          dateField.onChange(date || null);
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Category */}
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">Category</FormLabel>
                <div className="grid grid-cols-[1fr_auto] place-items-center gap-2">
                  <Select
                    onValueChange={field.onChange}
                    value={field.value ?? ""}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => {
                        if (!category.id || !category.name) {
                          return null;
                        }
                        return (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <PlusCircle
                    onClick={() => {
                      setOpen((open) => !open);
                    }}
                  />
                </div>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* Metadata */}
          <MetadataFields fields={fields} setFields={setFields} />

          <div className="flex justify-center">
            <Button type="submit" size="lg" className="font-medium w-full">
              {loading ? "Adding..." : "Add Plan"}
            </Button>
          </div>
        </form>
      </Form>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent aria-describedby="Description">
          <DialogHeader>
            <DialogTitle className="text-xl mb-2 font-bold">
              Add Category
            </DialogTitle>
            <NewPlanCategoryForm setOpen={setOpen} />
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};
