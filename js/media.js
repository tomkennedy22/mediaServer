console.log('in media.js');

//var root_url = "http://localhost:8888/hmpg/web/api/index.php/";
var write_url = "web/write.php";
var globalData = {};


var filters = {'genre':'',
			   'minYear':'',
			   'maxYear':'',
			   'minRating':'',
			   'maxRating':''
			  }

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
			console.log('filtering on ');
			filters['genre'] = option;
			filterMedia();
		});


	});

	filters['minYear'] = Array.min(yearArray);
	filters['maxYear'] = Array.max(yearArray);
	addSlider(Array.min(yearArray), Array.max(yearArray));
	console.log(filters);
}

function filterMedia(){

		console.log('in filter media');
		//console.log(globalData);
		console.log(filters);
		var returnedData = globalData['Media'];

		//genre
		returnedData = $.grep(returnedData, function (element, index) {
	    	return element['genre'] == filters['genre'] || filters['genre'] === 'All' || filters['genre'] === '';
		});

		//years
		returnedData = $.grep(returnedData, function (element, index) {
	    	return element['year'] >= filters['minYear'] && element['year'] <= filters['maxYear'];
		});

		//rating
		returnedData = $.grep(returnedData, function (element, index) {
	    	return element['rating'] >= filters['minRating'] && element['rating'] <= filters['maxRating'];
		});

	    console.log(returnedData);
	    populateMedia(returnedData);
}

function populateMedia(data){

	$('ul.media').empty();
	    $.each(data, function(){
	    	var node = this;
	    	console.log(this);
	    	var html = $('#movieClone').clone();
	    	console.log($(html).find('a').attr('class'));
	    	$(html).removeAttr('id');
	    	$(html).find('a > .name').html(this['name']);
	    	$(html).find('a > .poster').attr('src', this['imageUrl']);
	    	$(html).removeAttr('style');
	    	$(html).find('a').attr('data-src', this['filePath']);
	    	$(html).find('a').on('click', function(){
	    		var src = $(this).attr('data-src');
				console.log(src);
				$('#videoModal').modal('show');
				//$('#htmlVideo').find('source').attr('src', src);
				$('#htmlVideo').attr('src', src);
				$('.modal-title').text(node['name']);

		    	var imdbLink = 'http://www.omdbapi.com/?t=';
		    	var name = node['searchName'];
		    	name = name.replace(/ /g, '+');
		    	imdbLink += name;
		    	alert(imdbLink);

		    	$.getJSON(imdbLink , function( data ){
		    		console.log(imdbLink);
		    		console.log(data);
		    		$('#movieInfo > .runtime').text(data['Runtime']);
		    		$('#movieInfo > .plot').text(data['Plot']);
		    		$('#movieInfo > .rated').text('Rated '+ data['Rated']);

		    		if ( data['imdbRating'] != 'N/A'){
		    			$('#movieInfo > .rating').text(data['imdbRating'] + ' rating');
		    		}
		    		else {
		    			$('#movieInfo > .rating').text('');
		    		}

		    	});
	    	});
	    //	console.log(html);
	    //	console.log($('ul.media'));
	    	$('ul.media').prepend(html);
	    })
}

function addListeners(){
	$('#genreSelect > li > a').on('click', function(){
		var option = $(this).text();
		console.log('filtering on ');
		filters['genre'] = option;
		filterMedia();
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
/*
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
*/
}


function addSlider(minYear, maxYear) {
	console.log('in slider');
    $( "#slider-range" ).slider({
      range: true,
      min: minYear,
      max: maxYear,
      values: [ minYear, maxYear ],
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
    	filterMedia();
    } );

//////////////////////////////////
    $( "#rating-slider-range" ).slider({
      range: true,
      min: 0,
      max: 10,
      step: .5,
      values: [ 0, 10 ],
      slide: function( event, ui ) {
        $( "#ratingSlider" ).val(  ui.values[ 0 ] + " - " + ui.values[ 1 ] );
      }
    });
    $( "#ratingSlider" ).val(  $( "#rating-slider-range" ).slider( "values", 0 ) +
      " -" + $( "#rating-slider-range" ).slider( "values", 1 ) );


    $( "#rating-slider-range" ).on( "slidechange", function( event, ui ) {
    	var values = $( "#rating-slider-range" ).slider( "values" );
    	filters['minRating'] = values[0];
    	filters['maxRating'] = values[1];
    	filterMedia();
    } );
 }

