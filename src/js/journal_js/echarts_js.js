/**
 * Created by tangxl on 16-12-6.
 */
;
var ECHARTS_FUNC = {
  select_line_tpl : _.template($('#select_line_tpl').html()),
  all_china_tpl: _.template($('#all_china_tpl').html()),
  alert_map_tpl: _.template($('#alert_map_tpl').html()),
  ready_init: function() {
    var self = this;
    var $map_select_content = $('.map-select-content').html('');
    $map_select_content.append(self.all_china_tpl());
    _.each(GVR.JSON.area_json, function(areaJson, key) {
      var $select_line_tpl = self.select_line_tpl({area_key:key,provinces: areaJson});
      $map_select_content.append($select_line_tpl);
    })
  },

  area_total_map: function(dom_id, file_name) {
    var self = this;
    var file_path = '../jslib/area/' + file_name + '.json';
    var reg_file_path = /province_/.test(file_name);
    if (reg_file_path) {
      file_name = file_name.replace('province_', '');
      file_path = '../jslib/area/province/' + file_name + '.json';
    }
    $.get(file_path, function(area) {
      function randomData() {
        return Math.round(Math.random()*1000);
      }
      echarts.registerMap(file_name, area);
      var myChart = echarts.init(document.getElementById(dom_id));
      var option = {
        backgroundColor: '#0b151e',
        title: {
          left: 'center',
          textStyle: {
            color: '#fff'
          }
        },
        tooltip : {
          trigger: 'item',
          formatter: function(params, ticket, callback) {
            if(params.componentType !== 'markPoint') {
              var area = '';
              if (file_name === 'china') {
                _.each(GVR.JSON.area_json, function(areaJson, key) {
                  _.each(areaJson, function(area_province) {
                    if (params.name === area_province) {
                      area = areaJson[0] + '地区';
                    }
                  })
                });
              }
              else {
                area = params.name;
              }
              return area + '<br/>医院数量：' + params.value + '家';
            }
          }
        },
        legend: {
          orient: 'vertical',
          y: 'bottom',
          x:'right',
          data:['洽谈中', '确定意向', '部署中', '培训中', '使用中'],
          textStyle: {
            color: '#fff'
          },
          selectedMode: 'single',
          selected: {
            '洽谈中':false,
            '确定意向':false,
            '部署中': false,
            '培训中': false,
            '使用中':true
          },
          show: false
        },
        visualMap: {
          min: 0,
          max: 2500,
          left: 10,
          text: ['高','低'],           // 文本，默认为数值文本
          calculable: true,
          itemWidth: 30,
          itemHeight: 180,
          bottom: 10,
          color: ['#00c2eb', '#081218'],
          textStyle: {
            color: '#6bd8ea',
            fontSize: 16
          }
        },
        series : [
          {
            name: '洽谈中',
            type: 'map',
            mapType: file_name,
            roam: true,
            showLegendSymbol: false,
            zoom: 1.1,
            data: [
              {
                name: '北京',
                value: 500,
                itemStyle: {
                  normal: {
                    areaColor:'#1a3741'
                  }
                }
              },
              {
                name: '天津',
                value: 500,
                itemStyle: {
                  normal: {
                    areaColor:'#1a3741'
                  }
                }
              },
              {name: '上海',value: 500 },
              {name: '重庆',value: 500 },
              {name: '河北',value: 500 },
              {name: '河南',value: 500 },
              {name: '云南',value: 500 },
              {name: '辽宁',value: 500 },
              {name: '黑龙江',value: 500 },
              {name: '湖南',value: 500 },
              {name: '安徽',value: 1000 },
              {name: '山东',value: 1000 },
              {name: '新疆',value: 1000 },
              {name: '江苏',value: 1000 },
              {name: '浙江',value: 1000 },
              {name: '江西',value: 1000 },
              {name: '湖北',value: 1000 },
              {name: '广西',value: 1000 },
              {name: '甘肃',value: 1000 },
              {name: '山西',value: 1000 },
              {name: '内蒙古',value: 1000 },
              {name: '陕西',value: 1000 },
              {name: '吉林',value: 1000 },
              {name: '福建',value: 1000 },
              {name: '贵州',value: 1000 },
              {name: '广东',value: 1000 },
              {name: '青海',value: 1500 },
              {name: '西藏',value: 1500 },
              {
                name: '四川',
                value: 1500,
                itemStyle: {
                  normal: {
                    areaColor:'#1a3741'
                  }
                }
              },
              {name: '宁夏',value: 1500 },
              {name: '海南',value: 1500 },
              {name: '台湾',value: 1500 },
              {name: '香港',value: 1500 },
              {name: '澳门',value: 1500 },
              {
                name: '南海诸岛',value: randomData(), itemStyle:{
                  normal: {
                    opacity:0,
                  }
              }
              }
            ],
            markPoint: {
              symbol: 'circle',
              symbolSize: 15,
              label: {
                normal: {
                  show: false,
                  formatter: function(d) {
                    return d.name
                  }
                }
              },
              data: [{
                name: '产地:安徽砀山',
                coord: [116.58, 34.15]
              }],
              itemStyle: {
                normal: {
                  color: '#f1635e'
                }
              }
            },
            label: {
              normal: {
                formatter: '{b}',
                position: 'right',
                show: false
              },
              emphasis: {
                show: false
              }
            },
            itemStyle: {
              normal: {
                areaColor:'#1a3741',
                color: '#f4e925',
                borderColor: '#fff'

              },
              emphasis: {
                areaColor:'#6bd8ea',
                borderWidth:0,
                borderColor: 'rgba(0,0,0,0)'
              }
            }
          },
          {
            name: '确定意向',
            type: 'map',
            mapType: file_name,
            roam: true,
            showLegendSymbol: false,
            zoom: 1.1,
            data: [
              {
                name: '北京',
                value: 1200,
                itemStyle: {
                  normal: {
                    areaColor: '#1a3741'
                  }
                }
              },
              {
                name: '天津',
                value: 2300,
                itemStyle: {
                  normal: {
                    areaColor: '#1a3741'
                  }
                }
              },
              {name: '上海', value: 500},
              {name: '重庆', value: 500},
              {name: '河北', value: 500},
              {name: '河南', value: 500},
              {name: '云南', value: 500},
              {name: '辽宁', value: 500},
              {name: '黑龙江', value: 500},
              {name: '湖南', value: 500},
              {name: '安徽', value: 1000},
              {name: '山东', value: 1000},
              {name: '新疆', value: 1000},
              {name: '江苏', value: 1000},
              {name: '浙江', value: 1000},
              {name: '江西', value: 1000},
              {name: '湖北', value: 1000},
              {name: '广西', value: 1000},
              {name: '甘肃', value: 1000},
              {name: '山西', value: 1000},
              {name: '内蒙古', value: 1000},
              {name: '陕西', value: 1000},
              {name: '吉林', value: 1000},
              {name: '福建', value: 1000},
              {name: '贵州', value: 1000},
              {name: '广东', value: 1000},
              {name: '青海', value: 1500},
              {name: '西藏', value: 1500},
              {
                name: '四川',
                value: 1200,
                itemStyle: {
                  normal: {
                    areaColor: '#1a3741'
                  }
                }
              },
              {name: '宁夏', value: 2200},
              {name: '海南', value: 2400},
              {name: '台湾', value: 800},
              {name: '香港', value: 600},
              {name: '澳门', value: 400},
              {
                name: '南海诸岛',
                value: randomData(),
                itemStyle: {
                  normal: {
                    opacity: 0,
                  }
                }
              }
            ],
            markPoint: {
              symbol: 'circle',
              symbolSize: 20,
              label: {
                normal: {
                  show: false,
                  formatter: function (d) {
                    return d.name
                  }
                }
              },
              data: [{
                name: '产地:山东砀山',
                coord: [111.58, 30.15]
              }],
              itemStyle: {
                normal: {
                  color: '#ffc528'
                }
              }
            },
            label: {
              normal: {
                formatter: '{b}',
                position: 'right',
                show: false
              },
              emphasis: {
                show: false
              }
            },
            itemStyle: {
              normal: {
                areaColor: '#1a3741',
                color: '#f4e925',
                borderColor: '#fff'

              },
              emphasis: {
                areaColor: '#6bd8ea',
                borderWidth: 0,
                borderColor: 'rgba(0,0,0,0)'
              }
            }
          },
          {
            name: '部署中',
            type: 'map',
            mapType: file_name,
            roam: true,
            showLegendSymbol: false,
            zoom: 1.1,
            data: [
              {
                name: '北京',
                value: 500,
                itemStyle: {
                  normal: {
                    areaColor:'#1a3741'
                  }
                }
              },
              {
                name: '天津',
                value: 500,
                itemStyle: {
                  normal: {
                    areaColor:'#1a3741'
                  }
                }
              },
              {name: '上海',value: 500 },
              {name: '重庆',value: 500 },
              {name: '河北',value: 500 },
              {name: '河南',value: 500 },
              {name: '云南',value: 500 },
              {name: '辽宁',value: 500 },
              {name: '黑龙江',value: 500 },
              {name: '湖南',value: 500 },
              {name: '安徽',value: 1000 },
              {name: '山东',value: 1000 },
              {name: '新疆',value: 1000 },
              {name: '江苏',value: 1000 },
              {name: '浙江',value: 1000 },
              {name: '江西',value: 1000 },
              {name: '湖北',value: 1000 },
              {name: '广西',value: 1000 },
              {name: '甘肃',value: 1000 },
              {name: '山西',value: 1000 },
              {name: '内蒙古',value: 1000 },
              {name: '陕西',value: 1000 },
              {name: '吉林',value: 1000 },
              {name: '福建',value: 1000 },
              {name: '贵州',value: 1000 },
              {name: '广东',value: 1000 },
              {name: '青海',value: 1500 },
              {name: '西藏',value: 1500 },
              {
                name: '四川',
                value: 1500,
                itemStyle: {
                  normal: {
                    areaColor:'#1a3741'
                  }
                }
              },
              {name: '宁夏',value: 1500 },
              {name: '海南',value: 1500 },
              {name: '台湾',value: 1500 },
              {name: '香港',value: 1500 },
              {name: '澳门',value: 1500 },
              {
                name: '南海诸岛',value: randomData(), itemStyle:{
                normal: {
                  opacity:0,
                }
              }
              }
            ],
            markPoint: {
              symbol: 'circle',
              symbolSize: 20,
              label: {
                normal: {
                  show: false,
                  formatter: function(d) {
                    return d.name
                  }
                }
              },
              data: [{
                name: '产地:安徽砀山',
                coord: [116.58, 34.15]
              }],
              itemStyle: {
                normal: {
                  color: '#6bd8ea'
                }
              }
            },
            label: {
              normal: {
                formatter: '{b}',
                position: 'right',
                show: false
              },
              emphasis: {
                show: false
              }
            },
            itemStyle: {
              normal: {
                areaColor:'#1a3741',
                color: '#f4e925',
                borderColor: '#fff'

              },
              emphasis: {
                areaColor:'#6bd8ea',
                borderWidth:0,
                borderColor: 'rgba(0,0,0,0)'
              }
            }
          },
          {
            name: '培训中',
            type: 'map',
            mapType: file_name,
            roam: true,
            showLegendSymbol: false,
            zoom: 1.1,
            data: [
              {
                name: '北京',
                value: 500,
                itemStyle: {
                  normal: {
                    areaColor:'#1a3741'
                  }
                }
              },
              {
                name: '天津',
                value: 500,
                itemStyle: {
                  normal: {
                    areaColor:'#1a3741'
                  }
                }
              },
              {name: '上海',value: 500 },
              {name: '重庆',value: 500 },
              {name: '河北',value: 500 },
              {name: '河南',value: 500 },
              {name: '云南',value: 500 },
              {name: '辽宁',value: 500 },
              {name: '黑龙江',value: 500 },
              {name: '湖南',value: 500 },
              {name: '安徽',value: 1000 },
              {name: '山东',value: 1000 },
              {name: '新疆',value: 1000 },
              {name: '江苏',value: 1000 },
              {name: '浙江',value: 1000 },
              {name: '江西',value: 1000 },
              {name: '湖北',value: 1000 },
              {name: '广西',value: 1000 },
              {name: '甘肃',value: 1000 },
              {name: '山西',value: 1000 },
              {name: '内蒙古',value: 1000 },
              {name: '陕西',value: 1000 },
              {name: '吉林',value: 1000 },
              {name: '福建',value: 1000 },
              {name: '贵州',value: 1000 },
              {name: '广东',value: 1000 },
              {name: '青海',value: 1500 },
              {name: '西藏',value: 1500 },
              {
                name: '四川',
                value: 1500,
                itemStyle: {
                  normal: {
                    areaColor:'#1a3741'
                  }
                }
              },
              {name: '宁夏',value: 1500 },
              {name: '海南',value: 1500 },
              {name: '台湾',value: 1500 },
              {name: '香港',value: 1500 },
              {name: '澳门',value: 1500 },
              {
                name: '南海诸岛',value: randomData(), itemStyle:{
                normal: {
                  opacity:0,
                }
              }
              }
            ],
            markPoint: {
              symbol: 'circle',
              symbolSize: 20,
              label: {
                normal: {
                  show: false,
                  formatter: function(d) {
                    return d.name
                  }
                }
              },
              data: [{
                name: '产地:安徽砀山',
                coord: [116.58, 34.15]
              }],
              itemStyle: {
                normal: {
                  color: '#00d991'
                }
              }
            },
            label: {
              normal: {
                formatter: '{b}',
                position: 'right',
                show: false
              },
              emphasis: {
                show: false
              }
            },
            itemStyle: {
              normal: {
                areaColor:'#1a3741',
                color: '#f4e925',
                borderColor: '#fff'

              },
              emphasis: {
                areaColor:'#6bd8ea',
                borderWidth:0,
                borderColor: 'rgba(0,0,0,0)'
              }
            }
          },
          {
            name: '使用中',
            type: 'map',
            mapType: file_name,
            roam: true,
            showLegendSymbol: false,
            zoom: 1.1,
            data: [
              {
                name: '北京',
                value: 500,
                itemStyle: {
                  normal: {
                    areaColor:'#1a3741'
                  }
                }
              },
              {
                name: '天津',
                value: 500,
                itemStyle: {
                  normal: {
                    areaColor:'#1a3741'
                  }
                }
              },
              {name: '上海',value: 500 },
              {name: '重庆',value: 500 },
              {name: '河北',value: 500 },
              {name: '河南',value: 500 },
              {name: '云南',value: 500 },
              {name: '辽宁',value: 500 },
              {name: '黑龙江',value: 500 },
              {name: '湖南',value: 500 },
              {name: '安徽',value: 1000 },
              {name: '山东',value: 1000 },
              {name: '新疆',value: 1000 },
              {name: '江苏',value: 1000 },
              {name: '浙江',value: 1000 },
              {name: '江西',value: 1000 },
              {name: '湖北',value: 1000 },
              {name: '广西',value: 1000 },
              {name: '甘肃',value: 1000 },
              {name: '山西',value: 1000 },
              {name: '内蒙古',value: 1000 },
              {name: '陕西',value: 1000 },
              {name: '吉林',value: 1000 },
              {name: '福建',value: 1000 },
              {name: '贵州',value: 1000 },
              {name: '广东',value: 1000 },
              {name: '青海',value: 1500 },
              {name: '西藏',value: 1500 },
              {
                name: '四川',
                value: 1500,
                itemStyle: {
                  normal: {
                    areaColor:'#1a3741'
                  }
                }
              },
              {name: '宁夏',value: 1500 },
              {name: '海南',value: 1500 },
              {name: '台湾',value: 1500 },
              {name: '香港',value: 1500 },
              {name: '澳门',value: 1500 },
              {
                name: '南海诸岛',value: randomData(), itemStyle:{
                normal: {
                  opacity:0,
                }
              }
              }
            ],
            markPoint: {
              symbol: 'circle',
              symbolSize: 20,
              label: {
                normal: {
                  show: false,
                  formatter: function(d) {
                    return d.name
                  }
                }
              },
              data: [{
                name: '产地:安徽砀山',
                coord: [116.58, 34.15]
              }],
              itemStyle: {
                normal: {
                  color: '#939fdf'
                }
              }
            },
            label: {
              normal: {
                formatter: '{b}',
                position: 'right',
                show: false
              },
              emphasis: {
                show: false
              }
            },
            itemStyle: {
              normal: {
                areaColor:'#1a3741',
                color: '#f4e925',
                borderColor: '#fff'

              },
              emphasis: {
                areaColor:'#6bd8ea',
                borderWidth:0,
                borderColor: 'rgba(0,0,0,0)'
              }
            }
          }
        ],
        color: ['#939fdf', '#f1635e', '#ffc528', '#00d991', '#6bd8ea']
      };
      myChart.on('mouseover', function(area) {
        if (file_name === 'china') {
          _.each(GVR.JSON.provinceArray, function(province) {
            myChart.dispatchAction({
              type: 'mapUnSelect',
              name: province
            })
          });
          if(area.componentType === 'series') {
            _.each(GVR.JSON.area_json, function(areaJson, key) {
              _.each(areaJson, function(area_province) {
                if (area.name === area_province) {
                  _.each(GVR.JSON.area_json[key], function(province_text, province_key) {
                    if (province_key !== 0) {
                      myChart.dispatchAction({
                        type: 'mapSelect',
                        name: province_text
                      })
                    }
                  })
                }
              })
            });
          }
        }

      });
      myChart.on('globalout', function(area) {
        _.each(GVR.JSON.provinceArray, function(province) {
          myChart.dispatchAction({
            type: 'mapUnSelect',
            name: province
          })
        });
      });
      myChart.on('click', function(area) {
        console.log(area);
        if(area.componentType === 'markPoint') {
          var dom = myChart.getDom();
          var dom_left = $(dom).width();
          var dom_top = $(dom).height();
          var $body = $('body');
          $body.find('.hospital-alert').remove();
          var $alert_map_tpl = $(self.alert_map_tpl());
          $alert_map_tpl.find('.hospital-title').css('color', area.color);
          $alert_map_tpl.find('.alert-radius-border').css('border-color', area.color);
          $body.append($alert_map_tpl);
          var alert_height = $alert_map_tpl.height();
          var alert_width = $alert_map_tpl.width();
          var left = area.event.offsetX + alert_width / 8;
          var top = area.event.offsetY - alert_height / 7;
          if ((left + alert_width) > dom_left) {
            left =  area.event.offsetX - alert_width;
          }
          if (top + alert_height > dom_top) {
            top = area.event.offsetY - alert_height*2 / 3;
            left =  area.event.offsetX - alert_width /2 + 11 ;
          } else if (top < 10) {
            top = area.event.offsetY + alert_height*2 / 3 - 25;
            left =  area.event.offsetX - alert_width /2 + 11 ;
          }
          $alert_map_tpl.css({'border-color': area.color, 'left': left +'px', 'top': top + 'px'});
        }
        else {

        }
      });
      myChart.on('mousedown', function(area) {
        console.log(area);
        var $body = $('body');
        $body.find('.hospital-alert').remove();
      });
      myChart.setOption(option);
      GVR.ECHARTS.AREA_MAP = myChart;
    });
  }
};

$(function() {
  ECHARTS_FUNC.ready_init ();
})
;