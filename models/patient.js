const mongoose =require('mongoose');
const Schema=mongoose.Schema;

const patientSchema=new Schema({
name:{
    type: String,
    required: true
},
email:{
    type:String,
    required:true
},
password1:{
    type:String,
    required:true
},
password2:{
    type:String,
    required:true
}

},{timestamps:true});

const Patient=mongoose.model('Patient',patientSchema);
const Doctor=mongoose.model('Doctor',patientSchema);
module.exports=Patient;
module.exports=Doctor;