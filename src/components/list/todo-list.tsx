"use client";

import { capitalize } from "@/lib/utils";
import { Todo } from "@prisma/client";
import Link from "next/link";
import { Button } from "../ui/button";

interface Props {
  todos: Partial<Todo>[];
  page: string;
}

export const TodoList = ({ todos, page }: Props) => {
  return (
    <div className="grid grid-cols-2">
      {todos.map((todo) => {
        if (!todo.name) return null;

        const name = todo.name;

        return (
          <Button key={todo.id} asChild className="h-20">
            <Link href={`/${todo.name}`}>{capitalize(name)}</Link>
          </Button>
        );
      })}
    </div>
  );
};
