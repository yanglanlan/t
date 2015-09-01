
apiready = function(){
//var MCAST_DATA = 'shareihome\rsih123456';
	var MCAST_DATA = 'shenqidweisuo';
	//var MCAST_DATA = 'shenq';
	//var MCAST_DATA = '1111111111111111111111111111';
	var MUL_SEND_DATA = 'a';
	var START_MULADD1 =	"234.10.00.00";
	//var START_MULADD2 =	"234.10.44.44";
	//var START_MULADD3 =	"234.10.44.44";
	//var START_MULADD4 =	"234.10.44.44";
	var START_MULADD2 =	"234.10.11.11";
	var START_MULADD3 =	"234.10.22.22";
	var START_MULADD4 =	"234.10.33.33";
	//var START_MULADD4 =	"225.224.224.255";

	var DATA_START_ADD = "234.20.00.11";
	var DATA_TRAN_ADD =	"234.30.XX.YY";
	var DATA_END_ADD = "234.20.00.22";

	//var DATA_START_ADD = "234.10.44.44";
	//var DATA_TRAN_ADD =	"234.10.44.44";
	//var DATA_END_ADD = "234.10.44.44";
	
	var g_sid = 0;
	//var broadcast_ip = '224.224.224.255';
	var broadcasr_port = 8989;

	var socketManager = api.require('socketManager');

	function createSocketAndSendData(broadcast_ip,sendFunc,data1){
	//function createSocketAndSendData(sendFunc){
		try{
			socketManager.createSocket({
		    host: broadcast_ip,
		    port: 8989,
		    type:'udp',
		    //udpMode:'unicast'
		    udpMode:'multicast'
			}, function(ret, err){
			    if(ret){
			        var state = ret.state;
			         sid = ret.sid;
			        var data = ret.data;
			        var stateStr = "";
			        if(101 === state){
			            stateStr = "创建成功";
			             if(101 === state){
			            sendFunc(sid,data1,broadcast_ip);
			            //sendFunc(sid,data1,broadcast_ip);
					}
			        }else if(102 === state){
			            stateStr = "连接成功";
			        }else if(103 === state){
			            stateStr = "收到消息";
			        }else if(201 === state){
			            stateStr = "创建失败";
			        }else if(202 === state){
			            stateStr = "连接失败";
			        }else if(203 === state){
			            stateStr = "异常断开";
			        }else if(204 === state){
			            stateStr = "正常断开";
			        }else if(205 === state){
			            stateStr = "发生未知错误";
			        }

			        var msg = 'ip'+broadcast_ip+'\nsid: '+sid+'\nstate: '+stateStr+'\ndata: '+(data?data:'');
			        //api.alert({msg:msg});
				}
			    else{
			    	api.alert({msg:err.msg});
			    }
			});
			//api.alert({msg:'load finished'});
		}catch(e){
			api.alert({msg:e.message});
		}


	}

	function sendMsg(_sid , _data, _broadcast_ip){
		socketManager.write({
	      sid: _sid,            //由createSocket方法获取得到
	      data: _data,
	      host: _broadcast_ip,
      	  port:8989,
	    }, function(ret, err){
	    	//api.alert({msg:_sid+' send over'});
	    });
	}
function show2(str){
    api.alert({msg:str});
}
	function udpMulData2(ip,iDatalen)
	{
		var buff = MUL_SEND_DATA;

		for(var loop=0;loop<iDatalen;loop++)
			buff += MUL_SEND_DATA;

		//api.alert({msg:ip+'\ndata len'+iDatalen +buff});

		createSocketAndSendData(ip,sendMsg,buff);
		//createSocketAndSendData(ip,sendMsg,buff);

	}
	
	function udpMulData(ip,iDatalen)
	{
		var buff = MUL_SEND_DATA;

		for(var loop=0;loop<iDatalen;loop++)
			buff += MUL_SEND_DATA;

		//api.alert({msg:ip+'\ndata len'+iDatalen +buff});

		//createSocketAndSendData(ip,sendMsg,buff);
		//createSocketAndSendData(ip,sendMsg,buff);

		createSocketAndSendData(ip,sendMsg,buff);
		createSocketAndSendData(ip,sendMsg,buff);

	}
	

	function msleep(millis)
 	{
  		var date = new Date();
  		var curDate = null;
  		do { curDate = new Date(); }
  		while(curDate-date < millis);
	}

	function wireless_send(data)
	{
		var dataLen = 0;
		var ip = '';

		dataLen = data.length;

		for (var loop=0;loop<60;loop++)
		{
			udpMulData2(START_MULADD1,10);
			udpMulData2(START_MULADD2,20);
			udpMulData2(START_MULADD3,30);
			udpMulData2(START_MULADD4,40);
			msleep(10);
			//sleep(10);
		}

		udpMulData(DATA_START_ADD,dataLen + dataLen%2);
		udpMulData(DATA_START_ADD,dataLen + dataLen%2);

		for (var i=0;i<(dataLen-1);i+=2)
		{
			ip = '224.30.'+i/2+'.'+data[i].charCodeAt();
			//api.alert({msg:ip});
			//msleep(1000);
			udpMulData(ip,data[i+1].charCodeAt());
			udpMulData(ip,data[i+1].charCodeAt());
		}

		if (dataLen%2)
		{
			ip = '224.30.'+i/2+'.'+data[i].charCodeAt();
			udpMulData(ip,'\0');
			udpMulData(ip,'\0');
		}

		udpMulData(DATA_END_ADD,dataLen);
		udpMulData(DATA_END_ADD,dataLen);
		api.alert({msg:'send over'});
	}
	
	function send_data()
	{
		for (var loop=0;loop<10;loop++)
		{
			try{	      	
	      		wireless_send(send_data1);

	      	}catch(e){
				api.alert({msg:e.message});
			}
		      	msleep(1000);
		}
}
  var ui = {
      $txt_account: $('#ssid')
	, $txt_pwd: $('#password')
	, $btn_login: $('#btn-login')
	, $btn_forget: $('#btn-forget')
  };

  	var oPage = {
	init : function() {
		this.listen();
	},
	listen : function (){
 		var self = this;
  		// 账号
		ui.$txt_account.keydown(function(e) {
			var kc = e.which || e.keyCode;
			if(kc == 13) {
			$(this).blur();
			ui.$btn_login.trigger('touchend');
			}
		});

 		// 密码
  		ui.$txt_pwd.keydown(function(e) {
			var kc = e.which || e.keyCode;
			if(kc == 13) {
			$(this).blur();
			ui.$btn_login.trigger('touchend');
			}
		});
  
    	ui.$btn_login.on('touchend', function() {
        	self.fLogin();
        	//send_data();
      	});
  
	},
	// 去除空格
	fTrimStr: function(cont){
		if (cont == null) {
	  	return cont;
		}
		return cont = cont.replace(/^\s+|\s+$/g,"");
	},
	fLogin: function() {
		var self = this;
		var accountCont = self.fTrimStr(ui.$txt_account.val());
		var pwdCont = self.fTrimStr(ui.$txt_pwd.val());
		var send_data1=accountCont+" "+pwdCont;
		api.alert({msg:'send_data:'+send_data1});
		//setInterval(wireless_send,2000,sendMsg);
		self.send_wifi_para(send_data1);
		//msleep(1000);		
	},
	send_wifi_para: function(data1){
		wireless_send(data1);
		//wireless_send(data1);
	},
};

	oPage.init();
}