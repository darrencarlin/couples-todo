export const DATA = [
  {
    id: "1",
    userId: "1",
    name: "Movies",
    status: "To Watch",
    categories: {
      todo: "To Watch",
      started: "Watching",
      completed: "Watched",
    },
    fields: {
      name: "Flow",
      description: "Cat Movie",
      location: "Angelika",
    },
  },
  {
    id: "2",
    userId: "1",
    name: "Shows",
    status: "To Watch",
    categories: {
      todo: "To Watch",
      started: "Watching",
      completed: "Watched",
    },
    fields: {
      name: "Severance",
      location: "Apple TV",
    },
  },
];

export const SCHEMA = {
  id: "string",
  userId: "string",
  name: "string",
  status: "string",
  categories: {
    todo: "string",
    started: "string",
    completed: "string",
  },
  fields: {
    name: "string",
    description: "string",
    date: "string",
    location: "string",
    people: "string",
    budget: "string",
    comments: "string",
  },
};
