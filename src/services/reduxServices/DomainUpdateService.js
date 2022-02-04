import { createSlice } from "@reduxjs/toolkit";

export const DomainUpdateService = createSlice({
  name: "DomainUpdate",
  initialState: {},
  reducers: {
    setUpdates: (state, action) => {
      // console.log("in redux", state, action);
      var column = action.payload.column;
      var updating = action.payload.updating;
      state[column] = updating;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setUpdates } = DomainUpdateService.actions;

export default DomainUpdateService.reducer;
