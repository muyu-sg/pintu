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
for (var i = 0; i < 9; i++) { s[i] = i;}/*默认9是空的，给1-8赋值*/
s[9] = 0;
//s[i]为图片的序号，i为图片当前位置，
route=""



function judgeHaveSolution(){
	var inversion_number=0; //逆序数
	for (var i = 1; i < s.length; i++) { //i在前，j在后，求逆序数,从1求到9，要去掉空白块再排列
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
function myToS(){
	for (var i = 1; i <= first.length; i++) {
		if(first[i-1]==".") s[i]=0;
		else s[i]=parseInt(first[i-1]);
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
	last="";
	first="";
	var last = "123456789";
	flag = 0;
	BFSx = 0;
	BFSy = 0;
	m = new Array([0,0,0],[0,0,0],[0,0,0]);
}

var m = new Array([0,0,0],[0,0,0],[0,0,0]);
var last="";
//将打乱的字符串转换成想要的最终形态
function transfer(){
	for (var i = 0; i < s.length; i++) { s[i] = 0;}
	for (var i = 0; i < first.length; i++) {
		if(first[i]!=".") s[parseInt(first[i])]=1;
	}
	alert(s);
	for (var i = 1; i < s.length; i++) {
		if(s[i]==0){
			last+=".";
		}else{
			last+=i;
		}
		
	}
}

function show(){
	first=$("#orig").val();
//	last=$("#lasts").val();
//	transfer();
	last="";
	for (var i = 0; i < s.length; i++) { s[i] = 0;}
	for (var i = 0; i < first.length; i++) {
		if(first[i]!=".") s[parseInt(first[i])]=1;
	}
	for (var i = 1; i < s.length; i++) {
		if(s[i]==0){
			last+=".";
		}else{
			last+=i;
		}
	}
	myToS();
	if(judgeHaveSolution()){
		result2=doubleBFS()-1;
		var word_route="";
		for (var i = 0; i < route.length; i++) {
			if(route[i]=="0") word_route += "d";
			else if(route[i]=="1") word_route += "a";
			else if(route[i]=="2") word_route += "s";
			else if(route[i]=="3") word_route += "w";
		}
		$("#tips").html("最小步数： " + result2+"<br/>w:上 s:下 a:左 d:右<br/>空格移动方向:" + word_route )
		set();
	}else{
		$("#tips").html("無解");
	}
	set();
}
function show2(){
	var oriss=new Array(10);
	var oris=$("#orig").val();
	route=$("#rou").val();
	for (var i = 1; i <=oris.length; i++) {
		if(oris[i-1]=="."){
			oriss[i]=0;
			var space=i;
		}
		else oriss[i]=parseInt(oris[i-1]);
	}
	for (var i = 0; i < route.length; i++) {
			if(route[i]=="w"){
				oriss[space]=oriss[space-3];
				oriss[space-3]=0;
				space=space-3;
				
			}
			else if(route[i]=="s"){
				oriss[space]=oriss[space+3];
				oriss[space+3]=0;
				space=space+3;
			}
			else if(route[i]=="d"){
				oriss[space]=oriss[space+1];
				oriss[space+1]=0;
				space=space+1;
			}
			else if(route[i]=="a") {
				oriss[space]=oriss[space-1];
				oriss[space-1]=0;
				space=space-1;
			}
	}
	var str = "";
	for (var i = 1; i < oriss.length; i++) {
		if(oriss[i]==0) str += ".";
		else str += oriss[i];
	}
	$("#tips").html("改變後："+str);
}