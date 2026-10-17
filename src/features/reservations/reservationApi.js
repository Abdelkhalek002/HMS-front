import { apiSlice } from "../../store/api/apiSlice";

export const reservationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUserReservations: builder.query({
      query: ({ page = 1, limit = 5 } = {}) => ({
        url: `/myreservations?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ _id, id }) => ({
                type: "Reservation",
                id: _id || id,
              })),
              { type: "Reservation", id: "LIST" },
            ]
          : [{ type: "Reservation", id: "LIST" }],
    }),

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
      invalidatesTags: [{ type: "Reservation", id: "LIST" }],
    }),

    deleteReservation: builder.mutation({
      query: ({ userId, medxId }) => ({
        url: `/myreservations/${userId}/${medxId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { medxId }) => [
        { type: "Reservation", id: medxId },
        { type: "Reservation", id: "LIST" },
      ],
    }),

    updateReservationStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/reservations/${id}`,
        method: "PUT",
        data: { status },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Reservation", id },
        { type: "Reservation", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetUserReservationsQuery,
  useCreateReservationMutation,
  useDeleteReservationMutation,
  useUpdateReservationStatusMutation,
} = reservationApi;

export default reservationApi;
