export default function Home() {
  return (
    <div className="h-screen w-screen grid grid-cols-12 grid-rows-12">
      <div className="row-span-12 bg-blue-500">1</div>
      <div className="col-span-5 row-span-2 col-start-3 row-start-2 bg-red-500">2</div>
      <div className="col-span-3 row-span-2 col-start-9 row-start-2 bg-green-500">3</div>
      <div className="col-span-9 row-span-7 col-start-3 row-start-5 bg-yellow-500">4</div>
    </div>
  );
}
