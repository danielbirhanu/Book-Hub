import { createSlice } from "@reduxjs/toolkit";

const booksSlice = createSlice({
  name: "books",
  initialState: {
    booksFilter: {
      searchTerm: "",
      selectedGenre: "",
      selectedYear: "",
      selectedSort: [],
    },

    filteredBooks: [],
    bookYears: [],
    uniqueYear: [],
  },

  reducers: {
    setBooksFilter: (state, action) => {
      state.booksFilter = { ...state.booksFilter, ...action.payload };
    },

    setFilteredBooks: (state, action) => {
      state.filteredBooks = action.payload;
    },

    setBookYears: (state, action) => {
      state.bookYears = action.payload;
    },

    setUniqueYears: (state, action) => {
      state.uniqueYear = action.payload;
    },
  },
});

export const {
  setBooksFilter,
  setFilteredBooks,
  setBookYears,
  setUniqueYears,
} = booksSlice.actions;

export default booksSlice.reducer;