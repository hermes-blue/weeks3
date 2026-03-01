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
  CircularProgress,
  Fade,
  Stack,
  Divider,
  MenuItem,
} from "@mui/material";
import {
  PhotoCamera,
  Height,
  FitnessCenter,
  AutoAwesome,
  Refresh,
  Share,
  Download,
  Person,
} from "@mui/icons-material";
import { styled, keyframes } from "@mui/material/styles";
import ReactMarkdown from "react-markdown";
import { httpsCallable } from "firebase/functions";
import { functions } from "../firebase";

const ProfilePaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(6),
  borderRadius: 32,
  background: "rgba(255, 255, 255, 0.7)",
  backdropFilter: "blur(20px)",
  boxShadow: "0 20px 50px rgba(0, 0, 0, 0.05)",
  textAlign: "center",
  border: "1px solid rgba(255, 255, 255, 0.4)",
  transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
}));

const GlowButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(4),
  borderRadius: 16,
  padding: "16px 40px",
  fontWeight: "800",
  fontSize: "1.1rem",
  background: "linear-gradient(45deg, #6366f1 30%, #a855f7 90%)",
  color: "white",
  boxShadow: "0 10px 30px rgba(99, 102, 241, 0.3)",
  "&:hover": {
    background: "linear-gradient(45deg, #4f46e5 30%, #9333ea 90%)",
    transform: "translateY(-2px)",
    boxShadow: "0 15px 35px rgba(99, 102, 241, 0.4)",
  },
  "&:disabled": {
    background: "#e2e8f0",
  },
}));

const HiddenInput = styled("input")({
  display: "none",
});

const ReportBox = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(4),
  padding: theme.spacing(4),
  borderRadius: 24,
  background: "rgba(255, 255, 255, 0.95)",
  border: "1px solid rgba(99, 102, 241, 0.1)",
  textAlign: "left",
  boxShadow: "inset 0 2px 10px rgba(0,0,0,0.02)",
  "& h1, & h2, & h3": {
    background: "linear-gradient(45deg, #6366f1, #a855f7)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(1.5),
    fontWeight: 800,
  },
  "& p": {
    lineHeight: 1.8,
    color: "#444",
    fontSize: "1.05rem",
    marginBottom: theme.spacing(2),
  },
}));

const UserSummaryCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: 16,
  background: "rgba(99, 102, 241, 0.05)",
  border: "1px solid rgba(99, 102, 241, 0.1)",
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
  marginBottom: theme.spacing(3),
}));

