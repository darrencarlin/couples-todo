import { Todo } from "@prisma/client";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AppState {
  isLoading: boolean;
  todos: Partial<Todo>[];
}

export const initialState: AppState = {
  isLoading: false,
  todos: [],
};

const app = createSlice({
  name: "app",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    updateTodos: (state, action: PayloadAction<Partial<Todo>[]>) => {
      state.todos = action.payload;
    },
  },
});

export const { setLoading, updateTodos } = app.actions;

export default app.reducer;
