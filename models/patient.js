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
},
age:{
    type:String,
    required:true
},
gender:{
    type:String,
    required:true
},
height:{
    type:String,
    required:true
},
weight:{
    type:String,
    required:true
},
bloodgroup:{
    type:String,
    required:true
}

},{timestamps:true});

const doctorSchema=new Schema({
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
    },
    qualifications:{
        type:String,
        required:true
    },
    speciality:{
        type:String,
        required:true
    },
    locality:{
        type:String,
        required:true
    },
    hospital:{
        type:String,
        required:true
    },
    experience:{
        type:String,
        required:true
    }

    },{timestamps:true});

    const appointmentSchema=new Schema({
        doctoremail:{
            type: String,
            required: true
        },
        patientemail:{
            type:String,
            required:true
        },
        date:{
            type:String,
            required:true
        },
        
        time:{
            type:String,
            required:true
        },
        pat_id:{
            type:String,
            required:true
        },
        doc_id:{
            type:String,
            required:true
        },
        status:{
            type:String,
            required:true
        }
     
        },{timestamps:true});

        const contactSchema=new Schema({
            first_name:{
                type: String,
                required: true
            },
            last_name :{  type:String,
                required:true
            },
            email:{
                type:String,
                required:true
            },
            
           phone:{
                type:String,
                required:true
            },
            message:{
                type:String,
                required:true
            }
       
            },{timestamps:true});

const Patient=mongoose.model('Patient',patientSchema);
const Doctor=mongoose.model('Doctor',doctorSchema);
const Appointment=mongoose.model('Appointment',appointmentSchema);
const Contact=mongoose.model('Contact',contactSchema);
module.exports={
    patient:Patient,
    doctor:Doctor,
    appointment:Appointment,
    contact:Contact
};
