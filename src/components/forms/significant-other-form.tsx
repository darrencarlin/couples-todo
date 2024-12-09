"use client";

import { fetchApi } from "@/lib/utils";
import { ResponseType } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import {
  CreateSignificantOtherSchema,
  SignificantOtherFormData,
} from "./schema";

export const SignificantOtherForm = () => {
  const [loading, setLoading] = useState(false);
  const form = useForm<SignificantOtherFormData>({
    resolver: zodResolver(CreateSignificantOtherSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (
    values: z.infer<typeof CreateSignificantOtherSchema>
  ) => {
    setLoading(true);

    const data = {
      email: values.email,
    };

    const { success, message } = await fetchApi<ResponseType>(`/api/invite`, {
      method: "POST",
      body: JSON.stringify(data),
    });

    console.log({ success, message });

    setLoading(false);
  };

  return (
    <>
      <h2 className="text-xl mb-2 font-bold">Invite Your Significant Other</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter the email of your significant other."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-center">
            <Button type="submit" className="font-medium w-full">
              {loading ? "Inviting..." : "Send Invite"}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};
