import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query";

const BASE_URL = ''

const baseQuery = fetchBaseQuery({baseUrl: BASE_URL})

export const apiSlice = createApi({
    baseQuery,
    endpoints: () => ({

    })
})