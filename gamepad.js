X.GamePad = function (deadZone) {

    var gamepad = undefined;

    var onConnected = function(id) {
        if (this.onConnected)
            this.onConnected(id);
    };
    onConnected = onConnected.bind(this);

    var onDisconnected = function(id) {
        if (this.onDisconnected)
            this.onDisconnected(id);
    };
    onDisconnected = onDisconnected.bind(this);

    window.addEventListener("gamepadconnected", function (e) {
        console.log("Gamepad connected [%s] %d buttons, %d axes.",
            e.gamepad.id, e.gamepad.buttons.length, e.gamepad.axes.length);

        gamepad = e.gamepad;
        onConnected(gamepad.id);
    });

    window.addEventListener("gamepaddisconnected", function (e) {
        console.log("Gamepad disconnected from [%s]", e.gamepad.id);
        onDisconnected(gamepad.id);
        gamepad = undefined;
    });

    this.getGamePad = function () {
      return gamepad;
    };

    this.connected = function () {
        return gamepad != void 0;
    };

    var buttonPressed = function(b) {
        if (typeof(b) == "object") {
            return b.pressed;
        }
        return b == 1.0;
    };

    var buttonEvents = {};

    this.setButtonEvent = function(b, callback) {
        buttonEvents[b] = callback;
    };

    var axisEvents = {};

    this.resetAxesEvents = function() {
        axisEvents = {};
    };

    this.setAxisEvent = function (n, x, y, mx, my, callback) {
        n = n * 2;
        axisEvents[n] = {conf:{x:x, y:y, mx:mx, my:my}, callback: callback};
    };

    var prevButton = undefined;
    var gameLoop = function() {
        requestAnimationFrame(gameLoop);

        var gp = gamepad;

        if (!gp) return;

        for (var a = 0; a < gp.axes.length; a += 2) {
            if (!axisEvents[a])
                continue;

            var event = axisEvents[a];

            var x = gp.axes[a + event.conf.x] * event.conf.mx;
            var y = gp.axes[a + event.conf.y] * event.conf.my;

            if (Math.abs(x) > deadZone || Math.abs(y) > deadZone) {
                event.callback(x, y);
                // console.log('gamePad.axes[%s]: %s %s', a, x, y);
            }
        }

        for (var b in gp.buttons) {
            var button = gp.buttons[b];

            if (!button.pressed && prevButton == b)
                prevButton = undefined;

            if (button.pressed)
                console.log('gamePad.button[%s].pressed', b);

            if (!buttonEvents[b])
                continue;

            if (button.pressed && prevButton != b) {
                prevButton = b;
                buttonEvents[b]();
                return;
            }

        }
    };

    gameLoop();
};