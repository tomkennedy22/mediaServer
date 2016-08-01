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
$(document).ready(function(){
	var globalData = {};
	var filters = [];
	addListeners();
	getJSONFromLink("web/info.json");

	});



function getJSONFromLink(link) {
	console.log('in getjsonfrom link', link);
	$.getJSON( link, function( data ) {
		console.log('in getJSON');
	    console.log(data);
	    globalData = data;

	    populateMedia(data['Media']);
});
}



function filterMedia(filters){

		console.log('in filter media');
		console.log(globalData);
		console.log(filters);
		var returnedData = globalData['Media'];

		$.each(filters, function(){
			console.log(this);
			var key = this[0];
			var value = this[1];
			console.log(key, value);
			returnedData = $.grep(returnedData, function (element, index) {
		    	return element[key] == value;
			});
		})

	    console.log(returnedData);
	    populateMedia(returnedData);
}

function populateMedia(data){

	$('ul.media').empty();
	    $.each(data, function(){
	    	console.log(this);
	    	var html = $('#movieClone').clone();
	    	console.log($(html).find('a').attr('class'));
	    	$(html).removeAttr('id');
	    	$(html).find('a > .name').html(this['name']);
	    	$(html).find('a > .poster').attr('src', this['imageUrl']);
	    	$(html).find('a').removeAttr('style');
	    	$(html).find('a').attr('data-src', this['filePath']);
	    	$(html).find('a').on('click', function(){
	    		var src = $(this).attr('data-src');
				console.log(src);
				$('#videoModal').modal('show');
				//$('#htmlVideo').find('source').attr('src', src);
				$('#htmlVideo').attr('src', src);
	    	});
	    //	console.log(html);
	    //	console.log($('ul.media'));
	    	$('ul.media').prepend(html);
	    })
}

function addListeners(){
	$('#genreSelect').on('change', function(){
		var option = $('#genreSelect option:selected').text();
		if (option === 'Genre'){
			return;}
		console.log('filtering on ');
		filterMedia([['genre', option]]);
	});

	$('#myModal').modal();

	$('movieLink').on('click', function(){
		var src = $(this).attr('data-src');
		console.log(src);
		$('#videoModal').modal('show');
		$('#htmlVideo').find('source').attr('src', src);
	}) ;
}
/*

<li>
        <a href="#">
            <img class= "poster" src = ""/> 
            <h4 class="name"></h4>
            <p>Watch now</p>
        </a>
    </li>
*/

//getJSONFromLink("http://162.243.139.175/mediaServer/web/info.json");

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
