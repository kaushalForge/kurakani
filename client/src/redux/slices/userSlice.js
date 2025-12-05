import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const TOKEN_KEY = "token";
const USER_KEY = "user";

// ======== Local Storage Helpers ========
const getToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY) || null;
  } catch {
    return null;
  }
};

const getCurrentUser = () => {
  try {
    const data = localStorage.getItem(USER_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

const setToken = (token) => {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
  } catch {}
};

const setCurrentUser = (data) => {
  try {
    if (data) localStorage.setItem(USER_KEY, JSON.stringify(data));
  } catch {}
};

const clearAuth = () => {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  } catch {}
};

export const fetchCurrentUser = createAsyncThunk(
  "user/fetchCurrentUser",
  async (_, thunkAPI) => {
    try {
      const token = getToken();
      const currentUser = getCurrentUser();

      const res = await axios.get(`${API_URL}/api/user/current-user`, {
        headers: { authorization: token },
        params: { id: currentUser._id }, // pass as object
      });

      return res.data.currentUser;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || "Failed to fetch current user"
      );
    }
  }
);

export const fetchAllUsers = createAsyncThunk(
  "user/fetchAllUsers",
  async (_, thunkAPI) => {
    try {
      const token = getToken();
      const res = await axios.get(`${API_URL}/api/user`, {
        headers: { authorization: token },
      });
      return res.data.allUsers || [];
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || "Failed to fetch all users"
      );
    }
  }
);

export const fetchMyRequests = createAsyncThunk(
  "user/fetchMyRequests",
  async (_, thunkAPI) => {
    try {
      const token = getToken();
      const res = await axios.get(`${API_URL}/api/user/my-requests`, {
        headers: { authorization: token },
      });
      return res.data.myRequests || [];
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || "Failed to fetch my requests"
      );
    }
  }
);

export const fetchMyFriends = createAsyncThunk(
  "user/fetchMyFriends",
  async (_, thunkAPI) => {
    try {
      const token = getToken();
      const res = await axios.get(`${API_URL}/api/user/linked-friends`, {
        headers: { authorization: token },
      });
      return res.data.friends || [];
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || "Failed to fetch friends"
      );
    }
  }
);

export const fetchSuggestions = createAsyncThunk(
  "user/fetchSuggestions",
  async (_, thunkAPI) => {
    try {
      const token = getToken();
      const res = await axios.get(`${API_URL}/api/user/friend-suggestion`, {
        headers: { authorization: token },
      });
      return res.data.suggestions || [];
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || "Failed to fetch suggestions"
      );
    }
  }
);

// --------- POST / DELETE METHODS ---------

export const sendRequest = createAsyncThunk(
  "user/sendRequest",
  async (userId, thunkAPI) => {
    try {
      console.log(userId, "in thunk");
      const token = getToken();
      const currentUser = getCurrentUser();
      const res = await axios.post(
        `${API_URL}/api/user/send-request`,
        { requestFrom: currentUser._id, requestTo: userId },
        { headers: { authorization: token } }
      );
      return { userId, data: res.data };
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || "Failed to send request"
      );
    }
  }
);

export const acceptRequest = createAsyncThunk(
  "user/acceptRequest",
  async (userId, thunkAPI) => {
    try {
      const token = getToken();
      const currentUser = getCurrentUser();
      const res = await axios.post(
        `${API_URL}/api/user/accept-request`,
        { requestFrom: currentUser._id, requestTo: userId },
        { headers: { authorization: token } }
      );
      return { userId, data: res.data };
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || "Failed to accept request"
      );
    }
  }
);

export const cancelRequest = createAsyncThunk(
  "user/cancelRequest",
  async (userId, thunkAPI) => {
    try {
      const token = getToken();
      const currentUser = getCurrentUser();
      const res = await axios.post(
        `${API_URL}/api/user/cancel-request`,
        { requestFrom: currentUser._id, requestTo: userId },
        { headers: { authorization: token } }
      );
      return { userId, data: res.data };
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || "Failed to cancel request"
      );
    }
  }
);

export const unFriend = createAsyncThunk(
  "user/unFriend",
  async (userId, thunkAPI) => {
    try {
      const token = getToken();
      const currentUser = getCurrentUser();
      const res = await axios.delete(`${API_URL}/api/user/unFriend`, {
        data: { requestFrom: currentUser._id, requestTo: userId },
        headers: { authorization: token },
      });
      return { userId, data: res.data };
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || "Failed to unfriend"
      );
    }
  }
);

// ==========================
// SLICE
// ==========================

const userSlice = createSlice({
  name: "user",
  initialState: {
    token: getToken(),
    currentUser: getCurrentUser(),
    allUsers: [],
    myRequests: [],
    mySuggestions: [],
    myFriends: [],
    loading: false,
    error: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.currentUser = action.payload;
      setCurrentUser(action.payload);
    },
    logout: (state) => {
      state.currentUser = null;
      state.token = null;
      clearAuth();
    },
  },
  extraReducers: (builder) => {
    builder
      // FETCHES
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.allUsers = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchMyRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.myRequests = action.payload;
      })
      .addCase(fetchMyRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchMyFriends.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyFriends.fulfilled, (state, action) => {
        state.loading = false;
        state.myFriends = action.payload;
      })
      .addCase(fetchMyFriends.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchSuggestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSuggestions.fulfilled, (state, action) => {
        state.loading = false;
        state.mySuggestions = action.payload;
      })
      .addCase(fetchSuggestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ACTIONS
      .addCase(sendRequest.fulfilled, (state, action) => {
        state.currentUser.myRequests = [
          ...(state.currentUser.myRequests || []),
          action.payload.userId,
        ];
      })
      .addCase(acceptRequest.fulfilled, (state, action) => {
        state.currentUser.myRequests = (
          state.currentUser.myRequests || []
        ).filter((id) => id !== action.payload.userId);
        state.currentUser.myFriends = [
          ...(state.currentUser.myFriends || []),
          action.payload.userId,
        ];
      })
      .addCase(cancelRequest.fulfilled, (state, action) => {
        state.currentUser.myRequests = (
          state.currentUser.myRequests || []
        ).filter((id) => id !== action.payload.userId);
      })
      .addCase(unFriend.fulfilled, (state, action) => {
        state.currentUser.myFriends = (
          state.currentUser.myFriends || []
        ).filter((id) => id !== action.payload.userId);
      });
  },
});

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;
