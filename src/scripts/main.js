import debounce from './debounce.js';

let currentPage = 0;
const MIN_PAGE = 0;
const MAX_PAGE = 20; //보통은 api 호출시 Content-Range로 값을 계산하지만 api에서 확인되지 않음으로 임의의 값으로 set
const NUMBER_OF_IMAGES = 100;
const REQUEST_LIMIT = 10;

/********************************************
 * api 호출로 images 정보 가져오기
 ********************************************/
const getImages = async () => {
	const data = await Promise.allSettled(
		Array.from({length: Math.ceil(NUMBER_OF_IMAGES / REQUEST_LIMIT)}, (x, i) =>
			axios.get('https://api.thecatapi.com/v1/images/search', {
				params: {limit: REQUEST_LIMIT, page: currentPage * REQUEST_LIMIT + i},
			}),
		),
	);

	return data
		.filter((v) => v.status === 'fulfilled')
		.map((v) => v.value.data)
		.flat();
};

/********************************************
 * DialogBox 열기
 ********************************************/
const openDialogBox = (image) => {
	document.getElementById('dialog-box-image').src = image.url;
	document.getElementById('dialog-box-overlay').style.display = 'flex';
};

/********************************************
 * DialogBox 닫기
 ********************************************/
const closeDialogBox = (e) => {
	const overlay = document.getElementById('dialog-box-overlay');
	const closeButton = document.getElementById('dialog-box-close-button');

	if (e.target !== overlay && e.target !== closeButton) return;

	document.getElementById('dialog-box-overlay').style.display = 'none';
};

/********************************************
 * image 받아오는 동안 skeleton 출력
 ********************************************/
const loadSkeletons = () => {
	const skeletons = document.getElementById('images');
	skeletons.innerHTML = '';

	for (let i = 0; i < NUMBER_OF_IMAGES; i++) {
		const skeleton = document.createElement('div');
		skeleton.classList.add('skeleton');
		skeletons.appendChild(skeleton);
	}
};

/********************************************
 * 받아온 이미지 화면에 그리기 (drawing 중인 이미지는 skeleton)
 ********************************************/
const loadImages = async () => {
	try {
		//이미지 로드 전 화면에 skeleton 출력
		loadSkeletons();

		const imagesData = await getImages();
		const imagesElement = document.getElementById('images');
		imagesElement.innerHTML = '';

		imagesData.map((imageData) => {
			let image = document.createElement('img');
			image.src = `${imageData.url}`;
			image.loading = 'lazy';
			image.addEventListener('click', () => openDialogBox(imageData));

			let wrapper = document.createElement('div');
			wrapper.classList.add('image-wrapper', 'skeleton');

			wrapper.appendChild(image);
			imagesElement.appendChild(wrapper);
		});
	} catch (e) {
		const imagesElement = document.getElementById('images');
		imagesElement.innerHTML = '';

		window.alert('예상하지 못한 문제가 발생하였습니다.');
	}
};

/********************************************
 * page 번호 변경
 ********************************************/
const onClickChangePage = debounce((diff) => {
	console.log(diff);
	let value = currentPage + diff;
	if (value < MIN_PAGE) value = MIN_PAGE;
	if (value > MAX_PAGE) value = MAX_PAGE;

	if (value === currentPage) return;
	currentPage = value;

	document.getElementById('prev').disabled = currentPage === MIN_PAGE;
	document.getElementById('next').disabled = currentPage === MAX_PAGE;
	//현 페이지 변경후 이미지 재 로드
	loadImages();
}, 300);

//page 변경을 위한 이벤트 핸들러
document
	.getElementById('prev')
	.addEventListener('click', () => onClickChangePage(-1));
document
	.getElementById('next')
	.addEventListener('click', () => onClickChangePage(1));

//DialogBox 이벤트 핸들러
document
	.getElementById('dialog-box-overlay')
	.addEventListener('click', closeDialogBox);
document
	.getElementById('dialog-box-close-button')
	.addEventListener('click', closeDialogBox);

//첫 페이지 이미지 로딩
loadImages();
