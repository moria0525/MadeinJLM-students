// not used - can to delete..
$(function () {
    'use strict';
	$(".inputWrapper").mousedown(function () {
        var button = $(this);
        button.addClass('clicked');
        setTimeout(function () {
            button.removeClass('clicked');
        }, 50);
    });
});