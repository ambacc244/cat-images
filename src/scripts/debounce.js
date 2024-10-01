const debounce = (callbackFunc, delay = 300) => {
	let timer;

	return (props) => {
		if (timer) clearTimeout(timer);

		timer = setTimeout(() => {
			callbackFunc(props);
		}, delay);
	};
};

export default debounce;
