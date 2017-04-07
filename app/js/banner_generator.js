 /**
  * author: liangff
  * canvas 画图
  */

 /*
  * banner_generator 的使用过程
  * 编辑打开面板，设定banner的宽高
  * 选择背景图（最好可以拖动）或者选择背景色
  * 背景虚化效果
  * 撰写标题和描述（可拖动）
  * 任何修改，都能马上验证，并且生成预览
  * 可以预览
  */


 /*
  * 思路：声明全局变量，记录用户设置的参数
  * 每次用户修改某个属性，修改相应的全局变量
  * 并且重新画图
  */


 /* TODO:
  * 1. 拖拽文字
  * 2. 标题模糊背景
  * 3. canvas高度变化后，文字拉拽变形 解决方案：不允许用户修改宽高
  * 4. 引入背景图，允许裁切
  * 5. 新思路：多层可拖动，每层相互独立。点击生成图片时，再绘制canvas，并转化为img
  */

 // 声明变量
 var canvas, image, width, height, iLeft, iTop, bgRGBA, bgOpacity, bgHeight,
     titleFontSize, titleFontColor, titleLeft, titleTop, title,
     desFontSize, desFontColor, desLeft, desTop, description, titleFontStyle, desFontStyle;
 var bgRGB = '255,255,255';
 var olRGB = '255,255,255';
 var shwRGB = '255,255,255';
 var changeRGB = '255,255,255';
 var imgScale = 1;

 function initConfig() {
     width = $('#width').val();
     height = $('#height').val();
     imgScale = $('#imgScale').val();
     iLeft = $('#iLeft').val();
     iTop = $('#iTop').val();
     bgOpacity = $('#bgOpacity').val();
     bgRGBA = 'rgba(' + bgRGB + ',' + bgOpacity + ')';
     olRGBA = 'rgba(' + olRGB + ',' + bgOpacity + ')';
     shwRGBA = 'rgba(' + shwRGB + ',' + bgOpacity + ')';
     changeRGBA = 'rgba(' + changeRGB + ',' + bgOpacity + ')';
     bgtexture = $('#bgtexture').val();
     bgHeight = $('#bgHeight').val();
     shadowLeft = $('#shadowLeft').val(); //左侧阴影
     shadowRight = $('#shadowRight').val(); //右侧阴影
     titleFontSize = $('#titleFontSize').val();
     titleFontColor = $('#titleFontColor').val();
     titleFontStyle = $('#titleFontStyle').val(); //标题字体
     desFontStyle = $('#desFontStyle').val(); //副标题字体
     titleLeft = $('#titleLeft').val();
     titleTop = $('#titleTop').val();
     title = $('#title').val();

     desFontSize = $('#desFontSize').val();
     desFontColor = $('#desFontColor').val();
     desTop = $('#desTop').val();
     desLeft = $('#desLeft').val();
     description = $('#description').val();
 }

 initConfig();

 // 检查某字段是否合法
 function checkFormat(id, reg, tip, defaultValue) {
     var node = $('#' + id);
     var value = node.val();
     if (!reg.test(value)) {
         alert(tip);
         node.val() = defaultValue;
         node.focus();
         return false;
     }
     return true;
 }


 // 创建画布，如果原来有，应该销毁
 function createCanvas() {
     canvas = document.createElement('canvas');
     canvas.id = 'adMaker';
     canvas.width = width;
     canvas.height = height;
     $('#paper').html('');
     $('#paper').append(canvas);

 }

 // 读取文件数据
 var FileData = new FileReader();
 // 文件加载事件
 FileData.onload = function(event) {
     image = new Image();
     // 文件加载事件
     image.onload = function() {
             drawBanner();
         }
         // event.target.result 获取文件路径
     image.src = event.target.result;

 }

 $('#file').on('change', function(e) { //change 事件监听
     getfile(e);
 });

 function getfile() { //获取图片文件
     // 验证上传文件格式
     var fileFilter = /^(?:image\/bmp|image\/cis\-cod|image\/gif|image\/ief|image\/jpeg|image\/jpeg|image\/jpeg|image\/pipeg|image\/png|image\/svg\+xml|image\/tiff|image\/x\-cmu\-raster|image\/x\-cmx|image\/x\-icon|image\/x\-portable\-anymap|image\/x\-portable\-bitmap|image\/x\-portable\-graymap|image\/x\-portable\-pixmap|image\/x\-rgb|image\/x\-xbitmap|image\/x\-xpixmap|image\/x\-xwindowdump)$/i;

     var files = document.getElementById('file').files;
     if (files.length === 0) { //如果没有传图片~创建画布继续执行
         //颜色点击事件
         createCanvas();
     } else {
         var oFile = files[0];
         if (!fileFilter.test(oFile.type)) {
             alert("上传的文件必须是图片格式!");
             return;
         }
         //传递数据到FileData，数据加载后引发FileData.onload事件
         FileData.readAsDataURL(oFile);
     }
 }




 function drawBanner() { //有背景图片的动作

     canvas = document.getElementById('adMaker');
     var context = canvas.getContext('2d');

     context.clearRect(0, 0, width, height);

     //绘制背景渐变
     var changecol = context.createLinearGradient(0, 0, width, height);
     changecol.addColorStop(0, bgRGBA);
     changecol.addColorStop(1, changeRGBA);
     context.fillStyle = changecol;
     context.fillRect(0, 0, width, height);

     if (typeof image != 'undefined') {
         //向画布上绘制图片
         context.drawImage(image, iLeft, iTop, image.width * imgScale, image.height * imgScale);
     }

     // 绘制标题文字
     context.fillStyle = titleFontColor;
     context.font = 'bold ' + titleFontSize + 'px ' + titleFontStyle;
     context.fillText(title, titleLeft, titleTop);

     //绘制描边文字
     context.fillStyle = titleFontColor;
     context.fillText(title, titleLeft, titleTop)
     context.strokeStyle = olRGBA;
     context.strokeText(title, titleLeft, titleTop);

     //文字阴影
     context.shadowOffsetX = shadowLeft;
     context.shadowOffsetY = shadowRight;
     context.shadowColor = shwRGBA;
     context.fillText(title, titleLeft, titleTop);

     //绘制描述文字
     context.fillStyle = desFontColor;
     context.font = 'normal ' + desFontSize + 'px ' + desFontStyle;
     context.fillText(description, desLeft, desTop);
     if (typeof image != 'undefined' && bgtexture != 'no-repeat') {
         //绘制纹理 

         var pattern = context.createPattern(image, bgtexture);
         context.fillStyle = pattern;
         context.fillRect(0, 0, width, bgHeight);
     }

 }


 function showImage() { //展示图片
     $('#mb').show();
     $("#MyPix").show();

     mb.onclick = function() {
         $('#mb').hide();
         $("#MyPix").hide();
     }
 }

 function validate($dom) {
     var reg = new RegExp($dom.data('reg'));
     var msg = $dom.data('msg');
     if (!reg.test($dom.val())) {
         $dom.addClass('error')
         alert(msg);
         return false;
     }
     return true;
 }

 $('#sizeConfirm').on('click', function() {
     $(this).hide();
     $('#width').attr('disabled', true);
     $('#height').attr('disabled', true)
     $('li').show();
     createCanvas();
 })

 // input change事件
 $('input').on('change', function() {
     if (validate($(this))) {
         window[$(this).attr('id')] = $(this).val()
         if ($(this).attr('id') != 'width' && $(this).attr('id') != 'height')
             drawBanner();
     }

 });


 $('#putOut').on('click', function() {
     if (canvas.getContext) {
         var ctx = canvas.getContext("2d"); // 获取2d画布
         var myImage = canvas.toDataURL("image/png"); // 转化为图像数据
     }
     $("#MyPix").attr('src', myImage); // 获取一个图像NODE
     showImage();
     alert('请右键点击图片另存为存储图片！');
 });

 // // select change 事件
 $('select').on('change', function() {
     window[$(this).attr('id')] = $(this).val()
     console.log($(this).attr('id') + ':' + $(this).val())
     drawBanner();
 });


 // 背景颜色点击事件
 $('#colorWarp i').on('click', function() {
     bgRGB = $(this).attr('rgb')
     bgRGBA = 'rgba(' + bgRGB + ',' + bgOpacity + ')';
     $(this).addClass('current').siblings().removeClass('current')
     drawBanner();
 });

 // //描边颜色点击
 $('#coloroutline i').on('click', function() {
     olRGB = $(this).attr('rgb')

     olRGBA = 'rgba(' + olRGB + ',' + bgOpacity + ')';

     $(this).addClass('current').siblings().removeClass('current')
     drawBanner();

 });

 //阴影颜色
 $('#colorshadow i').on('click', function() {
     shwRGB = $(this).attr('rgb')
     shwRGBA = 'rgba(' + shwRGB + ',' + bgOpacity + ')';
     $(this).addClass('current').siblings().removeClass('current')
     validate($(this));
     drawBanner();
 });

 // //背景渐变颜色
 $('#colorchange i').on('click', function() {
     changeRGB = $(this).attr('rgb')
     changeRGBA = 'rgba(' + changeRGB + ',' + bgOpacity + ')';
     $(this).addClass('current').siblings().removeClass('current')
     validate($(this));
     drawBanner();
 });
