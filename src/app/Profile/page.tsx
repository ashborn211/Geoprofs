"use client";
import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/FireBase/FireBaseConfig";
import NavBar from "@/components/navBar/navBar";
import ResetPasswordForm from "@/components/ResetPasswordForm";
import VerifyEmailForm from "@/components/VerifyEmailForm";
import { generateSecret } from "@/utils/totp";

export default function UserProfile() {
  const [userData, setUserData] = useState({
    bsnNumber: "",
    naam: "",
    email: "",
    password: "",
    geboorte: "",
    team: "",
    vakantiedagen: "", // Example value
  });

  const [loading, setLoading] = useState(true);
  const [isResetPopupOpen, setIsResetPopupOpen] = useState(false);
  const [isVerifyPopupOpen, setIsVerifyPopupOpen] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [totpSecret, setTotpSecret] = useState("");

  const handleGeneratePassword = () => {
    const password = Math.random().toString(36).slice(-8); // Simple password generation
    setGeneratedPassword(password);
  };

  const handleGenerateTOTPSecret = () => {
    const secret = generateSecret();
    setTotpSecret(secret);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert("Copied to clipboard!");
    });
  };

  // Fetch user data from Firestore
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = auth.currentUser;
        if (currentUser) {
          const userDocRef = doc(db, "users", currentUser.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();

            let teamName = "";
            if (userData.team?.id) {
              const teamDocRef = doc(db, "Team", userData.team.id);
              const teamDoc = await getDoc(teamDocRef);

              if (teamDoc.exists()) {
                const teamData = teamDoc.data();
                teamName = teamData.TeamName || "";
              } else {
                console.error("No team document found");
              }
            } else {
              console.error("User does not have a valid team reference");
            }

            setUserData({
              bsnNumber: userData.bsnNumber || "",
              naam: userData.userName || "",
              email: userData.email || "",
              password: userData.password || "",
              geboorte: userData.geboorte || "",
              team: teamName,
              vakantiedagen: userData.vakantiedagen || "",
            });
          } else {
            console.error("No user document found");
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const maskBsnNumber = (bsnNumber: string) => {
    const bsnStr = bsnNumber.toString();
    if (bsnStr.length <= 3) {
      return bsnStr;
    }
    return "*".repeat(bsnStr.length - 3) + bsnStr.slice(-3);
  };

  const closeResetPopup = () => {
    setIsResetPopupOpen(false);
  };

  const closeVerifyPopup = () => {
    setIsVerifyPopupOpen(false);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      <div className="w-[6vw] bg-blue-500 h-full flex flex-col justify-end items-center">
        <NavBar />
      </div>
      <div className="w-[94vw] flex justify-center items-center">
        <div className="bg-white shadow-lg rounded-lg p-6 w-2/3">
          <div className="flex flex-col items-center mb-6">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
              <img
                src="/default-avatar.png"
                alt="Profile Avatar"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <h2 className="text-2xl font-bold mt-4">Your Profile</h2>
          </div>

          {loading ? (
            <div className="text-center text-xl">Loading...</div>
          ) : (
            <div className="bg-gray-50 rounded-md shadow-sm p-4">
              <table className="w-full">
                <tbody>
                  <tr className="border-b">
                    <td className="font-bold py-2 px-4">BSN:</td>
                    <td className="py-2 px-4">{maskBsnNumber(userData.bsnNumber)}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="font-bold py-2 px-4">Naam:</td>
                    <td className="py-2 px-4">{userData.naam}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="font-bold py-2 px-4">Email:</td>
                    <td className="py-2 px-4">{userData.email}</td>
                    <td className="py-2 px-4 text-right">
                      <button
                        className="text-blue-500 hover:underline"
                        onClick={() => setIsVerifyPopupOpen(true)}
                      >
                        ✏️
                      </button>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="font-bold py-2 px-4">Password:</td>
                    <td className="py-2 px-4">{"*".repeat(userData.password.length)}</td>
                    <td className="py-2 px-4 text-right">
                      <button
                        className="text-blue-500 hover:underline"
                        onClick={() => setIsResetPopupOpen(true)}
                      >
                        ✏️
                      </button>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="font-bold py-2 px-4">Geboorte:</td>
                    <td className="py-2 px-4">{userData.geboorte || "Not set"}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="font-bold py-2 px-4">Teams:</td>
                    <td className="py-2 px-4">{userData.team}</td>
                  </tr>
                  <tr>
                    <td className="font-bold py-2 px-4">Vakantiedagen 2024:</td>
                    <td className="py-2 px-4">{userData.vakantiedagen}</td>
                  </tr>
                </tbody>
              </table>

              <div className="flex flex-col mt-6">
                <button
                  type="button"
                  onClick={handleGenerateTOTPSecret}
                  className="p-2 bg-blue-500 text-white rounded"
                >
                  Generate TOTP Secret
                </button>
                {totpSecret && (
                  <div className="mt-4">
                    <p className="font-mono">{totpSecret}</p>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(totpSecret)}
                      className="text-blue-500"
                    >
                      Copy to Clipboard
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      {isResetPopupOpen && (
  <ResetPasswordForm onClose={closeResetPopup} />
)}



{isVerifyPopupOpen && (
  <VerifyEmailForm onClose={closeVerifyPopup} />
)}

    </div>
  );
}
