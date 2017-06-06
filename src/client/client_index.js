import '../scss/common.scss';
import '../scss/font.scss'
import '../scss/client.scss';


import tem from '../modules/template-web';




import { userGet } from '../api/api';

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