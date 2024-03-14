const express=require('express');
const app=express();
app.listen(3000);

app.set('view engine', 'ejs');
app.use(express.static('assets'));
app.use((req, res, next) => {
    res.locals.path = req.path;
    next();
  });
app.set('view engine', 'ejs');
app.get('/',(req,res)=>{
    res.render('index');
});
app.get('/patientlogin',(req,res)=>{
    res.render('index');
});

app.get('/doctorlogin',(req,res)=>{
    res.render('index');
});