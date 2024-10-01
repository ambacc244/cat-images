# Cat Images

## 목표
Vanilla JS로 100개의 고양이 이미지를 받아오는 페이지와 이미지 상세 모달 페이지 개발


## 프로젝트 구성
+ src : 페이지 구현을 위한 주요 코드 위치
  + index.html 
  + scripts : event 구현을 위한 js 스크립트 파일
  + styles: 스타일 적용을 위한 css 파일
    
## 개발 내용
+ Pagination
  + api 호출 중에 빈페이지 Skeleton 처리
  + image loading Skeleton 처리
  + 보통은 api 호출시 Content-Range로 값으로 MAX_PAGE를 계산하지만 api에서 확인되지 않음으로 임의의 값(20)으로 세팅 
+ image 클릭 DialogBox 이벤트
+ prettier, eslint 설정 적용
+ 기타 사용 라이브러리 : axios
