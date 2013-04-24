/**
 * Provides business logic to handle a simple image editor.
 *
 * @author Mike Hart
 * @copyright MIT Style
 * @version 0.0.1
 */
var ImageEditor = function() {
	var attachControlListeners = function () {
		document.getElementById("control_stage_width").addEventListener("keyup", stageWidthKeyUpEventHandler, false);
		document.getElementById("control_stage_height").addEventListener("keyup", stageHeightKeyUpEventHandler, false);
		document.getElementById("btn_control_add_text").addEventListener("click", addTextEventHandler, false);
		document.getElementById("btn_control_save").addEventListener("click", saveStageEventHandler, false);

		var addableImages = document.getElementsByClassName("addable-image");

		for (var i = 0; i < addableImages.length; i++) {
			addableImages[i].addEventListener("click", addImageEventHandler, false);
		}
	};

	var saveStageEventHandler = function (e) {
		e.stopPropagation();

		obj.stage.toDataURL({
			callback : function(url) {
				console.log(url);

				$.post(
					"savehandler.php", 
					{ data: url },
	            	function(data) {
	        			console.log(data);
	                	alert("Your Design Was Saved To The Server");
	            	}
	        	);
			}
		});
	};

	var addImageEventHandler = function (e) {
		var imageObj = new Image();
		var layer = new Kinetic.Layer();
		var target = e.target || window.event.target;
		var desiredWidth = window.prompt("Please enter a width in pixels", "100");
		var desiredHeight = window.prompt("Please enter a height in pixels", "100");

		imageObj.onload = function () {
			var kimage = new Kinetic.Image({
				x : 10,
				y : 10,
				image : imageObj,
				width : desiredWidth,
				height : desiredHeight,
				draggable : true
			});

			kimage.on("dblclick", deleteObject);

			layer.add(kimage);
			obj.stage.add(layer);
		};

		imageObj.src = target.src;
	};

	var addTextEventHandler = function (e) {
		e.stopPropagation();

		var textField = document.getElementById("control_add_text");
		var fontField = document.getElementById("control_add_text_font");
		var sizeField = document.getElementById("control_add_text_size");
		var colorField = document.getElementById("control_add_text_color");

		if (textField.value.length === 0) {
			alert("Please enter at least one character.");
		}

		var text = new Kinetic.Text({
			x : 10,
			y : 10,
			text : textField.value,
			fontSize : sizeField.value,
			fontFamily: fontField.value,
			fill : colorField.value,
			draggable : true
		});

		text.on("dblclick", deleteObject);

		var layer = new Kinetic.Layer();
		layer.add(text);
		obj.stage.add(layer);
	};

	var deleteObject = function () {
		this.getLayer().remove(this);
	};

	var stageWidthKeyUpEventHandler = function (e) {
		var target = e.target || window.event.srcElement;
		var value = target.value;

		if (isNaN(value)) {
			target.value = "";
			alert("Please enter a number");
		} else {
			obj.stage.setWidth(value);
		}

		return obj.stage;
	};

	var stageHeightKeyUpEventHandler = function (e) {
		var target = e.target || window.event.srcElement;
		var value = target.value;

		if (isNaN(value)) {
			target.value = "";
			alert("Please enter a number");
		} else {
			obj.stage.setHeight(value);
		}

		return obj.stage;
	};

	var obj = {
		stage : new Kinetic.Stage({
			container : "container",
			width : 400,
			height : 300
		}),

		layer : new Kinetic.Layer(),

		initialise : function () {
			attachControlListeners();
			this.stage.add(this.layer);
		}
	};

	return obj;
};