import { createSlice } from "@reduxjs/toolkit";

export const DomainDynamicValueService = createSlice({
  name: "DomainDynamicValue",
  initialState: {},
  reducers: {
    setValue: (state, action) => {
      state[action.payload.dns] = {};
      state[action.payload.dns][action.payload.column] = action.payload.value;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setValue } = DomainDynamicValueService.actions;

export default DomainDynamicValueService.reducer;
