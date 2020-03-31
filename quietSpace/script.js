window.onload = function () {
    "use strict";
    var path;
    var report = 0;
    
    var soundAllowed = function (stream) {
        //Audio stops listening in FF without // window.persistAudioStream = stream;
        //https://bugzilla.mozilla.org/show_bug.cgi?id=965483
        //https://support.mozilla.org/en-US/questions/984179
        window.persistAudioStream = stream;
        var audioContent = new AudioContext();
        var audioStream = audioContent.createMediaStreamSource( stream );
        var analyser = audioContent.createAnalyser();
        audioStream.connect(analyser);
        analyser.fftSize = 1024;

        var frequencyArray = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteTimeDomainData(frequencyArray);


        var doDraw = function () {
            requestAnimationFrame(doDraw);
            analyser.getByteFrequencyData(frequencyArray);

            var arrSum = function(arr){
                return arr.reduce(function(a,b){
                return a + b
                }, 0);
            }
            var averageVol = arrSum(frequencyArray)/512;

            var size = averageVol * 100; 
            //var size = 100 + frequencyArray[0]*10;

            //document.getElementById("viz-box").innerHTML = frequencyArray[0];
            document.getElementById("viz-box").style.backgroundColor = "blue";
            document.getElementById("viz-box").style.width = size + "px";
            document.getElementById("viz-box").style.height = size + "px";
            document.getElementById("viz-box").style.borderRadius = size/2 + "px";
        }
        doDraw();
    }

    var soundNotAllowed = function (error) {
        console.log(error);
    }

    /*window.navigator = window.navigator || {};
    /*navigator.getUserMedia =  navigator.getUserMedia       ||
                              navigator.webkitGetUserMedia ||
                              navigator.mozGetUserMedia    ||
                              null;*/
    navigator.getUserMedia({audio:true}, soundAllowed, soundNotAllowed);

};