$(".left-main .sidebar-fold").click(function() {

    if ($(this).parent().attr('class') == "left-main left-full") {
        $(this).parent().removeClass("left-full");
        $(this).parent().addClass("left-off");
        $('.logo').css('fontSize', '3rem');
        $(this).parent().parent().find(".right-product").removeClass("right-full");
        $(this).parent().parent().find(".right-product").addClass("right-off");

    } else {
        $(this).parent().removeClass("left-off");
        $(this).parent().addClass("left-full");
        $('.logo').css('fontSize', '10rem');
        $(this).parent().parent().find(".right-product").removeClass("right-off");
        $(this).parent().parent().find(".right-product").addClass("right-full");

    }
})