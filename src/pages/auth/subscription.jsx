/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Button, TextField } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CircularProgress from "@mui/material/CircularProgress";
import api from "../../composables/instance";
import { useAuth } from "../../context/auth/useAuth";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function Subscription() {
  const auth = useAuth();
  const { token } = auth;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

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

  /* ---- determine if guest (from mobile deep link) ---- */
  const urlService = searchParams.get("service");    // e.g. ?service=Gold
  const urlToken   = searchParams.get("token");      // optional token from app
  const isGuest    = !token && !urlToken;

  /* ---- fetch plans ---- */
  useEffect(() => {
    let mounted = true;

    // Priority: URL param > localStorage (from form) > user profile
    const serviceName =
      urlService ||
      selectedService?.name ||
      auth.user?.serviceName ||
      auth.user?.businessDetail?.[0]?.categoryName;

    console.log("Subscription Check:", {
      hasToken: !!token,
      urlService,
      localStorage: selectedService,
      userProfile: auth.user,
      discoveredName: serviceName,
    });

    if (!serviceName) {
      console.warn("No service name found");
      return;
    }

    // If we have a URL token, Auto-auth is now handled globally in AuthContext before render.

    (async () => {
      try {
        console.log(`[API REQUEST] Fetching plans for service: "${serviceName}"`);
        const { data: svc } = await api.post("Service/GetByName", null, {
          params: { name: serviceName },
          headers: urlToken ? { Authorization: `Bearer ${urlToken}` } : undefined,
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
        if (mounted) alert("Unable to load subscription plans");
      }
    })();

    return () => {
      mounted = false;
    };
  }, [token, urlService, urlToken, selectedService?.name, auth.user?.businessDetail?.categoryName]);

  /* ---- promo ---- */
  const clearPromo = () => {
    setDiscountAmount(0);
    setFinalAmount(0);
    setPromoCode("");
  };

  const applyPromoCode = async () => {
    if (!promoCode.trim() || !selectedPlan) {
      alert("Select a plan & enter promo code");
      return;
    }
    setPromoLoading(true);
    try {
      const { data } = await api.post("/Promo/Apply", {
        code: promoCode.trim(),
      }, {
        headers: (token || urlToken) ? { Authorization: `Bearer ${token || urlToken}` } : undefined,
      });
      if (data.success) {
        setDiscountAmount(data.discountValue);
        setFinalAmount(selectedPlan.price - data.discountValue);
      } else {
        throw new Error("Invalid promo");
      }
    } catch {
      alert("Invalid promo code");
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
    if (!selectedPlan) return alert("Please select a plan");

    // Guest users must login first
    const effectiveToken = token || urlToken;
    if (!effectiveToken) {
      alert("Please login to your account first to subscribe.");
      navigate("/sign-in");
      return;
    }

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

      const { data: rz } = await api.post("/Payment/initiate", payload, {
        headers: { Authorization: `Bearer ${effectiveToken}` }
      });

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
            }, {
              headers: { Authorization: `Bearer ${effectiveToken}` }
            });
            alert("Payment successful 🎉 Subscription activated");
            navigate("/profile");
          } catch {
            alert("Payment verification failed");
          }
        },
        theme: { color: "#EC4899" },
      };

      new window.Razorpay(rzOptions).open();
    } catch {
      alert("Payment failed");
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
        <h1 className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
          Subscribe now
        </h1>

        {/* Play Store Compliant Notice */}
        <p className="text-center text-sm text-gray-500 mb-8 max-w-md mx-auto">
          Manage your Track Inventory subscription. Payments are processed
          securely via Razorpay on our website.
        </p>

        {/* Guest login nudge */}
        {isGuest && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 text-center">
            <p className="text-blue-800 text-sm mb-2">
              You are browsing as a guest. Please sign in to subscribe.
            </p>
            <button
              onClick={() => navigate("/sign-in")}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
            >
              Sign In to Continue
            </button>
          </div>
        )}

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

        {plans.length === 0 && !isGuest && (
          <div className="text-center py-12">
            <CircularProgress size={32} />
            <p className="text-gray-500 mt-4">Loading subscription plans...</p>
          </div>
        )}

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
            disabled={spinner || isGuest}
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
