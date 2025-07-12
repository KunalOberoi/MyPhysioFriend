import express from "express";
import { addDoctor, loginAdmin, allDoctors, changeAvailability, doctorList, appointmentsAdmin, appointmentCancel, appointmentComplete, deleteDoctor, updateDoctor } from "../controllers/adminController.js";
import upload from "../middlewares/multer.js";
import authAdmin from "../middlewares/authAdmin.js";

const adminRouter = express.Router()

adminRouter.post('/add-doctor', authAdmin, upload.single('image'), addDoctor)
adminRouter.post('/login', loginAdmin)
adminRouter.post('/all-doctors', authAdmin, allDoctors)
adminRouter.post('/change-availability', authAdmin, changeAvailability)
adminRouter.get('/list-doctors', doctorList)
adminRouter.post('/appointments', authAdmin, appointmentsAdmin)
adminRouter.post('/cancel-appointment', authAdmin, appointmentCancel)
adminRouter.post('/complete-appointment', authAdmin, appointmentComplete)
adminRouter.post('/delete-doctor', authAdmin, deleteDoctor)
adminRouter.post('/update-doctor', authAdmin, upload.single('image'), updateDoctor)

export default adminRouter