/**
 * Created by tangxl on 16-12-6.
 */
var index = {
  manage_money_tpl: _.template($('#manage_money_tpl').html()),
  manage_status_tpl: _.template($('#manage_status_tpl').html()),
  ready_init:function() {
    var self = this;
    var $manage_money_radius = $('#manage-money-radius');
    var $manage_money_tpl = $.trim(self.manage_money_tpl());
    $manage_money_radius.html($manage_money_tpl);
    self.img_rotate();
    $('.icon-box').each(function() {
      var $ele = $(this);
      var height = $ele.outerHeight();
      $ele.css('width', height + 'px');
    });
    ECHARTS_FUNC.area_total_map('area-total-map', 'china');
    $('.img-rotate:last').click();
  },

  select_con_text: function($obj) {
    var self =this;
    var id = $obj.attr('id');
    var text = $obj.text().replace('：', '');
    var reg_id = Number(id.replace(/\w+_/, ''));
    var map_text;
    var $header_title = $('.header-title');
    var $total_hospital_num = $('.total-hospital-num');
    var $manage_money_radius = $('#manage-money-radius');
    var $body = $('body');
    $body.find('.hospital-alert').remove();
    $obj.closest('.map-select-content').find('.select-con-text').removeClass('active');
    $obj.addClass('active');
    $('.map-select-text').text(text).data('id', id);
     if(id === 'china') {
      map_text = 'china';
      var $manage_money_tpl = self.manage_money_tpl();
      $manage_money_radius.html($manage_money_tpl);
    }
    else {
       if(!isNaN(reg_id)) {
         _.each(GVR.JSON.provinceArray, function(province, key) {
           if (province === text) {
             map_text = 'province_' + GVR.JSON.provinceJson[key];
             return false;
           }

         });
       }
       else {
         map_text = id + '.geo';
       }
       var $manage_status_tpl = self.manage_status_tpl();
       $manage_money_radius.html($manage_status_tpl);
    }
    ECHARTS_FUNC.area_total_map('area-total-map', map_text);
    $header_title.text(text + '进度总览');
    $total_hospital_num.text(text + '医院总数');
    $('.img-rotate:last').click();
  },

  img_rotate: function() {
    var scale = 284/168;
    var arrow_scale = 163/26;
    var arrow_sector_scale = 284 / 200;
    var $parent_ele = $('.meter-img');
    var box_height = $parent_ele.height();
    var box_width = $parent_ele.width();
    var $meter_arrow = $('.meter-arrow');
    var $half_rect_1 = $('.half-rect-1');
    $('.img-rotate').each(function(index, dom) {
      var $ele = $(dom);
      var width = $ele.width();
      var height;
      var left;
      if (width > box_height) {
        width = box_height;
        left = (box_width - 2 * width) / 2;
      }
      else {
        width = box_width * 0.45;
        left = '5%';
      }
      height = width / scale;
      $ele.css({'width': width + 'px', 'height':height+ 'px', left: left});
      if (index === 0 ){
        var arrow_width = width / arrow_sector_scale;
        var arrow_height = arrow_width / arrow_scale;
        var arrow_left = (box_width - 2 * arrow_width) / 2;
        $meter_arrow.css({'width': arrow_width + 'px', 'height':arrow_height+ 'px', left: (arrow_left-5)+ 'px'});
        var rect_width_1 = width*2/3 ;
        var react_left_1 = (box_width -  rect_width_1) / 2;
        $half_rect_1.css(
          {
            height: (rect_width_1/2) + 'px',
            width: rect_width_1 + 'px',
            left: react_left_1 + 'px',
            'border-radius': (rect_width_1/2) + 'px ' + (rect_width_1/2) + 'px ' + '0 0'
          });
        $('.half-react').each(function (index, dom) {
          if (index > 0) {
            var width_half = rect_width_1*0.85;
            var width_half_1 = width_half*0.8;
            var width_half_left = (rect_width_1 -  width_half) / 2;
            var half_left_1 = (width_half -  width_half_1) / 2;
            if( index === 1 ) {
              $(dom).css(
                {
                  height: (width_half/2) + 'px',
                  width: width_half + 'px',
                  left: width_half_left + 'px',
                  'border-radius': (width_half/2) + 'px ' + (width_half/2) + 'px ' + '0 0'
                });
            }
            else if( index === 2 ) {
              $(dom).css(
                {
                  'line-height': (width_half_1/2 + 8) + 'px',
                  height: (width_half_1/2) + 'px',
                  width: width_half_1 + 'px',
                  left: half_left_1 + 'px',
                  'border-radius': (width_half_1/2) + 'px ' + (width_half_1/2) + 'px ' + '0 0'
                });
            }
          }
        })
      }
    })
  }
};

$(function(){
  index.ready_init();
  $(window).resize(function() {
    var area_echarts = GVR.ECHARTS.AREA_MAP;
    index.img_rotate();
    if (area_echarts) {
      area_echarts.resize();
    }
  });
}).on('click', '.select-con-text', function() {
  index.select_con_text ($(this));
})
;