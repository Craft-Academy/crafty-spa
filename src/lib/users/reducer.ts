import { combineReducers } from "@reduxjs/toolkit";
import { relationshipsSlice } from "./slices/relationships.slice";
import { usersSlice } from "./slices/users.slice";

export const reducer = combineReducers({
  [relationshipsSlice.name]: relationshipsSlice.reducer,
  [usersSlice.name]: usersSlice.reducer,
});
