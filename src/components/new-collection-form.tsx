"use client";

import { useAppSelector } from "@/lib/store/hooks";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar, Check, DollarSign, MapPin, Text, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Heading } from "./heading";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";

const nameSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }).max(100),
});

const verbsSchema = z.object({
  todo: z.string(),
  started: z.string(),
  done: z.string(),
});

const FIELDS = [
  {
    title: "Name",
    name: "name",
    icon: Text,
  },
  {
    title: "Description",
    name: "description",
    icon: Text,
  },
  {
    title: "Date",
    name: "date",
    icon: Calendar,
  },
  {
    title: "Location",
    name: "location",
    icon: MapPin,
  },
  {
    title: "People",
    name: "people",
    icon: Users,
  },
  {
    title: "Budget",
    name: "budget",
    icon: DollarSign,
  },
  {
    title: "Comments",
    name: "comments",
    icon: Text,
  },
];

export const NewCollectionForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [categories, setCategories] = useState<{ [key: string]: string }>({});
  const [selectedCategories, setSelectedCategories] = useState<{
    [key: string]: string;
  }>({});

  const [fields, setFields] = useState<string[]>([]);

  const nameForm = useForm<z.infer<typeof nameSchema>>({
    resolver: zodResolver(nameSchema),
    defaultValues: {
      name: "",
    },
  });

  const verbsForm = useForm<z.infer<typeof verbsSchema>>({
    resolver: zodResolver(verbsSchema),
    defaultValues: {
      todo: categories[0] || "",
      started: categories[1] || "",
      done: categories[2] || "",
    },
  });

  async function onSubmitName(values: z.infer<typeof nameSchema>) {
    setLoading(true);

    const { name } = values;

    const res = await fetch("/api/labels", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ category: name }),
    });

    const data = await res.json();

    setName(name);
    setCategories(data);
    // Set the default values for the verbs form
    verbsForm.setValue("todo", data.todo);
    verbsForm.setValue("started", data.started);
    verbsForm.setValue("done", data.done);
    setLoading(false);
  }

  const handleCreateCollection = async () => {
    console.log("Creating collection...");
    setLoading(true);

    const collection = {
      name: name.toLowerCase(),
      categories: JSON.stringify(selectedCategories),
      fields: JSON.stringify(fields),
    };

    await fetch("/api/collections", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(collection),
    });

    setLoading(false);

    toast("Collection created");
    router.push("/");
  };

  console.log({ fields });

  const hasCategories = Object.entries(categories).length > 0;
  const hasCategoriesAndFields = hasCategories && fields.length > 0;

  return (
    <div>
      <Heading as="h3" className="font-bold">
        What are you tracking?
      </Heading>
      <Form {...nameForm}>
        <form
          onSubmit={nameForm.handleSubmit(onSubmitName)}
          className="space-y-4"
        >
          <div className="grid grid-cols-[1fr_auto] items-end">
            <FormField
              control={nameForm.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel className="font-semibold">Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={`Enter a name for the todo.`}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="font-medium">
              {loading ? "..." : "Go!"}
            </Button>
          </div>
        </form>
      </Form>

      {hasCategories && (
        <div className="my-4">
          <Heading as="h3" className="font-bold">
            Categorize?
          </Heading>

          {/* <Form {...verbsForm}>
            <form
              onSubmit={verbsForm.handleSubmit(onSubmitVerbs)}
              className="space-y-4"
            >
              <FormField
                control={verbsForm.control}
                name="todo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Todo</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter a name for the todo."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={verbsForm.control}
                name="started"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Started</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter a name for the started todo."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={verbsForm.control}
                name="done"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Done</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter a name for the done todo."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form> */}

          <div className="flex flex-wrap">
            {Object.entries(categories).map((category, index) => {
              const categoryName = category[0];
              const categoryTitle = category[1];

              const classname = cn(
                "border-0 p-4-full text-sm font-bold flex items-center tranisition-all duration-100",
                {
                  "border-1": fields.includes(category[index]),
                }
              );

              return (
                <Button
                  className={classname}
                  key={categoryName}
                  onClick={() => {
                    const selected = {
                      [categoryName]: categoryTitle,
                    };

                    // Add to selected categories, remove if already exists
                    setSelectedCategories((prev) => {
                      if (prev[categoryName] === categoryTitle) {
                        const { [categoryName]: _, ...rest } = prev;
                        return rest;
                      }

                      return {
                        ...prev,
                        ...selected,
                      };
                    });
                  }}
                >
                  {/* {Object.entries(selectedCategories).includes([
                    categoryName,
                    categoryTitle,
                  ]) && <Check />} */}

                  {selectedCategories[categoryName] === categoryTitle && (
                    <Check />
                  )}

                  {categoryTitle}
                </Button>
              );
            })}
          </div>
        </div>
      )}

      {hasCategories && (
        <div className="my-4">
          <Heading as="h3" className="font-bold">
            Associate fields with {name}
          </Heading>
          <div className="flex flex-wrap">
            {FIELDS.map((field) => {
              const classname = cn(
                "border-0 p-4-full text-sm font-bold flex items-center tranisition-all duration-100",
                {
                  "border-1": fields.includes(field.name),
                }
              );

              return (
                <Button
                  className={classname}
                  key={field.name}
                  onClick={() => {
                    setFields((prev) =>
                      prev.includes(field.name)
                        ? prev.filter((f) => f !== field.name)
                        : [...prev, field.name]
                    );
                  }}
                >
                  {fields.includes(field.name) ? (
                    <Check />
                  ) : (
                    <field.icon size={16} />
                  )}{" "}
                  {field.title}
                </Button>
              );
            })}
          </div>
        </div>
      )}

      {hasCategoriesAndFields && (
        <>
          <div className="mt-4">
            <div className="prose">
              {hasCategories && (
                <pre>
                  <code>
                    {JSON.stringify(
                      {
                        name,
                        categories,
                        fields,
                      },
                      null,
                      2
                    )}
                  </code>
                </pre>
              )}
            </div>
          </div>

          <Button
            type="button"
            className="w-full my-4"
            onClick={() => handleCreateCollection()}
          >
            {loading ? "Creating..." : "Create Collection"}
          </Button>
        </>
      )}
    </div>
  );
};
