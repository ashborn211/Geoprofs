import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faClock,
  faPlaneDeparture,
  faUser,
  faFile,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";

import Logout from "../Logout";
import { useUser } from "@/context/UserContext"; // Import your user context

export default function NavBar() {
  const { user } = useUser(); // Destructure `user` from `useUser`

  return (
    <nav className="bg-[#2E56A2] w-full h-screen flex flex-col justify-between">
      {/* Top Section: Background Image and Icons */}
      <div className="flex flex-col items-center mt-8 space-y-12">
        {/* Logo */}
        <div
          className="w-16 h-16 bg-cover bg-center"
          style={{ backgroundImage: "url('images/Logo.png')" }}
        />

        {/* Icons with Links */}
        <a href="home" className="text-white text-2xl">
          <FontAwesomeIcon icon={faHouse} />
        </a>
        <a href="schedule" className="text-white text-2xl">
          <FontAwesomeIcon icon={faClock} />
        </a>
        <a href="flights" className="text-white text-2xl">
          <FontAwesomeIcon icon={faPlaneDeparture} />
        </a>
        <a href="Profile" className="text-white text-2xl">
          <FontAwesomeIcon icon={faUser} />
        </a>
        <a href="documents" className="text-white text-2xl">
          <FontAwesomeIcon icon={faFile} />
        </a>

        {/* Admin-Only Icon */}
        {user?.role === "admin" && (
          <a href="admin" className="text-white text-2xl">
            <FontAwesomeIcon icon={faUserPlus} />
          </a>
        )}
      </div>

      {/* Bottom Section: Logout */}
      <div className="flex justify-center mb-8">
        <Logout />
      </div>
    </nav>
  );
}
