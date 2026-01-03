import { Button } from "@mui/material";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useEffect, useState, useRef } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import api from "../composables/instance";

const BusinessDetails = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [spinner, setSpinner] = useState(false);

  const isFetched = useRef(false);

  useEffect(() => {
    const fetchCategories = async () => {
      if (isFetched.current) return; // Prevent duplicate call
      isFetched.current = true;

      try {
        setSpinner(true);

        const authToken = localStorage.getItem("accessToken");

        if (!authToken || authToken === "undefined" || authToken === "null") {
          alert("No access token found. Please login first.");
          return;
        }

        const response = await api.get("/Service/GetAllServices", {
          headers: {
            Authorization: `Bearer ${authToken}`,
            Accept: "*/*",
          },
        });

        setCategories(response.data || []);
      } catch (error) {
        alert(error.response?.data?.message || "Failed to load categories.");
      } finally {
        setSpinner(false);
      }
    };

    fetchCategories();
  }, []);

  const onSubmit = async (data) => {
    try {
      setSpinner(true);

      const authToken = localStorage.getItem("accessToken");

      if (!authToken || authToken === "undefined" || authToken === "null") {
        alert("No access token found. Please login first.");
        return;
      }

      const payload = {
        id: "-1",
        Name: data.businessName,
        CategoryId: data.category,
        Country: data.country,
        State: data.state,
        Address1: data.address1,
        Address2: data.address2 || "",
        ZipCode: data.zipCode,
      };

      const response = await api.post("/Service/GetAllservices", payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.status === 200) {
        alert("Business details submitted successfully!");
        navigate("/");
      } else {
        alert("Failed to submit business details. Please try again.");
      }
    } catch (error) {
      console.error("Business Details Submission Error:", error);
      alert(error.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setSpinner(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 sm:p-8 lg:p-16">
      <div className="w-full max-w-lg bg-white rounded-2xl p-8 border border-gray-200 shadow-2xl relative">

        <h1 className="gradient text-3xl sm:text-4xl font-bold text-center mb-6">
          Business Details
        </h1>

        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>

          {/* CATEGORY */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category <span className="text-red-500">*</span>
            </label>

            <select
              {...register("category", { required: "Category is required" })}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-pink-500 focus:outline-none"
            >
              <option value="">Select category</option>

              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            {errors.category && (
              <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
            )}
          </div>

          {/* BUSINESS NAME */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Business Name <span className="text-red-500">*</span>
            </label>

            <input
              type="text"
              {...register("businessName", {
                required: "Business Name is required",
              })}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-pink-500 focus:outline-none"
              placeholder="Enter business name"
            />

            {errors.businessName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.businessName.message}
              </p>
            )}
          </div>

          {/* COUNTRY */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Country <span className="text-red-500">*</span>
            </label>

            <input
              type="text"
              {...register("country", { required: "Country is required" })}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-pink-500 focus:outline-none"
              placeholder="Enter country"
            />

            {errors.country && (
              <p className="text-red-500 text-sm mt-1">{errors.country.message}</p>
            )}
          </div>

          {/* STATE */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              State <span className="text-red-500">*</span>
            </label>

            <input
              type="text"
              {...register("state", { required: "State is required" })}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-pink-500 focus:outline-none"
              placeholder="Enter state"
            />

            {errors.state && (
              <p className="text-red-500 text-sm mt-1">{errors.state.message}</p>
            )}
          </div>

          {/* ADDRESS 1 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address 1 <span className="text-red-500">*</span>
            </label>

            <input
              type="text"
              {...register("address1", { required: "Address 1 is required" })}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-pink-500 focus:outline-none"
              placeholder="Enter address"
            />

            {errors.address1 && (
              <p className="text-red-500 text-sm mt-1">{errors.address1.message}</p>
            )}
          </div>

          {/* ADDRESS 2 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address 2
            </label>

            <input
              type="text"
              {...register("address2")}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-pink-500 focus:outline-none"
              placeholder="Enter additional address (optional)"
            />
          </div>

          {/* ZIP CODE */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Zip Code <span className="text-red-500">*</span>
            </label>

            <input
              type="text"
              {...register("zipCode", { required: "Zip Code is required" })}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-pink-500 focus:outline-none"
              placeholder="Enter zip code"
            />

            {errors.zipCode && (
              <p className="text-red-500 text-sm mt-1">{errors.zipCode.message}</p>
            )}
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              variant="contained"
              className="w-full py-3 text-white font-semibold rounded-lg shadow-md bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:opacity-90 transition duration-200"
            >
              {spinner ? (
                <CircularProgress size={24} sx={{ color: "white" }} />
              ) : (
                "Submit"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default BusinessDetails;