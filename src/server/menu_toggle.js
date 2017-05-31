$(".left-main .sidebar-fold").click(function () {
    let parent = $(this).parent()
    if (parent.attr('class') == "left-main left-full") {
        parent.removeClass("left-full").addClass("left-off");
        $('.logo').css('fontSize', '3rem');
        parent.next(".right-product").removeClass("right-full").addClass("right-off");
    } else {
        parent.removeClass("left-off").addClass("left-full")
        $('.logo').css('fontSize', '10rem');
        parent.next(".right-product").removeClass("right-off").addClass("right-full");
    }
})