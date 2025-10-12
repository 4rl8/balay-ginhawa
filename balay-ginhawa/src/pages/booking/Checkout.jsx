export function Checkout({
  selectedRoom,
  guestInfo,
  setGuestInfo,
  checkIn,
  checkOut,
  guests,
  onBack,
  onCheckout,
  totalPrice,
  foodPackageFee,
}) {
  function handleChange(e) {
    setGuestInfo({ ...guestInfo, [e.target.name]: e.target.value });
  }

  //   const foodPackageFee = guestInfo.foodPackage === "yes" ? 500 : 0;
  // const total = selectedRoom.price + foodPackageFee;

  // Calculate tax and fees (12% of room price, minimum 200)

  return (
    <div className="w-full flex justify-center">
      <div className="w-full md:w-[70%] flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-[60%]">
          <button className="mb-6 mt-5 text-grey-800 hover:underline" onClick={onBack}>
            ← Back to Rooms
          </button>
          <form className="flex flex-col gap-4" onSubmit={e => e.preventDefault()}>
            <h2 className="text-2xl font-bold mb-2">Guest Information</h2>
            {[
              { name: "Fname", label: "First Name" },
              { name: "Lname", label: "Surname" },
              { name: "email", label: "Email" },
              { name: "phone", label: "Phone" },
            ].map(field => (
              <input
                key={field.name}
                type={field.name === "email" ? "email" : "text"}
                name={field.name}
                placeholder={field.label}
                value={guestInfo[field.name]}
                onChange={handleChange}
                className="border border-gray-300 rounded px-4 py-2"
                required
              />
            ))}
            <div>
              <label className="font-semibold mb-3 block">Food Package</label>
              {["yes", "no"].map(value => (
                <label key={value} className="flex items-center gap-4 w-1/4 ">
                  <input
                    type="radio"
                    name="foodPackage"
                    value={value}
                    checked={guestInfo.foodPackage === value}
                    onChange={handleChange}
                  />
                  {value.toUpperCase()}
                </label>
              ))}
            </div>
          </form>
        </div>

        <div className="w-full md:w-[40%] mt-30">
          <div className="bg-white border border-gray-300 rounded-md p-8">
            <h2 className="text-2xl font-bold mb-4">Summary</h2>
            <p>Room: {selectedRoom.label}</p>
            <p>₱{selectedRoom.price}/night</p>
            <p>Check-in: {checkIn?.toLocaleDateString()}</p>
            <p>Check-out: {checkOut?.toLocaleDateString()}</p>
            <p>Guests: {guests}</p>
            {foodPackageFee > 0 && (
              <p>
                Food Package: ₱{foodPackageFee} <span className="text-xs text-gray-500">(added if selected)</span>
              </p>
            )}
            <p className="font-bold mt-2">Total: ₱{totalPrice}</p>
            <button
              onClick={onCheckout}
              className="mt-4 py-2 w-full rounded text-white"
              style={{ backgroundColor: "#82A33D" }}
            >
              Checkout & Pay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
