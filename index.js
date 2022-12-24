document.addEventListener(`DOMContentLoaded`, async () => {
	
	let dragHandler = e => {
		e.preventDefault();
		e.stopPropagation();
	
		if (e.type == `drop` && e.dataTransfer.files[0].type.startsWith(`image/`)) {
			document.querySelector(`#file-select`).files = e.dataTransfer.files;
			document.querySelector(`#file-select`).dispatchEvent(new Event(`change`));
		}
		
		if (['dragenter', 'dragover'].includes(e.type)) {
			document.querySelector(`.drop-area`).classList.add(`drop-hover`);
		} else {
			document.querySelector(`.drop-area`).classList.remove(`drop-hover`);
		}
	}
	
	['dragenter', 'dragover', 'dragleave', 'drop'].forEach(e =>	document.querySelector(`.drop-area`).addEventListener(e, dragHandler, false));
	
	
	document.querySelector(`.drop-area`).addEventListener(`click`, () => {
		document.querySelector(`.drop-area > label`).click()
	});
	
	document.querySelector(`#file-select`).addEventListener(`change`, e => {
		const imgDisplay = document.querySelector(`.drop-image-display`);
		const dropArea = document.querySelector(`.drop-area`);
		
		if (!e.target.files) return;
		
		let objectUrl = URL.createObjectURL(e.target.files[0]);
		
		imgDisplay.src = objectUrl;
		dropArea.classList.add(`with-image`);
		
		if (imgDisplay.naturalHeight < 65) {
			imgDisplay.classList.add("pixelated");
		} else {
			imgDisplay.classList.remove("pixelated");
		}
		
		URL.revokeObjectURL(objectUrl);
	});
	
	document.querySelector(`.drop-image-display`).addEventListener(`load`, e => {
		const imgDisplay = document.querySelector(`.drop-image-display`);
		
		if (imgDisplay.naturalHeight < 65) {
			imgDisplay.classList.add("pixelated");
		} else {
			imgDisplay.classList.remove("pixelated");
		}
		
		console.log(e);
	});
	
	if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
		document.querySelector("html").dataset.theme = "dark";
	}
	
	const CHARS_BLOCKS = [`█`, `▓`, `▒`, `░`];
	const CHARS_LETTERS = [...`abcdefghijklmnopqrstuvwxyz`];
	const CHARS_UPPERCASE_LETTERS = [...`ABCDEFGHIJKLMNOPQRSTUVWXYZ`];
	const CHARS_NUMBERS = [`0`, `1`, `2`, `3`, `4`, `5`, `6`, `7`, `8`, `9`];
	const CHARS_SPECIAL = [`!`, `@`, `#`, `$`, `%`, `^`, `&`, `*`, `(`, `)`, `-`, `+`, `_`, `=`];
	
	const refreshOutput = () => {
		let width = Number(document.querySelector(`#width`).value),
			invertImg = document.querySelector(`#invert-img`).checked,
			doubleChar = document.querySelector(`#double-char`).checked;
		
		let allowedCharArrays = []
		
		if (document.querySelector(`#blocks`).checked)
			allowedCharArrays.push(CHARS_BLOCKS);
		if (document.querySelector(`#space`).checked)
			allowedCharArrays.push(` `);
		if (document.querySelector(`#alphanumeric`).checked)
			allowedCharArrays.push(CHARS_LETTERS, CHARS_UPPERCASE_LETTERS, CHARS_NUMBERS);
		//if (document.querySelector(`#special`).checked)
		//	allowedCharArrays.push(CHARS_LETTERS, CHARS_UPPERCASE_LETTERS, CHARS_NUMBERS);
		
		if (width < 2) {
			document.querySelector(`.main-container > textarea`).value = "ERROR: WIDTH must be greater than 1";
			return;
		}
		
		console.log([...new Set(allowedCharArrays.flat())])
		
		generatedText = ASCIIArtGenerator.generateText(
			document.querySelector(".drop-image-display"),
			width,
			[...new Set(allowedCharArrays.flat())],
			invertImg,
			doubleChar
		);
		
		document.querySelector(`.main-container > textarea`).value = generatedText;
	}
	document.querySelector(`.drop-image-display`).addEventListener(`load`, refreshOutput);
	document.querySelector(`.settings`).addEventListener(`change`, refreshOutput);
});