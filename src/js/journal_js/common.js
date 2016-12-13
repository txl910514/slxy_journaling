/**
 * Created by tangxl on 16-12-6.
 */
GVR.JSON.area_json = {
  db: ['东北','黑龙江','吉林', '辽宁'],
  hb: ['华北','北京', '河北', '内蒙古', '天津'],
  hd: ['华东','安徽', '江苏', '山东', '上海','浙江'],
  hn: ['华南', '广东', '广西', '海南'],
  hz: ['华中', '福建', '湖北', '湖南', '江西'],
  xb: ['西北','甘肃', '河南', '宁夏', '青海', '山西', '陕西', '新疆'],
  xn: ['西南','贵州', '四川', '西藏', '云南','重庆']
};
GVR.JSON.provinceArray = ['黑龙江','吉林', '辽宁', '北京', '河北',
  '内蒙古', '天津','安徽', '江苏', '山东', '上海','浙江','广东', '广西', '海南',
  '福建', '湖北', '湖南', '江西', '甘肃', '河南', '宁夏', '青海', '山西', '陕西', '新疆',
  '贵州', '四川', '西藏', '云南','重庆', '台湾', '香港', '澳门'];
GVR.JSON.provinceJson = ['heilongjiang','jilin', 'liaoning', 'beijing', 'hebei',
  'neimenggu', 'tianjin','anhui', 'jiangsu', 'shandong', 'shanghai','zhejiang',
  'guangdong', 'guangxi', 'hainan', 'fujian', 'hubei', 'hunan', 'jiangxi', 'gansu',
  'henan', 'ningxia', 'qinghai', 'shanxi', 'shanxi1', 'xinjiang', 'guizhou', 'sichuan',
  'xizang', 'yunnan','chongqing', 'tw', 'xianggang', 'aomen'];
var COMMON_FUNC = {
  single_num_tpl: _.template($('#single_num_tpl').html()),
  ready_init: function() {
    var self = this;
    self.get_time();
    self.animate_num(2, 111101011);
  },

  get_time: function() {
    function getTime_func() {
      var time_text;
      var local_time = new Date();
      var hour = local_time.getHours();
      var min = local_time.getMinutes();
      var year = local_time.getFullYear();
      var month = local_time.getMonth()+1;
      var date = local_time.getDate();
      hour = hour < 10 ? '0' + hour : hour;
      min = min < 10 ? '0' + min : min;
      month = month < 10 ? '0' + month : month;
      date = date < 10 ? '0' + date : date;
      time_text = year + '年' + month + '月' + date + '日';
      $('#js-hour-text').text(hour);
      $('#js-min-text').text(min);
      $('#js-year-text').text(time_text);
      setTimeout(getTime_func, 1000);
    }
    getTime_func();
  },

  num_init: function(num) {
    var self = this;
    var $div = $('<div></div>');
    num = num.toString();
    if (num.length >= 3) {
      num = num.replace(/(\d)(?=(\d{3})+$)/g, '$1,');
    }
    _.each(num,function(index, key) {
      if (index === ',' ) {
        index = 'split';
      }
      var single_num_tpl = self.single_num_tpl({index:index});
      $div.append(single_num_tpl);
    });
    return $div;
  },

  animate_num: function(startNum, endNum) {
    var self = this;
    var time;
    if (startNum > endNum) {
      console.info('数据顺序不对');
      return false;
    }
    var length = (endNum - startNum).toString().length;
    var add = 0;
    var $div;
    if (length <= 3) {
      add = 1;
      time = 10;
    }
    else if (length > 3 && length < 5) {
      add = 11;
      time = 10;
    }
    else if (length >= 5 && length < 7) {
      add = 1111;
      time = 7;
    }
    else if (length >= 7 && length < 9) {
      add = 11111;
      time = 5;
    }
    else if (length >= 9 && length < 12) {
      add = 111111;
      time = 2;
    }
    var num_setInterval = setInterval(function() {
      if( startNum <= endNum) {
        $div = self.num_init(startNum);
        startNum += add;
        $('#js-manage-frequency').html($div);
      }
      else {
        $div = self.num_init(endNum);
        $('#js-manage-frequency').html($div);
        clearInterval(num_setInterval);
      }
    }, time);
  },

  area_map: function($obj) {
    var alt = $obj.attr('id');
    var $body = $('body');
    var $meter_arrow = $('.meter-arrow');
    var $meter_num = $('#meter-num');
    var area_echarts = GVR.ECHARTS.AREA_MAP;
    var name;
    switch (alt) {
      case 'palaver' :
        name = '洽谈中';
        break;
      case 'purpose' :
        name = '确定意向';
        break;
      case 'arrange' :
        name = '部署中';
        break;
      case 'train' :
        name = '培训中';
        break;
      case 'use' :
        name = '使用中';
        break;
      default :
        name = '部署中';
        break;
    }
    $body.find('.hospital-alert').remove();
    $('.img-rotate').each(function(index, dom) {
      $meter_arrow.removeClass('meter-arrow-'+ (index + 1));
      $meter_num.removeClass('meter-num-' + (index + 1));
    });
    $meter_arrow.addClass('meter-arrow-' + ($obj.index() + 1) );
    $meter_num.addClass('meter-num-' + ($obj.index() + 1));
    $('.' + alt + '-img').addClass('active').siblings().removeClass('active');
    if (area_echarts) {
      area_echarts.dispatchAction({
        type:'legendSelect',
        name: name
      });
    }
  }

};

$(function() {
  COMMON_FUNC.ready_init();
}).on('click', '.img-rotate', function() {
  COMMON_FUNC.area_map($(this));
});