/**
 * author: VVG
 * My blog: http://www.cnblogs.com/NNUF/
 */
var Tool = {
    $: function(arg, context) {
        var tagAll, n, eles = [],
            i, sub = arg.substring(1);
        context = context || document;
        if (typeof arg == 'string') {
            switch (arg.charAt(0)) {
                case '#':
                    return document.getElementById(sub);
                    break;
                case '.':
                    if (context.getElementsByClassName) return context.getElementsByClassName(sub);
                    tagAll = $('*', context);
                    n = tagAll.length;
                    for (i = 0; i < n; i++) {
                        if (tagAll[i].className.indexOf(sub) > -1) eles.push(tagAll[i]);
                    }
                    return eles;
                    break;
                default:
                    return context.getElementsByTagName(arg);
                    break;
            }
        }
    },
    /* 添加样式名 */
    addClass: function(c, node) {
        if (!node) return;
        node.className = this.hasClass(c, node) ? node.className : node.className + ' ' + c;
    },

    /* 移除样式名 */
    removeClass: function(c, node) {
        var reg = new RegExp("(^|\\s+)" + c + "(\\s+|$)", "g");
        if (!this.hasClass(c, node)) return;
        node.className = reg.test(node.className) ? node.className.replace(reg, '') : node.className;
    },

    /* 是否含有CLASS */
    hasClass: function(c, node) {
        if (!node || !node.className) return false;
        return node.className.indexOf(c) > -1;
    }
}
var AdMacker = function() {
    var image, width, height, iLeft, iTop, bgRGBA, bgOpacity, bgHeight,
        titleFontSize, titleFontColor, titleLeft, titleTop, title,
        desFontSize, desFontColor, desLeft, desTop, description, titleFontStyle, desFontStyle;
    var bgRGB = '255,255,255';
    var olRGB = '255,255,255';
    var shwRGB = '255,255,255';
    var changeRGB = '255,255,255';
    var imgScale = 1;
    var regex = {
        reg1: /^([1-9]\d*)$/, // 验证正整数
        reg2: /^-?(0|[1-9]\d*)$/, // 验证零正负整数
        reg3: /^(0|0\.\d*|1)$/, // 验证透明度0-1
        reg4: /^([1-9]|10|0\.\d*)$/, // 缩放比例0-10，不包含0
        reg5: /^#([0-9a-zA-Z]{3}|[0-9a-zA-Z]{6})$/ // 验证颜色值
    }
    var tips = ['宽高只能为大于0的整数', '偏移量只能为零和正负整数',
        '透明度值在0-1之间，包括0和1', '比例限制在0-10之间，不包含0',
        '字号只能为正整数', '颜色值格式不正确，为#fff或#ffffff格式'
    ];

    // 读取文件数据
    var FileData = new FileReader();
    // 文件加载事件
    FileData.onload = function(event) {
        image = new Image();
        // 文件加载事件
        image.onload = function() {
                drawImg(image, iLeft, iTop, image.width * imgScale, image.height * imgScale);
            }
            // event.target.result 获取文件路径
        image.src = event.target.result;
    }


    // 创建画布
    function createCanvas() {
        var adMaker, canvas;
        if (!checkValue()) {
            return;
        }
        if (adMaker = Tool.$('#adMaker')) {
            adMaker.width = width;
            adMaker.height = height;
        } else {
            canvas = document.createElement('canvas');
            canvas.id = 'adMaker';
            canvas.width = width;
            canvas.height = height;
            Tool.$('#paper').innerHTML = '';
            Tool.$('#paper').appendChild(canvas);
        }
        //获取文件
        getfile();
    }

    function getfile() {//获取图片文件
        var file = Tool.$('#file');
        // 验证上传文件格式
        var fileFilter = /^(?:image\/bmp|image\/cis\-cod|image\/gif|image\/ief|image\/jpeg|image\/jpeg|image\/jpeg|image\/pipeg|image\/png|image\/svg\+xml|image\/tiff|image\/x\-cmu\-raster|image\/x\-cmx|image\/x\-icon|image\/x\-portable\-anymap|image\/x\-portable\-bitmap|image\/x\-portable\-graymap|image\/x\-portable\-pixmap|image\/x\-rgb|image\/x\-xbitmap|image\/x\-xpixmap|image\/x\-xwindowdump)$/i;
        if (file.files.length === 0) { //如果没有传图片~传背景颜色

            // alert('请选择图片!');
            // return;
            // 颜色点击事件
            // var labelI = Tool.$('#colorWarp').getElementsByTagName('i');
            // for (var j = 0, n = labelI.length; j < n; j++) {
            //     labelI[j].onclick = function() {
            //         bgRGB = this.getAttribute('rgb');
            //         var currents = Tool.$('.current', Tool.$('#colorWarp'));
            //         Tool.removeClass('current', currents[0]);
            //         Tool.addClass('current', this);
            //         createCanvas();
                  
            //     }
            // }
        } else {
            var oFile = file.files[0];
            if (!fileFilter.test(oFile.type)) {
                alert("上传的文件必须是图片格式!");
                return;
            }
            //传递数据到FileData，数据加载后引发FileData.onload事件
            FileData.readAsDataURL(oFile);
        }
    }

    function drawImg(img, left, top, imgwidth, imgheight) {//画图
        var canvas = Tool.$('#adMaker');
        var context = canvas.getContext('2d');
        // 绘制背景
        context.fillStyle = bgRGBA;
        context.fillRect(0, height - bgHeight, width, bgHeight);
        var changecol = context.createLinearGradient(0, 0, 640, 0);
        //创建画布
        context.clearRect(0, 0, width, height);
        context.drawImage(img, left, top, imgwidth, imgheight);

        //绘制背景渐变
        changecol.addColorStop(0, bgRGBA);
        changecol.addColorStop(1, changeRGBA);
        context.fillStyle = changecol;
        context.fillRect(0, 0, width, bgHeight);
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
        //绘制纹理    
        var pattern = context.createPattern(img, bgtexture);
        context.fillStyle = pattern;
        context.fillRect(0, 0, width, bgHeight);

    }

    function putOut() {
        var canvas = Tool.$("#adMaker");
        if (canvas.getContext) {
            var ctx = canvas.getContext("2d"); // 获取2d画布
            var myImage = canvas.toDataURL("image/png"); // 转化为图像数据
        }
        var imageElement = Tool.$("#MyPix"); // 获取一个图像NODE
        imageElement.src = myImage;
        showImage();
        alert('请右键点击图片另存为存储图片！');
    }

    function showImage() {
        var mb = Tool.$('#mb');
        var img = Tool.$("#MyPix");
        mb.style.display = 'block';
        img.style.display = 'block';
        mb.onclick = function() {
            mb.style.display = 'none';
            img.style.display = 'none';
        }
    }

    function checkValue() {
        // 获取所有
        width = Tool.$('#adWidth').value;
        height = Tool.$('#adHeight').value;
        imgScale = Tool.$('#imgScale').value;
        iLeft = Tool.$('#iLeft').value;
        iTop = Tool.$('#iTop').value;
        bgOpacity = Tool.$('#bgOpacity').value;
        bgRGBA = 'rgba(' + bgRGB + ',' + bgOpacity + ')';
        olRGBA = 'rgba(' + olRGB + ',' + bgOpacity + ')';
        shwRGBA = 'rgba(' + shwRGB + ',' + bgOpacity + ')';
        changeRGBA = 'rgba(' + changeRGB + ',' + bgOpacity + ')';
        //startRGB = 'rgba(' + bgRGB + ')';
        //endRGB = 'rgba(' + changeRGBA + ')';
        bgtexture = Tool.$('#bgtexture').value;
        bgHeight = Tool.$('#bgHeight').value;
        shadowLeft = Tool.$('#shadowLeft').value; //左侧阴影
        shadowRight = Tool.$('#shadowRight').value; //右侧阴影
        titleFontSize = Tool.$('#titleFontSize').value;
        titleFontColor = Tool.$('#titleFontColor').value;
        titleFontStyle = Tool.$('#titleFontStyle').value; //标题字体
        desFontStyle = Tool.$('#desFontStyle').value; //副标题字体
        titleLeft = Tool.$('#titleLeft').value;
        titleTop = Tool.$('#titleTop').value;
        title = Tool.$('#title').value;

        desFontSize = Tool.$('#desFontSize').value;
        desFontColor = Tool.$('#desFontColor').value;
        desTop = Tool.$('#desTop').value;
        desLeft = Tool.$('#desLeft').value;
        description = Tool.$('#description').value;

        // 画布
        if (!checkFormat('adWidth', regex.reg1, tips[0], 670)) return false;
        if (!checkFormat('adHeight', regex.reg1, tips[0], 240)) return false;

        // 图片
        if (!checkFormat('imgScale', regex.reg4, tips[3], 1)) return false;
        if (!checkFormat('iLeft', regex.reg2, tips[1], 0)) return false;
        if (!checkFormat('iTop', regex.reg2, tips[1], 0)) return false;

        // 背景
        if (!checkFormat('bgOpacity', regex.reg3, tips[2], 0.5)) return false;
        if (!checkFormat('bgHeight', regex.reg1, tips[0], 60)) return false;

        // 标题
        if (!checkFormat('titleFontSize', regex.reg1, tips[4], 25)) return false;
        if (!checkFormat('titleFontColor', regex.reg5, tips[5], '#fff')) return false;
        // if(!checkFormat('titleFontStyle',regex.reg5,tips[5],'微软雅黑'))return false;
        if (!checkFormat('titleLeft', regex.reg2, tips[1], 10)) return false;
        if (!checkFormat('titleTop', regex.reg2, tips[1], 10)) return false;

        // 描述
        if (!checkFormat('desFontSize', regex.reg1, tips[4], 25)) return false;
        if (!checkFormat('desFontColor', regex.reg5, tips[5], '#fff')) return false;
        if (!checkFormat('desLeft', regex.reg2, tips[1], 10)) return false;
        if (!checkFormat('desTop', regex.reg2, tips[1], 10)) return false;

        return true;
    }

    function checkFormat(id, reg, tip, defaultValue) {
        var node = Tool.$('#' + id);
        var value = node.value;
        if (!reg.test(value)) {
            alert(tip);
            node.value = defaultValue;
            node.focus();
            return false;
        }
        return true;
    }

    // change事件
    var inputs = Tool.$('input');
    for (var i = 0, k = inputs.length; i < k; i++) {
        if (inputs[i].type != 'button') {
            inputs[i].onchange = createCanvas;
        }
    }
    Tool.$('#putOut').onclick = putOut;

    // 背景颜色点击事件
    var labelI = Tool.$('#colorWarp').getElementsByTagName('i');
    for (var j = 0, n = labelI.length; j < n; j++) {
        labelI[j].onclick = function() {
            bgRGB = this.getAttribute('rgb');
            var currents = Tool.$('.current', Tool.$('#colorWarp'));
            Tool.removeClass('current', currents[0]);
            Tool.addClass('current', this);
            createCanvas();
        }
    }
    //描边颜色点击
    var outline = Tool.$('#coloroutline').getElementsByTagName('i');
    var len = outline.length;
    for (var k = 0; k < len; k++) {
        outline[k].onclick = function() {
            olRGB = this.getAttribute('rgb');
            var currents = Tool.$('.current', Tool.$('#coloroutline'));
            Tool.removeClass('current', currents[0]);
            Tool.addClass('current', this);
            createCanvas();

        }
    }
    //阴影颜色
    var shadow = Tool.$('#colorshadow').getElementsByTagName('i');
    var len = shadow.length;
    for (var m = 0; m < len; m++) {
        shadow[m].onclick = function() {
            shwRGB = this.getAttribute('rgb');
            var currents = Tool.$('.current', Tool.$('#colorshadow'));
            Tool.removeClass('current', currents[0]);
            Tool.addClass('current', this);
            createCanvas();
        }
    }
    //背景渐变颜色
    var change = Tool.$('#colorchange').getElementsByTagName('i');
    var len = change.length;
    for (var m = 0; m < len; m++) {
        change[m].onclick = function() {
            changeRGB = this.getAttribute('rgb');
            var currents = Tool.$('.current', Tool.$('#colorchange'));
            Tool.removeClass('current', currents[0]);
            Tool.addClass('current', this);
            createCanvas();
        }
    }
}();