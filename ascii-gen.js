window.ASCIIArtGenerator = {
	generateText: (image, width, allowedChars, invertImage = false, doubleChar = false) => {
		
		const calculateAverageCharColor = char => {
            const canvas = document.createElement(`canvas`);
            let ctx = canvas.getContext(`2d`);
            
            canvas.width = 16;
            canvas.height = 32;
            
			// white background
            ctx.fillStyle = "#ffffffff";
            ctx.fillRect(0, 0, 16, 32);

			// draw the char
            ctx.font = `32px monospace`;
            ctx.imageSmoothingEnabled = false;
            ctx.fillStyle = "#000000ff";
            ctx.fillText(char, 0, 32);
            
            const data = ctx.getImageData(0, 0, 16, 32).data;
            let colorSum = 0;

            // the canvas should be grayscale, so we can ignore the G, B, and A channels
			// since in grayscale, R == G == B
            for (let i = 0; i < data.length; i++) {
                if (i % 4 == 0) // only use the first component (R)
                    colorSum += data[i];
            }
            
            return colorSum / 512; // 512 = 16*32
		}
		
		const allowedCharColors = []
		for (char of allowedChars) {
			if (!char in ASCIIArtGenerator.calculatedCharacters) {
				ASCIIArtGenerator.calculatedCharacters[char] = calculateAverageCharColor(char);
			}
			
			allowedCharColors.push(ASCIIArtGenerator.calculatedCharacters[char])
		}
		
		const imgRatio = image.naturalWidth / image.naturalHeight;
		const height = width / imgRatio;
		
		const canvas = document.createElement(`canvas`);
		const ctx = canvas.getContext(`2d`);
		
		canvas.height = height;
		canvas.width = width;
		
		ctx.filter = 'grayscale(1)';
		ctx.drawImage(image, 0, 0, width, height);

		let text = "";
		
		const imgData = ctx.getImageData(0, 0, width, height);
		const data = imgData.data;
		
		for (let y = 0; y < height; y++) {
			
			for (let x = 0; x < width; x++) {
				let color = data[((y * imgData.width) + x) * 4]; // only use the R component, as the image is in grayscale
			
				if (invertImage) {
					color = 255 - color;
				}
			
				const closestColor = Object.values(allowedCharColors)
					.reduce((prev, curr) => Math.abs(curr - color) < Math.abs(prev - color) ? curr : prev);
				
				const closestChar = allowedChars[allowedCharColors.indexOf(closestColor)];
				
				text += closestChar;
				if (doubleChar) 
					text += closestChar;
			}
			
			text += "\n";
		}
		
		return text;
	},
	
	// Characters with already calculated average colors
	calculatedCharacters: {
		"█": 23.90625,
		"▓": 45.4375,
		"▒": 176.703125,
		"░": 212.515625,
		" ": 255
	}
}