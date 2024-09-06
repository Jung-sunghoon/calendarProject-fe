document.addEventListener("DOMContentLoaded", function () {
  // URL에서 토큰 추출
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token");

  if (token) {
    // 토큰을 로컬 스토리지에 저장
    sessionStorage.setItem("jwtToken", token);
    // URL에서 토큰 제거
    window.history.replaceState({}, document.title, "/");
    // 토큰을 사용하여 인증된 요청 예시
    fetchUserData(token);
  } else {
    console.error("토큰이 URL에 없습니다.");
  }
});

function fetchUserData(token) {
  fetch(`${import.meta.env.VITE_API_URL}/api/user`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("사용자 데이터:", data);
      // 여기서 사용자 데이터를 처리하거나 표시합니다.
    })
    .catch((error) => {
      console.error("데이터 가져오기 오류:", error);
    });
}
