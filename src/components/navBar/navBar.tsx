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
      <div className="flex flex-col items-center mt-4">
        {/* Achtergrondafbeelding */}
        <div
          className="w-16 h-16 bg-cover bg-center mb-4"
          style={{ backgroundImage: "url('images/Logo GeoProfs.png')" }}
        />
        {/* Individuele tekstitems */}
        <p className="text-white text-2xl mb-8">
          <FontAwesomeIcon icon={faHouse} />
        </p>
        <p className="text-white text-2xl mb-8">
          <FontAwesomeIcon icon={faClock} />
        </p>
        <p className="text-white text-2xl mb-8">
          <FontAwesomeIcon icon={faPlaneDeparture} />
        </p>
        <p className="text-white text-2xl mb-8">
          <FontAwesomeIcon icon={faUser} />
        </p>
        <p className="text-white text-2xl mb-8">
          <FontAwesomeIcon icon={faFile} />
        </p>
        <p className="text-white text-2xl mb-8">
          <FontAwesomeIcon icon={faUserPlus} />
        </p>
      </div>

      {/* Onderkant: "E" */}
      <div className="flex justify-center mb-4">
      <Logout></Logout>
      </div>
    </nav>
  );
}
