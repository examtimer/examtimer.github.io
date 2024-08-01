// https://github.com/evilstreak/markdown-js
function Editor(input, preview) {
    this.update = function () {
        preview.innerHTML = exports.toHTML(input.value);
    };
    input.editor = this;
    this.update();
}

// https://css-tricks.com/snippets/jquery/get-query-params-object/
jQuery.extend({
    getQueryParameters: function (str) {
        return (str || document.location.search).replace(/(^\?)/, '').split("&").map(function (n) {
            return n = n.split("="), this[n[0]] = n[1], this
        }.bind({}))[0];
    }

});

new Editor($("#infoContent")[0], $("#infoFormatted")[0]);


var startMillis;
var running = false;

var maxDurMain,
    maxDurRead;

var isStarted;

var timer = new interval(20, stepDown);

/*
 *  Variablen für Manipulation von CSS
 *
 *
 */
var infoPadding = 3,
    blockSpacing = 4;

$(function () {
    var params = $.getQueryParameters();


    if (!(Object.keys(params).length === 0 && params.constructor === Object)) {
        Object.keys(params).forEach(function (c) {
            $("#" + c).val(decodeURIComponent(params[c])
                /*.replace(/%23/g, '#')
                .replace(/%3A/g, ':')*/);
        });

        if ("readEnabled" in params && params.readEnabled === "false") {
            $("#readEnabled").prop("checked", false);
            toggleReadTimer();
        }

        if ("passwordEnabled" in params && params.passwordEnabled === "false") {
            $("#passwordEnabled").prop("checked", false);
            togglePassword();
        }

        $("#infoContent")[0].editor.update();
    }


    mainTimerChange();
    readTimerChange();

    toggleSettingsOverlay()
});


function stepDown() {
    var diff = Date.now() - startMillis;


    $('#timerMain').html(diffToTime(maxDurMain - diff, true));
    $('#timerRead').html(diffToTime(maxDurRead - diff, false));
}


function resetTimer() {
    timer.stop();
    sleep.allow();
    isStarted = false;

    mainTimerChange();
    readTimerChange();
}


function startTimer() {

    if (!($("#timerMain").html() == "00:00:00")) {
        // var maxDurMain = parseDuration("#timerMain") //(
        // (parseInt($("#mainHrs").val()) * 3600) +
        //(parseInt($("#mainMin").val()) * 60) +
        //(parseInt($("#mainSec").val()))) * 1000;

        // var maxDurRead = parseDuration("#timerRead") //(
        //(parseInt($("#readHrs").val()) * 3600) +
        //(parseInt($("#readMin").val()) * 60) +
        //(parseInt($("#readSec").val()))) * 1000;

        startMillis = Date.now();
        timer.run();
        sleep.prevent();

        isStarted = true;
    }

    if ($('#settings').is(':visible')) {
        toggleSettingsOverlay();
    }
}


function addTime() {
    $("#addTimePane").hide();

    addedTime = (
        (parseInt($("#addedHrs").val()) * 3600) +
        (parseInt($("#addedMin").val()) * 60) +
        (parseInt($("#addedSec").val()))) * 1000;

    maxDurMain += addedTime;


}

