import Link from "next/link";
import { signOut } from "firebase/auth";
import { auth } from "@/FireBase/FireBaseConfig"; // Adjust path to your config file

const Logout = () => {
  const handleLogout = async () => {
    try {
      await signOut(auth); // Firebase sign out
      console.log("User signed out successfully");
    } catch (error) {
      console.error("Error during sign out:", error);
    }
  };

  return (
    <Link
      href="./"
      className="text-white underline mb-[10px]"
      onClick={handleLogout}
    >
      Log out
    </Link>
  );
};

export default Logout;
