import { createAppAsyncThunk } from "@/lib/create-app-thunk";

export const getUser = createAppAsyncThunk(
  "users/getUser",
  (params: { userId: string }, { extra: { userGateway } }) =>
    userGateway.getUser(params.userId)
);
