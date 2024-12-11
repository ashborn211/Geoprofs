import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faClock,
  faPlaneDeparture,
  faUser,
  faFile,
  faUserPlus,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";

import Logout from "../Logout";

export default function NavBar() {
  return (
<nav className="bg-[#2E56A2] w-full h-screen flex flex-col justify-between">
  {/* Bovenkant: Achtergrondafbeelding en tekst */}
  <div className="flex flex-col items-center mt-8 space-y-12">
    {/* Achtergrondafbeelding */}
    <div
      className="w-20 h-20 bg-cover bg-center"
      style={{ backgroundImage: "url('images/Logo.png')" }}
    />
    {/* Individuele tekstitems */}
    <p className="text-white text-3xl">
      <FontAwesomeIcon icon={faHouse} />
    </p>
    <p className="text-white text-3xl">
      <FontAwesomeIcon icon={faClock} />
    </p>
    <p className="text-white text-3xl">
      <FontAwesomeIcon icon={faPlaneDeparture} />
    </p>
    <p className="text-white text-3xl">
      <FontAwesomeIcon icon={faUser} />
    </p>
    <p className="text-white text-3xl">
      <FontAwesomeIcon icon={faFile} />
    </p>
    <p className="text-white text-3xl">
      <FontAwesomeIcon icon={faUserPlus} />
    </p>
  </div>

  {/* Onderkant: "E" */}
  <div className="flex justify-center mb-8">
    <Logout />
  </div>
</nav>

  );
}
