import { initializeApp } from "firebase/app";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";

// Firebase 프로젝트 설정 (실제 배포 시 대시보드에서 받은 설정값으로 교체 필요)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const functions = getFunctions(app);

// 로컬 테스트 시 에뮬레이터 연결 (개발 환경인 경우)
if (window.location.hostname === "localhost" || window.location.hostname === "0.0.0.0") {
  connectFunctionsEmulator(functions, "localhost", 5001);
}

export { app, functions };
