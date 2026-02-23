import { useEffect, useState } from "react";
import {
  TextField,
  Button,
  CircularProgress,
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Divider,
  Grid,
} from "@mui/material";
import { Person, Business, Edit, Save, Cancel, Phone, Email, Block } from "@mui/icons-material";
import api from "../composables/instance";
import { useAuth } from "../context/auth/useAuth";
import { useToast } from "../context/toast/ToastContext";

export default function Profile() {
  const { token } = useAuth();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [emailHover, setEmailHover] = useState(false);
  const [categoryHover, setCategoryHover] = useState(false);

  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    category: "",
  });

  const [business, setBusiness] = useState({
    businessName: "",
    state: "",
    country: "",
    address1: "",
    address2: "",
    zipCode: "",
  });

  useEffect(() => {
    if (!token) return;

    (async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/User/GetUserDetails", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userData = Array.isArray(data) ? data[0] : data;
        setProfile({
          // Support both camelCase and PascalCase from backend
          firstName: userData?.firstName || userData?.FirstName || "",
          lastName: userData?.lastName || userData?.LastName || "",
          email: userData?.email || userData?.Email || "",
          phoneNumber: userData?.mobileNumber || userData?.MobileNumber || "",
          category: userData?.serviceName || userData?.ServiceName || "",
        });
        // Business / address details can come either as bussinessDetail[] or Address object
        const businessDetails =
          userData?.bussinessDetail ||
          userData?.BussinessDetail ||
          (userData?.Address || userData?.address ? [userData.Address || userData.address] : []);
        const businessData = Array.isArray(businessDetails) && businessDetails.length > 0 ? businessDetails[0] : {};
        setBusiness({
          businessName: businessData?.name || businessData?.Name || "",
          state: businessData?.state || businessData?.State || "",
          country: businessData?.country || businessData?.Country || "",
          address1: businessData?.address1 || businessData?.Address1 || "",
          address2: businessData?.address2 || businessData?.Address2 || "",
          zipCode: businessData?.zipCode || businessData?.ZipCode || "",
        });
      } catch {
        showToast("Failed to load profile", "error");
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
      formData.append("FirstName", profile.firstName || "");
      formData.append("LastName", profile.lastName || "");
      formData.append("Email", profile.email || "");
      formData.append("MobileNumber", profile.phoneNumber || "");
      formData.append("ProfilePicUrl", ""); 
      formData.append("Address.Name", business.businessName || "");
      formData.append("Address.Address1", business.address1 || "");
      formData.append("Address.Address2", business.address2 || "");
      formData.append("Address.State", business.state || "");
      formData.append("Address.Country", business.country || "");
      formData.append("Address.ZipCode", business.zipCode || "");
      formData.append("Address.MobileNumber", profile.phoneNumber || "");

      console.log("Sending FormData payload for CreateUpdate"); // Debug log

      const response = await api.post("/User/CreateUpdate", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      const { data: updatedData } = await api.get("/User/GetUserDetails", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updatedUserData = Array.isArray(updatedData) ? updatedData[0] : updatedData;
      setProfile({
        firstName: updatedUserData?.firstName || updatedUserData?.FirstName || "",
        lastName: updatedUserData?.lastName || updatedUserData?.LastName || "",
        email: updatedUserData?.email || updatedUserData?.Email || "",
        phoneNumber: updatedUserData?.mobileNumber || updatedUserData?.MobileNumber || "",
        category: updatedUserData?.serviceName || updatedUserData?.ServiceName || "",
      });
      const updatedBusinessDetails =
        updatedUserData?.bussinessDetail ||
        updatedUserData?.BussinessDetail ||
        (updatedUserData?.Address || updatedUserData?.address
          ? [updatedUserData.Address || updatedUserData.address]
          : []);
      const updatedBusinessData =
        Array.isArray(updatedBusinessDetails) && updatedBusinessDetails.length > 0
          ? updatedBusinessDetails[0]
          : {};
      setBusiness({
        businessName: updatedBusinessData?.name || updatedBusinessData?.Name || "",
        state: updatedBusinessData?.state || updatedBusinessData?.State || "",
        country: updatedBusinessData?.country || updatedBusinessData?.Country || "",
        address1: updatedBusinessData?.address1 || updatedBusinessData?.Address1 || "",
        address2: updatedBusinessData?.address2 || updatedBusinessData?.Address2 || "",
        zipCode: updatedBusinessData?.zipCode || updatedBusinessData?.ZipCode || "",
      });

      wasSuccess = true;
      toastConfig = {
        message: "Profile updated successfully",
        severity: "success",
      };
    } catch (error) {
      console.error("Update failed:", error);
      toastConfig = {
        message:
          "Update failed: " +
          (error.response?.data?.message || error.message),
        severity: "error",
      };
    } finally {
      const elapsed = Date.now() - startTime;
      const delay = Math.max(0, 5000 - elapsed); // ensure at least 5 seconds spinner

      setTimeout(() => {
        setSaving(false);
        if (toastConfig) {
          showToast(toastConfig.message, toastConfig.severity);
          if (wasSuccess) {
            setEditMode(false);
          }
        }
      }, delay);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
        <CircularProgress size={60} sx={{ color: '#667eea' }} />
      </div>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f9fafb', py: 4 }}>
      <Box sx={{ maxWidth: 1200, mx: 'auto', px: 4 }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            textAlign: 'center',
            mb: 4,
            background: 'linear-gradient(45deg, #ec4899, #6366f1)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          My Profile
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                background: 'white',
                borderRadius: 4,
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                border: '1px solid #e5e7eb',
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Avatar
                    sx={{
                      width: 60,
                      height: 60,
                      background: 'linear-gradient(45deg, #667eea, #764ba2)',
                      mr: 3,
                    }}
                  >
                    <Person sx={{ fontSize: 30, color: 'white' }} />
                  </Avatar>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 600, color: '#333' }}>
                      Personal Information
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="First Name"
                      value={profile.firstName}
                      disabled={!editMode}
                      onChange={(e) =>
                        setProfile({ ...profile, firstName: e.target.value })
                      }
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          backgroundColor: editMode ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.5)',
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Last Name"
                      value={profile.lastName}
                      disabled={!editMode}
                      onChange={(e) =>
                        setProfile({ ...profile, lastName: e.target.value })
                      }
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          backgroundColor: editMode ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.5)',
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box
                      sx={{ position: 'relative' }}
                      onMouseEnter={() => setEmailHover(true)}
                      onMouseLeave={() => setEmailHover(false)}
                    >
                      <TextField
                        fullWidth
                        label="Email"
                        type="email"
                        value={profile.email}
                        disabled={true} // Always disabled - cannot be changed
                        variant="outlined"
                        InputProps={{
                          startAdornment: <Email sx={{ color: '#666', mr: 1 }} />,
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            backgroundColor: 'rgba(255,255,255,0.5)',
                            '&.Mui-disabled': {
                              backgroundColor: 'rgba(255,255,255,0.3)',
                              color: '#999',
                            },
                          },
                        }}
                        helperText="Email cannot be changed"
                      />
                      {emailHover && (
                        <Box
                          sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            zIndex: 1,
                            pointerEvents: 'none',
                          }}
                        >
                          <Block sx={{ color: '#ef4444', fontSize: 24 }} />
                        </Box>
                      )}
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      value={profile.phoneNumber}
                      disabled={!editMode}
                      onChange={(e) =>
                        setProfile({ ...profile, phoneNumber: e.target.value })
                      }
                      variant="outlined"
                      InputProps={{
                        startAdornment: <Phone sx={{ color: '#666', mr: 1 }} />,
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          backgroundColor: editMode ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.5)',
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box
                      sx={{ position: 'relative' }}
                      onMouseEnter={() => setCategoryHover(true)}
                      onMouseLeave={() => setCategoryHover(false)}
                    >
                      <TextField
                        fullWidth
                        label="Category"
                        value={profile.category}
                        disabled={true} // Always disabled - display only
                        variant="outlined"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            backgroundColor: 'rgba(255,255,255,0.5)',
                            '&.Mui-disabled': {
                              backgroundColor: 'rgba(255,255,255,0.3)',
                              color: '#999',
                            },
                          },
                        }}
                        helperText="Category cannot be changed"
                      />
                      {categoryHover && (
                        <Box
                          sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            zIndex: 1,
                            pointerEvents: 'none',
                          }}
                        >
                          <Block sx={{ color: '#ef4444', fontSize: 24 }} />
                        </Box>
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Business Info Card */}
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                background: 'white',
                borderRadius: 4,
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                border: '1px solid #e5e7eb',
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Avatar
                    sx={{
                      width: 60,
                      height: 60,
                      background: 'linear-gradient(45deg, #764ba2, #667eea)',
                      mr: 3,
                    }}
                  >
                    <Business sx={{ fontSize: 30, color: 'white' }} />
                  </Avatar>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 600, color: '#333' }}>
                      Business Details
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Business Name"
                      value={business.businessName}
                      disabled={!editMode}
                      onChange={(e) =>
                        setBusiness({ ...business, businessName: e.target.value })
                      }
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          backgroundColor: editMode ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.5)',
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="State"
                      value={business.state}
                      disabled={!editMode}
                      onChange={(e) =>
                        setBusiness({ ...business, state: e.target.value })
                      }
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          backgroundColor: editMode ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.5)',
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Country"
                      value={business.country}
                      disabled={!editMode}
                      onChange={(e) =>
                        setBusiness({ ...business, country: e.target.value })
                      }
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          backgroundColor: editMode ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.5)',
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Address 1"
                      value={business.address1}
                      disabled={!editMode}
                      onChange={(e) =>
                        setBusiness({ ...business, address1: e.target.value })
                      }
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          backgroundColor: editMode ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.5)',
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Address 2"
                      value={business.address2}
                      disabled={!editMode}
                      onChange={(e) =>
                        setBusiness({ ...business, address2: e.target.value })
                      }
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          backgroundColor: editMode ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.5)',
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Zip Code"
                      value={business.zipCode}
                      disabled={!editMode}
                      onChange={(e) =>
                        setBusiness({ ...business, zipCode: e.target.value })
                      }
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          backgroundColor: editMode ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.5)',
                        },
                      }}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, gap: 2 }}>
          {editMode ? (
            <>
              <Button
                variant="contained"
                startIcon={saving ? null : <Save />}
                onClick={handleSave}
                disabled={saving}
                sx={{
                  background: 'linear-gradient(45deg, #ec4899, #6366f1)',
                  color: 'white',
                  px: 4,
                  py: 1.5,
                  borderRadius: 3,
                  fontWeight: 600,
                  textTransform: 'none',
                  boxShadow: '0 4px 15px rgba(236, 72, 153, 0.4)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #db2777, #4f46e5)',
                    boxShadow: '0 6px 20px rgba(236, 72, 153, 0.6)',
                    transform: 'translateY(-2px)',
                  },
                  '&:disabled': {
                    background: 'linear-gradient(45deg, #a855f7, #6366f1)',
                    color: 'white',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                {saving ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CircularProgress size={18} sx={{ color: "white" }} />
                    Saving...
                  </Box>
                ) : (
                  'Save Changes'
                )}
              </Button>
              <Button
                variant="outlined"
                startIcon={<Cancel />}
                onClick={() => setEditMode(false)}
                sx={{
                  borderColor: '#d1d5db',
                  color: '#6b7280',
                  px: 4,
                  py: 1.5,
                  borderRadius: 3,
                  fontWeight: 600,
                  textTransform: 'none',
                  '&:hover': {
                    borderColor: '#9ca3af',
                    backgroundColor: '#f9fafb',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Cancel
              </Button>
            </>
          ) : (
            <Button
              variant="contained"
              startIcon={<Edit />}
              onClick={() => setEditMode(true)}
              sx={{
                background: 'linear-gradient(45deg, #ec4899, #6366f1)',
                color: 'white',
                px: 4,
                py: 1.5,
                borderRadius: 3,
                fontWeight: 600,
                textTransform: 'none',
                boxShadow: '0 4px 15px rgba(236, 72, 153, 0.4)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #db2777, #4f46e5)',
                  boxShadow: '0 6px 20px rgba(236, 72, 153, 0.6)',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Edit Profile
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
}
