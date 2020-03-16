const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Categoria = new Schema({
    file_name: {
        type: String,
    },
    nome: {
        type: String,
        required: true
    },
    slogam: {
        type: String,
        required: true
    },
    autor: {
        type: String,
        required: true
    },
    dia: {
        type: String,
        required: true
    },
   
    slug: {
        type: String,
        required: true
    },
    texto: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    }
});

mongoose.model("categorias", Categoria);