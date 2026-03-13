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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import {
  Payment,
  CheckCircle,
  Cancel,
  Schedule,
  Receipt,
  ArrowBack,
  Visibility,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import api from "../composables/instance";
import { useAuth } from "../context/auth/useAuth";
import { useToast } from "../context/toast/ToastContext";

const normalizeList = (data) => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  return data?.data ?? data?.payments ?? data?.result ?? data?.transactions ?? [];
};

export default function PaymentHistory() {
  const { token } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  // GET /api/Payment/transactions/me + GET /api/Payment/dashboard/me - run once per token (no showToast in deps to avoid duplicate calls)
  useEffect(() => {
    if (!token) return;

    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const [txRes, dashRes] = await Promise.all([
          api.get("/Payment/transactions/me", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get("/Payment/dashboard/me", {
            headers: { Authorization: `Bearer ${token}` },
          }).catch(() => ({ data: null })),
        ]);

        if (cancelled) return;
        const paymentList = normalizeList(txRes.data);
        setPayments(paymentList);
        if (dashRes?.data != null) setDashboard(dashRes.data);
      } catch (error) {
        if (!cancelled) {
          console.error("Failed to load payment history:", error);
          showToast(error.response?.data?.message || "Failed to load payment history", "error");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [token]);

  // GET /api/Payment/transaction/{merchantTransactionId} - single transaction details
  const fetchTransactionDetail = async (id) => {
    const merchantTransactionId = id != null ? String(id) : "";
    if (!merchantTransactionId.trim()) return;
    setDetailLoading(true);
    setDetailOpen(true);
    setSelectedTransaction(null);
    try {
      const { data } = await api.get(
        `/Payment/transaction/${encodeURIComponent(merchantTransactionId)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSelectedTransaction(data);
    } catch (error) {
      console.error("Failed to load transaction detail:", error);
      showToast(error.response?.data?.message || "Failed to load transaction details", "error");
      setDetailOpen(false);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleCloseDetail = () => {
    setDetailOpen(false);
    setSelectedTransaction(null);
  };

  const getMerchantTransactionId = (payment) =>
    payment.merchantTransactionId ??
    payment.MerchantTransactionId ??
    payment.transactionId ??
    payment.TransactionId ??
    payment.orderId ??
    payment.OrderId ??
    payment.razorpayOrderId ??
    payment.id ??
    payment.Id;

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

  const statusStr = (s) => (s == null || typeof s === "object" ? "" : String(s)).toLowerCase();

  const getStatusColor = (status) => {
    const statusLower = statusStr(status);
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
    const statusLower = statusStr(status);
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

            {/* Dashboard summary from GET /Payment/dashboard/me */}
            {dashboard != null && Object.keys(dashboard).length > 0 && (
              <Box sx={{ mb: 3, p: 2, borderRadius: 2, bgcolor: "grey.50", border: "1px solid", borderColor: "grey.200" }}>
                <Typography variant="subtitle2" sx={{ color: "text.secondary", mb: 1 }}>
                  Summary
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                  {typeof dashboard.totalAmount === "number" && (
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      Total: ₹{dashboard.totalAmount.toFixed(2)}
                    </Typography>
                  )}
                  {typeof dashboard.totalTransactions === "number" && (
                    <Typography variant="body1" sx={{ color: "text.secondary" }}>
                      Transactions: {dashboard.totalTransactions}
                    </Typography>
                  )}
                  {dashboard.subscriptionStatus != null && (
                    <Chip size="small" label={String(dashboard.subscriptionStatus)} color="primary" variant="outlined" />
                  )}
                </Box>
              </Box>
            )}

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
                      <TableCell sx={{ fontWeight: 600, color: "#333" }} align="center">
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {payments.map((payment, index) => {
                      const merchantTransactionId = getMerchantTransactionId(payment);
                      const transactionId =
                        payment.transactionId ||
                        payment.orderId ||
                        payment.razorpayOrderId ||
                        payment.merchantTransactionId ||
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
                              label={status != null && typeof status !== "object" ? String(status) : "Unknown"}
                              color={getStatusColor(status)}
                              size="small"
                              sx={{
                                fontWeight: 500,
                                textTransform: "capitalize",
                              }}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                const id = merchantTransactionId || transactionId;
                                if (id) fetchTransactionDetail(id);
                              }}
                              title="View details"
                            >
                              <Visibility fontSize="small" />
                            </IconButton>
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

        {/* Single transaction detail: GET /Payment/transaction/{merchantTransactionId} */}
        <Dialog open={detailOpen} onClose={handleCloseDetail} maxWidth="sm" fullWidth>
          <DialogTitle>Transaction details</DialogTitle>
          <DialogContent>
            {detailLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
                <CircularProgress size={32} />
              </Box>
            ) : selectedTransaction ? (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, pt: 1 }}>
                {/* Real payment state from backend: razorpayPaymentId & completedAt = payment done */}
                {(() => {
                  const isPaid = !!(selectedTransaction.razorpayPaymentId ?? selectedTransaction.completedAt);
                  return (
                    <Box
                      sx={{
                        p: 1.5,
                        mb: 1,
                        borderRadius: 1,
                        bgcolor: isPaid ? "success.light" : "error.main",
                        color: isPaid ? "success.dark" : "white",
                      }}
                    >
                      <Typography variant="body2" sx={{ fontWeight: 600, color: "inherit" }}>
                        {isPaid ? "Payment completed" : "Payment not completed"}
                      </Typography>
                      {!isPaid && (
                        <Typography variant="caption" display="block" sx={{ mt: 0.5, color: "white" }}>
                          Order was created. Complete payment in Razorpay to activate your plan.
                        </Typography>
                      )}
                    </Box>
                  );
                })()}
                {Object.entries(selectedTransaction).map(([key, value]) => {
                  if (value == null || typeof value === "object") return null;
                  const keyLower = key.toLowerCase();
                  const isDateField =
                    (keyLower.includes("date") || keyLower === "createdat" || keyLower === "updatedat" || keyLower === "timestamp") &&
                    !keyLower.includes("status") &&
                    keyLower !== "status";
                  const label = key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());
                  let displayValue = isDateField ? formatDate(value) : String(value);
                  if ((keyLower === "status" || keyLower === "paymentstatus") && typeof value === "number") {
                    const isPaid = !!(selectedTransaction.razorpayPaymentId ?? selectedTransaction.completedAt);
                    if (!isPaid && value === 1) {
                      displayValue = "Order created (payment pending)";
                    } else {
                      const statusMap = { 0: "Pending", 1: "Success", 2: "Failed", 3: "Cancelled" };
                      displayValue = statusMap[value] ?? displayValue;
                    }
                  }
                  return (
                    <Box key={key} sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        {label}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500, textAlign: "right" }}>
                        {displayValue}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
            ) : null}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDetail}>Close</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}
