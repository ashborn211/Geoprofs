import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse } from '@fortawesome/free-solid-svg-icons';

export default function NavBar() {
  return (
    <nav className="bg-red-500 w-full h-screen flex flex-col justify-between">
      {/* Bovenkant: Achtergrondafbeelding en tekst */}
      <div className="flex flex-col items-center mt-4">
        {/* Achtergrondafbeelding */}
        <div
          className="w-16 h-16 bg-cover bg-center mb-4"
          style={{ backgroundImage: "url('images/Logo GeoProfs.png')" }}
        />
        {/* Individuele tekstitems */}
        <p className="text-white text-lg mb-2">
          <FontAwesomeIcon icon={faHouse} />
        </p>
        <p className="text-white text-lg mb-4">i2</p>
        <p className="text-white text-lg mb-4">i3</p>
        <p className="text-white text-lg mb-4">i4</p>
        <p className="text-white text-lg mb-4">i5</p>
        <p className="text-white text-lg mb-4">i6</p>
        <p className="text-white text-lg mb-4">i7</p>
      </div>

      {/* Onderkant: "E" */}
      <div className="flex justify-center mb-4">
        <p className="text-white text-lg">E</p>
      </div>
    </nav>
  );
}
