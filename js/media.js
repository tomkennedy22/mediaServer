console.log('in media.js');

//var root_url = "http://localhost:8888/hmpg/web/api/index.php/";
var write_url = "web/write.php";
var globalData = {};

function filterMedia(){

		console.log('in filter media');
		console.log(globalData);
		console.log(filters);
		var returnedData = globalData['Media'];

		//genre
		returnedData = $.grep(returnedData, function (element, index) {
	    	return element['genre'] == filters['genre'] || filters['genre'] === 'Genre';
		});

		//years
		returnedData = $.grep(returnedData, function (element, index) {
	    	return element['year'] >= filters['minYear'] && element['year'] <= filters['maxYear'];
		});

	    console.log(returnedData);
	    populateMedia(returnedData);
}

var filters = {'genre':'',
			   'minYear':'',
			   'maxYear':''
			  }

Object.observe(filters, function(){
	alert('changes filters');
	console.log(filters);
})

function inArray (arr, node) { 
    $.each(arr, function(){
    	if (this === node){
    		return true;
    	}
    })
    return false; 
}; 

Array.prototype.contains = function(v) {
    for(var i = 0; i < this.length; i++) {
        if(this[i] === v) return true;
    }
    return false;
};

Array.min = function( array ){
    return Math.min.apply( Math, array );
};

Array.max = function( array ){
    return Math.max.apply( Math, array );
};

Array.prototype.unique = function() {
    var arr = [];
    for(var i = 0; i < this.length; i++) {
        if(!arr.contains(this[i])) {
            arr.push(this[i]);
        }
    }
    return arr; 
}

$(document).ready(function(){
	var filters = [];
	addListeners();
	getJSONFromLink("web/info.json");
	saveData();

	});



function getJSONFromLink(link) {
	console.log('in getjsonfrom link', link);
	$.getJSON( link, function( data ) {
		console.log('in getJSON');
	    console.log(data);
	    globalData = data;

	    createFilters(data['Media']);

	    populateMedia(data['Media']);
});
}

function createFilters(data) {
	var yearArray = [];
	var genreArray = [];

	$.each(data, function(){
		
		yearArray.push(this['year']);	
		genreArray.push(this['genre']);
		
	});

	yearArray = yearArray.unique();
	genreArray = genreArray.unique();

	yearArray.sort();

	console.log(yearArray);
	console.log(genreArray);

	$.each(genreArray, function(){

		var clone = $('#genreSelect > li.proto').clone();
		$(clone).attr('value', this).removeAttr('class');
		$(clone).find('a').text(this);
		$('#genreSelect').append(clone);

		$(clone).find('a').on('click', function(){
			var option = $(this).text();
			if (option === 'Genre'){
				populateMedia(globalData);
				return;}
			console.log('filtering on ');
			filterMedia([['genre', option]]);
		});


	});

	filters['minYear'] = Array.min(yearArray);
	filters['maxYear'] = Array.max(yearArray);
	addSlider(Array.min(yearArray), Array.max(yearArray));
	console.log(filters);
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
	$('#genreSelect > li > a').on('click', function(){
		var option = $(this).text();
		if (option === 'Genre'){
			populateMedia(globalData);
				return;}
		console.log('filtering on ');
		filterMedia([['genre', option]]);
	});

	$('#myModal').modal();

	$('.movieLink').on('click', function(){
		var src = $(this).attr('data-src');
		console.log(src);
		$('#videoModal').modal('show');
		$('#htmlVideo').find('source').attr('src', src);
	}) ;
}

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


function addSlider(minYear, maxYear) {
	console.log('in slider');
    $( "#slider-range" ).slider({
      range: true,
      min: minYear,
      max: maxYear,
      values: [ 1994, 2016 ],
      slide: function( event, ui ) {
        $( "#amount" ).val(  ui.values[ 0 ] + " - " + ui.values[ 1 ] );
      }
    });
    $( "#amount" ).val(  $( "#slider-range" ).slider( "values", 0 ) +
      " -" + $( "#slider-range" ).slider( "values", 1 ) );


    $( "#slider-range" ).on( "slidechange", function( event, ui ) {
    	var values = $( "#slider-range" ).slider( "values" );
    	filters['minYear'] = values[0];
    	filters['maxYear'] = values[1];
    } );
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
