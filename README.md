# Filmes e sons
Pequeno projeto como todo para adicionar sons e filmes

## Motivacao
Relembrar conceitos de redux, gerenciador que um tempo nao uso


## Feature
- Usei  [redux toolkit](https://redux-toolkit.js.org/)
- Ele possui algumas vantagems como immer assim todos os dados sao imutaveis
- Com ele segui uma abordagem que diminiu bastante o boilerplate para construir a logica
- Nao precisei usar um switch gigante para detmerinar o tipo e acaao
- No index do diretorio de store eu centralizo todos a logica do redux ou seja eu crio o store e exporto os redurces e actions neste direotiro
- Reducer dentro de configureStore seriam os nossos redurecs que sao criados a partir de slice
- A logica e bem simples eu referencio meu arquivo que creiei o slicer em reducer
- Para criar um slicer eu preciso do valor initial e o nome dele, ambos sao essenciais
- Com o valor inicial eu vou receber por callback em state, ou seja no meu exemplo e um array,entao meu state sempre havera metodos de array, em extraReducer eu criei para retornar o meu estado ao valor inicial nesse caso simplemente retornei um array vazio []
- Por usar immer por debaixo dos panos utilizar abordagem de retornar uma array vazio ja suficiente para zerar meu estado
- Payload e o valor que vou receber via dispatch
- ExtraReducers e ideal para centralizar logicas que iram inferir em mais de um slicer como no caso de resetar era feito tanto no movieSlicer como songSlicer 
- Nome colocado no reducer dentro do configureStore e o nome que depois iremos acessar por exemplo state.songs,state.movies

```javascript


//action
import { createAction } from "@reduxjs/toolkit"

// criando uma ação separada para resetar o array de movie e song
export const reset = createAction("app/reset")


//store

import { configureStore } from "@reduxjs/toolkit"
import { reset } from "./actions/geral"
import { addMovie, removeMovie, movieReducer } from "./slices/movieSlicer"
import { addSong, removeSong, songReducer } from "./slices/songSlicer"


const store = configureStore({


  reducer: {
    songs: songReducer,
    movies: movieReducer,
  }

})

//não esquecer de adicionar o Provider na herarquia maior
export { store, addMovie, addSong, removeMovie, removeSong, reset }


//movieSlicer

import { createSlice } from "@reduxjs/toolkit"
import { reset } from "../actions/geral"


const movieSlicer = createSlice({
  initialState: [],
  name: "movie",
  reducers: {
    addMovie(state, action) {
      state.push(action.payload)
    },
    removeMovie(state, action) {
      const index = state.indexOf(action.payload)
      state.splice(index, 1)
    },
  },
  extraReducers: (builder) => {
    builder.addCase(reset, (state, action) => [])
  }


})

export const { addMovie, removeMovie } = movieSlicer.actions
export const movieReducer = movieSlicer.reducer


```


## 
- Como dito anteriormente nao preciso criar um swith para demtinar em qual arquivo sera disparado o distpach
- Para auxiliar nessa conexao do arquivo de logica do redux com os componentes do react usei o [react redux](https://react-redux.js.org/)
- Para disparar o trigger para a funcao correta do redux ustilizo o useDispatch e envolvo a funcao que exportei do actions 
- Reapara que exporeite dusa funcoes uma para adicionar som e outra remover o som
- Ao usar dispatch(addSong(song)) ja estou adicionando o valor no redux
- Com essa abordagem diminuo muito a questao de boilerplate pois cada funcao tem seu slicer bem definido e sao exportados pelos respectivos actions
- Para caputar esse valor inserido uso o useSelector nele por calback eu tenho o retorno do state, nesse caso e songs porque dentro de configure store e songs nome



```javascript
//song componente


import { createRandomSong } from "../data";
import { useDispatch, useSelector } from "react-redux"
import { addSong, removeSong } from "../store";

function SongPlaylist() {
  const dispatch = useDispatch()


  //aqui retorna um objeto {songs: value}
  //retorna a chave song porque meu reducer em configureStore e song
  const songPlaylist = useSelector((state) => state.songs);

  const handleSongAdd = (song) => {
    dispatch(addSong(song))
  };


  const handleSongRemove = (song) => {
    dispatch(removeSong(song))
  };

  const renderedSongs = songPlaylist.map((song) => {
    return (
      <li key={song}>
        {song}
        <button
          onClick={() => handleSongRemove(song)}
          className="button is-danger"
        >
          X
        </button>
      </li>
    );
  });

  return (
    <div className="content">
      <div className="table-header">
        <h3 className="subtitle is-3">Song Playlist</h3>
        <div className="buttons">
          <button
            onClick={() => handleSongAdd(createRandomSong())}
            className="button is-link"
          >
            + Add Song to Playlist
          </button>
        </div>
      </div>
      <ul>{renderedSongs}</ul>
    </div>
  );
}

export default SongPlaylist;



//song slicer

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




// index store


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


```

##
- Para limpar criamos uma action e compartilhamos ela nos dois slicers assim limparei tando o reducer de song quanto de movie
- Ao disparar a funcao reset ele limpara os dois reducer tanto de song quanto de movie




``` javascript


//componente App para limpar

import { useDispatch } from "react-redux"
import "./styles.css";
import MoviePlaylist from "./components/MoviePlaylist";
import SongPlaylist from "./components/SongPlaylist";
import { reset } from "./store";

export default function App() {
  const dispatch = useDispatch()


  const handleResetClick = () => {
    dispatch(reset())
  };

  return (
    <div className="container is-fluid">
      <button onClick={() => handleResetClick()} className="button is-danger">
        Reset Both Playlists
      </button>
      <hr />
      <MoviePlaylist />
      <hr />
      <SongPlaylist />
    </div>
  );
}


// action
import { createAction } from "@reduxjs/toolkit"


export const reset = createAction("app/reset")


//movie

import { createSlice } from "@reduxjs/toolkit"
import { reset } from "../actions/geral"


const movieSlicer = createSlice({
  initialState: [],
  name: "movie",
  reducers: {
    addMovie(state, action) {
      state.push(action.payload)
    },
    removeMovie(state, action) {
      const index = state.indexOf(action.payload)
      state.splice(index, 1)
    },
  },
  extraReducers: (builder) => {
    builder.addCase(reset, (state, action) => [])
  }


})

export const { addMovie, removeMovie } = movieSlicer.actions
export const movieReducer = movieSlicer.reducer


// song

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





```






