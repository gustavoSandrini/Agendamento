const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const appoitmentService = require("./services/AppointmentService");
const AppointmentService = require("./services/AppointmentService");
const nodemailer = require("nodemailer");

app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


app.set('view engine', 'ejs');

mongoose.connect("mongodb://127.0.0.1:27017/agendamento",{useNewUrlParser: true, useUnifiedTopology: true});
//mongoose.set('useFindAndModify', false);


app.get("/", (req, res) =>{
    res.render("index");
});

app.get("/cadastro", (req, res) =>{
    res.render("create");
});

app.post("/create", async(req, res) => {

    var status = await appoitmentService.Create(
        req.body.name,
        req.body.email,
        req.body.description,
        req.body.cpf,
        req.body.date,
        req.body.time
    )
    if(status){
        res.redirect("/");
    }else{
        res.send("Ocorreu uma falha!")
    }
});


app.get("/buscaconsultas", async (req, res) => {
    
    var appoitments = await AppointmentService.GetAll(false);
    res.json(appoitments);

app.get("/event/:id", async (req, res) =>{
    var appoitment = await AppointmentService.GetById(req.params.id);
    console.log(appoitment)
    res.render("event", {appo: appoitment});
})

});


app.post("/finish", async (req, res) => {
    var id = req.body.id;
    var result = await AppointmentService.Finish(id);

    res.redirect("/");
})


app.get("/list", async(req, res) =>{
    var appos = await AppointmentService.GetAll(true);
    res.render("list", {appos});
});

app.get("/resultadodabusca", async (req, res) =>{
   var appos = await AppointmentService.Search(req.query.search);
   res.render("list", {appos});
});

var polltime = 1000 * 60 * 5

setInterval(async() =>{

    await AppointmentService.SendNotification();


    
},polltime)



app.listen(8080, () => {});