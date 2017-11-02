"use strict";
var TEST = {};

TEST.Game = class {
	constructor() {
		this.screenHeight = 180;
		this.screenWidth = 320;
		this.options = {};

		window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, (m,key,value) => {
			this.options[key] = value;
		});
	}

	start() {
		if(
			!me.video.init( this.screenWidth, this.screenHeight, {
				wrapper: "screen",
				scale: this.options.scale || 'auto',
				scaleMethod: 'fit',
			})
		) {
			alert("This game is too cool for your browser, try a different one!");
		}

		me.audio.init("m4a,ogg");

		if(this.options.mute) {
			me.audio.muteAll();
		}

		// Set up our screen states
		Object.keys(TEST.Game.States).forEach((name) => {
			var className = name + "Screen"
			var classDefinition = TEST[className];
			if(!classDefinition) {
				console.warn(`FYI: You have no definition for ${name} screen.`);
			}
			else {
				me.state.set(
					TEST.Game.States[name],
					new (Function.prototype.bind.call(classDefinition))()
				);
			}
		});

		this.bindInput();

		me.loader.preload(this.resources(), this.onLoad.bind(this));
		me.state.change(TEST.Game.States.Loading);
	}

	bindInput() {
		var inputs = {
			left:  {
				keys: [me.input.KEY.LEFT, me.input.KEY.A],
				pad:  [me.input.GAMEPAD.BUTTONS.LEFT],
			},
			right: {
				keys: [me.input.KEY.RIGHT, me.input.KEY.D],
				pad:  [me.input.GAMEPAD.BUTTONS.RIGHT],
			},
			up: {
				keys: [me.input.KEY.UP, me.input.KEY.W],
				pad:  [me.input.GAMEPAD.BUTTONS.UP],
			},
			down: {
				keys: [me.input.KEY.DOWN, me.input.KEY.S],
				pad:  [me.input.GAMEPAD.BUTTONS.DOWN],
			},
			start: {
				keys: [me.input.KEY.ENTER, me.input.KEY.X],
				pad:  [me.input.GAMEPAD.BUTTONS.FACE_3, me.input.GAMEPAD.BUTTONS.START],
			},
		};

		Object.keys(inputs).forEach(function(k) {
			inputs[k].keys.forEach(function(code) {
				me.input.bindKey(code, k, true);
			})
			if(me.input.GAMEPAD) {
				inputs[k].pad.forEach(function(code) {
					me.input.bindGamepad(
						0,
						{
							type: 'buttons',
							code: code,
						},
						inputs[k].keys[0]
					);
				});
			}
		});
	}

	image(name) {
		return {
			name : name,
			type : "image",
			src  : `data/${name}.png`,
		}
	}

	audio(name) {
		return {
			name: name,
			type: "audio",
			src: "data/audio/",
			channels: 2,
		};
	}


TEST.Game.States = {
	Loading:  0 + me.state.USER,
	Intro:    1 + me.state.USER,
	Play:     2 + me.state.USER,
	Title:    3 + me.state.USER,
	Win:      6 + me.state.USER,
	GameOver: 7 + me.state.USER,
	Level:    8 + me.state.USER,
}

var game = new TEST.Game();

// Bind the game to the dom.
window.onReady(game.start.bind(game));
