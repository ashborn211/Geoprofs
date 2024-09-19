export default function Home() {
  return (
    <>
      <div className="h-screen w-screen grid grid-cols-12 grid-rows-12">
        <div className="col-span-1 row-span-12 bg-blue-500"></div>
        <div className="col-span-12 row-span-4 col-start-2 bg-yellow-500 flex justify-between p-4">
          <div className="bg-red-500" style={{ width: '75%' }}></div>
          <div className="bg-red-500" style={{ width: '20%' }}></div>
        </div>
        <div className="col-span-12 row-span-8 col-start-2 row-start-5 bg-green-500 flex justify-center items-center">
        <div className="bg-white" style={{ width: '90%', height: '90%' }}></div>
        </div>
      </div>
    </>
  );
}
