import { apiSlice } from "../../store/api/apiSlice";

export const transferApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get Transfers (supports status=pending|completed, page, limit, searchKey)
    getTransfers: builder.query({
      query: ({ page = 1, limit = 8, searchKey = "", status = "" } = {}) => {
        const params = new URLSearchParams();
        params.set("page", page);
        params.set("limit", limit);
        if (searchKey) params.set("searchKey", searchKey);
        if (status && status !== "all") params.set("status", status);

        return {
          url: `/transfers/?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id, transferId }) => ({
                type: "Transfer",
                id: id || transferId,
              })),
              { type: "Transfer", id: "LIST" },
            ]
          : [{ type: "Transfer", id: "LIST" }],
    }),

    // Get Single Transfer by ID
    getTransferById: builder.query({
      query: (id) => ({
        url: `/transfers/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Transfer", id }],
    }),

    // Transfer Clerk: Assign Hospital
    assignHospital: builder.mutation({
      query: ({ transferId, hospital_id, notes }) => ({
        url: `/transfers/${transferId}/assign-hospital`,
        method: "PUT",
        data: {
          hospital_id: Number(hospital_id),
          notes,
        },
      }),
      invalidatesTags: (result, error, { transferId }) => [
        { type: "Transfer", id: transferId },
        { type: "Transfer", id: "LIST" },
        { type: "Reservation", id: "ADMIN_LIST" },
        { type: "Reservation", id: "LIST" },
      ],
    }),

    // Update Transfer Details
    updateTransfer: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/transfers/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Transfer", id },
        { type: "Transfer", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetTransfersQuery,
  useGetTransferByIdQuery,
  useAssignHospitalMutation,
  useUpdateTransferMutation,
} = transferApi;

export default transferApi;
