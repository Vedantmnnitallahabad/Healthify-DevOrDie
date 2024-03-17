const express=require('express');
const app=express();
const Modules=require('./models/patient');
const Patient=Modules.patient;
const Doctor=Modules.doctor;
const Appointment=Modules.appointment;
const mongoose=require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const { ObjectId } = require('mongodb');
//can use this object to connect to mongodb


const uri="mongodb+srv://vedant:vedant1234@cluster0.xxpnhez.mongodb.net/Users?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(uri)
  .then(result => app.listen(3000))
  .catch(err => console.log(err));     ///THIS HELPS MOONGOOSE TO CONNECT TO PARTICULAR DATABADE
//   mongoose
//   .connect( uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
//   .then(() => console.log( 'Database Connected' ))
//   .catch(err => console.log( err ));

app.set('view engine', 'ejs');
app.use(cookieParser('abcdefg'));
app.use(session({
    secret : "ABCDEFG",
    saveUninitialized : false,
    resave : false,
    cookie:{
        maxAge : 1000 * 60 * 60 * 24, 
    }
}));
app.use(express.static('assets'));
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use((req, res, next) => {
    res.locals.path = req.path;
    next();
  });
app.set('view engine', 'ejs');

function patientCheck(req, res){
    //redirect to home if not logged in or if they are a doctor
    if(!req.session.user || req.session.user.qualifications){
        res.redirect('/patientlogin');
    }
}
function doctorCheck(req, res){
    //redirect to home if not logged in or if they are a patient
    if(!req.session.user || req.session.user.height){
        res.redirect('/doctorlogin');
    }
}

app.get('/',(req,res)=>{
    res.render('Home');
});



app.post('/patient-registration', async (req, res) => {
    if (req.body.password1 === req.body.password2) {

    const check=req.body;
       const existingPatient= await Patient.findOne({ email: check.email });
         
                if (existingPatient) {
                    // Patient with the same email already exists
                    res.send("Email Id already exists");
                } 
                    // No patient with the same email, proceed with registration
                 else{
                    const patient = new Patient(req.body);
                    patient.save()
                        .then(result => {
                            res.redirect('/patientlogin');
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(500).send('Error registering patient');
                        });
                 }   
                
          
           
    } else {
        res.render('Signup',{
            message:'Passwords do not match'
        });
      
    }
});
app.post('/doctor-registration', async (req, res) => {
    if (req.body.password1 === req.body.password2) {

    const check=req.body;
       const existingDoctor= await Doctor.findOne({ email: check.email });
         
                if (existingDoctor) {
                    // Patient with the same email already exists
                    res.send("Email Id already exists");
                } 
                    // No patient with the same email, proceed with registration
                 else{
                    const doctor = new Doctor(req.body);
                    doctor.save()
                        .then(result => {
                            res.redirect('/doctorlogin');
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(500).send('Error registering doctor');
                        });
                 }   
                
          
           
    } else {
        res.status(200).json({
            alert:"Password do not match"})
        //     ('Signup',{
        //     message:'Passwords do not match'
        // });
      
    }
});
app.post('/doctorlog',async (req,res)=>{
    const check=req.body;
    const existingDoctor= await Doctor.findOne({ email: check.email});
 
 if(existingDoctor){
    if(existingDoctor.password1==check.password){
        req.session.user = existingDoctor;
        res.redirect('/profile');
    }
    else{
     res.send('wrong password');
    }
 }
 else{
     res.send('Doctor does not exist!');
 }
 });
 app.get('/contact',(req,res)=>{
    res.render('contact');
 })
