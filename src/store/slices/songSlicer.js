import { createSlice } from "@reduxjs/toolkit"
import { reset } from "../actions/geral"

const songSlicer = createSlice({
  name: "song",
  initialState: [],
  reducers: {
    addSong(state, action) {
      state.push(action.payload)
    },
    removeSong(state, action) {
      const index = state.indexOf(action.payload)
      state.splice(index, 1)
    }
  },
  extraReducers: (builder) => {
    builder.addCase(reset, (state, action) => [])
  }
})


export const { addSong, removeSong } = songSlicer.actions
export const songReducer = songSlicer.reducer