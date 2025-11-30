import { useState } from "react";
import { Button } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CircularProgress from "@mui/material/CircularProgress";
import api from "../../composables/instance";
import { useAuth } from "../../context/auth/useAuth";

const Subscription = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [spinner, setSpinner] = useState(false);
  const { token } = useAuth();

  const plans = [
    {
      id: 1,
      title: "1 Year Plan",
      price: 1999,
      duration: "Per Year",
      features: ["Access to all features", "Priority Support", "1 Year Validity"],
    },
    {
      id: 2,
      title: "2 Year Plan",
      price: 3000,
      duration: "2 Years",
      features: ["Access to all features", "Priority Support", "2 Year Validity"],
    },
  ];

  const handleSubscribe = async () => {
    if (!selectedPlan) {
      alert("Please select a plan before subscribing.");
      return;
    }

    if (!token) {
      alert("Please login first!");
      return;
    }

    try {
      setSpinner(true);

      // INITIATing PAYMENT
      const initResponse = await api.post(
        "/Payment/initiate",
        {
          orderId: "ORDER_" + new Date().getTime(),
          amount: selectedPlan.price,
          customerName: "Your Name",
          mobileNumber: "9999999999",
          email: "user@example.com",
          metadata: { planId: selectedPlan.id },
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("INIT RAW RESPONSE:", initResponse.data);

      const data = initResponse.data;

      // Razorpay Options
      const options = {
        key: data.keyId,
        amount: data.amount * 100,
        currency: data.currency,
        name: "Track Inventory",
        description: data.description,
        order_id: data.orderId,

        handler: async function (response) {
          console.log("Razorpay Response:", response);

          try {
            const verifyResponse = await api.post(
              "/Payment/verify",
              {
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              },
              {
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );

            console.log("Verify Response:", verifyResponse.data);
            alert("Payment successful! 🎉 Subscription activated.");
          } catch (err) {
            console.error("Verify API Error:", err);
            alert("Verification failed.");
          }
        },
        theme: { color: "#EC4899" },
      };

      // LOADing Razorpay Window
      const razor = new window.Razorpay(options);
      razor.open();
    } catch (error) {
      console.error("Payment Error:", error);
      alert(error.response?.data?.message || "Something went wrong!");
    } finally {
      setSpinner(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-4xl">
        <h1 className="text-4xl font-bold text-center mb-10 bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
          Pricing options for every budget
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              onClick={() => setSelectedPlan(plan)}
              className={`cursor-pointer border rounded-2xl p-10 shadow-md transition-all hover:shadow-lg ${
                selectedPlan?.id === plan.id
                  ? "border-pink-500 ring-2 ring-pink-300"
                  : "border-gray-200"
              }`}
            >
              <h2 className="text-2xl font-semibold mb-2">{plan.title}</h2>
              <p className="text-3xl font-bold text-pink-500 mb-4">₹{plan.price}</p>
              <p className="text-sm text-gray-500 mb-4">{plan.duration}</p>
              <ul className="space-y-2">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-gray-700">
                    <CheckIcon className="text-green-500 mr-2" /> {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Button
            variant="contained"
            onClick={handleSubscribe}
            className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white font-semibold py-3 px-8 rounded-lg hover:opacity-90"
          >
            {spinner ? (
              <CircularProgress size={24} sx={{ color: "white" }} />
            ) : (
              "Subscribe Now"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Subscription;