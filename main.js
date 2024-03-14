const express=require('express');
const app=express();
const Patient=require('./models/patient');
const Doctor=require('./models/patient');
const mongoose=require('mongoose');  //can use this object to connect to mongodb


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
    res.render('index');
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
                            res.redirect('/');
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
                            res.redirect('/');
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(500).send('Error registering doctor');
                        });
                 }   
                
          
           
    } else {
        res.render('Signup',{
            message:'Passwords do not match'
        });
      
    }
});
app.post('/doctorlog',async (req,res)=>{
    const check=req.body;
    const existingDoctor= await Doctor.findOne({ email: check.email});
 
 if(existingDoctor){
    if(existingDoctor.password1==check.password){
     res.send('good');
    }
    else{
     res.send('wrong password');
    }
 }
 else{
     res.send('bad');
 }
 });
app.post('/patientlog',async (req,res)=>{
   const check=req.body;
   const existingPatient= await Patient.findOne({ email: check.email});

if(existingPatient){
   if(existingPatient.password1==check.password){
    res.send('good');
   }
   else{
    res.send('wrong password');
   }
}
else{
    res.send('bad');
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