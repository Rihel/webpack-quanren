import '../scss/common.scss';
import '../scss/register.scss';


import until from '../modules/until';
import tem from '../modules/template-web';

import { clitypes } from '../api/api';


/**
 * 初始化
 */
(async() => {
    let data = await clitypes();
    tem.defaults.imports.timestamp = a => {
        return a.replace(/(套餐包.+\n.+)/gmi, '').replace('该套餐', '');
    }
    let clitypesHtml = tem('clitype', { clitypes: data });

    $('#clitype-content').append(clitypesHtml);
})();

var current_fs, next_fs, previous_fs;
var left, opacity, scale;
var animating;

$(".next").on('click', function() {
    console.log($(this))
    if (animating) return false;
    animating = true;
    current_fs = $(this).parent();
    next_fs = $(this).parent().next();
    $("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");
    next_fs.show();
    current_fs.animate({
        opacity: 0
    }, {
        step: function(now, mx) {


            scale = 1 - (1 - now) * 0.2;

            left = (now * 50) + "%";

            opacity = 1 - now;
            current_fs.css({
                '-webkit-transform': 'scale(' + scale + ')',
                'transform': 'scale(' + scale + ')'
            });
            next_fs.css({
                'left': left,
                'opacity': opacity
            });
        },
        duration: 800,
        complete: function() {
            current_fs.hide();
            animating = false;
        },
        easing: 'easeInOutBack'
    });
});

$(".previous").on('click', function() {
    if (animating) return false;
    animating = true;

    current_fs = $(this).parent();
    previous_fs = $(this).parent().prev();


    $("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");


    previous_fs.show();

    current_fs.animate({
        opacity: 0
    }, {
        step: function(now, mx) {


            scale = 0.8 + (1 - now) * 0.2;

            left = ((1 - now) * 50) + "%";

            opacity = 1 - now;
            current_fs.css({
                'left': left
            });
            previous_fs.css({
                'transform': 'scale(' + scale + ')',
                'opacity': opacity
            });
        },
        duration: 800,
        complete: function() {
            current_fs.hide();
            animating = false;
        },

        easing: 'easeInOutBack'
    });
});

$(".submit").click(function() {
    return false;
});


$('.form-box').find('.drop').find('h3').click(function() {
    $(this).toggleClass('active');
    $(this).next('.drop-menu').toggle();
});
$('.drop-menu li').click(function() {
    $(this).parent().prev().html($(this).text());
    $(this).parent().prev().toggleClass('active');
    $(this).parent().hide();
})