const PAYMONGO_PUBLIC_KEY = "sk_test_ZM26eeASx66vWd8nN6i6wq3y";

export async function createCheckoutSession(amount) {
  const response = await fetch("https://api.paymongo.com/v1/checkout_sessions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Basic ${btoa(PAYMONGO_PUBLIC_KEY + ":")}`,
    },
    body: JSON.stringify({
      data: {
        attributes: {
          line_items: [
            {
              name: "Test Product",
              quantity: 1,
              currency: "PHP",
              amount: amount * 100, // PayMongo uses centavos
            },
          ],
          payment_method_types: ["gcash", "paymaya", "card"],
          success_url: "http://localhost:5173/success",
          cancel_url: "http://localhost:5173/cancel",
          description: "Test Checkout",
        },
      },
    }),
  });

  return response.json();
}
