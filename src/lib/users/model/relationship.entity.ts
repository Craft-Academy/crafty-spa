import { createEntityAdapter } from "@reduxjs/toolkit";

export type Relationship = {
  user: string;
  follows: string;
};

export const relationshipsAdapter = createEntityAdapter<Relationship>({
  selectId: (r: Relationship) => `${r.user}->${r.follows}`,
});
