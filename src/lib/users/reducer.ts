import { combineReducers } from "@reduxjs/toolkit";
import { relationshipsSlice } from "./slices/relationships.slice";

export const reducer = combineReducers({
  [relationshipsSlice.name]: relationshipsSlice.reducer,
});