function diffToTime(diff, main) {
    if (diff < 0) {
        if (main) {
            timer.stop();
            isStarted = false;
            $('#addTimeToggle').hide();
        }

        return "00:00:00";
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

function mainTimerChange() {
    if (isStarted)
        return;

    maxDurMain = (
        (parseInt($("#mainHrs").val()) * 3600) +
        (parseInt($("#mainMin").val()) * 60) +
        (parseInt($("#mainSec").val()))) * 1000;

    if (maxDurMain > 0 && !isStarted) {
        //   alert($(".startButton").length);
        $('.startButton').show();
    } else if (maxDurMain <= 0 && !isStarted) {
        $('.startButton').hide();
    }


    $('#timerMain').html(diffToTime(maxDurMain, false));
}

function readTimerChange() {
    if (isStarted)
        return;

    maxDurRead = (
        (parseInt($("#readHrs").val()) * 3600) +
        (parseInt($("#readMin").val()) * 60) +
        (parseInt($("#readSec").val()))) * 1000;

    $('#timerRead').html(diffToTime(maxDurRead, false));
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

function togglePassword() {
    if ($('#passwordEnabled')[0].checked) {
        $('#password').show();
        $('#passwordBox').show();
        $('#updatePasswordBox').show();
    }
    else {
        $('#password').hide();
        $('.passwordBox').hide();
        $('#updatePasswordBox').hide();
    }
}

function updatePassword(elem) {
    var password = elem.value;

    if (password == "") {
        password = "wird noch bekannt gegeben";
        $('#passwordValue').html(password);
        $('#updatePassword').val('');
        $('#password').val('');
    } else {
        $('#updatePassword').val(password);
        $('#password').val(password);
        $('#passwordValue').html(password);
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


/* ToDo: 
 * - Eine statt zwei Funktionen (negative Werte zum verkleinern?)
 * - Definition Standartwert auslagern?
 * - Eingabeparameter: 
 *       + String/Array[String]: Erhöhe (alle in Array) Selektor mit Standartwert
 *       + String/Array[String], Boolean: Erhöhen/Verringer (alle in Array) (Trigger: Boolean) mit Standardwert
 *       + String/Array[String], Number: Verändere (alle in Array) um angegebenen Wert
 * - Funktionsaufrufe anpassen an neue Namen
 */

function incSize(elem, amount) {
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

/* Todo:
 * - Umbenennen (sinnvoller Name)
 * - Funktionsaufrufe anpassen an neue Namen
 */

function magicFix(RunningState, callback, runningStateAfter) {
    if (RunningState == running) {
        callback();
        running = runningStateAfter;
    }
}
// Funktionen für Frontend-Design

function toggleSettingsOverlay() {
    $('.overlay').slideToggle('slow');
    $('#settings').parent().slideToggle('slow');
    $("#toggleSettings").toggleClass("buttons buttonactive");
}

function incMargin() {
    getPxAndIncrease("#toilet", "margin-top", blockSpacing);
    getPxAndIncrease("#toilet", "margin-bottom", blockSpacing);
}

function decMargin() {
    getPxAndIncrease("#toilet", "margin-top", -blockSpacing);
    getPxAndIncrease("#toilet", "margin-bottom", -blockSpacing);
}

function incInfo() {
    incSize('#infoFormatted');
    incSize('#infoCaption');
    getPxAndIncrease("#infoFormatted", "padding-left", infoPadding);
}

function decInfo() {
    decSize('#infoFormatted');
    decSize('#infoCaption');
    getPxAndIncrease("#infoFormatted", "padding-left", -infoPadding);
}

function getPxAndIncrease(elem, attr, increase) {
    var now = parseInt($(elem).css(attr).split("px")[0]);
    var then = now + increase;
    $(elem).css(attr, then);
    //alert($(elem).css(attr));
}

function startClick() {
    $(".startButton").hide();
    // $("#reset").hide();
    $("#addTimeToggle").show();
    $("#stopButton").show();
}

function stopClick() {
    // $(".startButton").hide();
    // $("#reset").show();
    $("#addTimeToggle").hide();
    $("#stopButton").hide();
}

function resetClick() {
    $(".startButton").show();
}

function toggleAddTime(elem) {
    var pane = $("#addTimePane");
    var rect = elem.getBoundingClientRect();

    pane[0].style.top = rect.bottom + 'px';
    pane[0].style.right = (window.innerWidth - rect.right) + 'px';

    pane.toggle();
}


function adjustToiletSign() {
    var timersIsHigher = (parseInt($("#timers").css("height")) >= parseInt($("#toilet").css("height")));
    var major = (timersIsHigher) ? $("#timers") : $("#toilet");
    var minor = (timersIsHigher) ? $("#toilet") : $("#timers");

    // alert("gesamt: "+$("#timers").css("height")+", toilet: "+$("#toilet").css("height"));
    $(major).css("top", 0);
    $(minor).css("top", (parseInt($(major).css("height")) - parseInt($(minor).css("height"))) / 2)
}

function generateStaticLink() {
    var settings = {
        mainHrs: $("#mainHrs").val(),
        mainMin: $("#mainMin").val(),
        mainSec: $("#mainSec").val(),
        readEnabled: $("#readEnabled").is(":checked"),
        readHrs: $("#readHrs").val(),
        readMin: $("#readMin").val(),
        readSec: $("#readSec").val(),
        infoContent: $("#infoContent").val(),
        passwordEnabled: $("#passwordEnabled").is(":checked"),
    };


    window.location = window.location.href.split("?")[0] + "?" + $.param(settings);
}