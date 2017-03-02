
    // https://github.com/evilstreak/markdown-js
    function Editor(input, preview) {
        this.update = function () {
            preview.innerHTML = exports.toHTML(input.value);
        };
        input.editor = this;
        this.update();
    }

    new Editor($("#infoContent")[0], $("#infoFormatted")[0]);


    var startMillis;
    var running = false;

    var maxDurMain,
        maxDurRead;

    var timer = new interval(50, stepDown);
    
    /*
    *  Variablen für Manipulation von CSS
    *
    *
    */
    var infoPadding = 3,
        blockSpacing = 4;

    function stepDown() {
        var diff = Date.now() - startMillis;

        $('#timerMain').html(diffToTime(maxDurMain - diff, true));
        $('#timerRead').html(diffToTime(maxDurRead - diff, false));
    }


    function resetTimer() {
        timer.stop();
        maxDurMain = (
            (parseInt($("#mainHrs").val()) * 3600) +
            (parseInt($("#mainMin").val()) * 60) +
            (parseInt($("#mainSec").val()))) * 1000;

        maxDurRead = (
            (parseInt($("#readHrs").val()) * 3600) +
            (parseInt($("#readMin").val()) * 60) +
            (parseInt($("#readSec").val()))) * 1000;

        $('#timerMain').html(diffToTime(maxDurMain, false));
        $('#timerRead').html(diffToTime(maxDurRead, false));
    }


    function startTimer() {

        if (!($("#timerMain").html() == "00:00:00")) {
            var maxDurMain = parseDuration("#timerMain") //(
            // (parseInt($("#mainHrs").val()) * 3600) +
            //(parseInt($("#mainMin").val()) * 60) +
            //(parseInt($("#mainSec").val()))) * 1000;

            var maxDurRead = parseDuration("#timerRead") //(
            //(parseInt($("#readHrs").val()) * 3600) +
            //(parseInt($("#readMin").val()) * 60) +
            //(parseInt($("#readSec").val()))) * 1000;

            startMillis = Date.now();
            timer.run();
        }

        if ($('#settings').is(':visible')) {
            toggleSettingsOverlay();
        }
    }

    function showAddTimePane(elem) {
        var pane = $("#addTimePane");

        //pane.offset($(elem).offset());
        pane.show();
    }

    function addTime() {
        toggleSettingsOverlay();

        addedTime = (
            (parseInt($("#addedHrs").val()) * 3600) +
            (parseInt($("#addedMin").val()) * 60) +
            (parseInt($("#addedSec").val()))) * 1000;

        startMillis += addedTime;


    }

    function diffToTime(diff, main) {
        if (diff < 0) {
            if (main) magicFix(true, timer.stop.bind(timer), false);
            return "00:00:00"
        }

        var hrs = Math.floor(diff / 3600000);
        var min = Math.floor((diff % 3600000) / 60000);
        var sec = Math.floor((diff % 60000) / 1000);

        return (hrs < 10 ? "0" + hrs : hrs) + ":" + (min < 10 ? "0" + min : min) + ":" + (sec < 10 ? "0" + sec : sec);
    }

    function parseDuration(from) {
        var durStr = $(from).html();
        //alert(durStr);
        var durArr = durStr.split(":");
        // alert(durArr);
        // alert(((parseInt(durArr[0]) * 3600) +
        //     (parseInt(durArr[1]) * 60) +
        //    (parseInt(durArr[2]))) * 1000);
        return (((parseInt(durArr[0]) * 3600) +
        (parseInt(durArr[1]) * 60) +
        (parseInt(durArr[2]))) * 1000);
    }


    function toggleReadTimer() {
        if (!$('#readEnabled')[0].checked) {
            $('#timerRead').hide();
            $('#readLabel').hide();
        }
        else {
            $('#timerRead').show();
            $('#readLabel').show();
        }

    }


    // https://gist.github.com/manast/1185904
    function interval(duration, fn) {
        this.baseline = undefined;

        this.run = function () {
            if (this.baseline === undefined) {
                this.baseline = new Date().getTime();
            }
            fn();
            var end = new Date().getTime();
            this.baseline += duration;

            var nextTick = duration - (end - this.baseline);
            if (nextTick < 0) {
                nextTick = 0
            }
            (function (i) {
                i.timer = setTimeout(function () {
                    i.run(end)
                }, nextTick)
            }(this))
        };

        this.stop = function () {
            clearTimeout(this.timer)
        }
    }


    function toggleToilet() {
        if ($('#toiletLabel').html() == "frei") {
            $('#toiletLabel').html("besetzt");


        }
        else {
            $('#toiletLabel').html("frei");
        }
        $("#toilet").toggleClass("toiletFree toiletOccupied");
        //alert($("toilet").attr("class"));
        return false;
    }

    function incSize(elem,amount) {
        amount = amount || 5;
        var fontSize = parseInt($(elem).css("font-size"));
        fontSize = (fontSize + amount) + "px";
        $(elem).css({
            'font-size': fontSize
        });
    }

    function decSize(elem, amount) {
         amount = amount || 5;
        var fontSize = parseInt($(elem).css("font-size"));
        fontSize = (fontSize - amount) + "px";
        $(elem).css({
            'font-size': fontSize
        });
    }

    //Fix, um Start, Stop und Reset zu verbessern
    function magicFix(RunningState, callback, runningStateAfter) {
        var report = "running ist " + ((running) ? "true." : "false.") + "\n";
        report += "Die Funktion soll ausgeführt werden, wenn running gleich " + ((RunningState) ? "true." : "false.") + "\n";
        if (RunningState == running) {
            report += "Funktion wird ausgeführt.\n"
            callback();
            running = runningStateAfter;
        }
        report += "running soll jetzt den Wert " + ((runningStateAfter) ? "true" : "false") + " haben.\n";

        report += "running hat den Wert " + ((running) ? "true" : "false");
        //alert(report);
    }
    // Funktionen für Frontend-Design

    function toggleSettingsOverlay() {
        $('.overlay').slideToggle('slow');
        $('#settings').parent().slideToggle('slow');
    }
    
    function incMargin(){
        getPxAndIncrease("#toilet","margin-top",blockSpacing);
        getPxAndIncrease("#toilet","margin-bottom",blockSpacing);
    }
    
    function decMargin(){
                getPxAndIncrease("#toilet","margin-top",-blockSpacing);
        getPxAndIncrease("#toilet","margin-bottom",-blockSpacing);
    }
    
    function incInfo(){
     incSize('#infoFormatted');
     incSize('#infoCaption');   
     getPxAndIncrease("#infoFormatted","padding-left",infoPadding);
    }
    
        function decInfo(){
     decSize('#infoFormatted');
     decSize('#infoCaption');  
     getPxAndIncrease("#infoFormatted","padding-left",-infoPadding);
    }
    
    function getPxAndIncrease(elem,attr,increase){
        var now = parseInt($(elem).css(attr).split("px")[0]);
        var then = now + increase;
        $(elem).css(attr,then);
        //alert($(elem).css(attr));
    }
    
    function startClick(){
        $("#startButton").hide();
        $("#reset").hide();
        $("#addTime").show();
        $("#stopButton").show();
    }
    
        function stopClick(){
                $("#startButton").hide();
        $("#reset").show();
        $("#addTime").hide();
        $("#stopButton").hide();
    }
    
        function resetClick(){
           $("#startButton").show();
    }
    