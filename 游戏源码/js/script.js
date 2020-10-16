var imgs=["a_.jpg","A_(2).jpg","B_.jpg","b_(2).jpg","c_.jpg","D_.jpg",
"d_(2).jpg","e_.jpg","g_.jpg","H_.jpg","h_(2).jpg","J_.jpg",
"k_.jpg","M_.jpg","m_(2).jpg","n_.jpg","O_.jpg","o_(2).jpg","P_.jpg","p_(2).jpg",
"Q_.jpg","q_(2).jpg","r_.jpg","s_.jpg","t_.jpg","U_.jpg","u_(2).jpg","v_.jpg",
"W_.jpg","X_.jpg","x_(2).jpg","Y_.jpg","y_(2).jpg","Z_.jpg","z_(2).jpg"]



function change(){
	var random= Math.ceil((Math.random()*imgs.length)-1);
	$(".square").css("background-image","url(img/"+imgs[random]+")");
	$("#oriImg").css("background-image","url(img/"+imgs[random]+")");
	randomLayout();
	reset();
}


var s = new Array(10); /*0-9每个框的情况，被数字占着or空着0*/
//保存不同位置的小块可去的位置
var s_can_walk = new Array(
	[0,0],
	[2,4],
	[1,3,5],
	[2,6],
	[1,5,7],
	[2,4,6,8],
	[3,5,9],
	[4,8],
	[5,7,9],
	[6,8]
);
//不同位置小块的top，left
var s_xyposition = new Array(
	[0,0],
	[0,0],
	[0,150],
	[0,300],
	[150,0],
	[150,150],
	[150,300], 
	[300,0],
	[300,150],
	[300,300],
);


var step=0;

for (var i = 0; i <10; i++) { s[i] = i;}
//随机选择空白格
var space_position = Math.ceil((Math.random()*8 + 1)) ;
s[space_position]=0;
//last保存原始状态小块序号顺序位置
var last = "";
var space_position=9;

//s[i]为图片当前位置，i为图片的序号.即序号为i的图片在s[i]位置
route=""
// 随机布局
function randomLayout(){
		for (var i = 0; i < s.length; i++) { 
			s[i] = 0;
		}/*设置为0，重新开始*/
		last="";
		$("#small_bolck"+space_position).show();
		//随机选取一个小块设为空白格
		space_position = Math.ceil((Math.random()*8 + 1)) ;
		//把空白格的块编号设为0
		s[space_position]=0;
		last.replace(space_position.toString(),".");
		for(var i=1;i<s.length;i++){
			if(i!=space_position){
				last+=i;
			}
			else{
				//将空白格的小块编号设为'.'，方便保存在字符串中
				last+=".";
			}
		}
		$("#small_bolck"+space_position).hide();
		for (var i = 1; i < s.length; i++) { 
			if(i==space_position)continue;
				// 随机得到1-9的一个数字
				var to_position = Math.ceil((Math.random()*8 + 1)) ; 
				while(s[to_position]!=0){
					if(to_position==1) to_position=9;
					else to_position--;
				} 
				moveSquare(i,0, to_position);
				s[to_position] = i;
		}
}
function findPosition(from_number){
	for (var i = 1; i < s.length; i++) {
		//查找某个序号的小块在哪个地方
		if (s[i]==from_number){ 
			return i;
		}
	}
}
//移动操作
function move(from_number){
	step++;
	$(".step").html(step);
	var from_position = findPosition(from_number);
	for (var i = 0; i < s_can_walk[from_position].length; i++) {
		//查看被点击小块四周是否有空白块，如果可以移动
		if ( s[ s_can_walk[from_position][i] ] == 0 ){ 
			moveSquare(from_number,from_position, s_can_walk[from_position][i]);
			break;
		}
	}
	// 每次移动完顺便判断一下是否游戏结束
	judge();
}

// 改变小div的top和left在页面上做出移动效果
function moveSquare(from_number,from_position, to_position){
	document.getElementById("small_bolck"+from_number).style.top=s_xyposition[to_position][0]+"px";
	document.getElementById("small_bolck"+from_number).style.left=s_xyposition[to_position][1]+"px";
	s[to_position] = s[from_position]; 
	s[from_position] = 0;
	
} 

