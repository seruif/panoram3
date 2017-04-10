var panoramConfig;
var panoramController;
X.LoadConfig(pannellumConfig, '/static/panoram3/images/', '.jpg', '7-1-enter', function(pnrmConfig) {
    panoramConfig = pnrmConfig;
    panoramController = new X.PanoramController(panoramConfig, gameConfig, {startTimeout: 1500, walkTimeout: 30000, speed: 10});
	//deadZone, axesSpeed, radius
    panoramController = X.GamePadPanoramSetEvents(0.1, 0.7, 2, panoramController);

    $('#newgame').show();
    $('#nstu').show();
});

// var xhr = new XMLHttpRequest();
// var burl = location.origin+'/static/panoram3/images/7-1-enter.jpg';
// xhr.open('GET', burl, true);
// xhr.responseType = 'blob';
// xhr.onload = function(e) {
//     if (this.status == 200) {
//         // var blob = this.response;
//         var urlCreator = window.URL || window.webkitURL;
//         var imageUrl = urlCreator.createObjectURL(this.response);
//         console.log(imageUrl);
//     }
// };
// xhr.onerror = function (e) {
//   console.error(e);
// };
// xhr.send();