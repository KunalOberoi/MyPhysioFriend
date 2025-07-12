import validator from "validator"
import bcrypt from "bcrypt"
import {v2 as cloudinary} from "cloudinary"
import doctorModel from "../models/doctorModel.js"
import userModel from "../models/userModel.js"
import jwt from "jsonwebtoken"
import appointmentModel from "../models/appointmentModel.js"

// api for adding doctor 



const addDoctor = async(req,res)=>{

    try{

        const {name,email,password,speciality,degree,experience,about,fees,address} =req.body
        const imageFile = req.file

        // checking for all data to add doctor 
        if (! name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address) {
            return res.json({
                success:false,
                message:"All fields are required"
            })
            
        }
        // validating email format
        if (!validator.isEmail(email)) {
            return res.json({
                success:false,
                message:"Please Enter A Valid Email"
            })
        }
        // validating password length
        if (password.length < 8) {
            return res.json({
                success:false,
                message:"Password Should be atleast 8 characters"
            })
            
        }
        // hashing docotr password
        const salt = await bcrypt.genSalt(10)
        const hashedPasssword = await bcrypt.hash(password,salt)

        // upload image to cloudinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path,{resource_type:"image"})
        const imageUrl = imageUpload.secure_url

        const doctorData ={
            name,
            email,
            image:imageUrl,
            password:hashedPasssword,
            speciality,
            degree,
            experience,
            about,
            fees,
            address:JSON.parse(address),
            date:Date.now()
        }

        const newDoctor = await doctorModel(doctorData)
        await newDoctor.save()

         res.json({success:true,message:"Doctor Added Successfully"})

        

    }catch(error){
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

// api for the admin login
const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email+password,process.env.JWT_SECRET)
            res.json({success:true,token })
        } else {
            res.json({ success: false, message: "Invalid Credentials" });
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API to get all doctor list of admin panel 
const allDoctors = async (req,res) =>{
    try {
        const doctors = await doctorModel.find({}).select('-password')
        res.json({success:true,doctors})
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API to change doctor availability
const changeAvailability = async (req, res) => {
    try {
        const { docId } = req.body;
        const docData = await doctorModel.findById(docId);
        await doctorModel.findByIdAndUpdate(docId, { available: !docData.available });
        res.json({ success: true, message: 'Availability Changed' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API to get all approved doctors list for frontend
const doctorList = async (req, res) => {
    try {
        const doctors = await doctorModel.find({ available: true }).select(['-password', '-email']);
        res.json({ success: true, doctors });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API to get all appointments for admin panel
const appointmentsAdmin = async (req, res) => {
    try {
        const appointments = await appointmentModel.find({});
        
        // Update appointments with latest user and doctor data
        const updatedAppointments = await Promise.all(appointments.map(async (appointment) => {
            try {
                // Get latest user data
                const latestUserData = await userModel.findById(appointment.userId).select('-password');
                
                // Get latest doctor data
                const latestDocData = await doctorModel.findById(appointment.docId).select('-password');
                
                // Return appointment with updated userData and docData if they still exist
                const updatedAppointment = {
                    ...appointment.toObject()
                };
                
                if (latestUserData) {
                    updatedAppointment.userData = latestUserData;
                }
                
                if (latestDocData) {
                    updatedAppointment.docData = latestDocData;
                }
                
                return updatedAppointment;
            } catch (error) {
                console.log('Error fetching user/doctor data for appointment:', error);
                // Return original appointment if there's an error
                return appointment.toObject();
            }
        }));
        
        res.json({ success: true, appointments: updatedAppointments });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API for appointment cancellation by admin  
const appointmentCancel = async (req, res) => {
    try {
        const { appointmentId } = req.body;

        const appointmentData = await appointmentModel.findById(appointmentId);
        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });

        // releasing doctor slot
        const { docId, slotDate, slotTime } = appointmentData;

        const doctorData = await doctorModel.findById(docId);

        let slots_booked = doctorData.slots_booked;

        slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime);

        await doctorModel.findByIdAndUpdate(docId, { slots_booked });

        res.json({ success: true, message: 'Appointment Cancelled' });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API for marking appointment as complete by admin  
const appointmentComplete = async (req, res) => {
    try {
        const { appointmentId } = req.body;

        const appointmentData = await appointmentModel.findById(appointmentId);
        
        if (!appointmentData) {
            return res.json({ success: false, message: 'Appointment not found' });
        }

        if (appointmentData.cancelled) {
            return res.json({ success: false, message: 'Cannot complete cancelled appointment' });
        }

        await appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: true });

        res.json({ success: true, message: 'Appointment marked as completed' });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API to delete doctor
const deleteDoctor = async (req, res) => {
    try {
        const { docId } = req.body;
        
        // Delete all appointments related to this doctor
        await appointmentModel.deleteMany({ docId });
        
        // Delete the doctor
        await doctorModel.findByIdAndDelete(docId);
        
        res.json({ success: true, message: 'Doctor Deleted Successfully' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API to update doctor profile from admin panel
const updateDoctor = async (req, res) => {
    try {
        const { docId, name, email, phone, speciality, degree, experience, about, fees, address, available } = req.body;
        
        // Validation
        if (!docId) {
            return res.json({ success: false, message: 'Doctor ID is required' });
        }

        // Check if doctor exists
        const doctor = await doctorModel.findById(docId);
        if (!doctor) {
            return res.json({ success: false, message: 'Doctor not found' });
        }

        // Validate email format if provided
        if (email && !validator.isEmail(email)) {
            return res.json({ success: false, message: 'Please enter a valid email' });
        }

        // Check if email is already taken by another doctor
        if (email && email !== doctor.email) {
            const existingDoctor = await doctorModel.findOne({ email, _id: { $ne: docId } });
            if (existingDoctor) {
                return res.json({ success: false, message: 'Email already exists' });
            }
        }

        const updateData = {};
        
        // Update fields only if provided
        if (name) updateData.name = name;
        if (email) updateData.email = email;
        if (phone) updateData.phone = phone;
        if (speciality) updateData.speciality = speciality;
        if (degree) updateData.degree = degree;
        if (experience) updateData.experience = experience;
        if (about) updateData.about = about;
        if (fees) updateData.fees = Number(fees);
        if (address) {
            updateData.address = typeof address === 'string' ? JSON.parse(address) : address;
        }
        if (typeof available !== 'undefined') updateData.available = Boolean(available);

        // Handle image upload if provided
        if (req.file) {
            const imageUpload = await cloudinary.uploader.upload(req.file.path, { resource_type: "image" });
            updateData.image = imageUpload.secure_url;
        }

        // Update doctor profile
        const updatedDoctor = await doctorModel.findByIdAndUpdate(docId, updateData, { new: true });
        
        res.json({ 
            success: true, 
            message: 'Doctor profile updated successfully',
            doctor: updatedDoctor
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export {addDoctor,loginAdmin,allDoctors,changeAvailability,doctorList,appointmentsAdmin,appointmentCancel,appointmentComplete,deleteDoctor,updateDoctor}
