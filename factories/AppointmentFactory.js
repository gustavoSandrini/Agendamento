class AppointmentFactory{

    build(simplesAppointment){

        var day = simplesAppointment.date.getDate()+1;
        var month = simplesAppointment.date.getMonth();
        var year = simplesAppointment.date.getFullYear();
        var hour = Number.parseInt(simplesAppointment.time.split(":")[0]);
        var minutes = Number.parseInt(simplesAppointment.time.split(":")[1]);

        var startDate = new Date(year, month, day, hour, minutes, 0, 0);
        //startDate.setHours(startDate.getHours() - 3 )



        var appo = {
            id: simplesAppointment._id,
            title: simplesAppointment.name + " - " + simplesAppointment.description,
            start: startDate,
            end: startDate,
            notified: simplesAppointment.notified,
            email: simplesAppointment.email
        }

        return appo;
    }

}


module.exports = new AppointmentFactory();