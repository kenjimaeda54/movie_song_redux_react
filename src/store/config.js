import { createSlice, configureStore } from "@reduxjs/toolkit"



const songSlicker = createSlice({
  initialState: [],
  name: "song",
  reducers: {
    addSong(state, action) {
      state.push(action.payload)
    },

    removeSong() {

    }
  }

})


const store = configureStore({
  reducer: {

    //este nome song sera que vai aparecer no objeto 
    // {song: []}
    song: songSlicker.reducer
  }
})

const currentSong = store.getState()
console.log(currentSong)


store.dispatch({
  //song e nome que esta no slice
  //addSong e a função
  type: "song/addSong",
  payload: "New song"
})


const songBeforeAdd = store.getState()
console.log(songBeforeAdd)



