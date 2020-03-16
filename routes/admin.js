const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");

require("../models/Categoria");
const Categoria = mongoose.model("categorias");
require("../models/Postagem");
const Postagem = mongoose.model("postagens");
require("../models/Edital");
const Edital = mongoose.model("editais");

const {eAdmin} = require("../helpers/eAdmin"); //pega apenas a função eAdmin do local;
const multer = require('multer');
const path = require("path");



router.get('/',  (req,res)=>{
    res.render("admin/index");
});

router.get('/posts',  (req,res)=>{
    res.send("Paginas de Posts");
});

// ADD ARQUIVO \/
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null,"upload/");
    },
    filename: function(req, file, cb){
        cb(null, file.originalname + path.extname(file.originalname));
    }
});
//ADD ARQUIVO /\

const upload = multer({storage});

//AQUI É SOBRE EDITAIS \/ 

router.get('/editais', (req,res)=>{
    Edital.find().sort({date: 'desc'}).then((editais) => {
        res.render("admin/editais", {editais: editais});
    }).catch((erro) => {
        req.flash("erro_msg", "Houve um erro ao listar as categorias");
        res.redirect("/admin");
    });
});

router.get('/editais/add', (req,res)=>{
    res.render("admin/addedital");
});

router.post("/editais/nova", upload.single("file"), (req,res)=>{
    //validação de formulários;
    console.log(req.file.originalname)
       
        const novoEdital = {
            file_name: req.file.originalname,
            titulo: req.body.titulo,
            autor: req.body.autor,
            descricao: req.body.descricao,
            dia: req.body.dia,
        }

        new Edital(novoEdital).save().then(()=>{
            req.flash("success_msg", "Edital registrao com sucesso!");
            res.redirect("/admin/editais");
        }).catch((err)=>{
            req.flash("error_msg", "Houve um erro ao salvar o edital, tente novamnte!" + err);
            res.redirect("/admin");
        });
}); //fim router categoria

router.get("/editais/edit/:id",  upload.single("file"), (req,res)=>{
    Edital.findOne({_id:req.params.id}).then((editais)=>{
        res.render("admin/editeditais", {editais: editais})
    }).catch((erro)=>{
            req.flash("error_msg", "Esta categoria não existe")
            res.redirect("/admin/editais")
        });  
});

router.post("/editais/edit",  (req,res)=>{
    //fazer a validação da edição;

    Edital.findOne({_id: req.body.id}).then((edital)=>{
        edital.file_name = req.file.originalname,
        edital.titulo = req.body.titulo,
        edital.autor = req.body.autor,
        edital.descricao = req.body.descricao,
        edital.dia = req.body.dia

        Edital.save().then(()=>{
            req.flash("success_msg", "Edital alterado com sucesso!");
            res.redirect("/admin/editais");
        }).catch((erro)=>{
            req.flash("error_msg", "Houve um erro ao salvar o edital!");
            res.redirect("/admin/eitais");
        })

    }).catch((err)=>{
        req.flash("error_msg", "Houve um erro ao editar a categoria"+err);
        res.redirect("admin/editais");
    })
});

router.post("/editais/deletar",  (req,res)=>{
    Edital.remove({_id: req.body.id}).then(()=>{
        req.flash("success_msg", "Edital deletado com sucesso!");
        res.redirect("/admin/editais");
    }).catch((erro)=>{
        req.flash("erro_msg", "Houve um erro ao deletar o edital");
        res.redirect("/admin/editais");
    })
})


//AQUI É SOBRE EDITAIS /\

//AQUI É SOBRE CATEGORIAS \/

router.get('/categorias', (req,res)=>{
    Categoria.find().sort({date: 'desc'}).then((categorias) => {
        res.render("admin/categorias", {categorias: categorias});
    }).catch((erro) => {
        req.flash("erro_msg", "Houve um erro ao listar as categorias");
        res.redirect("/admin");
    });
});

router.get('/categorias/add', (req,res)=>{
    res.render("admin/addcategorias");
});


router.post("/categorias/nova", upload.single("file"), (req,res)=>{
    //validação de formulários;
    console.log(req.file.originalname)
    var erros = []
    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: "Nome inválido"}); //push serve para colocar um novo dado dentro do array.
    }

    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        erros.push({texto: "Slug inválido"});
    }

    if(req.body.nome.length < 2){
        erros.push({texto: "Nome muito pequeno"});
    }

    if(erros.length > 0){
        res.render("admin/addcategorias",  {erros: erros});
    }else{
        const novaCategoria = {
            file_name: req.file.originalname,
            nome: req.body.nome,
            slogam: req.body.slogam,
            autor: req.body.autor,
            dia: req.body.dia,
            slug: req.body.slug,
            texto: req.body.texto
        }

        new Categoria(novaCategoria).save().then(()=>{
            req.flash("success_msg", "Categoria criada com sucesso!");
            res.redirect("/admin/categorias");
        }).catch((erro)=>{
            req.flash("error_msg", "Houve um erro ao salcar a categoria, tente novamnte!");
            res.redirect("/admin");
        });
    }//fim else  
}); //fim router categoria

