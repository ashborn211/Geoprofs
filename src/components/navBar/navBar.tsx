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
import { Link } from "@nextui-org/react";

export default function NavBar() {
  const { user } = useUser(); // Destructure `user` from `useUser`

  return (
    <nav className="bg-[#2E56A2] w-full h-screen flex flex-col justify-between max-md:w-14 max-md:align-middle  ">
      {/* Top Section: Background Image and Icons */}
      <div className="flex flex-col items-center mt-8 space-y-12">
        {/* Logo */}
        <div
          className="w-16 h-16 bg-cover bg-center max-lg:w-12 max-lg:h-12"
          style={{ backgroundImage: "url('images/Logo.png')" }}
        />

        {/* Icons with Links */}
        <Link className="text-white text-5xl max-lg:text-2xl " href="home">
          <FontAwesomeIcon icon={faHouse} />
        </Link>

        <Link className="text-white text-4xl max-lg:text-2xl" href="Profile">
          <FontAwesomeIcon icon={faUser} />
        </Link>

        {/* Admin-Only Icon */}
        {user?.role === "admiin" && (
          <Link href="admin" className="text-white text-4xl max-lg:text-2xl">
            <FontAwesomeIcon icon={faUserPlus} />
          </Link>
        )}
      </div>

      {/* Bottom Section: Logout */}
      <div className="flex justify-center mb-8">
        <Logout />
      </div>
    </nav>
  );
}
