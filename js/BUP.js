//$(function ($) {
// 往jQuery对象注册一个 BUP 方法
$.fn.BUP = function (brother, beishu) {
	console.log(this) // this为 $() 选择器选择的jQuery对象
  var $element = this;
  var $className = $element.attr('class');
  var $class1, $brother; // class 与 brother 变量 
	// If the target element is not an image
	// 首先判断这个挂载元素是不是一个img标签
	if (!$element.is('img')) {
		console.log(
			'%c Blowup.js Error: ' + '%cTarget element is not an image.',
			'background: #FCEBB6; color: #F07818; font-size: 17px; font-weight: bold;',
			'background: #FCEBB6; color: #F07818; font-size: 17px;'
		)
		return
	}

	// Constants
	// 定义常量
	var $IMAGE_URL = $element.attr('src')  // 挂载img元素的 src标签 地址
	var $brotherSrc = $('.' + brother).attr('src')  // 兄弟元素的 src标签 地址
	var $IMAGE_WIDTH = $element.width()  // 挂载元素的宽
  var $IMAGE_HEIGHT = $element.height()  // 挂载元素的高
	var NATIVE_IMG = new Image()  // 放大镜图片资源
	NATIVE_IMG.src = $element.attr('src') // 设置放大镜的图片资源地址
	//NATIVE_IMG.width = "900";
	//NATIVE_IMG.height = "900";

  // Default attributes
  // 默认放大镜图片属性
	var defaults = {
		round: true,  // 是否为圆形
		width: 200,  // 放大镜宽
		height: 200,  // 放大镜高
		background: '#FFF', // 背景颜色
		shadow: '0 8px 17px 0 rgba(0, 0, 0, 1)',  // 放大镜边缘阴影
		border: '6px solid #FFF',  // 放大镜边框
		cursor: true,  // 
		zIndex: 999999,  // 设置层级
	}

  // Update defaults with custom attributes
  // 更新默认属性( 如有需要 )
	var $options = defaults

  // Modify target image
  // 更新指向图片
	$element.on('dragstart', function (e) {
		e.preventDefault()
  })
  // 
	$element.css('cursor', $options.cursor ? 'crosshair' : 'none')

	// Create magnification lens element
	var lens = document.createElement('div')
	lens.id = '' + $className + 'BlowupLens'

	// Attack the element to the body
	$('body').append(lens)

	// Updates styles
	$blowupLens = $('#' + lens.id)

	$blowupLens.css({
		position: 'absolute',
		visibility: 'hidden',
		'pointer-events': 'none',
		zIndex: $options.zIndex,
		width: $options.width,
		height: $options.height,
		border: $options.border,
		background: $options.background,
		'border-radius': $options.round ? '50%' : 'none',
		'box-shadow': $options.shadow,
		'background-repeat': 'no-repeat',
	})

  // Show magnification lens
  // 鼠标划入时
	$element.mouseenter(function () {
		$class1 = $element.attr('class')
		$blowupLens = $('#' + $class1 + 'BlowupLens')
		$blowupLens.css('visibility', 'visible')
		$brother = $('#' + brother + 'BlowupLens')
		$brother.css('visibility', 'visible')
	})

  // Mouse motion on image
  // 鼠标移动时
	$element.mousemove(function (e) {
		/*$blowupLens = $("#"+$class1+"BlowupLens");
    	$brother = $("#"+brother+"BlowupLens");*/
    // Lens position coordinates
    // 用 pageX 和 pageY 来确定鼠标位置
		var lensX = e.pageX - $options.width / 2
		var lensY = e.pageY - $options.height / 2
    // Relative coordinates of image
    // relX, relY
		var relX = e.offsetX  // 当前鼠标位置 距离父元素的距离
    var relY = e.offsetY  // 
    // console.log(relX);
    // console.log(relY);
    // Zoomed image coordinates
    // 缩放后的X坐标
		var zoomX = -Math.floor(
			(relX / $element.width()) * NATIVE_IMG.width - $options.width / 2
    )
    // 缩放后的Y坐标
		var zoomY = -Math.floor(
			(relY / $element.height()) * NATIVE_IMG.height - $options.height / 2
		)
		//console.log(relX+"/"+$element.width()+"*"+ NATIVE_IMG.width );
		//console.log(zoomX);
		//console.log(zoomY);
		var bgSize
		switch (beishu) {
			case 0.5:
				zoomX = zoomX + zoomX * beishu
				zoomY = zoomY + zoomY * beishu
				bgSize = 400 * 2.5
				break
			case 1.5:
				zoomX = zoomX + zoomX * beishu
				zoomY = zoomY + zoomY * beishu
				bgSize = 400 * 3.5
				break
			default:
				bgSize = NATIVE_IMG.width
    }
    
		// 尝试使用滚轮控制放大
		document.onmousewheel = function (e) {
			e = event || window.event
			if (e.wheelDelta === 120) {
        zoomX = zoomX + zoomX * 0.5;
        zoomY = zoomY + zoomY * 0.5;
        bgSize = 400 * 2.5;
				console.log('Q')
			}
			if (e.wheelDelta === -120) {
				console.log('Hou')
			}
		}
		//尝试结束
		// Apply styles to lens
		$blowupLens.css({
			left: lensX,
			top: lensY,
			'background-image': 'url(' + $IMAGE_URL + ')',
			'background-position': zoomX + ' ' + zoomY,
			'background-size': bgSize,
		})
		// 此处if else 待优化逻辑。↓
		if (brother == 'rightImg') {
			$brother.css({
				left: lensX + $element.parent().width(),
				top: lensY,
				'background-image': 'url(' + $brotherSrc + ')',
				'background-position': zoomX + ' ' + zoomY,
				'background-size': bgSize,
			})
		} else if (brother == 'laftImg') {
			$brother.css({
				left: lensX - $element.parent().width(),
				top: lensY,
				'background-image': 'url(' + $brotherSrc + ')',
				'background-position': zoomX + ' ' + zoomY,
				'background-size': bgSize,
			})
		}
	})

	// 鼠标移除
	$element.mouseleave(function () {
		document.onmousewheel = null
		/*$blowupLens = $("#"+$class1+"BlowupLens");*/
		$blowupLens.css('visibility', 'hidden')
		/*$brother = $("#"+brother+"BlowupLens");*/
		$brother.css('visibility', 'hidden')
	})
}
//})