router.get("/categorias/edit/:id",  upload.single("file"), (req,res)=>{
    Categoria.findOne({_id:req.params.id}).then((categoria)=>{
        res.render("admin/editcategorias", {categoria: categoria})
    }).catch((erro)=>{
            req.flash("error_msg", "Esta categoria não existe")
            res.redirect("/admin/categorias")
        });  
    });

router.post("/categorias/edit",  (req,res)=>{
    //fazer a validação da edição;

    Categoria.findOne({_id: req.body.id}).then((categoria)=>{
        categoria.file_name = req.file.originalname,
        categoria.nome = req.body.nome,
        categoria.slogam = req.body.slogam,
        categoria.autor = req.body.autor,
        categoria.dia = req.body.dia,
        categoria.slug = req.body.slug,
        categoria.texto = req.body.texto

        categoria.save().then(()=>{
            req.flash("success_msg", "Categoria alterada com sucesso!");
            res.redirect("/admin/categorias");
        }).catch((erro)=>{
            req.flash("error_msg", "Houve um erro ao salvar a categoria!");
            res.redirect("/admin/categorias");
        })

    }).catch((erro)=>{
        req.flash("error_msg", "Houve um erro ao editar a categoria");
        res.redirect("admin/categorias");
    })
});

router.post("/categorias/deletar",  (req,res)=>{
    Categoria.remove({_id: req.body.id}).then(()=>{
        req.flash("success_msg", "Categoria deletada com sucesso!");
        res.redirect("/admin/categorias");
    }).catch((erro)=>{
        req.flash("erro_msg", "Houve um erro ao deletar a categoria");
        res.redirect("/admin/categorias");
    })
})

//AQUI É SOBRE CATEGORIAS /\

//AQUI É SOBRE POSTAGENSS \/

router.get("/postagens",  (req,res)=>{
    Postagem.find().populate("categoria").sort({data:'desc'}).then((postagens)=>{
        res.render("admin/postagens", {postagens: postagens})
    }).catch((erro) => {
        req.flash("error_msg", "Houve um erro ao listar as postagens");
        res.redirect("/admin");
    })
})

router.get("/postagens/add",  (req,res)=>{
    Categoria.find().then((categorias)=>{
        res.render("admin/addpostagem", {categorias: categorias});    
    }).catch((erro)=>{
        req.flash("erro_msg", "Houve um erro ao carregar a postagem!");
        res.redirect("/admin");
    })
})

router.post("/postagens/nova", (req,res)=>{
    //escrever validação;
    var erros = []
    if(req.body.categoria == '0'){
        erros.push({texto: "Selecione uma categoria valida"});
    }
    if(erros.length > 0){
        res.render("admin/addpostagem", {erros: erros})
    }else{
        const novaPostagem = {
            titulo: req.body.titulo,
            descricao: req.body.descricao,
            conteudo: req.body.conteudo,
            categoria: req.body.categoria,
            slug: req.body.slug
        }

        new Postagem(novaPostagem).save().then(() => {
            req.flash("success_msg", "Postagem criada com sucesso!");
            res.redirect("/admin/postagens");

        }).catch((erro)=>{
            req.flash("error_msg", "Houve um erro durante o salvamento da postagem");
            res.redirect("/admin/postagens");
        })
    }
})

router.get("/postagens/edit/:id", (req,res)=>{
    Postagem.findOne({_id: req.params.id}).then((postagem)=>{
        Categoria.find().then((categorias)=>{
            res.render("admin/editpostagens", {categorias: categorias, postagem: postagem});
        }).catch((erro)=>{
            req.flash("error_msg", "Houve um erro ao listar as categorias!");
            res.redirect("/admin/postagens");
        })
    }).catch((error) =>{
        req.flash("erro_msg", "Houve um erro ao carregar o formulário de edição!");
    })
})

router.post("/postagem/edit",  (req,res)=>{
    Postagem.findOne({_id: req.body.id}).then((postagem)=>{
        postagem.titulo = req.body.titulo
        postagem.descricao = req.body.descricao
        postagem.conteudo = req.body.conteudo
        postagem.categoria = req.body.categoria

        postagem.save().then(()=>{
            req.flash("success_msg", "Postagem editada com sucesso!");
            res.redirect("/admin/postagens");
        }).catch((error)=>{
            req.flash("error_msg", "Erro interno!");
            res.redirect("/admin/postagens");
        })

    }).catch((erro)=>{
        req.flash("error.msg", "Houve um erro ao salvar a edição");
        req.redirect("admin/postagens");
    })
})

router.get("/postagens/deletar/:id", (req,res)=>{
    Postagem.remove({_id: req.params.id}).then(()=>{
        req.flash("success_msg", "Postagem deletada com sucesso!");
        res.redirect("/admin/postagens");
    }).catch((erro)=>{
        req.flash("error_msg", "Houve um erro interno!");
        res.redirect("/admin/postagens");
    })
})

//AQUI É SOBRE POSTAGENSS /\

module.exports = router;