// 判断游戏是否结束
function judge(){
	if(step>=100){
		//若移动步数超过100则进行强制交换
		enforce();
	}
	else{
		var end = 1;
		for (var i = 1; i < s.length; i++) {
			if(i==space_position){
				continue;
			}
			if(s[i]!= i) {
				end= 0 ;
				break;
			}
		}
		if(s[space_position]!=0) end = 0;
		if(end==1) {
			$("#success").show();
			if(pause==false){
				startAndStop();
			}
		}
	}

}

//随机选取两个非空白格的小块进行强制调换
function enforce(){
	
	var space_position = findPosition(0); //找空格的位置 这里是s[n]位置
	do{
		//随机交换的两个小块不能是空白块
		var s1 = Math.ceil((Math.random()*8 + 1)) ; //随机生成1-9的数
		var s2 = Math.ceil((Math.random()*8 + 1)) ; //随机生成1-9的数
	}while(s1==s2||s1==space_position||s2==space_position);

	alert("当前步数超过100，进行强制交换,交换"+s1+","+s2+"块序号");
	$("#small_bolck"+s[s1]).css("top",s_xyposition[s2][0]+"px");
	$("#small_bolck"+s[s1]).css("left",s_xyposition[s2][1]+"px");
	$("#small_bolck"+s[s2]).css("top",s_xyposition[s1][0]+"px");
	$("#small_bolck"+s[s2]).css("left",s_xyposition[s1][1]+"px");
	temp=s[s1];
	s[s1]=s[s2];
	s[s2]=temp;
	//若进行强制调换后当前布局无解，则用户可自行选择两个小块进行调换
	if(!judgeHaveSolution()){
			alert("当前布局无解，可选择两个图片调换位置");
			$(".exchange").show();
		}
	$("#tips").html("")
	$("#success").hide();
	$(".step").html(0);
	step=0;
	$(".timer").html("0分0秒");
	time = 0;
	if(pause==false){ 
		startAndStop(); 
	}
	pause=true;
}


changeId=[];
//用户自定义两个小块进行交换
function exchange(){
	changeId=$("#exchangeId").val().split(",");
	if(changeId[0]==changeId[1]){
		alert("交换块号不能一样");
	}else if(changeId[0]>9||changeId[1]>9){
		alert("交换块号不能超过9")
	}else if(changeId[0]<1||changeId[1]<1){
		alert("交换块号不能小于1")
	}else{
		$("#small_bolck"+s[changeId[0]]).css("top",s_xyposition[changeId[1]][0]+"px");
		$("#small_bolck"+s[changeId[0]]).css("left",s_xyposition[changeId[1]][1]+"px");
		$("#small_bolck"+s[changeId[1]]).css("top",s_xyposition[changeId[0]][0]+"px");
		$("#small_bolck"+s[changeId[1]]).css("left",s_xyposition[changeId[0]][1]+"px");
		temp=s[changeId[0]];
		s[changeId[0]]=s[changeId[1]];
		s[changeId[1]]=temp;
	}
	alert("交换成功");
	$(".exchange").hide();	
}
//初始化函数，页面加载的时候调用重置函数，重新开始
window.onload=function(){
    randomLayout();
}

var pause = true;
function startAndStop(){
	// 开始计时
	var myclass = document.getElementsByClassName("square");
	if(pause){ //改字，改状态，开始计时+改div不能选定
		$("#start_and_stop").html("暂停游戏");
		document.getElementById("start_and_stop").innerHTML = "暂停游戏";
		for (var i = 0; i < myclass.length; i++) {
			myclass[i].style.cssText += "pointer-events: auto;"/*开始了游戏才能点按钮*/
		}
		pause = false;
		set_timer = setInterval(timer,1000);
	}
	else{
		$("#start_and_stop").html("开始游戏");
		for (var i = 0; i < myclass.length; i++) {
			myclass[i].style.cssText += "pointer-events: none;"/*停止了游戏就不能点按钮*/
		}
		pause = true;
		clearInterval(set_timer);	
	}
}

