const express=require('express');
const app=express();
const Modules=require('./models/patient');
const Patient=Modules.patient;
const Doctor=Modules.doctor;
const Appointment=Modules.appointment;
const mongoose=require('mongoose');
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
app.use(express.static('assets'));
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use((req, res, next) => {
    res.locals.path = req.path;
    next();
  });
app.set('view engine', 'ejs');
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
     res.render('doctorlogin_land',{doctor:existingDoctor});
    }
    else{
     res.send('wrong password');
    }
 }
 else{
     res.send('Doctor do not exist!!!');
 }
 });
app.post('/patientlog',async (req,res)=>{
   const check=req.body;
   const existingPatient= await Patient.findOne({ email: check.email});

if(existingPatient){
   if(existingPatient.password1==check.password){
    res.render('patientlogin_land',{patient:existingPatient});
   }
   else{
    res.send('wrong password');
   }
}
else{
    res.send('Patient Do not exist!!!');
}
});
app.get('/patientlogin',(req,res)=>{
    res.render('Signin');
});
app.get('/patientreg',(req,res)=>{
    res.render('Signup');
});
app.get('/doctorreg',(req,res)=>{
    res.render('Doctor_signup');
});
app.get('/doctorlogin',(req,res)=>{
    res.render('Doctor_login');
});
app.get('/about',(req,res)=>{
    res.render('about');
});
app.get('/searchfordoctor',(req,res)=>{
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
    const id=req.params.id;
    const doc=await Doctor.findById(id);
    res.render('appointment',{doc:doc});
  })
  app.post('/appointment/:id',async (req,res)=>{
    const id=req.params.id;
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
            res.status(200).send('appointment request sent');
            
        })
        .catch(err => {
            console.log(err);
            res.status(500).send('Error registering doctor');
        });

  })
  app.get('/viewappointments/:id',async (req,res)=>{
    const id=req.params.id;
    const doc=await Doctor.findById(id);
    const appointment= await Appointment.find({ doctoremail: doc.email});
    res.render('viewappointments',{appointment:appointment});
  })
  app.get('/patviewappointments/:id',async (req,res)=>{
    const id=req.params.id;
    const pat=await Patient.findById(id);
    const appointment= await Appointment.find({ patientemail: pat.email});
    res.render('patviewappointment',{appointment:appointment});
  })
  app.delete('/deleteappointments/:id',(req,res)=>{
    const id=req.params.id;
   
     Appointment.findByIdAndDelete(id) .then(result => {
      res.send('DELETED');
      })
      .catch(err => {
        console.log(err);
      });
  
     
   
})
  app.get('/findpat/:id',async (req,res)=>{
    const id=req.params.id;
    const pat=await Patient.findById(id); 
    res.render('viewpat',{patient:pat});
  })
  app.get('/finddocter/:id',async (req,res)=>{
    const id=req.params.id;
    const doc=await Doctor.findById(id); 
    res.render('viewdoc',{doctor:doc});
  })
  app.get('/finddoc/:speciality',async (req,res)=>{
    const speciality=req.params.speciality;
    const doc=await Doctor.find({ speciality: speciality});
    res.render('ind',{doctors:doc,DEPARTMENT:speciality}); 
  })

  app.patch('/declappointment/:id',(req,res)=>{
    const updates={"status": "CANCELLED"};

    Appointment.findByIdAndUpdate(id,{$set: updates}).then(result => {
        res.send('UPDATED');
        })
        .catch(err => {
          console.log(err);
        });
  })

  app.patch('/confappointment/:id',(req,res)=>{
    const updates={status: "ACCEPTED"};
    const id=req.params.id;
    Appointment.findByIdAndUpdate({_id:id},{$set: updates}).then(result => {
        res.send('UPDATED');
        })
        .catch(err => {
          console.log(err);
        });
  })

app.use((req, res) => {
    res.render('404');
});