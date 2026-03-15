/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Button, TextField } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CircularProgress from "@mui/material/CircularProgress";
import api from "../../composables/instance";
import { useAuth } from "../../context/auth/useAuth";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../context/toast/ToastContext";

export default function Subscription() {
  const auth = useAuth();
  const { token } = auth;
  const navigate = useNavigate();
  const { showToast } = useToast();

  const selectedService = JSON.parse(
    localStorage.getItem("selectedService") || "{}"
  );

  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const [promoCode, setPromoCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [finalAmount, setFinalAmount] = useState(0);
  const [promoLoading, setPromoLoading] = useState(false);

  const [spinner, setSpinner] = useState(false);

  /* ---- fetch plans ---- */
  useEffect(() => {
    let mounted = true;

    // Priority: localStorage (from form) > user profile (top level) > user profile (nested)
    const serviceName = selectedService?.name || auth.user?.serviceName || auth.user?.businessDetail?.[0]?.categoryName;

    console.log("Subscription Check:", {
      hasToken: !!token,
      localStorage: selectedService,
      userProfile: auth.user,
      discoveredName: serviceName
    });

    if (!token) return;

    if (!serviceName) {
      console.warn("No service name found in localStorage or user profile");
      return;
    }

    (async () => {
      try {
        console.log(`[API REQUEST] Fetching plans for service: "${serviceName}"`);
        const { data: svc } = await api.post("Service/GetByName", null, {
          params: { name: serviceName },
        });

        if (!svc) {
          console.error(`[API ERROR] Service "${serviceName}" not found in database`);
          return;
        }

        // Handle both PascalCase and camelCase
        const sId = svc.id || svc.Id;
        const sName = svc.name || svc.Name || serviceName;
        const sOneYear = svc.oneYearPrice || svc.OneYearPrice || 0;
        const sTwoYear = svc.twoYearPrice || svc.TwoYearPrice || 0;

        console.log("[API SUCCESS] Service data:", { sId, sName, sOneYear, sTwoYear });

        const plns = [];
        if (sOneYear > 0) {
          plns.push({
            id: `${sId}-1Y`,
            serviceId: sId,
            serviceName: sName,
            price: sOneYear,
            duration: "1 Year",
          });
        }
        if (sTwoYear > 0) {
          plns.push({
            id: `${sId}-2Y`,
            serviceId: sId,
            serviceName: sName,
            price: sTwoYear,
            duration: "2 Years",
          });
        }
        if (mounted) {
          setPlans(plns);
          if (plns.length === 0) {
            console.warn("No plans found for prices > 0");
          }
        }
      } catch (err) {
        console.error("Subscription load error details:", err);
        if (mounted) showToast("Unable to load subscription plans", "error");
      }
    })();

    return () => {
      mounted = false;
    };
  }, [token, selectedService?.name, auth.user?.businessDetail?.categoryName]);

  /* ---- promo ---- */
  const clearPromo = () => {
    setDiscountAmount(0);
    setFinalAmount(0);
    setPromoCode("");
  };

  const applyPromoCode = async () => {
    if (!promoCode.trim() || !selectedPlan) {
      showToast("Select a plan & enter promo code", "warning");
      return;
    }
    setPromoLoading(true);
    try {
      const { data } = await api.post("/Promo/Apply", {
        code: promoCode.trim(),
      });
      if (data.success) {
        setDiscountAmount(data.discountValue);
        setFinalAmount(selectedPlan.price - data.discountValue);
      } else {
        throw new Error("Invalid promo");
      }
    } catch {
      showToast("Invalid promo code", "error");
      clearPromo();
    } finally {
      setPromoLoading(false);
    }
  };

  useEffect(() => {
    clearPromo();
  }, [selectedPlan?.id]);

  /* ---- payment ---- */
  const handleSubscribe = async () => {
    if (!selectedPlan) return showToast("Please select a plan", "warning");
    if (!token) return showToast("Please login first", "warning");

    const payable = finalAmount > 0 ? finalAmount : selectedPlan.price;

    setSpinner(true);
    try {
      const payload = {
        orderId: "ORDER_" + Date.now(),
        serviceId: selectedPlan.serviceId || selectedService.id,
        planDuration: selectedPlan.duration === "1 Year" ? 1 : 2,
        amount: payable,
        promoCode: finalAmount > 0 ? promoCode.trim() : null,
        metadata: {
          planId: selectedPlan.id,
          planDuration: selectedPlan.duration,
        },
      };

      const { data: rz } = await api.post("/Payment/initiate", payload);

      const rzOptions = {
        key: rz.keyId,
        amount: rz.amount * 100,
        currency: rz.currency,
        name: "Track Inventory",
        description: rz.description,
        order_id: rz.orderId,
        handler: async (resp) => {
          try {
            await api.post("/Payment/verify", {
              razorpayOrderId: resp.razorpay_order_id,
              razorpayPaymentId: resp.razorpay_payment_id,
              razorpaySignature: resp.razorpay_signature,
            });
            showToast("Payment successful 🎉 Subscription activated", "success");
            navigate("/profile");
          } catch {
            showToast("Payment verification failed", "error");
          }
        },
        theme: { color: "#EC4899" },
      };

      new window.Razorpay(rzOptions).open();
    } catch {
      showToast("Payment failed", "error");
    } finally {
      setSpinner(false);
    }
  };

  /* ---- skip ---- */
  const handleSkip = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-4xl">
        <h1 className="text-4xl font-bold text-center mb-10 bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
          Subscribe now
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {plans.map((p) => {
            const isSel = selectedPlan?.id === p.id;
            const showDiscount = isSel && finalAmount > 0;
            return (
              <div
                key={p.id}
                onClick={() => setSelectedPlan(p)}
                className={`cursor-pointer border rounded-2xl p-10 shadow-md transition-all ${isSel
                    ? "border-pink-500 ring-2 ring-pink-300"
                    : "border-gray-200"
                  }`}
              >
                <h2 className="text-2xl font-semibold mb-2">
                  {p.serviceName}
                </h2>

                <div className="mb-4">
                  {showDiscount ? (
                    <>
                      <p className="text-lg line-through text-gray-400">
                        ₹{p.price}
                      </p>
                      <p className="text-3xl font-bold text-pink-500">
                        ₹{finalAmount}
                      </p>
                      <p className="text-sm text-green-600">
                        You saved ₹{discountAmount}
                      </p>
                    </>
                  ) : (
                    <p className="text-3xl font-bold text-pink-500">
                      ₹{p.price}
                    </p>
                  )}
                </div>

                <p className="text-sm text-gray-500 mb-4">{p.duration}</p>

                <ul className="space-y-2">
                  {p.features?.map((f, i) => (
                    <li key={i} className="flex items-center text-gray-700">
                      <CheckIcon className="text-green-500 mr-2" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex gap-4 justify-center">
          <TextField
            label="Promo Code"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
          />
          <Button
            variant="outlined"
            onClick={applyPromoCode}
            disabled={promoLoading}
          >
            {promoLoading ? "Applying..." : "Apply"}
          </Button>
        </div>

        {/* ACTION BUTTONS */}
        <div className="text-center mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="contained"
            onClick={handleSubscribe}
            disabled={spinner}
            className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white px-10 py-3"
          >
            {spinner ? (
              <CircularProgress size={24} sx={{ color: "white" }} />
            ) : (
              "Subscribe Now"
            )}
          </Button>

          <Button
            variant="text"
            onClick={handleSkip}
            disabled={spinner}
            className="text-gray-600 hover:text-gray-900"
          >
            Skip for now
          </Button>
        </div>
      </div>
    </div>
  );
}