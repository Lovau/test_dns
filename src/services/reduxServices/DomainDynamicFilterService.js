import { createSlice } from "@reduxjs/toolkit";

export const DomainDynamicFilterService = createSlice({
  name: "DomainDynamicFilter",
  initialState: {},
  reducers: {
    setDynamicFilter: (state, action) => {
      var column = action.payload.column;
      var filterValue = action.payload.filter;
      state[column] = filterValue;
      // console.log("in redux", state, column, filterValue);
    },
  },
});

// Action creators are generated for each case reducer function
export const { setDynamicFilter } = DomainDynamicFilterService.actions;

export default DomainDynamicFilterService.reducer;
