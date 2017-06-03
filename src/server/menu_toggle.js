$(".left-main .sidebar-fold").click(function() {
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
});

$('.drop').click(e => {
    let target = e.target,
        tagname = target.nodeName.toLowerCase();
    if (tagname === 'h3') {
        // $('#msform').find('.drop-menu').not($(this).next()).slideUp();
        $(e.target).toggleClass('active');
        $(e.target).next().slideToggle();

    }
    if (tagname === 'li') {
        let code = $(target).attr('code'),
            text = $(target).text(),
            dropMenu = $(target).parent(),
            title = dropMenu.prev();
        dropMenu.slideUp();
        title.text(text).attr('code', code);
        title.toggleClass('active')

    }

});