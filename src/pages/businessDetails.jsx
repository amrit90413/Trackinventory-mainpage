import { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import CircularProgress from '@mui/material/CircularProgress';
import api from '../composables/instance';
import { useAuth } from '../context/auth/useAuth';
import logo from '../assets/logo-icon.png';

const INDIA_STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat',
  'Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh',
  'Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab',
  'Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh',
  'Uttarakhand','West Bengal','Delhi','Jammu and Kashmir','Ladakh','Puducherry',
];

const inputCls =
  'w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all';

const selectCls =
  'w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all';

const Field = ({ label, required, error, children }) => (
  <div>
    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

const CATEGORY_ICONS = { Mobile: '📱', Vehicle: '🚗', Electronics: '💻', Watch: '⌚', Gold: '🪙' };

const BusinessDetails = () => {
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm({
    defaultValues: { country: 'India', showProductsOnWebsite: true }
  });
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [spinner, setSpinner] = useState(false);
  const { token } = useAuth();
  const isFetched = useRef(false);

  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [websiteAvailable, setWebsiteAvailable] = useState(null);
  const [websiteNameEdited, setWebsiteNameEdited] = useState(false);

  useEffect(() => {
    if (!token || isFetched.current) return;
    isFetched.current = true;
    (async () => {
      try {
        setSpinner(true);
        const response = await api.get('/Service/GetAllServices', {
          headers: { Authorization: `Bearer ${token}`, Accept: '*/*' },
        });
        setCategories(response.data || []);
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to load categories.');
      } finally {
        setSpinner(false);
      }
    })();
  }, [token]);

  const selectedCategoryId = watch('category');
  const businessName = watch('businessName');
  const websiteName = watch('websiteName');
  const showProductsOnWebsite = watch('showProductsOnWebsite');
  
  const selectedCat = categories.find((c) => (c.id || c.Id) === selectedCategoryId);
  const catName = selectedCat?.name || selectedCat?.Name || '';
  const isGoldCategory = catName.toLowerCase().includes('gold');

  // Fill Website Name Automatically
  useEffect(() => {
    if (!websiteNameEdited && !isGoldCategory && businessName) {
      setValue('websiteName', businessName.toLowerCase().replace(/[^a-z0-9]/g, ''));
    }
  }, [businessName, websiteNameEdited, isGoldCategory, setValue]);

  // Debounced Website Name Verification
  useEffect(() => {
    if (!websiteName || isGoldCategory) {
      setWebsiteAvailable(null);
      return;
    }
    
    const timer = setTimeout(async () => {
      setCheckingAvailability(true);
      try {
        await api.get(`/User/GetUserId?websiteName=${websiteName}`);
        setWebsiteAvailable(false);
      } catch (error) {
        if (error?.response?.status === 404 || error?.status === 404) {
          setWebsiteAvailable(true);
        } else {
          setWebsiteAvailable(null);
        }
      } finally {
        setCheckingAvailability(false);
      }
    }, 600);
    
    return () => clearTimeout(timer);
  }, [websiteName, isGoldCategory]);

  const onSubmit = async (data) => {
    try {
      if (!isGoldCategory && websiteAvailable === false) {
        alert('Website name is already taken. Please choose another one.');
        return;
      }
      if (!isGoldCategory && data.websiteName?.includes(' ')) {
        alert('Website must not contain spaces');
        return;
      }

      setSpinner(true);
      if (!token) { alert('Please login first.'); navigate('/sign-in'); return; }

      const payload = {
        id: -1,
        CategoryId: data.category,
        Name: data.businessName,
        WebsiteName: !isGoldCategory ? data.websiteName.trim() : '',
        MobileNumber: data.mobileNumber.trim(),
        Address1: data.address1,
        Address2: data.address2 || '',
        City: data.city.trim(),
        State: data.state,
        Country: data.country,
        ZipCode: data.zipCode.trim(),
        ShowProductsOnWebsite: data.showProductsOnWebsite
      };

      const response = await api.post('/User/SaveBussinessDetail', payload, {
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        const selectedCategory = categories.find((c) => (c.id || c.Id) === data.category);
        localStorage.setItem('selectedService', JSON.stringify({
          id: data.category,
          name: selectedCategory?.name || selectedCategory?.Name,
        }));
        navigate('/subscribe');
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Something went wrong.');
    } finally {
      setSpinner(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: 'linear-gradient(135deg,#0f172a 0%,#1e3a5f 40%,#0369a1 100%)' }}>
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-[42%] p-10">
        <button onClick={() => navigate('/')} className="flex items-center gap-2">
          <img src={logo} alt="TrackInventory" className="h-11 w-auto" />
        </button>
        <div>
          <h2 className="text-3xl font-bold text-white leading-snug mb-3">
            Set up your<br /><span className="text-cyan-400">business profile.</span>
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed mb-8">
            Tell us about your business so we can personalise your inventory dashboard and public store page.
          </p>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(CATEGORY_ICONS).map(([name, icon]) => (
              <div key={name}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  catName === name
                    ? 'bg-white text-slate-900 shadow-lg'
                    : 'bg-white/10 text-slate-300 border border-white/10'
                }`}>
                <span>{icon}</span> {name}
              </div>
            ))}
          </div>
        </div>
        <p className="text-slate-500 text-xs">Step 1 of 2 — Business Details</p>
      </div>

      {/* Right form */}
      <motion.div
        className="flex-1 flex flex-col justify-center items-center px-6 py-10 bg-white overflow-y-auto"
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <button onClick={() => navigate('/')} className="lg:hidden mb-8 mt-10">
          <img src={logo} alt="TrackInventory" className="h-10 w-auto" />
        </button>

        <div className="w-full max-w-md my-auto">
          <div className="mb-7">
            <h1 className="text-2xl font-bold text-slate-900">Business Details</h1>
            <p className="text-slate-500 text-sm mt-1">Complete your store setup to go live</p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <Field label="Category" required error={errors.category?.message}>
              <select
                className={selectCls}
                {...register('category', { required: 'Category is required' })}
              >
                <option value="">Select your business type</option>
                {categories.map((cat) => (
                  <option key={cat.id || cat.Id} value={cat.id || cat.Id}>
                    {CATEGORY_ICONS[cat.name || cat.Name] || '📦'} {cat.name || cat.Name}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Business Name" required error={errors.businessName?.message}>
              <input
                type="text"
                placeholder="e.g. Sharma Mobile Store"
                {...register('businessName', { required: 'Business Name is required' })}
                className={inputCls}
              />
            </Field>

            <Field label="Mobile Number" required error={errors.mobileNumber?.message}>
              <input
                type="tel"
                placeholder="9876543210"
                maxLength={10}
                {...register('mobileNumber', { 
                  required: 'Mobile Number is required',
                  pattern: {
                    value: /^[6-9]\d{9}$/,
                    message: 'Valid 10-digit mobile number required'
                  }
                })}
                className={inputCls}
                onChange={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, '');
                  setValue('mobileNumber', e.target.value);
                }}
              />
            </Field>

            {!isGoldCategory && (
              <div className="space-y-4">
                <Field label="Website Name" required error={errors.websiteName?.message}>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-4 flex items-center text-slate-400 text-sm pointer-events-none">
                      trackinventory.in/
                    </span>
                    <input
                      type="text"
                      placeholder="myshop"
                      {...register('websiteName', { required: 'Website Name is required' })}
                      className={`${inputCls} pl-[138px]`}
                      onChange={(e) => {
                        const val = e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '');
                        setValue('websiteName', val);
                        setWebsiteNameEdited(true);
                      }}
                    />
                  </div>
                  {websiteName && (
                    <p className={`text-xs mt-1 font-medium ${checkingAvailability ? 'text-slate-400' : (websiteAvailable ? 'text-green-500' : 'text-red-500')}`}>
                      {checkingAvailability ? "Checking availability..." : (websiteAvailable ? "✓ Website name is available" : "✗ Website name is already taken")}
                    </p>
                  )}
                </Field>

                <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">Show Products on Website</p>
                    <p className="text-xs text-slate-500">Allow customers to view your inventory online</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" {...register('showProductsOnWebsite')} />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <Field label="Country" required error={errors.country?.message}>
                <select className={selectCls} {...register('country', { required: 'Country is required' })}>
                  <option value="India">India</option>
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Canada">Canada</option>
                  <option value="Australia">Australia</option>
                  <option value="United Arab Emirates">UAE</option>
                </select>
              </Field>
              <Field label="State" required error={errors.state?.message}>
                <select className={selectCls} {...register('state', { required: 'State is required' })}>
                  <option value="">Select state</option>
                  {INDIA_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <Field label="Address Line 1" required error={errors.address1?.message}>
                  <input
                    type="text"
                    placeholder="Street, area, locality"
                    {...register('address1', { required: 'Address is required' })}
                    className={inputCls}
                  />
                </Field>
              </div>

              <Field label="Address Line 2">
                <input
                  type="text"
                  placeholder="Optional"
                  {...register('address2')}
                  className={inputCls}
                />
              </Field>

              <Field label="City" required error={errors.city?.message}>
                <input
                  type="text"
                  placeholder="City name"
                  {...register('city', { required: 'City is required' })}
                  className={inputCls}
                />
              </Field>

              <Field label="Zip Code" required error={errors.zipCode?.message}>
                <input
                  type="text"
                  placeholder="PIN code"
                  {...register('zipCode', { 
                    required: 'Zip Code is required',
                    pattern: {
                      value: /^[1-9][0-9]{5}$/,
                      message: 'Valid 6-digit PIN required'
                    }
                  })}
                  className={inputCls}
                  onChange={(e) => {
                    e.target.value = e.target.value.replace(/[^0-9]/g, '');
                    setValue('zipCode', e.target.value);
                  }}
                />
              </Field>
            </div>

            <motion.button
              type="submit"
              disabled={spinner}
              className="w-full py-3.5 rounded-xl text-white font-semibold text-sm disabled:opacity-70 flex items-center justify-center gap-2 mt-2"
              style={{ background: 'linear-gradient(90deg,#2563eb,#06b6d4)' }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
            >
              {spinner ? <CircularProgress size={20} sx={{ color: 'white' }} /> : 'Continue to Subscription →'}
            </motion.button>
          </form>
          <div className="h-10"></div>
        </div>
      </motion.div>
    </div>
  );
};

export default BusinessDetails;
