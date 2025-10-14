import { useState } from "react";

export function Checkout({
  selectedRoom,
  guestInfo,
  setGuestInfo,
  checkIn,
  checkOut,
  guests,
  onBack,
  onCheckout,
  foodPackageFee,
  nights,
 totalPrice,
  roomTotal,
}) {
  function handleChange(e) {
    setGuestInfo({ ...guestInfo, [e.target.name]: e.target.value });
  }

  // State for terms agreement
  const [agreed, setAgreed] = useState(false);

  // Calculate number of nights

  return (
    <div className="w-full flex justify-center">
      <div className="w-full md:w-[70%] flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-[60%]">
          <button className="mb-6 mt-5 text-grey-800 hover:underline" onClick={onBack}>
            ← Back to Rooms
          </button>
          <form className="flex flex-col gap-4" onSubmit={e => e.preventDefault()}>
            <h2 className="text-2xl font-bold mb-2">Guest Information</h2>
            {/* First Name */}
            <input
              type="text"
              name="Fname"
              placeholder="First Name"
              value={guestInfo.Fname}
              onChange={handleChange}
              className="border border-gray-300 rounded px-4 py-2"
              required
              pattern="^[A-Za-z\s\-]+$"
              title="First name should only contain letters, spaces, or hyphens."
              autoComplete="given-name"
            />
            {/* Surname */}
            <input
              type="text"
              name="Lname"
              placeholder="Surname"
              value={guestInfo.Lname}
              onChange={handleChange}
              className="border border-gray-300 rounded px-4 py-2"
              required
              pattern="^[A-Za-z\s\-]+$"
              title="Surname should only contain letters, spaces, or hyphens."
              autoComplete="family-name"
            />
            {/* Email */}
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={guestInfo.email}
              onChange={handleChange}
              className="border border-gray-300 rounded px-4 py-2"
              required
              pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
              title="Please enter a valid email address."
              autoComplete="email"
            />
            {/* Phone */}
            <input
              type="tel"
              name="phone"
              placeholder="Phone (e.g. 639XXXXXXXXX)"
              value={guestInfo.phone}
              onChange={handleChange}
              className="border border-gray-300 rounded px-4 py-2"
              required
              pattern="^63\d{10}$"
              title="Phone number must be a valid Philippine mobile number starting with 63 (e.g. 639171234567)."
              autoComplete="tel"
              maxLength={12}
              inputMode="numeric"
            />
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
                    required
                  />
                  {value.toUpperCase()}
                </label>
              ))}
              {/* Always show the food package table, regardless of selection */}
              <div className="mt-4">
                <table className="w-full text-sm border border-gray-300 rounded overflow-hidden">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="py-2 px-3 text-left font-semibold">Meal</th>
                      <th className="py-2 px-3 text-left font-semibold">Menu</th>
                      <th className="py-2 px-3 text-left font-semibold">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t">
                      <td className="py-2 px-3 align-top font-medium">Breakfast</td>
                      <td className="py-2 px-3">
                        Garlic rice
                        <br />
                        Longganisa or Tocino (choice of 1)
                        <br />
                        Fried egg
                        <br />
                        Brewed coffee or juice
                      </td>
                      <td className="py-2 px-3 align-top">₱120</td>
                    </tr>
                    <tr className="border-t">
                      <td className="py-2 px-3 align-top font-medium">Lunch</td>
                      <td className="py-2 px-3">
                        Chicken or Pork Adobo
                        <br />
                        Mixed vegetables (Chopsuey or Pinakbet)
                        <br />
                        Steamed rice
                        <br />
                        Buko Pandan dessert
                        <br />
                        Iced tea
                      </td>
                      <td className="py-2 px-3 align-top">₱200</td>
                    </tr>
                    <tr className="border-t">
                      <td className="py-2 px-3 align-top font-medium">Dinner</td>
                      <td className="py-2 px-3">
                        Grilled Bangus or Fried Chicken
                        <br />
                        Stir-fried vegetables or pancit
                        <br />
                        Steamed rice
                        <br />
                        Leche flan cup
                        <br />
                        House iced tea or calamansi juice
                      </td>
                      <td className="py-2 px-3 align-top">₱180</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            {/* Terms and Conditions Checkbox */}
            <div className="mt-6">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={e => setAgreed(e.target.checked)}
                  required
                />
                <span>
                  I agree to the <span className="underline">terms and conditions</span>, including paying for any damages during my stay.
                </span>
              </label>
            </div>
          </form>
        </div>

        <div className="w-full md:w-[40%] mt-30">
          <div className="bg-white border border-gray-300 rounded-md p-8 gap-5">
            <h2 className="text-2xl font-bold mb-4">Summary</h2>
            <p className="mb-2"><strong>Room:</strong> {selectedRoom.label}</p>
            <p className="mb-2"><strong>Price:</strong> ₱{selectedRoom.price}/night</p>
            <p className="mb-2"><strong>Nights:</strong> {nights}</p>
            <p className="mb-2"><strong>Check-in:</strong> {checkIn?.toLocaleDateString()}</p>
            <p className="mb-2"><strong>Check-out:</strong> {checkOut?.toLocaleDateString()}</p>
            <p className="mb-2"><strong>Guests:</strong> {guests}</p>
            <p className="mb-2"><strong>Room Total:</strong> ₱{roomTotal}</p>
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
              disabled={!agreed}
              title={!agreed ? "You must agree to the terms and conditions to proceed." : ""}
            >
              Checkout & Pay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
