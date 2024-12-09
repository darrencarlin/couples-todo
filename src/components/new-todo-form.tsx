"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

import { capitalize, cn, formatDate, pluralize } from "@/lib/utils";
import { Todo } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Heading } from "./heading";
import { Textarea } from "./ui/textarea";

type Field =
  | "name"
  | "description"
  | "date"
  | "location"
  | "people"
  | "budget"
  | "comments";

type Fields = Field[];

const dynamicFormSchema = (fields: Fields) =>
  z.object(
    fields.reduce((acc, field) => {
      switch (field) {
        case "name":
          acc[field] = z
            .string()
            .min(1, { message: "Name is required" })
            .max(100);
          break;
        case "description":
          acc[field] = z.string().max(500).optional();
          break;
        case "date":
          acc[field] = z.date();
          break;

        case "location":
          acc[field] = z.string().optional();
          break;

        case "people":
          acc[field] = z.string().optional();
          break;

        case "budget":
          acc[field] = z.string().optional();
          break;

        case "comments":
          acc[field] = z.string().optional();
          break;

        default:
          acc[field] = z.string();
      }
      return acc;
    }, {} as Record<string, z.ZodType>)
  );

type Categories = { todo: string; started: string; done: string };

type Props = {
  page: string;
  fields: Fields;
  categories: Categories;
};

export const NewTodoForm = ({ page, fields, categories }: Props) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const schema = dynamicFormSchema(fields);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: fields.reduce((acc, field) => {
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
    }, {} as Record<string, string | Date>),
  });

  async function onSubmit(values: z.infer<typeof schema>) {
    setLoading(true);
    const processedValues = { ...values };

    // Check if date exists and is a Date object before formatting
    if (values.date instanceof Date) {
      processedValues.date = formatDate(values.date);
    }

    const todo: Partial<Todo> = {
      name: pluralize(page),
      metadata: JSON.stringify(processedValues),
      status: "ACTIVE",
    };

    await fetch("/api/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(todo),
    });

    setLoading(false);

    router.push(`/${pluralize(page)}`);
  }

  return (
    <div>
      <Heading as="h3" className="font-bold">
        Add an {page}
      </Heading>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {fields.map((field) => {
            switch (field) {
              case "name":
                return (
                  <FormField
                    key={field}
                    control={form.control}
                    name={field}
                    render={({ field: inputProps }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">
                          {capitalize(field)}
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={`Enter a ${field} for the ${page}.`}
                            {...inputProps}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                );

              case "description":
                return (
                  <FormField
                    key={field}
                    control={form.control}
                    name={field}
                    render={({ field: inputProps }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">
                          {capitalize(field)}
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder={`Enter a ${field} for the ${page}.`}
                            {...inputProps}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                );

              case "date":
                return (
                  <Controller
                    key={field}
                    control={form.control}
                    name={field}
                    render={({ field: dateField }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">
                          {capitalize(field)}
                        </FormLabel>
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
                                selected={dateField.value}
                                onSelect={(date) => dateField.onChange(date)}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                );

              case "location":
                return (
                  <FormField
                    key={field}
                    control={form.control}
                    name={field}
                    render={({ field: inputProps }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">
                          {capitalize(field)}
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={`Enter a ${field} for the ${page}.`}
                            {...inputProps}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                );

              case "people":
                return (
                  <FormField
                    key={field}
                    control={form.control}
                    name={field}
                    render={({ field: inputProps }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">
                          {capitalize(field)}
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={`Enter a ${field} for the ${page}.`}
                            {...inputProps}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                );

              case "budget":
                return (
                  <FormField
                    key={field}
                    control={form.control}
                    name={field}
                    render={({ field: inputProps }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">
                          {capitalize(field)}
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={`Enter a ${field} for the ${page}.`}
                            {...inputProps}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                );

              case "comments":
                return (
                  <FormField
                    key={field}
                    control={form.control}
                    name={field}
                    render={({ field: inputProps }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">
                          {capitalize(field)}
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder={`Enter a ${field} for the ${page}.`}
                            {...inputProps}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                );

              default:
                return null;
            }
          })}

          <div className="flex justify-center">
            <Button type="submit" size="lg" className="font-medium">
              {loading ? "Adding..." : `Add ${capitalize(page)}`}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
