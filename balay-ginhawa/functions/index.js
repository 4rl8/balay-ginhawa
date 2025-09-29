/**
 * Import function triggers from their respective submodules:
 * 
 * 
 * THIS IS FOR LATER USE IF WE WANT TO 
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// const {setGlobalOptions} = require("firebase-functions");
// const {onRequest} = require("firebase-functions/https");
// const logger = require("firebase-functions/logger");

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
// setGlobalOptions({maxInstances: 10});

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

// functions/index.js
// const functions = require("firebase-functions");
// const fetch = require("node-fetch");

// exports.createCheckoutSession = functions
//   .region("asia-southeast1") // ✅ deploy to Singapore, not US
//   .https.onCall(async (data, context) => {
//     try {
//       const response = await fetch("https://api.paymongo.com/v1/checkout_sessions", {
//         method: "POST",
//         headers: {
//           accept: "application/json",
//           "Content-Type": "application/json",
//           authorization: "Basic " + Buffer.from("sk_test_ZM26eeASx66vWd8nN6i6wq3y").toString("base64"),
//         },
//         body: JSON.stringify({
//           data: {
//             attributes: {
//               send_email_receipt: false,
//               show_description: true,
//               show_line_items: true,
//               cancel_url: "http://localhost:5173/cancel",
//               success_url: "http://localhost:5173/success",
//               line_items: [
//                 {
//                   currency: "PHP",
//                   amount: 10000,
//                   description: "Test Item",
//                   quantity: 1,
//                 },
//               ],
//               payment_method_types: ["gcash", "card"],
//             },
//           },
//         }),
//       });

//       const result = await response.json();
//       return result; // 🔑 return instead of res.send
//     } catch (error) {
//       console.error(error);
//       throw new functions.https.HttpsError("internal", "Checkout session failed");
//     }
//   });
