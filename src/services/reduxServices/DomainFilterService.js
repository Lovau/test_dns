import { createSlice } from "@reduxjs/toolkit";

export const DomainFilterService = createSlice({
  name: "DomainFilter",
  initialState: {},
  reducers: {
    setFilter: (state, action) => {
      var column = action.payload.column;
      var filterValue = action.payload.filter;
      state[column] = filterValue;
      // console.log("in redux", state, column, filterValue);
    },
  },
});

// Action creators are generated for each case reducer function
export const { setFilter } = DomainFilterService.actions;

export default DomainFilterService.reducer;
