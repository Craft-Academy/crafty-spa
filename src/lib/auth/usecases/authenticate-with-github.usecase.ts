import { createAppAsyncThunk } from "@/lib/create-app-thunk";

export const authenticateWithGithub = createAppAsyncThunk(
  "auth/authenticateWithGithub",
  async (_, { extra: { authGateway } }) => {
    const authUser = await authGateway.authenticateWithGithub();

    return authUser;
  }
);
