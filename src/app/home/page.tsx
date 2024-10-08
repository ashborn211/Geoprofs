import CalendarComponent from "../../components/calendar/calendar";
import { Link } from "@nextui-org/react";

export default function Home() {
  return (
    <>
      <div className="flex h-screen overflow-hidden">
        <div className="w-[6vw] bg-blue-500 h-full flex flex-col justify-end items-center h-full">
        <Link href="./" className="text-white underline mb-[10px]">Log out</Link>
        </div>
        <div className="w-[94vw] h-full">
          <div className="h-full grid grid-cols-12 grid-rows-12">
            <div className="col-span-12 row-span-4 col-start-1 bg-yellow-500 flex justify-between p-4">
              <div className="bg-red-500" style={{ width: "75%" }}></div>
              <div className="bg-red-500" style={{ width: "20%" }}></div>
            </div>
            <div className="col-span-12 row-span-8 col-start-1 row-start-5 bg-custom-gray-500 flex justify-center items-center">
              <div
                className=" rounded-lg"
                style={{
                  width: "90%",
                  height: "90%",
                  background: "linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(52,198,254,1) 100%)"
                }}
              >
                <CalendarComponent />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
