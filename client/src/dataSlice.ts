// dataSlice.ts (or .js)
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { JobItemType } from './types';

export const fetchData = createAsyncThunk('data/fetchData', async () => {
  const response = await fetch('http://localhost:8000/data');
  const result = await response.json();
  return result;
});

export const createJob = createAsyncThunk(
  'data/createJob',
  async (job: Omit<JobItemType, 'id'>) => {
    console.log("Creating job:", job);
    const resp = await fetch('http://localhost:8000/createjob', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(job),
    });
    console.log("Creating job resp:", resp);
    if (!resp.ok) throw new Error('Failed to create job');
    return (await resp.json()) as JobItemType; // server returns the created job with id
  }
);

const dataSlice = createSlice({
  name: 'data',
  initialState: {
    items: [] as JobItemType[],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    saveStatus: 'idle',  // for saving data
    error: undefined as string | undefined,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // FETCH DATA
      .addCase(fetchData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // CREATE JOB
      .addCase(createJob.fulfilled, (state, action) => {
        state.items.push(action.payload);
      });
  },
});

export default dataSlice.reducer;