import { createAction } from "@reduxjs/toolkit"

// criando uma ação separada para resetar o array de movie e song
export const reset = createAction("app/reset")