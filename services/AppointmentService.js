var appoitment = require("../models/Appointment");
var mongoose = require("mongoose");
var AppointmentFactory = require("../factories/AppointmentFactory");
var mailer = require("nodemailer");

const Appo = mongoose.model("Appointment", appoitment);


class AppoitmentService {

    async Create(name, email, description, cpf, date, time){
        var newAppo = new Appo({
            name,
            email,
            description,
            cpf,
            date,
            time,
            finished: false,
            notified: false
        });
        try{
        await newAppo.save();
        return true;
    }catch(err){
        console.log(err);
        return false;

    }

    }
    async GetAll(showFinished){

        if(showFinished){
            return await Appo.find();
        }else{
            var appos = await Appo.find({'finished': false})
            var appoitments = [];

            appos.forEach(appoitment => {

                if(appoitment.date != undefined){
                appoitments.push( AppointmentFactory.build(appoitment) )
            }
            });

            return appoitments;
        }

    }
    async GetById(id){
        try{
        var event = await Appo.findOne({'_id': id})
        return event;
    }catch(err){
        console.log("erro na rota evento")
    }
    }
    async Finish(id){
    try{
    await Appo.findByIdAndUpdate(id, {finished: true});
    return true;
  }catch(err){
    console.log("Erro ao finalizar!!")
    return false;
  }
    }
    async Search(query){
    try{
    var appos = await Appo.find().or([{email: query},{cpf: query}])
    return appos;
 }catch(err){
    console.log("Erro ao buscar");
    return [];
 }
    }
    async SendNotification(){
        
           var appos = await this.GetAll(false);

           var transporter = mailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 25,
            auth: {
                user: "3c0370dbc8cf62",
                pass: "62e81ca301ebce"
            }
        });

            appos.forEach(async app => {
                var date = app.start.getTime();
                var hour = 1000 * 60 * 60;
                var gap = date-Date.now();

                if(gap <= hour){

                    if(!app.notified){

                    await Appo.findByIdAndUpdate(app.id, {notified: true});

                        transporter.sendMail({
                            from: "Ododente<testenodejs@gmail.com>",
                            to: app.email,
                            subject: "Sua consulta vai Acontecer!",
                            text: "Olá!! sua consulta vai ser realizada em 1 hora."

                        }).then( () => {

                        }).catch(err =>{

                        })

                    }

                }
            })
        }
    }


module.exports = new AppoitmentService();