var time = 0;
// 计时函数,计时+改文字
function timer(){
	time ++;
	var sec = time%60;
	var min = (time-sec)/60;
	$(".timer").html(min + "分" + sec + "秒");
}
//重置，时间步数清0
function reset(){
	$("#tips").html("")
	$("#success").hide();
	$(".step").html(0);
	step=0;
	$(".timer").html("0分0秒");
	time = 0;
	if(pause==false){ 
		startAndStop(); 
	}
	pause=true;
	randomLayout(); 
}
//用逆序数的方式判断当前布局是否有解
function judgeHaveSolution(){
	var inversion_number=0; //逆序数
	//i在前，j在后，求逆序数,从1求到9，要去掉空白块再排列
	for (var i = 1; i < s.length; i++) { 
		if(s[i]==0) continue;
		for (var j = i+1; j < s.length; j++) {
			if(s[j]==0) continue;
			if(s[i]>s[j]) inversion_number++;
		}
	}
	// 逆序数为偶数,则返回有解,反之返回无解，
	if(inversion_number%2==0){
		return true;
	}else {
		return false
	};
}


/**
 * js HashTable哈希表实现
 * 参数及方法说明：
 * 函数名              |说明             |   返回值
 * ---------------------|-------------------|----------
 * add(key,value)       |添加项                |无
 * ----------------------------------------------------
 * getValue(key)        |根据key取值            |object
 * ----------------------------------------------------
 * remove(key)          |根据key删除一项      |无
 * ----------------------------------------------------
 * containsKey(key)     |是否包含某个key      |bool
 * ----------------------------------------------------
 * containsValue(value) |是否包含某个值        |bool
 * ----------------------------------------------------
 * getValues()          |获取所有的值的数组  |array
 * ----------------------------------------------------
 * getKeys()            |获取所有的key的数组    |array
 * ----------------------------------------------------
 * getSize()            |获取项总数          |int
 * ----------------------------------------------------
 * clear()              |清空哈希表          |无
 */

function HashTable() {
    var size = 0;
    var entry = new Object();
    this.add = function (key, value) {//添加项
        if (!this.containsKey(key)) {
            size++;
        }
        entry[key] = value;
    }
    this.getValue = function (key) {//根据key取值
        return this.containsKey(key) ? entry[key] : null;
    }
    this.remove = function (key) {//根据key删除一项
        if (this.containsKey(key) && (delete entry[key])) {
            size--;
        }
    }
    this.containsKey = function (key) {//是否包含某个key
        return (key in entry);
    }
    this.containsValue = function (value) {//是否包含某个值
        for (var prop in entry) {
            if (entry[prop] == value) {
                return true;
            }
        }
        return false;
    }
    this.getValues = function () {//获取所有的值的数组
        var values = new Array();
        for (var prop in entry) {
            values.push(entry[prop]);
        }
        return values;
    }
    this.getKeys = function () {//获取所有的key的数组
        var keys = new Array();
        for (var prop in entry) {
            keys.push(prop);
        }
        return keys;
    }
    this.getSize = function () {//获取项总数
        return size;
    }
    this.clear = function () {//清空哈希表
        size = 0;
        entry = new Object();
    }
}

function Queue(){
    this.dataStore = [];
	this.push = function push ( element ) {//入队
		this.dataStore.push( element );
	}     
    this.pop = function pop () { //出队	
		if( this.empty() ) return 'This queue is empty';
		else this.dataStore.shift();
		//JS中的数组可以直接利用 shift 方法删除数组的第一个元素，
	}    
    this.back = function back () {  //查看队尾元素
   		if( this.empty() ) return 'This queue is empty';
   		else return this.dataStore[ this.dataStore.length - 1 ];
   	}        
	this.mytoString = function mytoString(){//显示队列所有元素
		return this.dataStore.join('\n');
	}   
	this.clear = function clear(){ //清空当前队列

		delete this.dataStore;
		this.dataStor = [];
	}        	
	this.empty = function empty(){//判断当前队列是否为空
		if( this.dataStore.length == 0 ) return true;
		else return false;
	}         
	this.front = function front(){//查看队首元素
		if( this.empty() ) return 'This queue is empty';
		else return this.dataStore[ 0 ];
	}          
}

