// ========== Packages ==========
// Initialising express
const express = require("express");

// ========== Controllers ==========
// Initialising VoucherController
const VoucherController = require("./voucherController");

// ========== Set-up ==========
// Initialising voucherRoutes
const voucherRoutes = express.Router();

// ========== Routes ==========
// Route to get vouchers by memberID
voucherRoutes.get("/:memberID", VoucherController.getVouchersByMemberID);

// Route to redeem a voucher by voucherID
voucherRoutes.post("/redeem/:voucherID", VoucherController.redeemVoucher);

// ========== Export ==========
module.exports = voucherRoutes;
