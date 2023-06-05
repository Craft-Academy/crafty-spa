import { createListenerMiddleware } from "@reduxjs/toolkit";
import { AppDispatch, Dependencies, RootState } from "./create-store";

export const createAppListenerMiddleware = () =>
  createListenerMiddleware<RootState, AppDispatch, Dependencies>();
