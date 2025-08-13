import { apiSlice } from "./apiSlice";
import { BOOK_URL, UPLOAD_URL } from "../constants";

export const booksApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllBooks: builder.query({
      query: () => `${BOOK_URL}/all-books`,
    }),
    createBook: builder.mutation({
      query: (newBook) => ({
        url: `${BOOK_URL}/create-book`,
        method: "POST",
        body: newBook,
      }),
    }),

    updateBook: builder.mutation({
      query: ({ id, updatedBook }) => ({
        url: `${BOOK_URL}/update-book/${id}`,
        method: "PUT",
        body: updatedBook,
      }),
    }),

    addBookReview: builder.mutation({
      query: ({ id, rating, comment }) => ({
        url: `${BOOK_URL}/${id}/reviews`,
        method: "POST",
        body: { rating, id, comment },
      }),
    }),

    deleteComment: builder.mutation({
      query: ({ bookId, reviewId }) => ({
        url: `${BOOK_URL}/delete-comment`,
        method: "DELETE",
        body: { bookId, reviewId },
      }),
    }),

    deleteBook: builder.mutation({
      query: (id) => ({
        url: `${BOOK_URL}/delete-book/${id}`,
        method: "DELETE",
      }),
    }),

    getSpecificBook: builder.query({
      query: (id) => `${BOOK_URL}/specific-book/${id}`,
    }),

    uploadImage: builder.mutation({
      query: (formData) => ({
        url: `${UPLOAD_URL}`,
        method: "POST",
        body: formData,
      }),
    }),

    getNewBooks: builder.query({
      query: () => `${BOOK_URL}/new-books`,
    }),

    getTopBooks: builder.query({
      query: () => `${BOOK_URL}/top-books`,
    }),

    getRandomBooks: builder.query({
      query: () => `${BOOK_URL}/random-books`,
    }),
  }),
});

export const {
  useGetAllBooksQuery,
  useCreateBookMutation,
  useUpdateBookMutation,
  useAddBookReviewMutation,
  useDeleteCommentMutation,
  useGetSpecificBookQuery,
  useUploadImageMutation,
  useDeleteBookMutation,
  //
  useGetNewBooksQuery,
  useGetTopBooksQuery,
  useGetRandomBooksQuery,
} = booksApiSlice;