app.post('/patientlog',async (req,res)=>{
   const check=req.body;
   const existingPatient= await Patient.findOne({ email: check.email});

if(existingPatient){
   if(existingPatient.password1==check.password){
    req.session.user = existingPatient;
    res.redirect('/profile');
   }
   else{
    res.send('wrong password');
   }
}
else{
    res.send('Patient does not exist!');
}
});
app.get('/patientlogin',(req,res)=>{
    if(!req.session.user || req.session.user.qualifications){
        res.render('Signin');
    }
    else{
        res.redirect('/profile');
    }
});
app.get('/patientreg',(req,res)=>{
    res.render('Signup');
});
app.get('/doctorreg',(req,res)=>{
    res.render('Doctor_signup');
});
app.get('/doctorlogin',(req,res)=>{
    if(!req.session.user || req.session.user.height){
        res.render('Doctor_login');
    }
    else{
        res.redirect('/profile')
    }
});
app.get('/about',(req,res)=>{
    res.render('about');
});
app.get('/searchfordoctor',(req,res)=>{
    patientCheck(req, res);
    Doctor.find()
     .then(result=>{
        res.render('finddoctor',{doctors:result});
     });
    
})
  app.get('/eachdoctor/:id',async (req,res)=>{
    const id=req.params.id;
    const doc=await Doctor.findById(id);
    res.render('eachdoc',{doc:doc});
  }) 
  app.get('/bookappointment/:id',async (req,res)=>{
    patientCheck(req, res);
    const id=req.params.id;
    const doc=await Doctor.findById(id);
    res.render('appointment',{doc:doc});
  })
  app.post('/appointment/:id',async (req,res)=>{
    const id=req.params.id;

    const existingapt=await Appointment.findOne({patientemail:req.body.email});
    if(existingapt && existingapt.status==="PENDING"){
        res.send('Appointment already booked');
    }
    else{
        const doc=await Doctor.findById(id);
        const pat= await Patient.findOne({ email: req.body.email});
      
       const apt={
        doctoremail:doc.email,
        patientemail:req.body.email,
        date:req.body.date,
        time:req.body.time,
        pat_id:pat._id,
        doc_id:doc._id,
        status:"PENDING"
       }
        const appointment = new Appointment(apt);
        appointment.save()
            .then(result => {


                res.redirect('/profile');
            })
            .catch(err => {
                console.log(err);
                res.status(500).send('Error registering doctor');
            });
    
    }
    

  })
  app.get('/viewappointments/:id',async (req,res)=>{
    doctorCheck(req, res);
    const id=req.params.id;
    const doc=await Doctor.findById(id);
    const appointment= await Appointment.find({ doctoremail: doc.email});
    res.render('viewappointments',{appointment:appointment});
  })
  app.get('/patviewappointments/:id',async (req,res)=>{
    patientCheck(req, res);
    const id=req.params.id;
    const pat=await Patient.findById(id);
    const appointment= await Appointment.find({ patientemail: pat.email});
    res.render('patviewappointment',{appointment:appointment});
  })
  app.delete('/deleteappointments/:id',(req,res)=>{
    patientCheck(req, res);
    const id=req.params.id;
   
     Appointment.findByIdAndDelete(id) .then(result => {
      res.send('DELETED');
      })
      .catch(err => {
        console.log(err);
      });
  
     
   
})
app.get('/profile', async (req,res) => {
    if(!req.session.user){
        res.redirect('/');
    }
    else if(!req.session.user.qualifications){
        res.render('patientdetails',{patient:req.session.user});
    }
    else{
        res.render('doctordetails',{doctor:req.session.user});
    }

})
  app.get('/findpat/:id',async (req,res)=>{
    doctorCheck(req, res);
    const id=req.params.id;
    const pat=await Patient.findById(id); 
    res.render('viewpat',{patient:pat});
  })
  app.get('/finddocter/:id',async (req,res)=>{
    patientCheck(req, res);
    const id=req.params.id;
    const doc=await Doctor.findById(id); 
    res.render('viewdoc',{doctor:doc});
  })
  app.get('/finddoc/:speciality',async (req,res)=>{
    patientCheck(req, res);
    const speciality=req.params.speciality;
    const doc=await Doctor.find({ speciality: speciality});
    res.render('ind',{doctors:doc,DEPARTMENT:speciality}); 
  })

  app.put('/declappointment/:id',async (req,res)=>{
   
     const id=req.params.id;
     const apt=await  Appointment.findById(id);
    
     await  Appointment.replaceOne({_id:id}, 
         {
             doctoremail:apt.doctoremail,
 
             patientemail:apt.patientemail,
 
             date:apt.date,
 
             time:apt.time,
 
             pat_id:apt.pat_id,
 
             doc_id:apt.doc_id,
 
             status: "REJECTED"
          });

          res.send('REJECTED');

})


  app.put('/confappointment/:id',async (req,res)=>{

    
    const id=req.params.id;

    const apt=await  Appointment.findById(id);
    
    await  Appointment.replaceOne({_id:id}, 
        {
            doctoremail:apt.doctoremail,


            patientemail:apt.patientemail,

            date:apt.date,

            time:apt.time,

            pat_id:apt.pat_id,

            doc_id:apt.doc_id,

            status: "ACCEPTED"
         });

         res.send('ACCEPTED');
})

app.get('/logout', async (req, res) => {
    req.session.destroy((err) => {
        if(err){
            console.log(err);
            throw(err);
        }
    })
    res.redirect('/');
})

app.get('/logout', async (req, res) => {
    req.session.destroy((err) => {
        if(err){
            console.log(err);
            throw(err);
        }
    })
    res.redirect('/');
})

app.get('/singleaptpat/:id',async (req,res)=>{
    const id=req.params.id;
    const apt=await Appointment.findById(id);
    res.render('patsingleappointment',{appointment:apt});
})
app.get('/singleaptdoc/:id',async (req,res)=>{
    const id=req.params.id;
    const apt=await Appointment.findById(id);
    res.render('docsingleappointment',{appointment:apt});
})
app.use((req, res) =>{
    res.render('404');
});