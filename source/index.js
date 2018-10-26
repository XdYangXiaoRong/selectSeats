document.addEventListener("DOMContentLoaded", function(){
    var canvas = document.getElementById("canvas");
    var c=canvas.getContext('2d');//设置绘图环境2d
    //画扇形
    canvasCirle(c,300,300,300,194,229,'pink')
    canvasCirle(c,300,300,300,233,268,'yellow')
    canvasCirle(c,300,300,300,272,307,'#01814A')
    canvasCirle(c,300,300,300,311,346,'#FF8040')
    canvasCirle(c,300,300,150,194,346,'white')//内部白色的圆
    //写文字
    drawCircularText(c,300,300,230,'A',rads(211),rads(229))
    drawCircularText(c,300,300,230,'B',rads(250),rads(268))
    drawCircularText(c,300,300,230,'C',rads(289),rads(307))
    drawCircularText(c,300,300,230,'D',rads(328),rads(346))
    //绘制舞台
    drawStage(c)
    
    /**
     * 若第一排50(base=50)个座位，依此每排递增2个座位，最后一排为100个，所以总共有0，1，2，……25,总共26(rowNumber=26)排。
     * 每排对应的座位数依此为50，52，53，……，100
     */
    var seatSelect={
        base:5,//第一排的座位数
        rowNumber:3,//每个区分别有多少排座位，这里是26排
        rowCount:[],//每一排总共多少座位数
        array:[],//当前操作数组
        arrayA:[],//A,B,C,D四个区的座位存储，上一个区找不到位置则进入下一个区的数组
        arrayB:[], 
        arrayC:[],
        arrayD:[],
        holdArray:[],
        areasCount:0,//统计搜素了几个区域找到位置的
        areas:["A","B","C","D"],//A,B,C,D四个区的标识符号
        emptyFlag:false,//用于标记小区的票是否已经被选完，选完则不进行查询
        flag:false,//用于记录连续分配是否成功
        selectedSeats:[],//每一次选中的座
        initArray:function(){//开辟一个新数组的方法
            var rows = [];
            for(var i=0;i<this.rowNumber;i++){
                rows.push(i);
                this.rowCount.push(this.base+2*i);
            }
            var array=new Array(this.rowNumber);
            for(var i=0;i<array.length;i++){
            array[i] = new Array();
                for(var j=0;j<=this.rowCount[i];j++){
                    array[i][j] = 0;
                    if(j===this.rowCount[i]){
                        array[i][j]=this.rowCount[i];//最后一个用来存储这一排还剩下的座位号
                    }
                }
            }
            return array;
        },
        AreaChoose:function(array,tempNumber){//座位的选择
            console.log("areasCount",this.areasCount)
            for(var i=0;i<array.length;i++){
                var maxSeats=array[i].length-1;//取得当前排还剩余的座位数的下标j
                var leftNumber=array[i][maxSeats];//取得当前排剩余的座位数
                console.log("leftNumber",leftNumber,typeof leftNumber)
                if(tempNumber>leftNumber){//若果当前行的座位已经不够分，则换到下一行
                    continue;
                }else{//否则在当前位置选作
                    leftNumber-=tempNumber;
                    array[i][maxSeats]=leftNumber;//剩余座位数减此次选中的
                    var index=0;//第一个不是没有被选中的座位的第二个下标
                    for(var j=0;j<array[i].length;j++){
                        if(array[i][j]===0){//找到第一个没有被选中的座
                            index=j;
                            break;
                        }
                    }
                    for(var k=index;k<index+tempNumber*1;k++){//将选中的座位全部标记为1
                        array[i][k]=1;
                        this.selectedSeats.push(this.areas[this.areasCount]+'-'+(i+1*1)+'-'+(k+1*1))
                    }
                    this.flag = true;
        
                    if(this.areasCount===0){
                        this.arrayA=array;
                    }else if(this.areasCount===1){
                        this.arrayB=array;
                    }else if(this.areasCount===2){
                        this.arrayC=array;
                    }else if(this.areasCount===3){
                        this.arrayD=array;
                    }
                    // this.holdArray[this.areasCount]=this.array;
                    this.array=this.arrayA;
                    this.areasCount = 0;
                    // console.log(77777,this.array)
                    // console.log(9999,this.arrayA,this.arrayB,this.arrayC,this.arrayD)
                    break;
                }
            }
            if(!this.flag){//记录连续分配未成功
                this.areasCount++;//当前区域没有合适的座位了，到下一个区寻找
                if(this.areasCount<4){
                    console.log("进入下一个区")
                    this.array=this.holdArray[this.areasCount];
                    array=this.array;//置空
                    this.AreaChoose(array,tempNumber);
                    
                }else{//四个区都没有连续的座位了
                    console.log("四个区都没有足够个数的连续的座位了")
                    console.log(9999,this.arrayA,this.arrayB,this.arrayC,this.arrayD)
                    this.areasCount=0;// 
                    for(var i=0;i<this.arrayA.length;i++){
                        for(var j=0;j<this.arrayA[i].length-1;j++){
                            var maxSeats=this.arrayA[i].length-1;//取得当前排还剩余的座位数的下标j
                            var leftNumber=this.arrayA[i][maxSeats];//取得当前排剩余的座位数
                            if(this.arrayA[i][j]===0 &&this.selectedSeats.length<tempNumber){
                                leftNumber--;
                                this.arrayA[i][maxSeats]=leftNumber;
                                this.arrayA[i][j]=1;
                                this.selectedSeats.push("A-"+(i+1*1)+'-'+(j+1*1))
                                console.log(this.arrayA)
                            }
                            if(this.selectedSeats.length>=tempNumber){
                                // this.array = this.arrayA;
                                this.areasCount=0;
                                break;
                            }
                        }
                    }
                    for(var i=0;i<this.arrayB.length;i++){
                        for(var j=0;j<this.arrayB[i].length-1;j++){
                            var maxSeats=this.arrayB[i].length-1;//取得当前排还剩余的座位数的下标j
                            var leftNumber=this.arrayB[i][maxSeats];//取得当前排剩余的座位数
                            if(this.arrayB[i][j]===0 &&this.selectedSeats.length<tempNumber){
                                leftNumber--;
                                this.arrayB[i][maxSeats]=leftNumber;
                                this.arrayB[i][j]=1;
                                this.selectedSeats.push("B-"+(i+1*1)+'-'+(j+1*1))
                            }
                            if(this.selectedSeats.length>=tempNumber){
                                // this.array = this.arrayB;
                                this.areasCount=0;
                                break;
                            }
                        }
                    }
                    for(var i=0;i<this.arrayC.length;i++){
                        for(var j=0;j<this.arrayC[i].length-1;j++){
                            var maxSeats=this.arrayC[i].length-1;//取得当前排还剩余的座位数的下标j
                            var leftNumber=this.arrayC[i][maxSeats];//取得当前排剩余的座位数
                            if(this.arrayC[i][j]===0 &&this.selectedSeats.length<tempNumber){
                                leftNumber--;
                                this.arrayC[i][maxSeats]=leftNumber;
                                this.arrayC[i][j]=1;
                                this.selectedSeats.push("C-"+(i+1*1)+'-'+(j+1*1))
                            }
                            if(this.selectedSeats.length>=tempNumber){
                                this.areasCount=0;
                                break;
                            }
                        }
                    }
                    for(var i=0;i<this.arrayD.length;i++){
                        for(var j=0;j<this.arrayD[i].length-1;j++){
                            var maxSeats=this.arrayD[i].length-1;//取得当前排还剩余的座位数的下标j
                            var leftNumber=this.arrayD[i][maxSeats];//取得当前排剩余的座位数
                            if(this.arrayD[i][j]===0 &&this.selectedSeats.length<tempNumber){
                                leftNumber--;
                                this.arrayD[i][maxSeats]=leftNumber;
                                this.arrayD[i][j]=1;
                                this.selectedSeats.push("D-"+(i+1*1)+'-'+(j+1*1))
                            }
                            if(this.selectedSeats.length>=tempNumber){
                                this.areasCount=0;
                            }
                        }
                    }
                    this.array=this.arrayA;//从A区开始遍历
                    if(this.selectedSeats.length<tempNumber){
                        var seatsCouldSelected=this.selectedSeats.length;
                        if(seatsCouldSelected===0){
                            alert("座位已经被选光了！")
                        }else{
                            alert("仅剩"+seatsCouldSelected+"个座位可以选了！")
                        }
                        this.emptyFlag=true;
                    }
                }
            }
        },
        init:function(){
            this.array=this.initArray();
            this.arrayA=this.initArray();
            this.arrayB=this.initArray();
            this.arrayC=this.initArray();
            this.arrayD=this.initArray();
            this.holdArray=[this.arrayA,this.arrayB,this.arrayC,this.arrayD]
            var that=this;
            $("#enterSelect").click(function(){
                // $(".seats_content").css("visibility",'visible');
                $(".seats_content").css("display",'block');
            })
            $("#sure").click(function(){
                if(this.emptyFlag){
                    alert("票已经全部售完！");
                    return
                }
                var reg=/^[1-5]$/;
                var tempNumber =Number(($('#tempNumber').val()||"").trim());
                $('#tempNumber').val('');
                $('#tempNumber2').val('')
                if(!reg.test(tempNumber)){
                    $('.toastMessage').css("display","block");
                    $('.toastMessage').html("请输入1-5之间的数字进行随机选票！");
                    setTimeout(()=>{
                        $('.toastMessage').css("display","none");
                    },1500)
                    return
                }
                console.log(tempNumber)
                that.flag = false;//用于记录连续分配是否成功
                that.selectedSeats = [];//选中的座
                that.AreaChoose(that.array,tempNumber)
                console.log('selectedSeats-----2',that.selectedSeats)

                //根据所选结果渲染座位界面 
                var dataValNodes=$('.seat_one');
                for(var index=0;index<dataValNodes.length;index++){
                    var data_val=dataValNodes.eq(index).data('val');
                    var count=0;//遍历次数，找到所有对象后不再遍历
                    if(count<that.selectedSeats.length){
                        if(that.selectedSeats.indexOf(data_val)!==-1){
                            dataValNodes.eq(index).attr("class","seat_one selected");
                            count++
                        }
                    }else{
                        break;//退出当前循环
                    }
                }
                $('.toastMessage').css("display","block");
                $('.toastMessage').html("您本次选中的座位号为: "+that.selectedSeats.join(','));
                $('.seatsNumber').css("display",'block')
                var html=$('.seatsNumber').html();
                $('.seatsNumber').html(html+'<br />' + that.selectedSeats.join(','))
                setTimeout(()=>{
                    $('.toastMessage').css("display","none");
                    $('.changeArae').css("display","block");
                },1500)
                console.log(9999,that.arrayA,that.arrayB,that.arrayC,that.arrayD)
            })
            $("#out").click(function(){//退出选座界面
                // $(".seats_content").css("visibility",'hidden'); 
                $(".seats_content").css("display","none");
            })
        },
        initSeats:function(){//座位布局初始化
            var areasDom=$(".areas");
            var html='';
            for(var i=0;i<this.areas.length;i++){
                html='';
                for(var j=0;j<this.rowNumber;j++){
                    html+='<div class="row">';
                    for(var k=0;k<this.rowCount[j];k++){
                        var str=this.areas[i]+"-"+(j+1*1)+"-"+(k+1*1);
                        html+='<div class="seat_one" data-val="'+ str+'"></div>'
                    }
                    html+='</div>'
                }
                areasDom.eq(i).html(html)
            }
            
        }
    };
    seatSelect.init();
    seatSelect.initSeats();
}, false);
function canvasCirle(ele,x,y,r,angle1=0,angle2=360,color){
    ele.save();
    ele.beginPath();
    ele.moveTo(x,y);
    ele.arc(x,y,r,angle1*Math.PI/180,angle2*Math.PI/180,false);
    ele.closePath();    
    ele.restore();
    ele.fillStyle = color || 'red';
    ele.fill();
    // return this;
}
function drawCircularText(ctx,x,y,r,string, startAngle, endAngle ,lv){
    var radius = r,
        angleDecrement = (startAngle - endAngle)/(string.length-1),
        angle = parseFloat(startAngle),
        index = 0,
        character;
    
    ctx.save();
    
    ctx.fillStyle = 'white';
    ctx.font = '40px 微软雅黑';
    ctx.textAlign = lv || 'center';
    ctx.textBaseline = 'middle';
    
    while (index < string.length) {
        character = string.charAt(index); 
        ctx.save();
        ctx.beginPath();
        ctx.translate(x + Math.cos(angle) * radius,
                    y + Math.sin(angle) * radius);
        ctx.rotate(Math.PI/2 + angle);
        ctx.fillText(character, 0, 0);
        angle -= angleDecrement;
        index++;
        ctx.restore();
    }
    ctx.restore();
}
function rads(x){
    return Math.PI*x/180;
}
function drawStage(ctx){
    ctx.fillStyle = "#EEEEFF";  //对画布填充颜色
    //参数===>x: 矩形左上角的 x 坐标  y:    矩形左上角的 y 坐标，width：  矩形的宽度，以像素计 ,height： 矩形的高度，以像素计
    ctx.fillRect(150, 330, 300, 50); //fillRect() 方法绘制“已填色”的矩形。默认的填充颜色是黑色。
    ctx.font = 'bold 30px arial';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillStyle = '#DF5326';
    ctx.fillText('舞台', 275, 340);
}