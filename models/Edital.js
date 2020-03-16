const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Editais = new Schema({
    file_name: {
        type: String,
    },
    titulo: {
        type: String,
        required: true
    },
    autor:{
        type: String,
        require: true
    },
    descricao: {
        type: String,
        required: true
    },
    dia: {
        type: String,
        required: true
    },
    data: {
        type: Date,
        default: Date.now()
    }
});

mongoose.model("editais", Editais);