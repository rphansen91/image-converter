(function () {
	var converter = new Converter()
	var calculator = new Calculator()
	var input = {}

	document.onload = initialize()

	function initialize () {
		input.reader = new FileReader()
		input.element = document.getElementById("imageInput")
		input.imageBefore = document.getElementById("imageBefore")
		input.imageAfter = document.getElementById("imageAfter")

		input.canvas = document.createElement("canvas")
		input.canvasCtx = input.canvas.getContext("2d")
		input.canvas.width = 600;
		input.canvas.height = 600;

		input.imageBefore.onload = function () {

			input.canvasCtx.drawImage(
				input.imageBefore, 
				calculator.getPosition(input.imageBefore).x,
				calculator.getPosition(input.imageBefore).y,
				calculator.getSize(input.imageBefore),
				calculator.getSize(input.imageBefore),
				0, 0, 
				input.canvas.width, 
				input.canvas.height
			)

			input.canvasCtx.transform(1, 0, 0, 1, 0, 0);
			input.canvasCtx.transform(-1, 0, 0, 1, input.canvas.width, 0);
			input.canvasCtx.transform(-1, 0, 0, -1, input.canvas.width, input.canvas.height );
			input.canvasCtx.transform(1, 0, 0, -1, 0, input.canvas.height );
			input.canvasCtx.transform(0, 1, 1, 0, 0, 0);
			input.canvasCtx.transform(0, 1, -1, 0, input.canvas.height , 0);
			input.canvasCtx.transform(0, -1, -1, 0, input.canvas.height , input.canvas.width);
			input.canvasCtx.transform(0, -1, 1, 0, 0, input.canvas.width);

			imageAfter.src =  input.canvas.toDataURL("image/jpeg", 0.8)
		}

		input.reader.onload = function (event) {
			input.imageBefore.src = event.target.result
		}

		input.element.onchange = function (event) {
			if (event.target && event.target.files) {
				input.reader.readAsDataURL(event.target.files[0])
			}	
		}
	}

	function Calculator () {
		var calc = this;

		this.getPosition = function (image) {
			return {
				y: (image.width < image.height)?((image.height - image.width)/2):0,
				x: (image.width > image.height)?((image.width  - image.height)/2):0
			}
		}

		this.getSize = function (image) {
			return Math.min(image.height, image.width)
		}

		return this;
	}

	function Converter () {
		var ref = this;

		ref.worker = false;

		ref.init = function () {
			ref.worker = (window.Worker)?new window.Worker("./worker.js"):false;
			ref.worker.onmessage = ref.finished
		}

		ref.sendFile = function (file) {
			if (ref.worker) {
				ref.worker.postMessage(file)
			}
		}

		ref.finished = function (data) {
			console.log(data)
		}

		ref.init()

		return this;
	}
})()