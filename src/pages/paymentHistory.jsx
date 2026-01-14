import { useEffect, useState } from "react";
import {
  CircularProgress,
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Divider,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import {
  Payment,
  CheckCircle,
  Cancel,
  Schedule,
  Receipt,
  ArrowBack,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import api from "../composables/instance";
import { useAuth } from "../context/auth/useAuth";
import { useToast } from "../context/toast/ToastContext";
import { IconButton } from "@mui/material";

export default function PaymentHistory() {
  const { token } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    if (!token) return;

    (async () => {
      try {
        setLoading(true);
        // Try common payment history endpoints
        let data;
        try {
          const response = await api.get("/Payment/GetHistory", {
            headers: { Authorization: `Bearer ${token}` },
          });
          data = response.data;
        } catch (err) {
          // Try alternative endpoint
          try {
            const response = await api.get("/Payment/History", {
              headers: { Authorization: `Bearer ${token}` },
            });
            data = response.data;
          } catch (err2) {
            // Try another alternative
            const response = await api.get("/Payment/GetPayments", {
              headers: { Authorization: `Bearer ${token}` },
            });
            data = response.data;
          }
        }

        // Handle different response formats
        const paymentList =
          Array.isArray(data) ? data : data?.data || data?.payments || data?.result || [];

        setPayments(paymentList);
      } catch (error) {
        console.error("Failed to load payment history:", error);
        showToast("Failed to load payment history", "error");
      } finally {
        setLoading(false);
      }
    })();
  }, [token, showToast]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  const getStatusColor = (status) => {
    const statusLower = (status || "").toLowerCase();
    if (statusLower === "success" || statusLower === "completed" || statusLower === "paid") {
      return "success";
    }
    if (statusLower === "failed" || statusLower === "cancelled" || statusLower === "refunded") {
      return "error";
    }
    if (statusLower === "pending" || statusLower === "processing") {
      return "warning";
    }
    return "default";
  };

  const getStatusIcon = (status) => {
    const statusLower = (status || "").toLowerCase();
    if (statusLower === "success" || statusLower === "completed" || statusLower === "paid") {
      return <CheckCircle sx={{ fontSize: 20 }} />;
    }
    if (statusLower === "failed" || statusLower === "cancelled" || statusLower === "refunded") {
      return <Cancel sx={{ fontSize: 20 }} />;
    }
    return <Schedule sx={{ fontSize: 20 }} />;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
        <CircularProgress size={60} sx={{ color: "#667eea" }} />
      </div>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f9fafb", py: 4 }}>
      <Box sx={{ maxWidth: 1200, mx: "auto", px: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton
            onClick={() => navigate(-1)}
            sx={{
              color: "#667eea",
              "&:hover": { backgroundColor: "rgba(102, 126, 234, 0.1)" },
            }}
          >
            <ArrowBack />
          </IconButton>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              background: "linear-gradient(45deg, #ec4899, #6366f1)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Payment History
          </Typography>
        </Box>

        {/* Payment History Card */}
        <Card
          sx={{
            background: "white",
            borderRadius: 4,
            boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
            border: "1px solid #e5e7eb",
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <Avatar
                sx={{
                  width: 60,
                  height: 60,
                  background: "linear-gradient(45deg, #667eea, #764ba2)",
                  mr: 3,
                }}
              >
                <Receipt sx={{ fontSize: 30, color: "white" }} />
              </Avatar>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 600, color: "#333" }}>
                  All Transactions
                </Typography>
                <Typography variant="body2" sx={{ color: "#666", mt: 0.5 }}>
                  View your complete payment history
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {payments.length === 0 ? (
              <Box
                sx={{
                  textAlign: "center",
                  py: 8,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Payment sx={{ fontSize: 64, color: "#d1d5db" }} />
                <Typography variant="h6" sx={{ color: "#666" }}>
                  No payment history found
                </Typography>
                <Typography variant="body2" sx={{ color: "#999" }}>
                  Your payment transactions will appear here once you make a payment.
                </Typography>
              </Box>
            ) : (
              <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600, color: "#333" }}>
                        Transaction ID
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, color: "#333" }}>Date</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: "#333" }}>Service</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: "#333" }}>Plan</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: "#333" }} align="right">
                        Amount
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, color: "#333" }} align="center">
                        Status
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {payments.map((payment, index) => {
                      const transactionId =
                        payment.transactionId ||
                        payment.orderId ||
                        payment.razorpayOrderId ||
                        payment.id ||
                        `TXN-${index + 1}`;
                      const date =
                        payment.date ||
                        payment.createdAt ||
                        payment.paymentDate ||
                        payment.timestamp;
                      const serviceName =
                        payment.serviceName ||
                        payment.service ||
                        payment.planName ||
                        "N/A";
                      const planDuration =
                        payment.planDuration ||
                        payment.duration ||
                        payment.period ||
                        "";
                      const amount =
                        payment.amount ||
                        payment.totalAmount ||
                        payment.paidAmount ||
                        0;
                      const status =
                        payment.status ||
                        payment.paymentStatus ||
                        payment.transactionStatus ||
                        "Unknown";

                      return (
                        <TableRow
                          key={index}
                          sx={{
                            "&:hover": { backgroundColor: "#f9fafb" },
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell>
                            <Typography
                              variant="body2"
                              sx={{
                                fontFamily: "monospace",
                                color: "#667eea",
                                fontWeight: 500,
                              }}
                            >
                              {transactionId}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ color: "#666" }}>
                              {formatDate(date)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ color: "#333", fontWeight: 500 }}>
                              {serviceName}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ color: "#666" }}>
                              {planDuration || "N/A"}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography
                              variant="body2"
                              sx={{ color: "#333", fontWeight: 600, fontSize: "1rem" }}
                            >
                              ₹{typeof amount === "number" ? amount.toFixed(2) : amount}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Chip
                              icon={getStatusIcon(status)}
                              label={status}
                              color={getStatusColor(status)}
                              size="small"
                              sx={{
                                fontWeight: 500,
                                textTransform: "capitalize",
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
