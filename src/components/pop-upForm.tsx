import React, { useState } from 'react';

const PopUpForm: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded shadow-lg hover:bg-blue-700">Open Leave Request</button>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="max-w-sm rounded-lg shadow-2xl bg-white border border-gray-200 p-4">
            <div className="bg-blue-600 text-white p-4 rounded-t-lg shadow-lg">
              <h2 className="text-center text-lg font-bold">Donderdag</h2>
              <p className="text-center text-sm">28/11/2024</p>
            </div>
            <div className="p-4 space-y-4 shadow-md rounded-lg bg-gray-50">
              <p className="text-lg font-semibold text-gray-800 shadow-sm p-2 rounded bg-white">Joseph Stalin</p>
              <div className="flex items-center space-x-2 bg-gray-100 p-2 rounded shadow-md">
                <label className="text-gray-700">Verlof</label>
                <input type="time" defaultValue="10:30" className="border p-1 rounded text-gray-700 shadow-sm" />
                <span className="text-gray-700">tot</span>
                <input type="time" defaultValue="16:30" className="border p-1 rounded text-gray-700 shadow-sm" />
              </div>
              <div className="bg-gray-100 p-2 rounded shadow-md">
                <label className="text-gray-700">Reden</label>
                <input type="text" defaultValue="ziekenhuis (aambeien)" disabled className="border p-2 w-full text-gray-500 bg-gray-200 rounded shadow-sm" />
              </div>
              <div className="flex justify-between mt-4">
                <button className="bg-custom-red hover:bg-red-700 text-white px-4 py-2 rounded shadow-lg">Decline</button>
                <button className="bg-custom-green hover:bg-green-700 text-white px-4 py-2 rounded shadow-lg">Approve</button>
              </div>
              <div className="flex justify-center mt-4">
                <button onClick={() => setIsOpen(false)} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded shadow-lg">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default PopUpForm;