// 九宫格字符数组转换为字符串12354678.成功,是把s[10]化成字符串,.为空格的位置
function myToString(){
	var str = "";
	for (var i = 1; i < s.length; i++) {
		if(s[i]==0) str += ".";
		else str += s[i];
	}
	return str;
}


var first = "";
var walk_timer;
var result;
function cheater(){ 
	if(!judgeHaveSolution()) alert("该布局无解");
	else {
			route = "";
			//将当前图片位置转换为字符串形式
			first = myToString();
			result = doubleBFS(); 
			if(result==-1)alert("该布局无解");
			var word_route="";
			for (var i = 0; i < route.length; i++) {
				if(route[i]=="0") word_route += "d";
				else if(route[i]=="1") word_route += "a";
				else if(route[i]=="2") word_route += "s";
				else if(route[i]=="3") word_route += "w";
			}
		$("#tips").html("最小步数： " + result +"<br/>w:上 s:下 a:左 d:右<br/>空格移动方向:" + word_route )
		if(result != -1)walk_timer  = setInterval(walk, 500);
		set();
	}
}
//向用户提示最小步数和路线
function pointer(){ 
	if(!judgeHaveSolution()) alert("该布局无解");
	else {
			route = "";
			//将当前图片位置转换为字符串形式
			first = myToString();
			result = doubleBFS(); 
			if(result==-1)alert("该布局无解");
			var word_route="";
			for (var i = 0; i < route.length; i++) {
				if(route[i]=="0") word_route += "d";
				else if(route[i]=="1") word_route += "a";
				else if(route[i]=="2") word_route += "s";
				else if(route[i]=="3") word_route += "w";
			}
			$("#tips").html("最小步数： " + result +"<br/>w:上 s:下 a:左 d:右<br/>空格移动方向:" + word_route )
			set();
	}

}



