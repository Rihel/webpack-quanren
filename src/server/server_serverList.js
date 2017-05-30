import '../scss/server.scss'
import '../scss/font.scss'
import './menu_toggle';
import { alert, dialog } from '../modules/dialog';


console.log($('.seeDetail'));

$('.seeDetail').click(function() {
    dialog({
        title: '请确认预约信息',
        content: `
         <div class="list-group">
            <a href="#" class="list-group-item ">
                <h4 class="list-group-item-heading"><i class="icon-merchant"></i>门店</h4>
                <p class="list-group-item-text">车道汽车维修服务有限公司</p>
            </a>
            <a href="#" class="list-group-item ">
                <h4 class="list-group-item-heading"><i class="icon-position"></i>地址</h4>
                <p class="list-group-item-text">广州市海珠区瑞宝南洲北路泊岸森邻</p>
            </a>
            <a href="#" class="list-group-item ">
                <h4 class="list-group-item-heading"><i class="icon-time"></i>预约时间</h4>
                    <p class="list-group-item-text">2017.05.29   16:30</p>
            </a>
                <a href="#" class="list-group-item ">
                <h4 class="list-group-item-heading"><i class="icon-project"></i>预约项目</h4>
                <p class="list-group-item-text">精洗</p>
            </a>
        </div>
    `,
        btns: ['取消预约', '返回'],
        btnsCallback(btns) {
            console.log(btns);
        }
    })
})