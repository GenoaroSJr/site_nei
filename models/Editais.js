const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Editais = new Schema({
    titulo: {
        type: String,
        required: true
    },
    descricao: {
        type: String,
        required: true
    },
    auto: {
        type: String,
        required: true
    }
});

mongoose.model("editais", Editais);