var route; //路线里0是右，1是左，2是下，3是上
//dis记录每一个状态的步数（有可能由q1扩展的步数，也有可能是由q2扩展的步数）
var dis = new HashTable();
//vis中value=1表示从前部BFS（q1）扩展的，value=2表示从后部BFS（q2）扩展的的，如果出现两个状态相加为3说明找到路径	
var vis = new HashTable(); //map<string, int> 
var route1 = new HashTable(); //map<string, string> 
var route2 = new HashTable(); 
var q1 = new Queue();
var q2 = new Queue();
var dir = new Array([0,1],[0,-1],[1,0],[-1,0])
var str1 = "";//str1是移动前九宫格的字符串形式
var str2 = "";//str2是移动后九宫格的字符串形式
var str = "";
var flag = 0;
var BFSx = 0;
var BFSy = 0;
//first为当前布局
//last为最后应得的正确结果[12345678.]
function doubleBFS(){
	q1.push(first);
	q2.push(last);
	dis.add(first,0);
	dis.add(last,0);
	//起始点作为前部BFS的起点（=1），终点作为后部BFS的起点（=2）
	vis.add(first,1);
	vis.add(last,2);
	route1.add(first,"");
	route2.add(last,""); 
	while(!q1.empty() && !q2.empty()){
		if(q1.dataStore.length < q2.dataStore.length){//每次选择待扩展节点少的那个方向进行扩展
			str1 = q1.front(); 
			q1.pop();
			flag = 1;//表示后续变换状态入q1队列
		}
		else{
			str1 = q2.front();
			q2.pop();
			flag = 2; //表示后续变换状态入q2队列
		}
		
	 //把字符串变成九宫字符数组
		for (var i = 0; i < str1.length; i++) {
			m[(i-(i % 3)) / 3][i % 3] = str1[i];
		}


		for (var i = 0; i < 3; i++) { //找空格在的位置
			for (var j = 0; j < 3; j++) {
				if(m[i][j]== '.'){
					BFSx = i;
					BFSy = j;
					break;
				}
			}
			if(m[i][j]==".") break;
		}
		//当前状态进行上下左右方向移动
		for (var i = 0; i < 4; i++) {
			str2 = ""; //每次寻找时都清零，不然会累计
			var tx = BFSx + dir[i][0];
			var ty = BFSy + dir[i][1];
			//判断是否越界
			if((tx>=0 && tx<3) && (ty>=0 && ty<3)){ //交换0值和移动方向的数字
				var temp = m[BFSx][BFSy];
				m[BFSx][BFSy] = m[tx][ty];
				m[tx][ty] = temp; //tx,ty是0值坐标
				for (var j = 0; j < 3; j++) {
					for (var k = 0; k < 3; k++) {
						str2 += m[j][k];
					}
				}
				if(!dis.containsKey(str2)){//当前状态未被扩展过
					dis.add(str2,dis.getValue(str1) + 1) ;//步数=原数字步数+1
					vis.add(str2,vis.getValue(str1) ) ;//更新状态，与原数字的来源（前部还是后部BFS）相同
					str = i.toString();//0是右，1是左，2是下，3是上
					if(flag == 1 ){
						q1.push(str2);
						route1.add(str2,route1.getValue(str1) + str) ;
					}else if(flag==2){
						q2.push(str2);
						route2.add(str2,route2.getValue(str1) + str) ;					
					}
				} 
				//搜索范围重叠，出现答案
				else{
					str = i.toString();//0是右，1是左，2是下，3是上
					if(flag == 1 ){
						route1.add(str2,route1.getValue(str1) + str) ;
					}else if(flag==2){
						route2.add(str2,route2.getValue(str1) + str) ;					
					}
					//相加为3说明找到路径（还有可能是=2或者=4，都是由相同方向的BFS已经扩展过的点，不需要处理）				
					if(vis.getValue(str1) + vis.getValue(str2) == 3){
						var ans = dis.getValue(str1) + dis.getValue(str2) +1;
						var ahead_route;
						var later_route;
						var change_later_route = "";
						//注意：由于在找到路径前一次判断未被扩展过后更新了状态，所以此时最新的状态没有在vis中
						var r12 = route1.getValue(str2);
						var r22 = route2.getValue(str2);
						//三元选择符输出长的
						ahead_route=r12; //r11是null，输出r12
						later_route=r22; //r21是null，输出r22
						later_route = later_route.split('').reverse().join('');
						//从目的节点找到的路径与从开始结点找到的路径相反，所以要反过来
						for (var i = 0; i < later_route.length; i++) { 
							if(later_route[i]=="0") change_later_route += "1";
							else if(later_route[i]=="1") change_later_route += "0";
							else if(later_route[i]=="2") change_later_route += "3";
							else if(later_route[i]=="3") change_later_route += "2";
						}
						route = ahead_route + change_later_route ;//记录每一步移动的方向
						return ans;
					}
				}
            //因为最多有上下左右移动四种情况，每一次移动后再找另一种情况需要复原
			var temp = m[BFSx][BFSy];
			m[BFSx][BFSy] = m[tx][ty];
			m[tx][ty] = temp;
			}
		}
	}
	return -1;
}

var m = new Array([0,0,0],[0,0,0],[0,0,0]);


function set(){
	dis = new HashTable();
	vis = new HashTable(); //map<string, int>dis, vis;
	route1 = new HashTable(); //map<string, string>route1, route2;
	route2 = new HashTable(); 
	q1 = new Queue();
	q2 = new Queue();
	str1 = "";
	str2 = "";
	str = "";
	var last = "123456789";
	flag = 0;
	BFSx = 0;
	BFSy = 0;
	m = new Array([0,0,0],[0,0,0],[0,0,0]);
}

var walk_times = 0 ;
//动画演示
function walk(){
	var space_position = findPosition(0); //找空格的位置 这里是s[n]位置
	var i = walk_times;
	$("div").css("pointer-events","none")
	if(route[i]=="0"){ //向右走
		move( s[space_position+1] ); //move是移动数字吧
	}
	else if (route[i]=="1"){ //向左走
		move( s[space_position-1] );
	}
	else if (route[i]=="2"){ //向下走
		move( s[space_position+3] );
	}
	else if (route[i]=="3"){ //向上走
		move( s[space_position-3] );
	}
	walk_times++;
	
	if(walk_times == route.length){ //如果步数走到了，就关计时器，并且步数清零
		walk_times = 0;
		clearInterval(walk_timer);
		$("div").css("pointer-events","auto")
	}
	
}