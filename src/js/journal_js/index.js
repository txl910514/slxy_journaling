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
/*    self.img_rotate();*/
    self.icon_box();
    index.init_ajax('china');
    $('.progress-visit').css('display', 'none');
    self.small_bg();
/*    self.map_bg();*/
  },

  small_bg: function() {
    var self = this;
    var option_data = {
      lineWidth: 0.5,
      lineCap: 'butt',
      strokeStyle:'rgba(63,63,63,0.2)',
      data:[]
    };
    var space = 20;
    var $small_bg = $('#small-bg');
    var $right_content = $('.right-content');
    var width = $small_bg.parent().width() - 2 * space;
    var height = $small_bg.parent().height();
    var horizontal_num = Math.ceil(width / space);
    var more_left = width - Math.floor(width / space) * space;
    var more_bottom = height - Math.floor(height / space) * space;
    var right_width = Math.floor(horizontal_num*2/3) * space - 3*space;
    var left_width = width - right_width;
    $('.map-content').css({
      right: left_width + 'px'
    });
    $right_content.css({
      left: right_width + 'px'
    });
    $('.body-content').css({
      'margin-right': space + more_left + 'px',
      'margin-bottom': space + more_bottom + 'px'
    });
    $('.content').css({
      'padding-right': space + more_left + 'px',
      'padding-bottom': space + more_bottom + 'px'
    });
    var right_content_height = $right_content.height();
    var right_content_num = Math.ceil(right_content_height / space);
    var right_top = Math.floor(right_content_num*2/3) * space;
    var right_bottom = right_content_height - right_top;
    $('.meter-box').css({
      bottom: right_top + 'px'
    });
    $('.manage-box').css({
      top: right_bottom + 'px'
    });
    self.img_rotate();
    self.canvas_line(option_data, 'small-bg', space);
  },

  map_bg: function() {
    var self = this;
    var option_data = {
      lineWidth: 0.5,
      lineCap: 'butt',
      strokeStyle:'#192e34',
      data:[]
    };
    var height_meter = parseInt($('.manage-box').css('top'));
    self.canvas_line(option_data, 'map-bg', height_meter, true);
  },

  canvas_line: function(option_data, ele_id, space, border) {
    var canvas_ele = new canvasMap();
    var horizontal_option = $.extend({}, option_data);
    var vertical_option = $.extend({}, option_data);
    var $parent = $('#' + ele_id).parent();
    var width = $parent.width();
    var height = $parent.height();
    var horizontal_num = Math.ceil(width / space);
    var vertical_num = Math.ceil(height / space);
    _(vertical_num).times(function(n) {
      if (border) {
        if (space*n <  height && n === vertical_num-1) {
          horizontal_option.data.push({
            start:{x:0, y:height},
            end:{x:width, y:height}
          });
        }
        n -= 1;
      }
      horizontal_option.data.push({
        start:{x:0, y:(n+1)*space},
        end:{x:width, y:(n+1)*space}
      });

    });
    _(horizontal_num).times(function(n) {
      if (border) {
        if (space*n <  width && n === horizontal_num-1) {
          var last_space = width - space*n;
          vertical_option.data.push({
            start:{x:width, y:0},
            end:{x:width, y:height}
          });
        }
        n -= 1;
      }
      vertical_option.data.push({
        start:{x:(n+1)*space, y:0},
        end:{x:(n+1)*space, y:height}
      });
    });
    canvas_ele.init(document.getElementById(ele_id));
    canvas_ele.horizontal_line(horizontal_option);
    canvas_ele.horizontal_line(vertical_option);
  },

  icon_box: function() {
    $('.icon-box').each(function() {
      var $ele = $(this);
      var height = $ele.outerHeight();
      $ele.css('width', height + 'px');
    });
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
       $('.progress-visit').css('display', 'none');
    }
    else {
       $('.progress-visit').css('display', 'block');
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
    self.icon_box();
    self.init_ajax(map_text);
    $header_title.text(text + '进度总览');
    $total_hospital_num.text(text + '医院总数');
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
      var math_height = box_height * Math.sin(Math.PI*2/5);
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
  },

  init_ajax: function(area) {
    var self = this;
    var hospital_num = {};
    var manage_money = 0, manage_num = 0, translate_num = 0, total_hospital = 0,all_total_hospital = 0,
      deliver = 0,  probation = 0,  regular = 0, received_payments = 0, manage_frequency = 0;
    var province_path = /province_/.test(area);
    var china_path = /china/.test(area);
    var province_replace = area.replace(/province_/, '');
    var hospital_classify = {
      palaver:[],
      purpose:[],
      arrange:[],
      train:[],
      use:[]
    };
    var status_data = {
      palaver:{
        name: '洽谈中',
        data:[
          {
            db: 5,
            hb: 19,
            hd: 11,
            hn: 13,
            hz: 15,
            xb: 5,
            xn: 7
          }
        ],
        point:[],
        color:'#f1635e'
      },
      purpose:{
        name: '确定意向',
        data:[
          {
            db: 3,
            hb: 12,
            hd: 7,
            hn: 5,
            hz: 10,
            xb: 2,
            xn: 2
          }
        ],
        point:[],
        color:'#ffc528'
      },
      arrange:{
        name: '部署中',
        data:[
          {
            db: 2,
            hb: 3,
            hd: 7,
            hn: 6,
            hz: 3,
            xb: 1,
            xn: 3
          }
        ],
        point:[],
        color:'#6bd8ea'
      },
      train:{
        name: '培训中',
        data:[
          {
            db: 2,
            hb: 0,
            hd: 5,
            hn: 3,
            hz: 2,
            xb: 0,
            xn: 2
          }
        ],
        point:[],
        color:'#00d991'
      },
      use:{
        name: '使用中',
        data:[{
          db: 12,
          hb: 47,
          hd: 72,
          hn: 58,
          hz: 51,
          xb: 15,
          xn: 27
        }],
        point:[],
        color:'#939fdf'
      }
    };
    var data_ajax = {
      lend_data: ['洽谈中', '确定意向', '部署中', '培训中', '使用中'],
      lend_selected: {
        '洽谈中':false,
        '确定意向':false,
        '部署中': false,
        '培训中': false,
        '使用中':true
      },
      max:72,
      series:[]
    };
    var $init_url = $('#init-url');
    var $content = $('#content');
    var vyunying_url = '<%=base%>' + $init_url.attr('url1');
    var vbigdisplay_url = '<%=base%>' + $init_url.attr('url2');
    $.when(
      self.returns_ajax_init($init_url, {}, vyunying_url)
    ).then(function(vyunying){
        $.when(self.vbigdisplay_ajax_init($content, {}, vbigdisplay_url)).then(function(vbigdisplay) {
          vbigdisplay = {
            disHosCount: [],
            entity: [],
            otherInfo: [],
            proHosCount: []
          }
          vyunying = []
          var concat_yunying = vyunying.concat(vbigdisplay.entity);
          if (province_path) {
            _.each(vbigdisplay.proHosCount, function(proHos_count) {
              var province_text = proHos_count.province.replace(/[\u5e02|\u7701]/,'');
              province_text = province_text.replace(/[\u7ef4|\u543e|\u5c14|\u56de|\u58ee|\u65cf|\u81ea|\u6cbb|\u533a]/g,'');
              var province_array_text;
              _.each(GVR.JSON.provinceJson, function(provinceJson, province_index) {
                if (province_replace === provinceJson) {
                  province_array_text = GVR.JSON.provinceArray[province_index];
                }
              });
              if (province_text === province_array_text) {
                if (proHos_count.hos_count) {
                  all_total_hospital  = parseInt(proHos_count.hos_count);
                }
              }
            })
          }
          else if (china_path) {

          }
          else {
            _.each(vbigdisplay.disHosCount, function(disHos_count) {
              var area_replace = area.replace('.geo', '');
              if (disHos_count.district === GVR.JSON.area_json[area_replace][0] + '区') {
                if (disHos_count.hos_count) {
                  all_total_hospital  = parseInt(disHos_count.hos_count);
                }
              }
            })
          }
          _.each(vbigdisplay.otherInfo, function(otherInfo) {
            if (province_path) {
              if (!otherInfo.province) {
                return true;
              }
              var province_text = otherInfo.province.replace(/[\u5e02|\u7701]/,'');
              province_text = province_text.replace(/[\u7ef4|\u543e|\u5c14|\u56de|\u58ee|\u65cf|\u81ea|\u6cbb|\u533a]/g,'');
              var province_array_text;
              _.each(GVR.JSON.provinceJson, function(provinceJson, province_index) {
                if (province_replace === provinceJson) {
                  province_array_text = GVR.JSON.provinceArray[province_index];
                }
              });
              if (province_text === province_array_text) {
                if (otherInfo.count) {
                  manage_frequency += parseInt(otherInfo.count);
                }
              }
            }
            else if (china_path) {
              if (otherInfo.count) {
                manage_frequency += parseInt(otherInfo.count);
              }
            }
            else {
              var area_replace = area.replace('.geo', '');
              if (otherInfo.district === GVR.JSON.area_json[area_replace][0] + '区') {
                if (otherInfo.count) {
                  manage_frequency += parseInt(otherInfo.count);
                }
              }
            }
          });
          _.each(concat_yunying, function(hospital, index) {
            if (province_path) {
              if (!hospital.province) {
                return true;
              }
              var province_text = hospital.province.replace(/[\u5e02|\u7701]/,'');
              province_text = province_text.replace(/[\u7ef4|\u543e|\u5c14|\u56de|\u58ee|\u65cf|\u81ea|\u6cbb|\u533a]/g,'');
              var province_array_text;
              _.each(GVR.JSON.provinceJson, function(provinceJson, province_index) {
                if (province_replace === provinceJson) {
                  province_array_text = GVR.JSON.provinceArray[province_index];
                }
              });
              if (province_text !== province_array_text) {
                return true;
              }
            }
            else if (china_path) {

              if (hospital.total_price) {
                manage_money += parseInt(hospital.total_price);
              }
            }
            else {
              if (!hospital.district) {
                return true;
              }
              var area_replace = area.replace('.geo', '');
              if (hospital.district !== GVR.JSON.area_json[area_replace][0] + '区') {
                return true;
              }
            }
            if (hospital.total_num) {
              manage_num += hospital.total_num;
            }
            if(hospital.received_payments) {
              received_payments += hospital.received_payments;
            }
            total_hospital += 1;
            var status;
            switch (Number(hospital.business_status)) {
              case 1:
                status = '拜访中';
                translate_num += 1;
                break;
              case 2:
                status = '洽谈中';
                break;
              case 3:
                status = '确定意向';
                break;
              case 4:
                status = '部署中';
                break;
              case 5:
                status = '培训中';
                break;
              default :
                status = '使用中';
                hospital.business_status = 6;
                break;
            }
            switch (Number(hospital.business_detaile)) {
              case 1:
                deliver +=1;
                break;
              case 2:
                probation += 1;
                break;
              case 3:
                regular += 1;
                break;
              default :
                break;
            }
            var hospital_json = {
              district: hospital.district,
              province: hospital.province,
              status:status,
              business_status: hospital.business_status
            };
            var point_json = {
              name: hospital.hospitals_name || hospital.hospital_name,
              coord: [hospital.lon, hospital.lat],
              value: hospital.hospitals_id
            };
            switch (hospital_json.status) {
              case '洽谈中':
                hospital_classify.palaver.push(hospital_json);
                status_data.palaver.point.push(point_json);
                break;
              case '确定意向':
                hospital_classify.purpose.push(hospital_json);
                status_data.purpose.point.push(point_json);
                break;
              case '部署中':
                hospital_classify.arrange.push(hospital_json);
                status_data.arrange.point.push(point_json);
                break;
              case '培训中':
                hospital_classify.train.push(hospital_json);
                status_data.train.point.push(point_json);
                break;
              case '使用中':
                hospital_classify.use.push(hospital_json);
                status_data.use.point.push(point_json);
                break;
              default:
                break;
            }
          });
          hospital_num = {
            palaver_num: 75,
            purpose_num: 41,
            arrange_num: 25,
            train_num: 14,
            use_num: 282
          };
          GVR.JSON.hospital_num = hospital_num;
          if (china_path) {
            _.each(hospital_classify,function(classify, classify_key) {
              var area_num = {
                db: 0,
                hb: 0,
                hd: 0,
                hn: 0,
                hz: 0,
                xb: 0,
                xn: 0
              };
              _.each(classify, function(hospital, hospital_key) {
                _.each(GVR.JSON.area_json, function(areaJson, area_key) {
                  if (hospital.district === areaJson[0] + '区' ) {
                    area_num[area_key] = area_num[area_key] + 1;
                    if(data_ajax.max < area_num[area_key]) {
                      data_ajax.max = area_num[area_key];
                    }
                  }
                });
              });
              status_data[classify_key].data.push(area_num);
            });
            data_ajax.series = status_data;
            manage_money = 27830409060
            COMMON_FUNC.animate_num($('#money-text'), 0, manage_money);
          }
          else if (province_path) {
            data_ajax.series = status_data;
          }
          else {
            _.each(hospital_classify, function(classify, classify_key) {
              var province_num = {};
              _.each(classify, function(hospital, hospital_key) {
                _.each(GVR.JSON.provinceArray, function(provinceJson, province_key) {
                  var province_reg = hospital.province.replace(/[\u5e02|\u7701]/,'');
                  if (province_reg === provinceJson) {
                    if (province_num[provinceJson]) {
                      province_num[provinceJson] = province_num[provinceJson] + 1;
                    }
                    else {
                      province_num[provinceJson] = 1;
                    }
                    if(province_num[provinceJson]) {
                      if(data_ajax.max < province_num[provinceJson]) {
                        data_ajax.max = province_num[provinceJson];
                      }
                    }
                  }
                });
              });

              status_data[classify_key].data.push(province_num);
            });
            data_ajax.series = status_data;
          }
          if(!china_path) {
            if (received_payments > 10000) {
              received_payments = parseInt(received_payments /10000);
              $('#received-unit').text('万元');
            }
            else if(received_payments > 100000000){
              $('#received-unit').text('亿元');
            }
            else {
              $('#received-unit').text('元');
            }
            COMMON_FUNC.animate_num($('#deliver'), 0, deliver);
            COMMON_FUNC.animate_num($('#probation'), 0, probation);
            COMMON_FUNC.animate_num($('#regular'), 0, regular);
            COMMON_FUNC.animate_num($('#received-payments'), 0, received_payments);
          }
          var progress = parseInt((total_hospital / all_total_hospital) *100);
          $('.progress-con').css('width', progress + '%');
          $('.progress-num').text(total_hospital + '/' + all_total_hospital);
          manage_num = 576934
          COMMON_FUNC.animate_num($('#amount-text'), 0, manage_num);
          manage_frequency = 1439372
          COMMON_FUNC.animate_num($('#js-manage-frequency'),0, manage_frequency);
          ECHARTS_FUNC.area_total_map('area-total-map', area, data_ajax);
          $('.img-rotate:last').click();
          var clientWidth = document.body.clientWidth;
          var rotate_length = $('.img-rotate').length;
          var length_eq = 0;
/*          var set_rotate = setInterval(function() {
            if (length_eq === rotate_length - 1) {
              clearInterval(set_rotate);
              self.init_ajax(area);
            }
            $('.img-rotate:eq('+ length_eq +')').click();
            length_eq ++;
          }, 60*1000);*/
        });
    });
  },

  returns_ajax_init: function($init_url, data, url) {
    return {}
  },

  vbigdisplay_ajax_init: function($init_url, data, url) {
    return []
  }
};

$(function(){
  index.ready_init();
  $(window).resize(function() {
    var area_echarts = GVR.ECHARTS.AREA_MAP;
    index.img_rotate();
    index.icon_box();
    index.small_bg();
/*    index.map_bg();*/
    if (area_echarts) {
      area_echarts.resize();
    }
  });
}).on('click', '.select-con-text', function() {
  index.select_con_text ($(this));
})
;