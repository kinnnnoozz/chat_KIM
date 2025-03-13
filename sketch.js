let chatMessages = [];
let userInputBox;
let inputButton;
let shareButton;
let chatBoxYStart = 100; // 채팅 메시지 시작 위치
let fullText = "안녕하세요. 저는 김영주의 포트폴리오 설명을 도와드릴 챗봇입니다."; // 표시할 전체 문장
let displayText = ""; // 현재 화면에 표시되는 텍스트
let charIndex = 0; // 현재 표시할 문자 위치

const maxMessages = 15; // 화면에 표시할 최대 메시지 개수
let youtubeIframe; // 유튜브 iframe 변수
let youtubeIframe2;
let lastMessageYPosition = chatBoxYStart; // 마지막 메시지 Y 위치 추적
let youtubeVideoVisible = false; // 영상이 보였는지 여부 추적
let youtubeIframeHeight = 0; // 유튜브 iframe의 높이

let myVideo; // 비디오 객체

let img;  // 이미지 변수
let imgTimer; // 타이머 변수
let chatHistory = []; // 지난 대화 목록 저장
let darkMode = false;
let themeButton;

function setup() {
    createCanvas(windowWidth, windowHeight);
    background(240); // 연한 회색 배경
    themeButton = createButton('테마 변경');
    themeButton.position(windowWidth * 0.20, 22);
    themeButton.mousePressed(toggleTheme);
    themeButton.size(120, 40);
    themeButton.style('font-size', '20px');
    themeButton.style('background-color', '#FFCCCC'); // 🔴 버튼 배경색 (예: 주황색)
    themeButton.style('border-radius', '8px'); // 모서리 둥글게

    let inputY = windowHeight * 0.88; // 화면 높이의 90% 지점에 배치

    // 헤더 스타일
    fill(50);
    textSize(24);
    textAlign(CENTER);
    text("", width / 2, 40);

    
    // 사용자 입력 창
    userInputBox = createInput();
    userInputBox.position((windowWidth - (1000 + 100 + 100 + 20)) / 2,  inputY);
    userInputBox.size(1000, 50);

    // 보내기 버튼
    inputButton = createButton('보내기');
    inputButton.position(userInputBox.x + userInputBox.width + 10, inputY);
    inputButton.size(100, 50);
    inputButton.mousePressed(sendMessage);
    
    // 공유 버튼 (채팅 내용을 공유할 수 있도록)
    shareButton = createButton('공유');
    shareButton.position(inputButton.x + inputButton.width + 10, inputY);
    shareButton.size(100, 50);
    shareButton.mousePressed(shareChat);
    
    // 입력 스타일
    userInputBox.style('font-size', '16px');
    inputButton.style('background-color', '#4CAF50');
    inputButton.style('color', 'white');
    inputButton.style('border', 'none');
    inputButton.style('border-radius', '5px');

    shareButton.style('background-color', '#2196F3');
    shareButton.style('color', 'white');
    shareButton.style('border', 'none');
    shareButton.style('border-radius', '5px');

    
}

function toggleTheme() {
    darkMode = !darkMode;
}

// 메시지 전송 함수
function sendMessage() {
    const userInput = userInputBox.value().trim();
    if (userInput !== "") {
        chatMessages.push({ sender: 'user', message: userInput });

        if (myVideo) {
            myVideo.remove();
            myVideo = null;  // 변수 초기화
        }

        if (img) {
            img.remove();
            img = null;
            clearTimeout(imgTimer);  // 타이머 초기화
        }

        if (youtubeIframe) {
            youtubeIframe.remove();
            youtubeIframe = null;
        }

        if (youtubeIframe2) {
            youtubeIframe2.remove();
            youtubeIframe2 = null;
        }

        if (userInput.includes("게임")) {
            chatMessages.push({ sender: 'bot', message: "좀비게임, 미연시를 표시합니다." });
            showFirstImage();
        } else if (userInput.includes("초기")) {
            chatMessages.push({ sender: 'bot', message: "게임을 재생합니다." });
            playVideo();
        } else if (userInput.includes("졸")) {
            chatMessages.push({ sender: 'bot', message: "Steven Park 세계관을 발전시켜 나갈 예정입니다!" });
            displayYoutubeVideo();
        } else if (userInput.includes("시위")) {
            chatMessages.push({ sender: 'bot', message: "유튜브 영상: 기습 시위한 버튜버" });
            displayYoutubeVideo2();
        } else if (userInput.includes("다음")) {
            chatMessages.push({ sender: 'bot', message: "버튜버 명걸이를 소개합니다." });
            showThirdImage();
        } else if (userInput.includes("최근")) {
            chatMessages.push({ sender: 'bot', message: "NCA 프로젝트, 전시장에서 쓸 수 있는 디바이스를 만들었습니다." });
            playVideo2();
        } else {
            chatMessages.push({ sender: 'bot', message: getBotResponse(userInput) });

            chatHistory.push(userInput);
        if (chatHistory.length > 10) {
            chatHistory.shift(); // 최대 10개까지만 저장
        }
            if (youtubeIframe) {
                youtubeIframe.remove();
                youtubeIframe = null;
                youtubeVideoVisible = false;
            }
        }
        
        userInputBox.value('');
    }

    if (chatMessages.length > maxMessages * 2) {
        chatMessages.shift();
    }
}

