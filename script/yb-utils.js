function apialert(_title, _msg, callback){
	api.alert({
	    title: _title,
	    msg: _msg,
	}, function(ret, err) {
		if(callback){
			callback();
		}
	});
}

function toast(_msg){
	api.toast({
	    msg: _msg,
	    global: true
	});
}

function radioValue(ename){
	var radios = document.getElementsByName(ename);
	if(radios){
		for(var r in radios){
			if(radios[r].checked){
				return radios[r].value;
			}
		}
	}
}

function selectValue(eid){
	return $(eid).value;
}