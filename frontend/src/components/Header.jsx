import { assets } from "../assets/assets"

const Header = () => {
  return (
    <div className="flex flex-col md:flex-row flex-wrap bg-gradient-to-r from-primary to-primary-light rounded-xl px-6 md:px-10 lg:px-20 shadow-xl overflow-hidden">
      {/* left side  */}
      <div className="md:w-1/2 flex flex-col items-start justify-center gap-6 py-12 m-auto md:py-[10vw] md:mb-[-30px] animate-fade-in">
        <p className="text-3xl md:text-4xl lg:text-5xl text-white font-bold leading-tight md:leading-tight lg:leading-tight">
          Book Appointment <br/> With <span className="text-accent">Trusted</span> Doctors
        </p>
        <div className="flex flex-col md:flex-row items-center gap-4 text-white text-sm font-normal">
          <img className="w-28 rounded-full shadow-lg" src={assets.group_profiles} alt="Doctor Profiles" />
          <p className="leading-relaxed">Simply browse through our extensive list of trusted doctors,<br className="hidden sm:block" />Schedule your appointment hassle-free with expert care.</p>
        </div>
        <a href='#speciality' className="flex items-center gap-3 bg-white px-10 py-4 rounded-full text-primary text-sm font-semibold m-auto md:m-0 hover:scale-105 hover:shadow-lg transition-all duration-300 group" >
          Book Appointment 
          <img className="w-3 group-hover:translate-x-1 transition-transform duration-300" src={assets.arrow_icon} alt="Arrow" />
        </a>
      </div>

      {/* right side  */}
      <div className="md:w-1/2 relative animate-slide-up">
        <img className="w-full md:absolute bottom-0 h-auto rounded-lg drop-shadow-2xl" src={assets.header_img} alt="Doctor" />
      </div>
    </div>
  )
}

export default Header
