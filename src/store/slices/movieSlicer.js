import { createSlice } from "@reduxjs/toolkit"
import { reset } from "../actions/geral"


const movieSlicer = createSlice({
  initialState: [],
  name: "movie",
  reducers: {
    //payload e o valor que vamos enviar no caso uma string com nome do movie
    //state esta relaciado ao valor inicial, no caso aqui e um array
    addMovie(state, action) {
      state.push(action.payload)
    },
    removeMovie(state, action) {
      const index = state.indexOf(action.payload)
      state.splice(index, 1)
    },
  },
  extraReducers: (builder) => {
    // redux / toolkit usa o immer por debaixo dos panos 
    //então o ideal e retornar um array vazio para ele comprrender que e um mutavel valor
    builder.addCase(reset, (state, action) => [])
  }


})

export const { addMovie, removeMovie } = movieSlicer.actions
export const movieReducer = movieSlicer.reducer