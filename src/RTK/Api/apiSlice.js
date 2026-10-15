import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "./axiosBaseQuery";

/**
 * Base RTK Query API slice.
 * Features should inject endpoints using apiSlice.injectEndpoints({ ... }).
 */
export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Reservation", "Clinic", "User", "Auth"],
  endpoints: () => ({}),
});