// 챗봇 응답
function getBotResponse(userInput) {
    if (userInput.includes("안녕")) return "안녕하세요!";
    else if (userInput.includes("날씨")) return "오늘의 날씨는 맑고 20도입니다.";
    else if (userInput.includes("김영주")) return "과학 기술과 예술을 융합하여 게임, 디바이스, 로봇과 같은 움직이는 것을 만드는 사람입니다!";
    else if (userInput.includes("버추얼")) return "가상과 관련된 용어를 뜻하나 최근엔 '버추얼 유튜버', '버추얼 아이돌'등 여러 방면에서 활동하는 가상인물을 칭하기도 한다.";
    else return "잘 이해하지 못했어요.";
}

// 채팅 내용 공유 기능 (콘솔에 복사)
function shareChat() {
    let chatText = chatMessages.map(msg => `${msg.sender === 'user' ? '사용자' : '챗봇'}: ${msg.message}`).join("\n");
    navigator.clipboard.writeText(chatText);
    alert("채팅 내용이 복사되었습니다!");
}

function showFirstImage() {
    img = createImg('asset/zomv.png', '첫 번째 이미지'); // 첫 번째 이미지 로드
    img.size(600, 500);
    img.position((windowWidth - 600) / 2, lastMessageYPosition + 180);

    // ✅ 10초 후 두 번째 이미지로 변경
    imgTimer = setTimeout(() => {
        showSecondImage();
    }, 5000);  // 10초 후 실행
}

function showSecondImage() {
    if (img) {
        img.remove(); // 기존 이미지 삭제
    }

    img = createImg('asset/U.png', '두 번째 이미지'); // 두 번째 이미지 로드
    img.size(700, 360);
    img.position((windowWidth - 700) / 2, lastMessageYPosition + 100);
}

function showThirdImage() {
    if (img) {
        img.remove(); // 기존 이미지 삭제
    }

    img = createImg('asset/M.png', '3 번째 이미지'); // 두 번째 이미지 로드
    img.size(700, 400);
    img.position((windowWidth - 700) / 2, lastMessageYPosition + 180);

    imgTimer = setTimeout(() => {
        showFourthImage();
    }, 4000);  // 10초 후 실행
}

function showFourthImage() {
    if (img) {
        img.remove(); // 기존 이미지 삭제
    }

    img = createImg('asset/M3.png', '4 번째 이미지'); // 두 번째 이미지 로드
    img.size(900, 300);
    img.position((windowWidth - 900) / 2, lastMessageYPosition + 100);

    imgTimer = setTimeout(() => {
        showFiveImage();
    }, 4000);  // 10초 후 실행
}

function showFiveImage() {
    if (img) {
        img.remove(); // 기존 이미지 삭제
    }

    img = createImg('asset/M0.jpg', '5 번째 이미지'); // 두 번째 이미지 로드
    img.size(500, 550);
    img.position((windowWidth - 500) / 2, lastMessageYPosition + 100);
}

function playVideo() {
    if (myVideo) {
        myVideo.remove(); // 기존 비디오 제거
    }

    myVideo = createVideo(['asset/trsnsition.mp4']); // 경로에 있는 비디오 파일
    myVideo.size(600, 600);
    myVideo.position((windowWidth - 600) / 2, lastMessageYPosition + 180);
    myVideo.autoplay(true);
    myVideo.elt.muted = true; // 자동재생
    myVideo.loop();
}

function playVideo2() {
    if (myVideo) {
        myVideo.remove(); // 기존 비디오 제거
    }

    myVideo = createVideo(['asset/NCA.mp4']); // 경로에 있는 비디오 파일
    myVideo.size(900, 600);
    myVideo.position((windowWidth - 900) / 2, lastMessageYPosition + 140);
    myVideo.autoplay(true);
    myVideo.loop();
    myVideo.volume(1.0);  // ✅ 소리 활성화 (최대 음량)
    
}

