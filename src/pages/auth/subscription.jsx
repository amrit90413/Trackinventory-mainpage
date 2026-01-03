import { useEffect, useState } from "react";
import { Button, TextField } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CircularProgress from "@mui/material/CircularProgress";
import api from "../../composables/instance";
import { useAuth } from "../../context/auth/useAuth";

const Subscription = () => {
  const { token, user } = useAuth();
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [spinner, setSpinner] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [finalAmount, setFinalAmount] = useState(0);
  const [promoLoading, setPromoLoading] = useState(false);

  const selectedService = JSON.parse(localStorage.getItem("selectedService") || "{}");

  useEffect(() => {
    const fetchPlans = async () => {
      if (!token || !selectedService.name) return;

      try {
        const res = await api.post("/Service/GetByName", {
          name: selectedService.name, 
        });

        const mappedPlans = res.data.map((item) => ({
          id: item.id,
          serviceName: item.serviceName,
          price: item.price,
          duration: item.duration,
          features: item.features || [],
        }));

        setPlans(mappedPlans);
      } catch (err) {
        console.error("Unable to load subscription plans:", err);
        alert("Unable to load subscription plans");
      }
    };

    fetchPlans();
  }, [token, selectedService]);

  const applyPromoCode = async () => {
    if (!promoCode || !selectedPlan) {
      alert("Select plan & enter promo code");
      return;
    }

    try {
      setPromoLoading(true);

      const res = await api.post("/Promo/Apply", {
        promoCode: promoCode,
        serviceId: selectedPlan.id,
        amount: selectedPlan.price,
      });

      setDiscountAmount(res.data.discountAmount);
      setFinalAmount(res.data.finalAmount);

      alert("Promo code applied successfully 🎉");
    } catch (err) {
      console.error("Promo Error", err);
      alert(err.response?.data?.message || "Invalid promo code");
    } finally {
      setPromoLoading(false);
    }
  };

  const handleSubscribe = async () => {
    if (!selectedPlan) {
      alert("Please select a plan");
      return;
    }

    if (!token) {
      alert("Please login first!");
      return;
    }
    const payableAmount = finalAmount > 0 ? finalAmount : selectedPlan.price;

    try {
      setSpinner(true);

      const initResponse = await api.post("/Payment/initiate", {
        orderId: "ORDER_" + Date.now(),
        amount: payableAmount,
        customerName: user?.name,
        mobileNumber: user?.mobile,
        email: user?.email,
        metadata: {
          serviceId: selectedPlan.id,
          promoCode: promoCode || null,
        },
      });

      const data = initResponse.data;

      const options = {
        key: data.keyId,
        amount: data.amount * 100,
        currency: data.currency,
        name: "Track Inventory",
        description: data.description,
        order_id: data.orderId,
        handler: async function (response) {
          try {
            await api.post("/Payment/verify", {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });

            alert("Payment successful 🎉 Subscription activated");
          } catch {
            alert("Payment verification failed");
          }
        },
        theme: { color: "#EC4899" },
      };

      new window.Razorpay(options).open();
    } catch (error) {
      console.error(error);
      alert("Payment failed");
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
              onClick={() => {
                setSelectedPlan(plan);
                setDiscountAmount(0);
                setFinalAmount(0);
              }}
              className={`cursor-pointer border rounded-2xl p-10 shadow-md transition-all ${
                selectedPlan?.id === plan.id
                  ? "border-pink-500 ring-2 ring-pink-300"
                  : "border-gray-200"
              }`}
            >
              <h2 className="text-2xl font-semibold mb-2">{plan.serviceName}</h2>
              <p className="text-3xl font-bold text-pink-500 mb-4">₹{plan.price}</p>
              <p className="text-sm text-gray-500 mb-4">{plan.duration}</p>

              <ul className="space-y-2">
                {plan.features?.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-gray-700">
                    <CheckIcon className="text-green-500 mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        {/* PROMO CODE */}
        <div className="mt-8 flex gap-4 justify-center">
          <TextField
            label="Promo Code"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
          />
          <Button variant="outlined" onClick={applyPromoCode} disabled={promoLoading}>
            {promoLoading ? "Applying..." : "Apply"}
          </Button>
        </div>

        {finalAmount > 0 && (
          <p className="text-center mt-4 text-lg font-semibold text-green-600">
            Payable Amount: ₹{finalAmount} (Saved ₹{discountAmount})
          </p>
        )}

        <div className="text-center mt-10">
          <Button
            variant="contained"
            onClick={handleSubscribe}
            className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white px-10 py-3"
          >
            {spinner ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Subscribe Now"}
          </Button>
        </div>
      </div>
    </div>
  );
};
export default Subscription;