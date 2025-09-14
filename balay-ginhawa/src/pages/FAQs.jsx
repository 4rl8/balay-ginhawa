import { useState } from "react";
import { Header } from "../components/Header";
import divider from '../assets/images/divider.svg';
import homeBG from '../assets/images/homeBG.svg';
import dropdown from '../assets/images/dropdown.svg';

const faqs = [
  {
    question: "What payment methods do you accept?",
    answer: "We accept cash, major credit cards, and select mobile payment options."
  },
  {
    question: "Do you have a restaurant or room service?",
    answer: "Yes, we offer both a restaurant and 24-hour room service for your convenience."
  },
  {
    question: "Is breakfast included in the room rate?",
    answer: "Breakfast is complimentary for all guests staying with us."
  },
  {
    question: "How can I make a booking?",
    answer: "You can book directly on our website, by phone, or through popular booking platforms."
  },
  {
    question: "Is parking available? Is it free or paid?",
    answer: "We offer free parking for all our guests."
  }
];

export function FAQs() {
  const [openIdx, setOpenIdx] = useState(null);

  return (
    <>
      <title>balay Ginhawa</title>
      <div className="relative">
        <img
          src={homeBG}
          alt="balay Ginhawa Logo"
          className="absolute top-0 left-0 w-full h-60 object-cover -z-10"
        />
        <Header />
        <div className="p-24 text-white px-20 py-8">
          <h1 className="text-4xl font-bold">FAQs</h1>
          <h2 className="text-2xl">Frequently Asked Questions</h2>
        </div>
        <img src={divider} alt="" className="w-full h-auto" />
      </div>

      <div className="FAQs-container flex m-auto flex-col gap-6 p-8 px-20 py-10 w-[70%]">
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            className="bg-white rounded-lg shadow p-6 flex flex-col cursor-pointer transition hover:bg-gray-100"
            onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
          >
            <div className="flex items-center justify-between">
              <p className="font-semibold text-gray-800">{faq.question}</p>
              <img src={dropdown} alt="dropdown icon" />
            </div>
            {openIdx === idx && (
              <div className="mt-4 text-gray-700">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}