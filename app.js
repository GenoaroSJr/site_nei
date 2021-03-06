//Carregando módulos
const express = require('express');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const app = express();
const admin = require('./routes/admin');
const path = require('path'); // manipular pastas e diretorios
const mongoose = require('mongoose');
const session = require("express-session");
const flash = require("connect-flash");


require("./models/Postagem");
const Postagem = mongoose.model("postagens");
require("./models/Categoria");
const Categoria = mongoose.model("categorias");
require("./models/Pesquisa");
const Pesquisa = mongoose.model("pesquisas");
require("./models/Edital");
const Edital = mongoose.model("editais");

const usuarios = require("./routes/usuario");
const passport = require("passport");
require("./config/auth")(passport);





//Configurações
// Sessão
app.use(session({
    secret: "cursodenode", // ele cria uma sessão
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
// Middleware
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    res.locals.user = req.user || null;
    next();
});

app.use(express.static(__dirname + '/public'))
//Body Parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//Handlebars
app.engine('handlebars', handlebars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
//Mongoose
mongoose.connect('mongodb://localhost/nei').then(() => {
    console.log("Conectado com sucesso");
}).catch((err) => {
    console.log("Erro ao se conectar: " + err);
});
//Em breve

//Public
app.use(express.static(path.join(__dirname, "public")));

//Rotas
app.get('/', (req, res) => {
        res.render("index");
})

//Rotas - postagens
app.get("/postagem/:slug", (req, res) => {
    Postagem.findOne({ slug: req.params.slug }).then((postagem) => {
        if (postagem) {
            res.render("postagem/index", { postagem: postagem })
        } else {
            req.flash("error_msg", "Essa postagem não existe!");
            res.redirect('/');
        }
    }).catch((err) => {
        req.flash("error_msg", "Houve um error interno! " + err);
        res.redirect("/")
    })
})

//Rotas - categorias
app.get("/categorias", (req, res) => {
    Categoria.find().then((categorias) => {
        res.render("categorias/index", { categorias: categorias });
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro interno! " + err);
        res.redirect("/");
    })
})

app.get("/categorias/:slug", (req, res) => {
    Categoria.findOne({ slug: req.params.slug }).then((categoria) => {
        if (categoria) {
            Postagem.find({ categoria: categoria._id }).then((postagens) => {
                res.render("categorias/postagens", { postagens: postagens, categoria: categoria })
            }).catch((err) => {
                req.flash("error_msg", "Esta categoria não existe! " + err);
                res.redirect("/");
            })
        } else {
            req.flash("error_msg", "Esta categoria não existe!");
            res.redirect("/");
        }
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro " + err);
        console.log(erro)
        res.redirect("/");
    })
})

//Rotas - editais
app.get("/editais", (req, res) => {
    Edital.find().then((editais) => {
        res.render("editais/index", { editais: editais });
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro interno! " + err);
        res.redirect("/");
    })
})

//Rotas - pesquisa
app.get("/pesquisas", (req, res) => {
    Edital.find().then((pesquisas) => {
        res.render("pesquisas/index", { pesquisas: pesquisas });
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro interno! " + err);
        res.redirect("/");
    })
})

app.use('/admin', admin);
app.use("/usuarios", usuarios);

app.get("/404", (req, res) => {
    res.send("ERRO 404!");
})
//Outros
const PORT = 8081;
app.listen(PORT, () => {
    console.log("Servidor Rodando em http://localhost:8081");
});