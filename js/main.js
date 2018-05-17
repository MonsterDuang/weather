// document.addEventListener('plusready', Main)

/**
 * @description 获取地理位置  显示天气信息 
 * */ 
function Main() {
	// 下拉刷新
	mui('#pullrefresh').pullRefresh().refresh(true)
	//console.log("所有plus api都应该在此事件发生后调用，否则会出现plus is undefined。"
	/**
	 * 位置工具
	 * */
	var watchId = null;
	/**
	 * @description 监听位置变化信息
	 * */ 
	watchPosition()
	function watchPosition(){
		if (watchId) {
	        return;
	    }
	   watchId = plus.geolocation.watchPosition(function(p){
	        geoInf(p);
	        postToServer(p);
	    }, function(e){
	        $('#site').text("Geolocation error: " + e.message);
	    }); 
	}
	/**
	 * @description 通过定位模块获取位置信息
	 * */ 
	function getGeocode() {
	    plus.geolocation.getCurrentPosition(geoInf, function(e) {
	        $('#site').text("获取定位位置信息失败：" + e.message);
	    }, {
	        geocode: true,
	        provider: 'amap'
	    });
	}
	/**
	 * @description 处理位置信息
	 * */ 
	function geoInf(position) {
		var site = JSON.stringify(position.address.district)
		$('.city').text(JSON.parse(site))
		showWeather(JSON.parse(site))
		clearWatch()  // 停止监听位置变化信息
	}
	/**
	 * @description 停止监听位置变化信息
	 * */ 
	function clearWatch(){
	    if (watchId) {
	        plus.geolocation.clearWatch(watchId);
	        watchId = null;
	    }
	}
	/*
	 * @description 通过定位获取到地理信息  传到 这里 获取天气信息
	 * */
	$("#btn").click(showWeather)
	function showWeather (site) {
		var city = tex.value || site
		var url = "http://wthrcdn.etouch.cn/weather_mini?city="
		var URL = url + city
		$.get(URL, function (result) {
			tex.value = ''
			var obj = JSON.parse(result).data
			mui('#pullrefresh').pullRefresh().endPulldownToRefresh()  // 结束下拉刷新
			$('.city').text(obj.city)
			$('.now-wendu').text(obj.wendu + '℃')
			var today = obj.forecast[0]
			$('.icon-type-weather').attr('src', getImg(today.type))
			var detail = today.type + ' ' + today.low.substr(3) + '/' + today.high.substr(3)
			$('.type').text(detail)
			$('.ganmao').text(obj.ganmao)
			var Week = obj.forecast
			if ($('.after li').length === 5) {
				$('.after li').remove()
			}
			for (var i = 0; i < Week.length; i++) {
				$li = $('<li></li>')
				$('.after').append($li)
				$date = $('<p></p>').attr('class', 'date')
				$li.append($date)
				var day = Week[i].date.split('日')[0]
				$date.append($('<p></p>').text(day + '日'))
				var week = i === 0 ? '今天' : Week[i].date.split('日')[1]
				$date.append($('<p></p>').text(week))
				$img = $('<img></img>').attr({
					'src': getImg(Week[i].type),
					'class': 'icon-type-weather-week'
				})
				$li.append($img)
				$high = $('<p></p>').attr('class', 'high').text(Week[i].high.substr(3))
				$low = $('<p></p>').attr('class', 'low').text(Week[i].low.substr(3))
				$li.append($high)
				$li.append($low)
			}
		})
	}
	/*
	 * @description 返回天气状图
	 * */
	function getImg(type) {
		switch (type) {
			case '多云':
				return './img/duoyun.png'
				break
			case '暴雪':
				return './img/baoxue.png'
				break
			case '暴雨':
				return './img/baoyu.png'
				break
			case '大暴雨':
				return './img/dabaoyu.png'
				break
			case '大雪':
				return './img/daxue.png'
				break
			case '大雨':
				return './img/dayu.png'
				break
			case '雷阵雨':
				return './img/leizhenyu.png'
				break
			case '晴':
				return './img/qing.png'
				break
			case '特大暴雨':
				return './img/tedabaoyu.png'
				break
			case '雾':
				return './img/wu.png'
				break
			case '小雪':
				return './img/xiaox.png'
				break
			case '小雨':
				return './img/xiaoyu.png'
				break
			case '阴':
				return './img/yin.png'
				break
			case '雨夹雪':
				return './img/yujiaxue.png'
				break
			case '阵雪':
				return './img/zhenxue.png'
				break
			case '阵雨':
				return './img/zhenyu.png'
				break
			case '中雪':
				return './img/zhongxue.png'
				break
			case '中雨':
			case '小到中雨':
				return './img/zhongyu.png'
				break
		}
	}
}