const SetupProfile = () => {
  const [photo, setPhoto] = useState(null);
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [gender, setGender] = useState("");
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!height || !weight) return;
    
    setLoading(true);
    setReport(null);

    try {
      const getStyleAdvice = httpsCallable(functions, "getStyleAdvice");
      const result = await getStyleAdvice({ height, weight, gender, photo });
      setReport(result.data.advice);
    } catch (error) {
      alert("분석 중 오류가 발생했습니다: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: { xs: 4, md: 10 } }}>
      <ProfilePaper elevation={0}>
        <Typography 
          variant="h3" 
          gutterBottom 
          fontWeight="900" 
          sx={{ 
            mb: 1, 
            letterSpacing: "-0.02em",
            background: "linear-gradient(45deg, #1e293b, #6366f1)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Style AI
        </Typography>
        <Typography variant="h6" color="textSecondary" sx={{ mb: 6, fontWeight: 400, opacity: 0.8 }}>
          데이터 기반의 퍼스널 스타일링 조언을 받아보세요.
        </Typography>

        {!report ? (
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <Box sx={{ mb: 6, display: "flex", flexDirection: "column", alignItems: "center" }}>
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
                      width: 160,
                      height: 160,
                      mb: 2,
                      border: "6px solid white",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      "&:hover": { transform: "scale(1.05) rotate(2deg)" },
                    }}
                  >
                    {!photo && <PhotoCamera sx={{ fontSize: 50, color: "#94a3b8" }} />}
                  </Avatar>
                </IconButton>
              </label>
              <Typography variant="body2" fontWeight="600" color="primary">
                {photo ? "이미지 교체" : "전신 사진 업로드 (선택)"}
              </Typography>
            </Box>

            <Stack spacing={3} sx={{ maxWidth: 400, mx: "auto" }}>
              <TextField
                select
                fullWidth
                label="성별 (Gender)"
                variant="filled"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person color="primary" />
                    </InputAdornment>
                  ),
                  disableUnderline: true,
                }}
                sx={{
                  "& .MuiFilledInput-root": {
                    borderRadius: 4,
                    backgroundColor: "rgba(0,0,0,0.03)",
                    "&:hover": { backgroundColor: "rgba(0,0,0,0.05)" },
                    "&.Mui-focused": { backgroundColor: "rgba(0,0,0,0.05)" },
                  },
                }}
              >
                <MenuItem value="male">남성</MenuItem>
                <MenuItem value="female">여성</MenuItem>
                <MenuItem value="other">기타</MenuItem>
              </TextField>

              <TextField
                fullWidth
                label="키 (Height)"
                variant="filled"
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Height color="primary" />
                    </InputAdornment>
                  ),
                  endAdornment: <InputAdornment position="end">cm</InputAdornment>,
                  disableUnderline: true,
                }}
                sx={{
                  "& .MuiFilledInput-root": {
                    borderRadius: 4,
                    backgroundColor: "rgba(0,0,0,0.03)",
                    "&:hover": { backgroundColor: "rgba(0,0,0,0.05)" },
                    "&.Mui-focused": { backgroundColor: "rgba(0,0,0,0.05)" },
                  },
                }}
              />
              <TextField
                fullWidth
                label="몸무게 (Weight)"
                variant="filled"
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FitnessCenter color="primary" />
                    </InputAdornment>
                  ),
                  endAdornment: <InputAdornment position="end">kg</InputAdornment>,
                  disableUnderline: true,
                }}
                sx={{
                  "& .MuiFilledInput-root": {
                    borderRadius: 4,
                    backgroundColor: "rgba(0,0,0,0.03)",
                    "&:hover": { backgroundColor: "rgba(0,0,0,0.05)" },
                    "&.Mui-focused": { backgroundColor: "rgba(0,0,0,0.05)" },
                  }
                }}
              />

              <GlowButton
                fullWidth
                type="submit"
                variant="contained"
                disabled={!height || !weight || loading}
                startIcon={loading ? <CircularProgress size={24} color="inherit" /> : <AutoAwesome />}
              >
                {loading ? "스타일 분석 중..." : "스타일 분석 시작"}
              </GlowButton>
            </Stack>
          </Box>
        ) : (
          <Fade in={!!report}>
            <Box>
              <UserSummaryCard elevation={0}>
                <Avatar src={photo} sx={{ width: 80, height: 80, border: "3px solid white" }} />
                <Box sx={{ textAlign: "left" }}>
                  <Typography variant="h6" fontWeight="800">분석 완료</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {height}cm · {weight}kg · {gender === "male" ? "남성" : gender === "female" ? "여성" : "기타"}
                  </Typography>
                </Box>
              </UserSummaryCard>

              <ReportBox>
                <Typography variant="h5" fontWeight="900" sx={{ mb: 3, display: "flex", alignItems: "center", gap: 1.5 }}>
                  <AutoAwesome sx={{ color: "#6366f1" }} /> 
                  오늘의 스타일 조언 (5줄 이내)
                </Typography>
                <Divider sx={{ mb: 3, opacity: 0.5 }} />
                <ReactMarkdown>{report}</ReactMarkdown>
                
                <Box sx={{ mt: 6, display: "flex", gap: 2 }}>
                  <Button 
                    fullWidth
                    variant="outlined" 
                    startIcon={<Refresh />}
                    onClick={() => setReport(null)} 
                    sx={{ borderRadius: 4, py: 1.5, borderWidth: 2, fontWeight: 700 }}
                  >
                    다시 분석하기
                  </Button>
                </Box>
              </ReportBox>
            </Box>
          </Fade>
        )}
      </ProfilePaper>
    </Container>
  );
};

export default SetupProfile;
