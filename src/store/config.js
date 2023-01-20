import { createSlice, configureStore } from "@reduxjs/toolkit"


const songSlicer = createSlice({
  name: "song",
  initialState: [],
  reducers: {
    addSong(state, action) {
      state.push(action.payload)
    },
    removeSong(state, action) {

    }
  }
})


const store = configureStore({

  //este nome song sera que vai aparecer no objeto 
  // {songs                             xx              : []}
  reducer: {
    songs: songSlicer.reducer
  }

})

//não esquecer de adicionar o Provider na hirarquia maior
export { store }
export const { addSong } = songSlicer.actions


//exemplo interessante
// //vejo o valor atual do state
// const currentSongOne = store.getState()
// console.log(currentSongOne)


// store.dispatch({
//   //song e nome que esta no slice
//   //addSong e a função
//   type: "song/addSong",
//   payload: "New Song"
// })


// const currentSongTwo = store.getState()
// console.log(currentSongOne)
// console.log(currentSongTwo)