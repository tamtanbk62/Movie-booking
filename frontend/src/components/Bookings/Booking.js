import { Button, FormLabel, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getBookings, getMovieDetails, newBooking } from "../../api-helpers/api-helpers";
import Seat from "./Seat";

const Booking = () => {
  const [movie, setMovie] = useState();
  const [inputs, setInputs] = useState({ seatNumber: "", date: "" });
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [isMobileScreen, setIsMobileScreen] = useState(false);
  const id = useParams().id;
  const [bookings, setBookings] = useState();
  const seatBooking = Array(selectedSeats.length).fill(false);
  let seatTemp;
  useEffect(() => {
    getMovieDetails(id)
      .then((res) => setMovie(res.movie))
      .catch((err) => console.log(err));
  }, [id]);
  useEffect(() => {
    getBookings(id)
      .then((res) => setBookings(res.booking))
      .catch((err) => console.log(err));
  }, [id]);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobileScreen(window.innerWidth <= 1024);
    };

    // Thiết lập kích thước màn hình ban đầu
    handleResize();

    // Đăng ký sự kiện resize
    window.addEventListener("resize", handleResize);

    // Xóa sự kiện khi component bị unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const handleChange = (e) => {
    const newSeatNumber = e.target.value;
    if(seatBooking[parseInt(newSeatNumber) - 1]){
      return;
    }
    setInputs((prevInputs) => ({
      ...prevInputs,
      seatNumber: newSeatNumber
    }));
  
    // Update selected seats based on new seat number
    const newSelectedSeats = Array(selectedSeats.length).fill(false);
    const seatIndex = parseInt(newSeatNumber) - 1;
    if (seatIndex >= 0 && seatIndex < 50) {
      newSelectedSeats[seatIndex] = true;
    }
    setSelectedSeats(newSelectedSeats);
  };
  
  const handleSeatSelect = (index) => {
    const newSelectedSeats = Array(selectedSeats.length).fill(false);
    newSelectedSeats[index] = true;
    setSelectedSeats(newSelectedSeats);
    setInputs((prevState) => ({
      ...prevState,
      seatNumber: index + 1
    }));
  };   
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(inputs);
    newBooking({ ...inputs, movie: movie._id })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
    window.location.reload();
  };

  const renderSeats = () => {
    const seats = [];
    for (let i = 0; i < 10; i++) {
      const row = [];
      for (let j = 0; j < 5; j++) {
        let index = j * 10 + i;        
        const seatNumber = index + 1; // Tính toán số chỗ ngồi
        const isBooked = seatBooking[index] || false;
        let isSelected = selectedSeats[index] || false;
        if(isBooked){
          isSelected = false;
          index = seatTemp;
        }
        row.push(
          <Seat
            key={index}
            selected={isSelected}
            isBooked={isBooked}
            onSelect={() => handleSeatSelect(index)}
            seatNumber={seatNumber} // Truyền số chỗ ngồi vào Seat
          />
        );
      }
      seats.push(<div key={i}>{row}</div>);
    }
    return seats;
  };

  return (
    <div>
      {bookings && bookings.map((booking, index) => (
        seatBooking[booking.seatNumber - 1] = true
      ))}
      {movie && (
        <Fragment>
          <Typography
            padding={3}
            fontFamily="verdana"
            variant="h4"
            textAlign={"center"}
          >
            <b>Đặt vé cho phim: {movie.title}</b>
          </Typography>
          <Box display={"flex"} justifyContent={"center"}>
            <Box
              display={"flex"}
              justifyContent={"column"}
              flexDirection="column"
              paddingTop={3}
              width="50%"
              marginRight={"auto"}
            >
              <img
                width="80%"
                height="100%"
                src={movie.posterUrl}
                alt={movie.title}
              />
              <Box width={"80%"} marginTop={3} padding={2}>
                <Typography paddingTop={2}>{movie.description}</Typography>
                <Typography fontWeight={"bold"} marginTop={1}>
                  Diễn viên:
                  {movie.actors.map((actor) => " " + actor + " ")}
                </Typography>
                <Typography fontWeight={"bold"} marginTop={1}>
                  Ngày phát hành: {new Date(movie.releaseDate).toDateString()}
                </Typography>
              </Box>
            </Box>
            <Box width={"50%"} paddingTop={3}>
              <form onSubmit={handleSubmit}>
                <Box
                  padding={5}
                  margin={"auto"}
                  display="flex"
                  flexDirection={"column"}
                >                  
                  <FormLabel>Vị trí ghế</FormLabel>
                  <TextField
                    name="seatNumber"
                    value={inputs.seatNumber}
                    onChange={handleChange}
                    type={"number"}
                    margin="normal"
                    variant="standard"
                    inputProps={{ min: "1", max: "50" }} // Giả sử bảng có tối đa 50 chỗ ngồi
                  />
                  <FormLabel>Ngày đặt vé</FormLabel>
                  <TextField
                    name="date"
                    type={"date"}
                    margin="normal"
                    variant="standard"
                    value={inputs.date}
                    onChange={(e) => setInputs((prevState) => ({ ...prevState, date: e.target.value }))}
                  />
                  <Button type="submit" sx={{margin: "auto",bgcolor: "#add8e6",":hover": {bgcolor: "#121217"}}}>
                    Đặt vé
                  </Button>                 
                </Box>
              </form>
              <Box display={isMobileScreen ? "none" : "flex"} alignItems="center" > 
                <Box display="flex" alignItems="center" marginRight={2}>
                  <Box width={20} height={20} bgcolor="#d3302f" marginRight={1}></Box>
                  <Typography>Đã bán</Typography>
                </Box>
                <Box display="flex" alignItems="center" marginRight={2}>
                  <Box width={20} height={20} bgcolor="#2e7d31" marginRight={1}></Box>
                  <Typography>Đã chọn</Typography>
                </Box>
                <Box display="flex" alignItems="center" marginRight={2}>
                  <Box width={20} height={20} bgcolor="#1876d2" marginRight={1}></Box>
                  <Typography>Trống</Typography>
                </Box>
              </Box>    
              <Box display={isMobileScreen ? "none" : "flex"} alignItems="center">                              
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ m: 1, width: "650px"}}
                >
                  SCREEN
                </Button>                      
              </Box>
              <Box display={isMobileScreen ? "none" : "flex"} alignItems="center" marginLeft={-10} marginTop={2}>                              
                {renderSeats()}
              </Box>
            </Box>
          </Box>
        </Fragment>
      )}
    </div>
  );
};

export default Booking;
