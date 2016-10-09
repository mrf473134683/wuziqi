/**
 * Created by Administrator on 2016/9/29.
 */
$(function () {

    $('#audio').on('ended', function() {
        $('#audio').src = '1.mp3';
        $('#audio').play();
    })

    $('.start').on('click',function(){
        $('.box').addClass('zoom-out-up');
    })

    $(".right .time").html("00:00");
    function jishi() {
        var time = 0;
        var m = 0;
        var s = 0;
        tt = setInterval(function() {
            time += 1;
            s = time % 60;
            if (time % 60 == 0) {
                m = parseInt(m);
                m += 1;
                m = (m < 10) ? '0' + m : m;
            }
            s = (s < 10) ? '0' + s : s;
            $(".right .time").html(m + ':' + s);
        }, 1000);
    }


    var canvas = $('#canvas').get(0);
    var ctx = canvas.getContext('2d');

    var width = canvas.width;  //600
    var ROW = 15;
    var off = width / ROW;  //40
    var flag = true;
    var blocks = {};  //{'3_4':'black'}

    var ai = false;
    var blank ={};
    for (var i = 0; i < ROW; i++){
        for (var j = 0; j < ROW; j++){
            blank[p2k(i,j)] = true;
        }
    }

    function o2k (position){
        return position.x + '_' + position.y;
    };

    function p2k (x,y){
        return x + '_' + y;
    };
    /************星标************/
    function drawCircle(x,y){
        ctx.beginPath();
        ctx.arc(x * off + 0.5, y * off + 0.5,2,0,Math.PI * 2)
        ctx.fill();
        ctx.closePath();
    };

    function drawChess(position,color){
        ctx.save();
        ctx.beginPath();

        if(color === 'black'){
            var gradient = ctx.createRadialGradient(-4,-4,1,0,0,12);
            gradient.addColorStop(0,"#ccc");
            gradient.addColorStop(1,"black");
            ctx.fillStyle = gradient;

            //ctx.fillStyle = '#000';
        }else if(color === 'white') {
            var gradient = ctx.createRadialGradient(-2,-2,3,0,0,12);
            gradient.addColorStop(0,"#fff");
            gradient.addColorStop(1,"#ccc");
            ctx.fillStyle = gradient;
            //ctx.fillStyle = '#fff';
        }

        ctx.translate((position.x + 0.5) * off + 0.5, (position.y + 0.5) * off + 0.5);
        ctx.arc(0,0,12,0,Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        ctx.restore();

        blocks[ o2k(position) ] = color;
        //console.log(blocks);

        delete blank[o2k(position)];
    };
    /************棋盘*************/
    function draw (){
        ctx.beginPath();
        for(var i = 0;i < ROW; i ++){
            ctx.moveTo(off/2 + 0.5,off/2 + 0.5 + i * off);
            ctx.lineTo(14.5 * off + 0.5,off/2 + 0.5 + i * off);
        }
        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();
        for(var i = 0;i < ROW;i ++){
            ctx.moveTo(off/2 + 0.5 + i * off,off/2 + 0.5 );
            ctx.lineTo(off/2 + 0.5 + i * off,14.5 * off + 0.5);
        }
        ctx.stroke();
        ctx.closePath();

        drawCircle(3.5,3.5);
        drawCircle(11.5,3.5);
        drawCircle(7.5,7.5);
        drawCircle(3.5,11.5);
        drawCircle(11.5,11.5);
    };

    function k2o (k){
        var arr = k.split('_');
        return {
            x: parseInt(arr[0]),
            y: parseInt(arr[1])
        }
    }

    function drawText (pos,text,color){
        ctx.save();
        ctx.font = '10px 微软雅黑';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        if (color === 'black'){
            ctx.fillStyle = 'white';
        }else if (color === 'white'){
            ctx.fillStyle = 'black';
        }
        ctx.fillText(text,(pos.x + 0.5) * off,(pos.y + 0.5) * off)
        ctx.restore();
    }

    function review (){
        var i =1;
        for (var pos in blocks){
            drawText( k2o(pos), i, blocks[pos] );
            i ++;
        }
    }

    function check (pos,color){
        var rowNum = 1;
        var colNum = 1;
        var leftsNum = 1;
        var rightsNum = 1;
        var table ={};//得到一个正确的表格
        for (var i in blocks){
            if (blocks[i] === color){
                table[i] = true;
            }
        }
        console.log(table);
        //横排
        var tx = pos.x;
        var ty = pos.y;
        while (table[ p2k((tx + 1),ty) ]){
            rowNum ++;
            tx ++;
        }
        var tx = pos.x;
        var ty = pos.y;
        while (table[ p2k((tx - 1),ty) ]){
            rowNum ++;
            tx --;
        }
        //竖排
        var tx = pos.x;
        var ty = pos.y;
        while (table[ p2k(tx,(ty + 1)) ]){
            colNum ++;
            ty ++;
        }
        var tx = pos.x;
        var ty = pos.y;
        while (table[ p2k(tx,(ty - 1)) ]){
            colNum ++;
            ty --;
        }
        //左斜
        var tx = pos.x;
        var ty = pos.y;
        while (table[ p2k((tx + 1),(ty + 1)) ]){
            leftsNum ++;
            tx ++;
            ty ++;
        }
        var tx = pos.x;
        var ty = pos.y;
        while (table[ p2k((tx - 1),(ty - 1)) ]){
            leftsNum ++;
            tx --;
            ty --;
        }
        //右斜
        var tx = pos.x;
        var ty = pos.y;
        while (table[ p2k((tx + 1),(ty - 1)) ]){
            leftsNum ++;
            tx ++;
            ty --;
        }
        var tx = pos.x;
        var ty = pos.y;
        while (table[ p2k((tx - 1),(ty + 1)) ]){
            leftsNum ++;
            tx --;
            ty ++;
        }
        return Math.max(rowNum,colNum,leftsNum,rightsNum);
        //return (rowNum >= 5) || (colNum >= 5)|| (leftsNum >= 5)|| (rightsNum >= 5);
    };

    function restart (){
        ctx.clearRect(0,0,500,500);
        blocks = {};
        flag = true;
        draw();
        //jishi();
        $(canvas).off('click').on('click',handleClick);
    }

    function AI(){
        var max1 = -Infinity;
        var max2 = -Infinity;
        var pos1;
        var pos2;
        for (var i in blank){
            var score1 = check(k2o(i),'black');
            var score2 = check(k2o(i),'white');
            if (score1 > max1){
                max1 = score1;
                pos1 = k2o(i);
            }
            if (score2 > max2){
                max2 = score2;
                pos2 = k2o(i);
            }
        }
        if (max2 >= max1){
            return pos2;
        }else{
            return pos1;
        }
    };

    function handleClick (e){

        var position = {
            x: Math.round( (e.offsetX - off/2)/off ),
            y: Math.round( (e.offsetY - off/2)/off )
        };

        if(blocks[o2k(position)]){
            return;
        }

        if (ai){
            drawChess(position,'black');
            if(check(position, 'black') >= 5){
                alert('黑棋赢');
                $(canvas).off('click');
                if (confirm('是否生成棋谱?')){
                    review();
                }
                return;
            }

            drawChess(AI(),'white');
            if(check(AI(), 'white') > 5){
                alert('白棋赢');
                $(canvas).off('click');
                if (confirm('是否生成棋谱?')){
                    review();
                }
                return;
            }
            return;
        }

        if (flag){
            drawChess(position,'black');

            if(check(position, 'black') >= 5){
                alert('黑棋赢');
                $(canvas).off('click');
                if (confirm('是否生成棋谱?')){
                    review();
                }
                return;
            }
        } else {
            drawChess(position,'white');

            if(check(position, 'white') >= 5){
                alert('白棋赢');
                $(canvas).off('click');
                if (confirm('是否生成棋谱?')){
                    review();
                }
                return;
            }
        }
        flag = !flag;
    }

    ///////////////////////////////////
    $(canvas).on('click',handleClick);

    $('.restart').on('click',function(){
        $(this).addClass('pulse');
        restart();
    });

    $('.computer').on('click',function(){
        $(this).toggleClass('active').addClass('pulse');
        jishi();
        ai = !ai;
    });

    $('.person').on('click',function(){
        $(this).addClass('pulse');
        jishi();
    });

    $('.set').on('click',function(){
        window.close();
    });

    draw();



})