// 유튜브 영상 직접 재생
function displayYoutubeVideo() {
    // 이미 영상이 있는 경우 새로 만들지 않음
    if (youtubeIframe) {
        youtubeIframe.remove();
    }
    
    // 유튜브 iframe 삽입
    youtubeIframe = createElement('iframe');
    youtubeIframe.attribute('width', '560');
    youtubeIframe.attribute('height', '315');
    youtubeIframe.attribute('src', 'https://www.youtube.com/embed/ptbFwS01E9E?si=bVGx1YhT5BAEoZGK'); // 예시: 유튜브 영상 URL
    youtubeIframe.attribute('frameborder', '0');
    youtubeIframe.attribute('allowfullscreen', '');
    
    // 유튜브 영상 위치 설정: 채팅 메시지 마지막 위치 아래에 표시
    youtubeIframe.position((windowWidth - 560) / 2, lastMessageYPosition + 180); // 채팅 메시지 간격에 맞춰 위치 설정
    youtubeIframeHeight = 315; // 유튜브 영상 높이 설정
    youtubeVideoVisible = true; // 영상이 보였다는 상태 추적
}

function displayYoutubeVideo2() {
    // 이미 영상이 있는 경우 새로 만들지 않음
    if (youtubeIframe) {
        youtubeIframe.remove();
    }
    
    // 유튜브 iframe 삽입
    youtubeIframe2 = createElement('iframe');
    youtubeIframe2.attribute('width', '640');
    youtubeIframe2.attribute('height', '360');
    youtubeIframe2.attribute('src', 'https://www.youtube.com/embed/FjphlA3k5S4?si=TtUwSndy1mituKJ2'); // 예시: 유튜브 영상 URL
    youtubeIframe2.attribute('frameborder', '0');
    youtubeIframe2.attribute('allowfullscreen', '');
    
    // 유튜브 영상 위치 설정: 채팅 메시지 마지막 위치 아래에 표시
    youtubeIframe2.position((windowWidth - 640) / 2, lastMessageYPosition + 180); // 채팅 메시지 간격에 맞춰 위치 설정
}

// 화면 그리기
function draw() {
    background(darkMode ? 30 : 240); // 다크 모드 배경
    fill(darkMode ? 200 : 50);
    textSize(20);
    textAlign(CENTER);
       
    // 현재까지 입력된 텍스트 표시
    text(displayText, width / 2, 40);
    
    fill(0);
    textSize(20);
    textAlign(LEFT, TOP);

    let textBoxWidth = 1000; // 고정된 텍스트 박스 너비
    let textBoxHeight = 30;

    let chatBoxX = (windowWidth - textBoxWidth) / 2; // X축 중앙 정렬
    
    let yPosition = chatBoxYStart; // 메시지 시작 위치

    let recentMessages = chatMessages.slice(-6); 

    for (let i = 0; i < recentMessages.length; i++) {
        let msg = recentMessages[i];
        let textBoxWidth = 1000;
        let textBoxHeight = 30;

        if (msg.sender === 'user') {
            fill(200, 230, 255);
            rect(chatBoxX, yPosition, textBoxWidth, textBoxHeight, 10);
            fill(0);
            text(`사용자: ${msg.message}`, chatBoxX + 10, yPosition + 7);
        } else {
            fill(255, 220, 220);
            rect(chatBoxX, yPosition, textBoxWidth, textBoxHeight, 10);
            fill(0);
            text(`챗봇: ${msg.message}`, chatBoxX + 10, yPosition + 8);
        }

        yPosition += textBoxHeight + 10; // 다음 메시지 위치로 이동

        fill(100);
        textSize(22);
        let historyX = windowWidth * (6 / 7); // 화면의 3/1 위치
        text("📜 지난 대화 목록", historyX, 100);
        
        fill(100);
        textSize(18);
        let historyY = 140;
        for (let i = chatHistory.length - 1; i >= 0; i--) {
            text("- " + chatHistory[i], historyX, historyY);
            historyY += 30;
        }
    }


    lastMessageYPosition = yPosition;

}


function keyPressed() {
    if (key === ' ' && charIndex < fullText.length) {
        displayText += fullText[charIndex]; // 한 글자 추가
        charIndex++;
    }
    if (keyCode === ENTER || keyCode === RETURN) {
        sendMessage();
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    userInputBox.position((windowWidth - (1000 + 100 + 100 + 20)) / 2, height - 50);
    inputButton.position(userInputBox.x + userInputBox.width + 10, height - 50);
    shareButton.position(inputButton.x + inputButton.width + 10, height - 50);
    chatBoxX = (windowWidth - textBoxWidth) / 2;
    img.position((windowWidth - 600) / 2, lastMessageYPosition + 180);
    img.position((windowWidth - 700) / 2, lastMessageYPosition + 100);

}
