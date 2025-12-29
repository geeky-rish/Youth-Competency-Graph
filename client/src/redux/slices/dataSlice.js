import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Thunks
export const fetchSkills = createAsyncThunk(
    'data/fetchSkills',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/skills');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch skills');
        }
    }
);

export const fetchRoles = createAsyncThunk(
    'data/fetchRoles',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/roles');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch roles');
        }
    }
);

const dataSlice = createSlice({
    name: 'data',
    initialState: {
        skills: [],
        roles: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Skills
            .addCase(fetchSkills.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchSkills.fulfilled, (state, action) => {
                state.loading = false;
                state.skills = action.payload;
            })
            .addCase(fetchSkills.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Roles
            .addCase(fetchRoles.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchRoles.fulfilled, (state, action) => {
                state.loading = false;
                state.roles = action.payload;
            })
            .addCase(fetchRoles.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default dataSlice.reducer;
