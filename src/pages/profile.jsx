import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CircularProgress } from '@mui/material';
import { Person, Business, Edit, Save, Cancel, Phone, Email, Lock } from '@mui/icons-material';
import api from '../composables/instance';
import { useAuth } from '../context/auth/useAuth';
import { useToast } from '../context/toast/ToastContext';
import { useNavigate } from 'react-router-dom';

const inputCls = (editable) =>
  `w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none ${
    editable
      ? 'border-blue-300 bg-white text-slate-800 focus:ring-2 focus:ring-blue-500'
      : 'border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed'
  }`;

const Section = ({ icon, title, children }) => (
  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
    <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100">
      <div className="w-9 h-9 rounded-xl flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg,#2563eb,#06b6d4)' }}>
        {icon}
      </div>
      <h2 className="text-base font-semibold text-slate-800">{title}</h2>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

const Field = ({ label, children }) => (
  <div>
    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
      {label}
    </label>
    {children}
  </div>
);

export default function Profile() {
  const { token } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const [profile, setProfile] = useState({ firstName: '', lastName: '', email: '', phoneNumber: '', category: '' });
  const [business, setBusiness] = useState({ businessName: '', state: '', country: '', address1: '', address2: '', zipCode: '' });

  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/User/GetUserDetails', { headers: { Authorization: `Bearer ${token}` } });
        const u = Array.isArray(data) ? data[0] : data;
        setProfile({
          firstName: u?.firstName || u?.FirstName || '',
          lastName: u?.lastName || u?.LastName || '',
          email: u?.email || u?.Email || '',
          phoneNumber: u?.mobileNumber || u?.MobileNumber || '',
          category: u?.serviceName || u?.ServiceName || '',
        });
        const bd = u?.bussinessDetail || u?.BussinessDetail || [];
        const b = Array.isArray(bd) && bd.length > 0 ? bd[0] : {};
        setBusiness({
          businessName: b?.name || b?.Name || '',
          state: b?.state || b?.State || '',
          country: b?.country || b?.Country || '',
          address1: b?.address1 || b?.Address1 || '',
          address2: b?.address2 || b?.Address2 || '',
          zipCode: b?.zipCode || b?.ZipCode || '',
        });
      } catch {
        showToast('Failed to load profile', 'error');
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  const handleSave = async () => {
    const startTime = Date.now();
    setSaving(true);
    let toastConfig = null;
    let wasSuccess = false;
    try {
      const formData = new FormData();
      formData.append('FirstName', profile.firstName || '');
      formData.append('LastName', profile.lastName || '');
      formData.append('Email', profile.email || '');
      formData.append('MobileNumber', profile.phoneNumber || '');
      formData.append('ProfilePicUrl', '');
      formData.append('Address.Name', business.businessName || '');
      formData.append('Address.Address1', business.address1 || '');
      formData.append('Address.Address2', business.address2 || '');
      formData.append('Address.State', business.state || '');
      formData.append('Address.Country', business.country || '');
      formData.append('Address.ZipCode', business.zipCode || '');
      formData.append('Address.MobileNumber', profile.phoneNumber || '');

      await api.post('/User/CreateUpdate', formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
      });

      const { data: updatedData } = await api.get('/User/GetUserDetails', { headers: { Authorization: `Bearer ${token}` } });
      const u = Array.isArray(updatedData) ? updatedData[0] : updatedData;
      setProfile({
        firstName: u?.firstName || u?.FirstName || '',
        lastName: u?.lastName || u?.LastName || '',
        email: u?.email || u?.Email || '',
        phoneNumber: u?.mobileNumber || u?.MobileNumber || '',
        category: u?.serviceName || u?.ServiceName || '',
      });
      const bd = u?.bussinessDetail || u?.BussinessDetail || [];
      const b = Array.isArray(bd) && bd.length > 0 ? bd[0] : {};
      setBusiness({
        businessName: b?.name || b?.Name || '',
        state: b?.state || b?.State || '',
        country: b?.country || b?.Country || '',
        address1: b?.address1 || b?.Address1 || '',
        address2: b?.address2 || b?.Address2 || '',
        zipCode: b?.zipCode || b?.ZipCode || '',
      });
      wasSuccess = true;
      toastConfig = { message: 'Profile updated successfully', severity: 'success' };
    } catch (error) {
      toastConfig = { message: 'Update failed: ' + (error.response?.data?.message || error.message), severity: 'error' };
    } finally {
      const elapsed = Date.now() - startTime;
      setTimeout(() => {
        setSaving(false);
        if (toastConfig) {
          showToast(toastConfig.message, toastConfig.severity);
          if (wasSuccess) setEditMode(false);
        }
      }, Math.max(0, 5000 - elapsed));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <CircularProgress sx={{ color: '#2563eb' }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6" style={{ background: 'linear-gradient(135deg,#f0f9ff 0%,#f8fafc 100%)' }}>
      <div className="max-w-5xl mx-auto">
        {/* Page header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your personal and business information</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal info */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Section icon={<Person sx={{ color: 'white', fontSize: 18 }} />} title="Personal Information">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <Field label="First Name">
                    <input
                      className={inputCls(editMode)}
                      value={profile.firstName}
                      disabled={!editMode}
                      onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                    />
                  </Field>
                  <Field label="Last Name">
                    <input
                      className={inputCls(editMode)}
                      value={profile.lastName}
                      disabled={!editMode}
                      onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                    />
                  </Field>
                </div>
                <Field label="Email Address">
                  <div className="relative">
                    <Email sx={{ fontSize: 16, color: '#94a3b8', position: 'absolute', top: '50%', left: 12, transform: 'translateY(-50%)' }} />
                    <input className={`${inputCls(false)} pl-9`} value={profile.email} disabled />
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Email cannot be changed</p>
                </Field>
                <Field label="Phone Number">
                  <div className="relative">
                    <Phone sx={{ fontSize: 16, color: '#94a3b8', position: 'absolute', top: '50%', left: 12, transform: 'translateY(-50%)' }} />
                    <input
                      className={`${inputCls(editMode)} pl-9`}
                      value={profile.phoneNumber}
                      disabled={!editMode}
                      onChange={(e) => setProfile({ ...profile, phoneNumber: e.target.value })}
                    />
                  </div>
                </Field>
                <Field label="Category">
                  <input className={inputCls(false)} value={profile.category} disabled />
                  <p className="text-xs text-slate-400 mt-1">Category cannot be changed</p>
                </Field>
              </div>
            </Section>
          </motion.div>

          {/* Business info */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Section icon={<Business sx={{ color: 'white', fontSize: 18 }} />} title="Business Details">
              <div className="space-y-4">
                <Field label="Business Name">
                  <input
                    className={inputCls(editMode)}
                    value={business.businessName}
                    disabled={!editMode}
                    onChange={(e) => setBusiness({ ...business, businessName: e.target.value })}
                  />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="State">
                    <input
                      className={inputCls(editMode)}
                      value={business.state}
                      disabled={!editMode}
                      onChange={(e) => setBusiness({ ...business, state: e.target.value })}
                    />
                  </Field>
                  <Field label="Country">
                    <input
                      className={inputCls(editMode)}
                      value={business.country}
                      disabled={!editMode}
                      onChange={(e) => setBusiness({ ...business, country: e.target.value })}
                    />
                  </Field>
                </div>
                <Field label="Address Line 1">
                  <input
                    className={inputCls(editMode)}
                    value={business.address1}
                    disabled={!editMode}
                    onChange={(e) => setBusiness({ ...business, address1: e.target.value })}
                  />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Address Line 2">
                    <input
                      className={inputCls(editMode)}
                      value={business.address2}
                      disabled={!editMode}
                      onChange={(e) => setBusiness({ ...business, address2: e.target.value })}
                    />
                  </Field>
                  <Field label="Zip Code">
                    <input
                      className={inputCls(editMode)}
                      value={business.zipCode}
                      disabled={!editMode}
                      onChange={(e) => setBusiness({ ...business, zipCode: e.target.value })}
                    />
                  </Field>
                </div>
              </div>
            </Section>
          </motion.div>
        </div>

        {/* Quick links */}
        <motion.div
          className="mt-6 bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-wrap gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <button
            onClick={() => navigate('/change-password')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-100 transition-colors"
          >
            <Lock sx={{ fontSize: 16 }} /> Change Password
          </button>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          className="flex justify-end gap-3 mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
        >
          {editMode ? (
            <>
              <button
                onClick={() => setEditMode(false)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors"
              >
                <Cancel sx={{ fontSize: 16 }} /> Cancel
              </button>
              <motion.button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-white text-sm font-semibold disabled:opacity-60"
                style={{ background: 'linear-gradient(90deg,#2563eb,#06b6d4)' }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {saving ? <CircularProgress size={16} sx={{ color: 'white' }} /> : <Save sx={{ fontSize: 16 }} />}
                {saving ? 'Saving…' : 'Save Changes'}
              </motion.button>
            </>
          ) : (
            <motion.button
              onClick={() => setEditMode(true)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-white text-sm font-semibold"
              style={{ background: 'linear-gradient(90deg,#2563eb,#06b6d4)' }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Edit sx={{ fontSize: 16 }} /> Edit Profile
            </motion.button>
          )}
        </motion.div>
      </div>
    </div>
  );
}
