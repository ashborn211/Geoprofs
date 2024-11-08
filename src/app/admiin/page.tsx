import { Link } from "@nextui-org/react";

export default function AdminPage() {
  return (
    <>
      <div className="flex h-screen overflow-hidden bg-custom-gray">
        {/* Sidebar */}
        <div  aria-label="sidebar1" className="w-[6vw] bg-blue-500 h-full flex flex-col justify-end items-center">
          <Link href="./" className="text-white underline mb-4">
            Log out
          </Link>
        </div>

        {/* Main Content */}
        <div className="w-[94vw] h-full">
          <div className="h-full grid grid-cols-12 grid-rows-12">
            {/* Header */}
            <div className="col-span-12 row-span-4 bg-custom-gray-500 flex justify-around items-center p-4">
              <div
                className="rounded-lg text-4xl flex items-center justify-center p-4"
                style={{
                  width: "65%",
                  background:
                    "linear-gradient(90deg, rgba(255,255,255,1) 16%, rgba(90,209,254,1) 100%)",
                }}
              >
                <h1>Welcome, Admin</h1>
              </div>

              <div className="w-[20%]">
                <div aria-label="img"
                  className="w-full h-[75%] bg-cover bg-center"
                  style={{
                    backgroundImage: "url('/images/Logo GeoProfs.png')",
                  }}
                ></div>
              </div>
            </div>

            <div className="col-span-12 row-span-8 bg-custom-gray-500 p-8 flex flex-col space-y-4">
              <div className="bg-white border-2 border-black rounded-lg p-8 flex justify-between items-center">
                <h2 className="text-2xl">Admin Search</h2>
                <Link
                  href="./admiin/admiin-search"
                  className="bg-blue-500 text-white rounded-lg py-2 px-4"
                >
                  Go to Admin Search
                </Link>
              </div>

              <div className="bg-white border-2 border-black rounded-lg p-8 flex justify-between items-center">
                <h2 className="text-2xl">Add Users</h2>
                <Link
                  href="./admiin/add-users"
                  className="bg-blue-500 text-white rounded-lg py-2 px-4"
                >
                  Go to Add Users
                </Link>
              </div>

              <div className="bg-white border-2 border-black rounded-lg p-8 flex justify-between items-center">
                <h2 className="text-2xl">Add Users</h2>
                <Link
                  href="./admiin/show-teams"
                  className="bg-blue-500 text-white rounded-lg py-2 px-4"
                >
                  Go to teams
                </Link>
              </div>

              <div className="bg-white border-2 border-black rounded-lg p-8 flex justify-between items-center">
                <h2 className="text-2xl">Add Users</h2>
                <Link
                  href="./admiin/show-user"
                  className="bg-blue-500 text-white rounded-lg py-2 px-4"
                >
                  Go to Users
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
