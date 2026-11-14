import { apiSlice } from "../../store/api/apiSlice";

export const reservationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Student / User Reservations
    getUserReservations: builder.query({
      query: ({ page = 1, limit = 5, student_id, userId, user_id } = {}) => {
        const targetUserId = student_id || userId || user_id;
        // When viewing a specific user's reservations as an admin, query the admin endpoint /reservations/?user_id=...
        // because /myreservations is strictly restricted to regular users (returns 403 Forbidden for admins).
        if (targetUserId) {
          return {
            url: `/reservations/?page=${page}&limit=${limit}&user_id=${targetUserId}`,
            method: "GET",
          };
        }
        return {
          url: `/myreservations?page=${page}&limit=${limit}`,
          method: "GET",
        };
      },
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

    // Admin View Specific User Reservations
    getAdminUserReservations: builder.query({
      query: ({ userId, student_id, user_id, page = 1, limit = 5 } = {}) => {
        const targetUserId = userId || student_id || user_id;
        const params = new URLSearchParams();
        params.set("page", page);
        params.set("limit", limit);
        if (targetUserId) params.set("user_id", targetUserId);

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

    // Admin All Reservations (with searchKey, examType, clinic_id, status, month, year, date, faculty_id, level_id, gender, nationality_id, user_id)
    getAdminReservations: builder.query({
      query: ({
        page = 1,
        limit = 8,
        searchKey = "",
        search = "",
        userName = "",
        examType = "",
        exam_type = "",
        clinic_id = "",
        clinicId = "",
        status = "",
        filterStatus = "",
        date = "",
        faculty_id = "",
        facultyId = "",
        level_id = "",
        levelId = "",
        gender = "",
        nationality_id = "",
        nationalityId = "",
        user_id = "",
        userId = "",
        student_id = "",
        studentId = "",
        month = "",
        year = "",
      } = {}) => {
        const params = new URLSearchParams();
        params.set("page", page);
        params.set("limit", limit);

        const searchVal = searchKey || search || userName;
        if (searchVal) params.set("searchKey", searchVal);

        const examTypeVal = examType || exam_type;
        if (examTypeVal) params.set("examType", examTypeVal);

        const clinicVal = clinic_id || clinicId;
        if (clinicVal) params.set("clinic_id", String(clinicVal).split(" ")[0]);

        const statusVal = status !== "" ? status : filterStatus;
        if (statusVal) params.set("status", statusVal);

        if (date) params.set("date", date);

        const facultyVal = faculty_id || facultyId;
        if (facultyVal) params.set("faculty_id", String(facultyVal).split(" ")[0]);

        const levelVal = level_id || levelId;
        if (levelVal) params.set("level_id", String(levelVal).split(" ")[0]);

        if (gender) params.set("gender", gender);

        const nationalityVal = nationality_id || nationalityId;
        if (nationalityVal) params.set("nationality_id", String(nationalityVal).split(" ")[0]);

        const userVal = user_id || userId || student_id || studentId;
        if (userVal) params.set("user_id", String(userVal).split(" ")[0]);

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

    // Counter: Initiate Transfer / Convert Reservation to Transfer
    initiateTransfer: builder.mutation({
      query: ({ id, transfer_reason, notes }) => ({
        url: `/reservations/${id}/transfer`,
        method: "POST",
        data: { transfer_reason, notes },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Reservation", id },
        { type: "Reservation", id: "LIST" },
        { type: "Reservation", id: "ADMIN_LIST" },
        { type: "Transfer", id: "LIST" },
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
  useGetAdminUserReservationsQuery,
  useGetEmergencyReservationsQuery,
  useGetReservationByIdQuery,
  useCreateReservationMutation,
  useAdminCreateReservationMutation,
  useAdminUpdateReservationMutation,
  useAdminDeleteReservationMutation,
  useDeleteReservationMutation,
  useUpdateReservationStatusMutation,
  useInitiateTransferMutation,
} = reservationApi;

export default reservationApi;
