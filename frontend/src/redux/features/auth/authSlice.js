import { createSlice } from "@reduxjs/toolkit";

const loadCachedUser = () => {
  const cachedUser = localStorage.getItem("userInfo");

  if (!cachedUser) {
    return null;
  }

  try {
    return JSON.parse(cachedUser);
  } catch {
    localStorage.removeItem("userInfo");
    return null;
  }
};

const initialState = {
  userInfo: loadCachedUser(),
  authChecked: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
      state.authChecked = true;
      localStorage.setItem("userInfo", JSON.stringify(action.payload));
    },

    logout: (state) => {
      state.userInfo = null;
      state.authChecked = true;
      localStorage.removeItem("userInfo");
    },

    setAuthChecked: (state, action) => {
      state.authChecked = action.payload;
    },
  },
});

export const { setCredentials, logout, setAuthChecked } = authSlice.actions;
export default authSlice.reducer;
