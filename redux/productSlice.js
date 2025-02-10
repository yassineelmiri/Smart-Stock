import { createSlice } from '@reduxjs/toolkit';

const productSlice = createSlice({
  name: 'products',
  initialState: {
    list: [],
  },
  reducers: {
    setProducts: (state, action) => {
      state.list = action.payload;
    },
    addProduct: (state, action) => {
      state.list.push(action.payload);
    },
  },
});

export const { setProducts, addProduct } = productSlice.actions;
export default productSlice.reducer;
