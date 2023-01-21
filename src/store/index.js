import { configureStore } from "@reduxjs/toolkit"
import { reset } from "./actions/geral"
import { addMovie, removeMovie, movieReducer } from "./slices/movieSlicer"
import { addSong, removeSong, songReducer } from "./slices/songSlicer"


const store = configureStore({

  //este nome song sera que vai aparecer no objeto 
  // {songs: []}
  reducer: {
    songs: songReducer,
    movies: movieReducer,
  }

})

//não esquecer de adicionar o Provider na herarquia maior
export { store, addMovie, addSong, removeMovie, removeSong, reset }



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