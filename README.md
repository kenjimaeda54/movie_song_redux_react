# Filmes e Sons
# Pequeno projeto, similar ao Todo, para adicionar sons e filmes

## Motivação
Relembrar conceitos de redux, gerenciador que um tempo não uso


## Feature
- Usei  [redux toolkit](https://redux-toolkit.js.org/)
- Ele possui algumas vantagens como immer assim todos os dados são mutaveis
-  Com essa lib conseguimos usar  uma abordagem que diminui bastante o boilerplate  
- Não precisei usar um switch gigante para determinar o tipo e acação
- No index do diretório de store eu centralizo todos a lógica do redux, ou seja, eu crio o store é exporto os redurces e actions 
- Reducer dentro de configureStore seriam os nossos redurecs que são criados a partir de slice
- A lógica e bem simples, referencio meu arquivo que criei o slicer em reducer
- Para criar um slicer eu preciso do valor initial e o nome dele, ambos são essenciais
- Valor do reducer    recebo por callback em state,   no meu exemplo e um array, porque meu valor inicial e um array, se fosse inteiro seria número e por ai diante.
- Para retornar meu reducer no valor inicial, ou seja vazio, simplesmente dentro de extraReducer retorno um array vazio, motivo que usamos immer por de baixo dos pano.
- Por  redux toolkit por debaixo dos panos utilizar immer  retorna uma array vazio já suficiente para zerar meu estado
- Payload e o valor que vou receber via dispatch
- ExtraReducers e ideal para centralizar logicas que iram inferir em mais de um slicer c
- Esse exemplo era para  resetar  movieSlicer e  songSlicer 
- Nome colocado no reducer dentro do configureStore e o nome que depois iremos acessar, por exemplo: state.songs,state.movies

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
- Como dito anteriormente não preciso criar um swith para demtinar em qual arquivo sera disparado o distpach
- Para auxiliar nessa conexão do arquivo de lógica do redux com os componentes do react usei o [react redux](https://react-redux.js.org/)
- Para disparar o trigger para a função correta do redux utilizo o useDispatch é envolvo a função que exportei dos arquivos de slicers 
- Reapara que exportei  duas funções uma para adicionar som e outra remover o som
- Ao usar dispatch(addSong(song)) já estou adicionando o valor no redux
- Com essa abordagem diminuo muito a questão de boilerplate, pois cada função tem seu slicer bem definido sendo exportados pelos respectivos actions
- Para caputar esse valor inserido uso o useSelector nele por calback eu tenho o retorno do state, nesse caso e songs porque dentro de configureStore  nome do recucer e songs



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
- Ao disparar a função reset ele limpara os dois reducer tanto de song quanto de movie


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






