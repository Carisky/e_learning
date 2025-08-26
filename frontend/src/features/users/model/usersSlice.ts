import { createSlice } from '@reduxjs/toolkit';

const usersSlice = createSlice({
  name: 'users',
  initialState: { selectedId: null as number | null },
  reducers: {
    selectUser(state, action) { state.selectedId = action.payload as number; },
  },
});

export const { selectUser } = usersSlice.actions;
export default usersSlice.reducer;
