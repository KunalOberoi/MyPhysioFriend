import { assets } from "../assets/assets"

const Footer = () => {
  return (
    <div className="md:mx-10">
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">

        {/* left section  */}
        <div>
            <img className="mb-6 w-44 hover:scale-105 transition-transform duration-300" src={assets.logo} alt="MyPhysioFriend" />
            <p className="w-full md:w-2/3 text-gray-600 leading-relaxed text-base"> Providing expert physiotherapy care to help you move better, feel stronger, and live pain-free with personalized treatment plans.</p>
        </div>
        {/* center section  */}
        <div >
            <p className="text-xl font-bold mb-6 text-primary">Company</p>
            <ul className="flex flex-col gap-3 text-gray-600">
                <li className="hover:text-primary cursor-pointer transition-colors duration-300">Home</li>
                <li className="hover:text-primary cursor-pointer transition-colors duration-300">About Us</li>
                <li className="hover:text-primary cursor-pointer transition-colors duration-300">Contact Us</li>
                <li className="hover:text-primary cursor-pointer transition-colors duration-300">Privacy Policy</li>
            </ul>
        </div>
        {/* right section  */}
        <div>
            <p className="text-xl font-bold mb-6 text-primary">Get In Touch</p>
            <ul className="flex flex-col gap-3 text-gray-600">
                <li className="hover:text-accent cursor-pointer transition-colors duration-300">+919138136007</li>
                <li className="hover:text-accent cursor-pointer transition-colors duration-300">myphysiofrend@gmail.com</li>
            </ul>
        </div>
      </div>
      <div>
        {/* copyright  */}
        <hr className="border-gray-300" />
        <p className="py-6 text-sm text-center text-gray-600 bg-gray-50 -mx-10 px-10 mt-4">Copyright @2025 My Physio Friend - All Rights Reserved</p>
      </div>
    </div>
  )
}

export default Footer
