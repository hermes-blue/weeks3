import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Avatar,
  Paper,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { PhotoCamera, Height, FitnessCenter } from "@mui/icons-material";
import { styled } from "@mui/material/styles";

const ProfilePaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: 24,
  background: "rgba(255, 255, 255, 0.8)",
  backdropFilter: "blur(10px)",
  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
  textAlign: "center",
  border: "1px solid rgba(255, 255, 255, 0.3)",
}));

const GlowButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(3),
  borderRadius: 12,
  padding: "12px 32px",
  fontWeight: "bold",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
  "&:hover": {
    boxShadow: "0 6px 25px rgba(0, 0, 0, 0.25)",
  },
}));

const HiddenInput = styled("input")({
  display: "none",
});

const SetupProfile = () => {
  const [photo, setPhoto] = useState(null);
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");

  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <ProfilePaper elevation={0}>
        <Typography variant="h4" gutterBottom fontWeight="800" sx={{ mb: 1, color: "#1a1a1a" }}>
          Personal Stylist
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
          당신을 위한 최적의 스타일을 찾아드리기 위해<br />기본 정보를 입력해 주세요.
        </Typography>

        <Box sx={{ mb: 4, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <label htmlFor="photo-upload">
            <HiddenInput
              accept="image/*"
              id="photo-upload"
              type="file"
              onChange={handlePhotoChange}
            />
            <IconButton component="span" sx={{ p: 0 }}>
              <Avatar
                src={photo}
                sx={{
                  width: 120,
                  height: 120,
                  mb: 1,
                  border: "4px solid white",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                  cursor: "pointer",
                  transition: "transform 0.2s",
                  "&:hover": { transform: "scale(1.05)" },
                }}
              >
                {!photo && <PhotoCamera sx={{ fontSize: 40 }} />}
              </Avatar>
            </IconButton>
          </label>
          <Typography variant="caption" color="textSecondary">
            {photo ? "사진 변경하기" : "전신 사진을 업로드해주세요"}
          </Typography>
        </Box>

        <Box component="form" noValidate sx={{ mt: 1 }}>
          <TextField
            fullWidth
            label="키 (Height)"
            variant="outlined"
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Height sx={{ color: "primary.main" }} />
                </InputAdornment>
              ),
              endAdornment: <InputAdornment position="end">cm</InputAdornment>,
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
              },
            }}
          />
          <TextField
            fullWidth
            label="몸무게 (Weight)"
            variant="outlined"
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FitnessCenter sx={{ color: "primary.main" }} />
                </InputAdornment>
              ),
              endAdornment: <InputAdornment position="end">kg</InputAdornment>,
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
              },
            }}
          />

          <GlowButton
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            disabled={!height || !weight}
          >
            스타일 분석 시작하기
          </GlowButton>
        </Box>
      </ProfilePaper>
    </Container>
  );
};

export default SetupProfile;
