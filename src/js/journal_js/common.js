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
/*    self.animate_num(2, 111101011);*/
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

  animate_num: function($dom,startNum, endNum) {
    var self = this;
    var time = 10;
    if (startNum > endNum) {
      console.info('数据顺序不对');
      return false;
    }
    var length = (endNum - startNum).toString().length - 2;
    var add = 0;
    var $div;
    if (length > 0) {
      for (i = 0; i < length; i++) {
        add += Math.pow(10,i);
      }
    }
    else {
      add = 1;
    }
    var num_setInterval = setInterval(function() {
      if( startNum <= endNum) {
        $div = self.num_init(startNum);
        startNum += add;
        $dom.html($div);
      }
      else {
        $div = self.num_init(endNum);
        $dom.html($div);
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
    if (GVR.JSON.hospital_num) {
      $('#meter-num').text(GVR.JSON.hospital_num[alt+'_num']);
    }
    if (area_echarts) {
      area_echarts.dispatchAction({
        type:'legendSelect',
        name: name
      });
    }
  },

  ajax_get: function($obj, data, url, error_callback, callback){
    /*
     ajax get通用方法
     参数：
     $obj: 触发GET事件的元数对象，一般为a标签或button。
     data (可选): 往URL上附加的额外参数。
     url (可选): GET请求的URL路径，不传会从$obj对象上获取url属性，没有url属性时默认用当前路径.
     error_callback (可选): 异常时的回调函数
     callback: 成功时的回调函数
     */
    var self = this;
    var args = Array.prototype.slice.call(arguments);
    var _callback = args.slice(-1)[0];
    error_callback = null;
    call_back = null;
    if(_.isFunction(_callback)){
      var callback = args.pop();
      var _error_callback = args.slice(-1)[0];
      if(_.isFunction(_error_callback)){
        error_callback =  args.pop();
      }
      $obj = args[0];
      data = args[1];
      url = args[2];
    }
    if($obj.hasClass('disabled')){
/*      self.full_loading("hide");*/
    }
    else{
      $obj.addClass('disabled');
      var my_date = new Date;
      data = data || {};
/*      $.extend(data, {time: my_date.getTime()});*/
      var url= url || $obj.attr('url') || '.';
      return $.ajax({
        type: 'GET',
        url: url,
        data: data,
        dataType:'JSONP',
        jsonp: 'callback',
        jsonpCallback:'success_jsonpCallback',
        success: function(result){
          if(result.msg){
            console.log(result.msg);
          }
          $obj.removeClass('disabled');
          if(_.isFunction(callback)){
            callback(result);
          }
          if(result.reload === 1){
            self._reload();
          }
          else if(result.reload === 2){
            self.reload();
          }
          else if(result.reload === 3){
            self._reload(0);
          }
          else if(result.redirect){
            self.redirect(result.redirect);
          }
/*          self.full_loading("hide");*/
        },
        error: function(xhr, msg, error){
          console.log(xhr);
          console.log(msg);
          console.log(error);
          if(msg === "error"){
            if(xhr.status === 404){
              console.info("无效的数据");
            }
            else if(xhr.status === 500){
              console.info("服务器异常，请联系管理员");
            }
            else if(xhr.status === 403){
              console.info("登录已过期或没有访问权限");
              self._reload();
            }
            else{
              console.info("网络异常，请稍后再试");
            }
          }
          else{
            if(msg){
              console.log(msg);
            }
          }
          if(_.isFunction(error_callback)){
            error_callback();
          };
          $obj.removeClass('disabled');
/*          self.full_loading("hide");*/
        }
      });
    }
    return false;
  }

};

$(function() {
  COMMON_FUNC.ready_init();
}).on('click', '.img-rotate', function() {
  COMMON_FUNC.area_map($(this));
});