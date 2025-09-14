import { useState } from "react";
//Tailwind by KhyteGpt
// A specialized Dropdown component for Status + Add Task Popup -KhyteGpt
export default function Dropdown({ roomNo, onSelect, onAddTask }) {
  //isOpen - boolean kung naka open ba yung dropdown o hindi
  //setIsOpen - pang toggle o update ng state ng isOpen
  const [isOpen, setIsOpen] = useState(false);

  //selected - dito nakasave kung anong option yung napili sa dropdown
  //setSelected - updater function para palitan yung laman ng selected
  const [selected, setSelected] = useState(null);

  //showPopup - boolean para malaman kung naka display ba yung popup o hindi
  //setShowPopup - pang toggle ng popup visibility
  const [showPopup, setShowPopup] = useState(false);

  //taskDescription - state na magho-hold ng text input ng user para sa bagong task
  //setTaskDescription - updater function para palitan yung laman ng taskDescription habang nagta-type
  const [taskDescription, setTaskDescription] = useState("");

  //label - default text na makikita sa dropdown bago pumili ng option
  //options - listahan ng mga pwedeng pagpiliang status ng room
  const label = "Change Status";
  const options = ["Available", "Booked", "Maintenance"];

  //handleSelect - function na tinatawag pag nag click ng isang option
  //ilalagay sa selected state kung ano yung pinindot na option
  //tatawagin si onSelect callback (kung meron pinasa galing sa parent component) at ibibigay yung option na pinili then
  //isasara ang dropdown (setIsOpen(false))
  const handleSelect = (option) => {
    setSelected(option);
    onSelect?.(option);
    setIsOpen(false);
  };

  //handleAddTask - function para mag save ng bagong maintenance task
  //icheck kung may laman si taskDescription gamit trim() para walang extra spaces
  //kung may laman, tatawagin si onAddTask callback (kung meron) at ipapasa yung object na may roomNo at description
  //ire-reset ang taskDescription para malinis ulit yung input box then isasara yung popup
  const handleAddTask = () => {
    if (taskDescription.trim()) {
      onAddTask?.({ roomNo, taskDescription });
      setTaskDescription("");
      setShowPopup(false);
    }
  };

  return (
    <div className="relative inline-block text-left w-32">
      {/* Dropdown Button
          - Ito yung button na nakikita muna bago lumabas yung listahan ng options
          - Kapag pinindot, itotoggle niya ang isOpen (true/false)
          - Kung walang selected option, ipapakita niya yung default label na "Change Status"
      */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white border border-gray-300 rounded-lg shadow-sm px-1 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50 flex justify-between items-center"
      >
        {selected || label}
        <span>{isOpen ? "▲" : "▼"}</span>
      </button>

      {/* Dropdown Options
          - Lalabas lang kapag true si isOpen
          - options.map ay gagawa ng listahan ng div para sa bawat option
          - Pag pinindot ang isang option, tatawag sa handleSelect(option)
      */}
      {isOpen && (
        <div className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
          {options.map((option, index) => (
            <div
              key={index}
              onClick={() => handleSelect(option)}
              className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
            >
              {option}
            </div>
          ))}
        </div>
      )}

      {/* Add Task Button */}
      <button
        onClick={() => setShowPopup(true)}
        className="mt-1 w-full text-sm font-medium underline hover:text-gray-500"
      >
        + Add Task
      </button>

      {/* Popup Component
          - Lalabas lang kapag true si showPopup
          - Fixed positioning sa gitna ng screen (overlay style)
          - May background overlay gamit "fixed inset-0"
          - Z-index 50 para laging nasa ibabaw
      */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="bg-white border-2 border-green-600 rounded-xl shadow-lg p-6 w-[400px] relative">
           
                {/* Popup Title */}
            <h2 className="text-lg font-semibold mb-4">Add Maintenance Task:</h2>

            <p className="mb-2">
              {/* Display ng room number sa popup using roomNo na naka set sa FrontDeskRoom page */}
              <strong>Room </strong> <strong>{roomNo}</strong>
            </p>

            <label className="block text-sm font-medium text-gray-700 mb-1">
              Task Description:
            </label>
            <input
              type="text"
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              placeholder="Enter task description..."
              className="w-full border px-3 py-2 rounded-lg mb-4"
            />

            {/* Action Buttons (Save + Cancel)
                - Save Task (green) para i-save yung bagong task
                - Cancel (gray) para isara lang yung popup nang walang gagawin
                - Naka flex-row para magkatabi silang dalawa
            */}
            <div className="flex justify-center gap-30">
              <button
                onClick={handleAddTask}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Save Task
              </button>
              <button
                onClick={() => setShowPopup(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
