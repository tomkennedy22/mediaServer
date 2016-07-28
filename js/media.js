console.log('in media.js');

//var root_url = "http://localhost:8888/hmpg/web/api/index.php/";
//var write_url = "web/api/write.php";
/*
function saveData(){
	console.log('Saving data!!!');
	console.log(globalData);

	$.ajax
	    ({
	        type: "POST",
	        dataType : 'json',
	        async: false,
	        url: write_url,
	        data: { data: JSON.stringify(globalData) },
	        success: function () {alert("Thanks!"); },
	        failure: function() {alert("Error!");}
	});
}
*/
var globalData = {};


function getJSONFromLink(link) {
	console.log('in getjsonfrom link', link);
	$.getJSON( link, function( data ) {
		console.log('in getJSON');
	    console.log(data);
	    globalData = data;

	    $.each(data['Media'], function(){
	    	console.log(this);
	    })
	  });

}

//getJSONFromLink("http://162.243.139.175/mediaServer/web/info.json");
getJSONFromLink("web/info.json");
/*
function updateLocalStorage(userId){
	var accts = globalData.Account;

	console.log('looking for userid ' + userId);

	var user = $.grep(
	                accts, 
	                function (item,index) { 
	                	console.log(item);
	                    return item.userId == userId; 
	                });

	console.log(user);
		//alert('email matched password!');
	$.each(user[0], function(key, value){
		localStorage.setItem(key, value);
	});
	window.location = 'hmpg.html';
	
}*/
