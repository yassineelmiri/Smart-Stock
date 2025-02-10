import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ✅ Vérifie bien que json-server tourne avant de tester
export const loginUser = createAsyncThunk("auth/loginUser", async (userData, thunkAPI) => {
    try {
        const response = await axios.get("http://192.168.1.14:5000/warehousemans");
        const warehousemans = response.data;
        console.log("Données reçues :", warehousemans);
        console.log("Utilisateur recherché :", userData);

        // Vérifier si l'utilisateur existe
        const user = warehousemans.find(u => u.secretKey === userData.secretKey);

        if (user) {
            // ✅ Simuler un token de session
            return { ...user, token: "fake-jwt-token" };
        } else {
            return thunkAPI.rejectWithValue("Identifiants incorrects");
        }
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null
    },
    reducers: {
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.user = action.payload;
                state.isAuthenticated = true;
                state.loading = false;
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            });
    }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
