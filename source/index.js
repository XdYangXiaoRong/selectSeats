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
     * 若第一排50个座位，依此每排递增2个座位，最后一排为100个，所以总共有0，1，2，……25,总共26排。
     * 每排对应的座位数依此为50，52，53，……，100
     */
    var seatSelect={
        base:5,
        rowNumber:3,//每个区分别有多少排座位
        rowCount:[],//每一排总共多少座位数
        array:[],//当前操作数组
        arrayA:[],//A,B,C,D四个区的座位存储，上一个区找不到位置才新建下一个区的数组
        arrayB:[], 
        arrayC:[],
        arrayD:[],
        holdArray:[],
        areasCount:0,//统计搜素了几个区域找到位置的
        areas:["A","B","C","D"],//A,B,C,D四个区的标识符号
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
        AreaChoose:function(array,tempNumber){
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
                        this.selectedSeats.push(this.areas[this.areasCount]+'-'+i+'-'+k)
                    }
                    this.flag = true;
                    console.log('selectedSeats',this.selectedSeats)
                    console.log(23333,array)
                    if(this.areasCount===0){
                        this.arrayA=array;
                    }else if(this.areasCount===1){
                        this.arrayB=array;
                    }else if(this.areasCount===2){
                        this.arrayC=array;
                    }else if(this.areasCount===3){
                        this.arrayD=array;
                    }
                    console.log(9999,this.arrayA,this.arrayB,this.arrayC,this.arrayD)
                    break;
                }
            }
            if(!this.flag){//记录连续分配未成功
                this.areasCount++;//当前区域没有合适的座位了，到下一个区寻找
                if(this.areasCount<4){
                    console.log("进入下一个区")
                    // this.array=this.initArray();
                    this.array=this.holdArray[this.areasCount];
                    array=this.array;//置空
                    this.AreaChoose(array,tempNumber);
                }else{//四个区都没有连续的座位了
                    console.log("四个区都没有足够个数的连续的座位了")
                    console.log(9999,this.arrayA,this.arrayB,this.arrayC,this.arrayD)
                    this.areasCount=0;// 
                    // while(tempNumber>0){
                        for(var i=0;i<this.arrayA.length;i++){
                            for(var j=0;j<this.arrayA[i].length-1;j++){
                                var maxSeats=this.arrayA[i].length-1;//取得当前排还剩余的座位数的下标j
                                var leftNumber=this.arrayA[i][maxSeats];//取得当前排剩余的座位数
                                if(this.arrayA[i][j]===0 &&this.selectedSeats.length<tempNumber){
                                    leftNumber--;
                                    this.arrayA[i][maxSeats]=leftNumber;
                                    this.arrayA[i][j]=1;
                                    this.selectedSeats.push("A-"+i+'-'+j)
                                    console.log(this.arrayA)
                                }
                                if(this.selectedSeats.length>=tempNumber){
                                    this.array = this.arrayA;
                                    this.areasCount=0;
                                    break;
                                }
                            }
                        }
                        // tempNumber=tempNumber-this.selectedSeats.length;//还差的个数
                        // this.areasCount=1;
                        // if(tempNumber<=0){
                        //     return
                        // }
                        for(var i=0;i<this.arrayB.length;i++){
                            for(var j=0;j<this.arrayB[i].length-1;j++){
                                var maxSeats=this.arrayB[i].length-1;//取得当前排还剩余的座位数的下标j
                                var leftNumber=this.arrayB[i][maxSeats];//取得当前排剩余的座位数
                                if(this.arrayB[i][j]===0 &&this.selectedSeats.length<tempNumber){
                                    leftNumber--;
                                    this.arrayB[i][maxSeats]=leftNumber;
                                    this.arrayB[i][j]=1;
                                    this.selectedSeats.push("B-"+i+'-'+j)
                                    console.log(this.arrayB)
                                }
                                if(this.selectedSeats.length>=tempNumber){
                                    this.array = this.arrayB;
                                    // this.areasCount=1;
                                    break;
                                }
                            }
                        }
                        // tempNumber=tempNumber-this.selectedSeats.length;//还差的个数
                        // if()
                        // this.areasCount=2;
                        // if(tempNumber<=0){
                        //     return
                        // }
                        for(var i=0;i<this.arrayC.length;i++){
                            for(var j=0;j<this.arrayC[i].length-1;j++){
                                var maxSeats=this.arrayC[i].length-1;//取得当前排还剩余的座位数的下标j
                                var leftNumber=this.arrayC[i][maxSeats];//取得当前排剩余的座位数
                                if(this.arrayC[i][j]===0 &&this.selectedSeats.length<tempNumber){
                                    leftNumber--;
                                    this.arrayC[i][maxSeats]=leftNumber;
                                    this.arrayC[i][j]=1;
                                    this.selectedSeats.push("C-"+i+'-'+j)
                                    console.log(this.arrayC)
                                }
                                if(this.selectedSeats.length>=tempNumber){
                                    this.array = this.arrayC;
                                    // this.areasCount=2;
                                    break;
                                }
                            }
                        }
                        // tempNumber=tempNumber-this.selectedSeats.length;//还差的个数
                        // this.areasCount=3
                        // if(tempNumber<=0){
                        //     return
                        // }
                        for(var i=0;i<this.arrayD.length;i++){
                            for(var j=0;j<this.arrayD[i].length-1;j++){
                                var maxSeats=this.arrayD[i].length-1;//取得当前排还剩余的座位数的下标j
                                var leftNumber=this.arrayD[i][maxSeats];//取得当前排剩余的座位数
                                if(this.arrayD[i][j]===0 &&this.selectedSeats.length<tempNumber){
                                    leftNumber--;
                                    this.arrayD[i][maxSeats]=leftNumber;
                                    this.arrayD[i][j]=1;
                                    this.selectedSeats.push("D-"+i+'-'+j)
                                    console.log(this.arrayD)
                                }
                                if(this.selectedSeats.length>=tempNumber){
                                    this.array = this.arrayD;
                                    // this.areasCount=3;
                                }
                            }
                        }
                        this.areasCount=0;
                        this.array=this.arrayA;
                        if(this.selectedSeats.length<tempNumber){
                            alert("座位已经被选光了！")
                        }
                    // }
                    console.log('selectedSeats-----2',this.selectedSeats)
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
            console.log(this.array)
            var that=this;
            $("#sure").click(function(){
                var tempNumber =Number(($('#tempNumber').val()||'').trim());
                console.log(tempNumber)
                that.flag = false;//用于记录连续分配是否成功
                that.selectedSeats = [];//选中的座
                that.AreaChoose(that.array,tempNumber)
                console.log('selectedSeats-----2',that.selectedSeats)
                console.log(9999,that.arrayA,that.arrayB,that.arrayC,that.arrayD)
            })
        }
    };
    seatSelect.init();
    // var base = 5,
    //     // rowNumber = 26,//一个区域总共26排
    //     rowNumber=3,
    //     rowCount = [];//每一排总共多少座位数
    // var array = [],arrayA = [],arrayB = [], arrayC = [],arrayD = [];
    // var areas = ["A","B","C","D"];
    // var areasCount=0;
    // function init(){
    //     var rows = [];
    //     for(var i=0;i<rowNumber;i++){
    //         rows.push(i);
    //         rowCount.push(base+2*i);
    //     }
    //     var array=new Array(rowNumber);
    //     for(var i=0;i<array.length;i++){
    //     array[i] = new Array();
    //         for(var j=0;j<=rowCount[i];j++){
    //             array[i][j] = 0;
    //             if(j===rowCount[i]){
    //                 array[i][j]=rowCount[i];//最后一个用来存储这一排还剩下的座位号
    //             }
    //         }
    //     }
    //     return array;
    // }

    // array=init();
    
    
    // function getSelectedSeat(){//获取已经被选过的座位号
    //   $.get("http://127.0.0.1:8000/" + new Date().getTime(), function(data){ 
    //       console.log(2333,data)
    //       var seatsSelected=JSON.stringify(data).split(',');//根据接口返回已经被选中的座位号
    //       return seatsSelected
    //   }).then(function(data){
    //       console.log(222222,data)
    //   })
    // }
    // getSelectedSeat();
    // $("#sure").click(function(){
    //     var tempNumber =Number(($('#tempNumber').val()||'').trim());
    //     console.log(tempNumber)
    //     var flag = false,//用于记录连续分配是否成功
    //         selectedSeats = [];//选中的座
    //     this.AreaChoose
        // function Area(){
        //     console.log("areasCount",areasCount)
        //     for(var i=0;i<array.length;i++){
        //         var maxSeats=array[i].length-1;//取得当前排还剩余的座位数的下标j
        //         var leftNumber=array[i][maxSeats];//取得当前排剩余的座位数
        //         console.log("leftNumber",leftNumber,typeof leftNumber)
        //         if(tempNumber>leftNumber){//若果当前行的座位已经不够分，则换到下一行
        //             continue;
        //         }else{//否则在当前位置选作
        //             leftNumber-=tempNumber;
        //             array[i][maxSeats]=leftNumber;//剩余座位数减此次选中的
        //             var index=0;//第一个不是没有被选中的座位的第二个下标
        //             for(var j=0;j<array[i].length;j++){
        //                 if(array[i][j]===0){//找到第一个没有被选中的座
        //                     index=j;
        //                     break;
        //                 }
        //             }
        //             for(var k=index;k<index+tempNumber*1;k++){//将选中的座位全部标记为1
        //                 array[i][k]=1;
        //                 selectedSeats.push(areas[areasCount]+'-'+i+'-'+k)
        //             }
        //             flag = true;
        //             console.log('selectedSeats',selectedSeats)
        //             console.log(23333,array)
        //             if(areasCount===0){
        //                 arrayA=array;
        //             }else if(areasCount===1){
        //                 arrayB=array;
        //             }else if(areasCount===2){
        //                 arrayC=array;
        //             }else if(areasCount===3){
        //                 arrayD=array;
        //             }
        //             console.log(9999,arrayA,arrayB,arrayC,arrayD)
        //             break;
        //         }
        //     }
        //     if(!flag){//记录连续分配未成功
        //         areasCount++;//当前区域没有合适的座位了，到下一个区寻找
        //         if(areasCount<4){
        //             console.log("进入下一个区")
        //             array=init();
        //             Area();
        //         }else{//四个区都没有连续的座位了
        //             console.log("四个区都没有足够个数的连续的座位了")
        //             console.log(9999,arrayA,arrayB,arrayC,arrayD)
        //         }
        //     }
        // }    
    // })
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
//            ctx.strokeText(character, 0, 0);
        
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