// Seat.js

import React from "react";
import { Button } from "@mui/material";

const Seat = ({ selected, onSelect, seatNumber, isBooked }) => {
  return (
    <Button
      variant="contained"
      color={isBooked ? "error" : (selected ? "success" : "primary")} // Sử dụng màu đỏ nếu ghế đã được đặt
      onClick={onSelect}
      sx={{ m: 1 }}
    >
      {seatNumber} {/* Hiển thị số chỗ ngồi */}
    </Button>
  );
};

export default Seat;
