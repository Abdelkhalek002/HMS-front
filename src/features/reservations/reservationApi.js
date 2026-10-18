import { apiSlice } from "../../store/api/apiSlice";

export const reservationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Student / User Reservations
    getUserReservations: builder.query({
      query: ({ page = 1, limit = 5, student_id } = {}) => ({
        url: `/myreservations?page=${page}&limit=${limit}${student_id ? `&student_id=${student_id}` : ""}`,
        method: "GET",
      }),
      providesTags: (result) =>
        result?.data || result?.results
          ? [
              ...(result.data || result.results).map(({ _id, id }) => ({
                type: "Reservation",
                id: _id || id,
              })),
              { type: "Reservation", id: "LIST" },
            ]
          : [{ type: "Reservation", id: "LIST" }],
    }),

    // Admin All Reservations (with searchKey, examType, clinic_id, status, month, year)
    getAdminReservations: builder.query({
      query: ({
        page = 1,
        limit = 8,
        searchKey = "",
        examType = "",
        clinic_id = "",
        status = "",
        month = "",
        year = "",
      } = {}) => {
        const params = new URLSearchParams();
        params.set("page", page);
        params.set("limit", limit);
        if (searchKey) params.set("searchKey", searchKey);
        if (examType) params.set("examType", examType);
        if (clinic_id) params.set("clinic_id", clinic_id);
        if (status) params.set("status", status);
        if (month) params.set("month", month);
        if (year) params.set("year", year);

        return {
          url: `/reservations/?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: (result) =>
        result?.results || result?.data
          ? [
              ...(result.results || result.data).map(({ id, medicEx_id }) => ({
                type: "Reservation",
                id: id || medicEx_id,
              })),
              { type: "Reservation", id: "ADMIN_LIST" },
            ]
          : [{ type: "Reservation", id: "ADMIN_LIST" }],
    }),

    // Admin Emergency Reservations
    getEmergencyReservations: builder.query({
      query: ({ page = 1, limit = 8, searchKey = "", month = "", year = "" } = {}) => {
        const params = new URLSearchParams();
        params.set("page", page);
        params.set("limit", limit);
        if (searchKey) params.set("searchKey", searchKey);
        if (month) params.set("month", month);
        if (year) params.set("year", year);

        return {
          url: `/reservations/emergency?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: [{ type: "Reservation", id: "EMERGENCY_LIST" }],
    }),

    // View Single Reservation by ID
    getReservationById: builder.query({
      query: (id) => ({
        url: `/reservations/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Reservation", id }],
    }),

    // User Create Reservation
    createReservation: builder.mutation({
      query: (data) => {
        let payload = data;
        if (typeof FormData !== "undefined" && payload instanceof FormData) {
          payload = Object.fromEntries(payload.entries());
        }

        if (payload?.clinic_id !== undefined && payload?.clinic_id !== null) {
          payload = {
            ...payload,
            clinic_id: Number(payload.clinic_id),
          };
        }

        return {
          url: "/Myreservations",
          method: "POST",
          data: payload,
        };
      },
      invalidatesTags: [
        { type: "Reservation", id: "LIST" },
        { type: "Reservation", id: "ADMIN_LIST" },
      ],
    }),

    // Admin Create Emergency / Walk-in Reservation
    adminCreateReservation: builder.mutation({
      query: (data) => ({
        url: "/reservations",
        method: "POST",
        data,
      }),
      invalidatesTags: [
        { type: "Reservation", id: "LIST" },
        { type: "Reservation", id: "ADMIN_LIST" },
        { type: "Reservation", id: "EMERGENCY_LIST" },
      ],
    }),

    // Admin Update Reservation
    adminUpdateReservation: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/reservations/${id}`,
        method: "PUT",
        data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Reservation", id },
        { type: "Reservation", id: "ADMIN_LIST" },
      ],
    }),

    // Admin Delete Reservation
    adminDeleteReservation: builder.mutation({
      query: (id) => ({
        url: `/reservations/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Reservation", id },
        { type: "Reservation", id: "ADMIN_LIST" },
        { type: "Reservation", id: "EMERGENCY_LIST" },
      ],
    }),

    // User Cancel / Delete Reservation
    deleteReservation: builder.mutation({
      query: ({ userId, medxId }) => ({
        url: `/myreservations/${userId}/${medxId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { medxId }) => [
        { type: "Reservation", id: medxId },
        { type: "Reservation", id: "LIST" },
        { type: "Reservation", id: "ADMIN_LIST" },
      ],
    }),

    // Accept / Decline Reservation Status
    updateReservationStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/reservations/${id}/status`,
        method: "PUT",
        data: { status },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Reservation", id },
        { type: "Reservation", id: "LIST" },
        { type: "Reservation", id: "ADMIN_LIST" },
      ],
    }),
  }),
});

export const {
  useGetUserReservationsQuery,
  useGetAdminReservationsQuery,
  useGetEmergencyReservationsQuery,
  useGetReservationByIdQuery,
  useCreateReservationMutation,
  useAdminCreateReservationMutation,
  useAdminUpdateReservationMutation,
  useAdminDeleteReservationMutation,
  useDeleteReservationMutation,
  useUpdateReservationStatusMutation,
} = reservationApi;

export default reservationApi;
