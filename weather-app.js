/*This is a fairly simple app that lets you pick a day and the location of the user is gotten, 
and the weather is given back for the day, tomorrow or the next day.  It flexes the ability of 
changing a poriton of the page with ajax.  open weather map api is used to gather the weather info. 
and html5 is used to obtain the location lat/long.  as a bit of a bonus there is an interactive 
to-do list included to use in conjuction with the weather app.  Thank you for viewing*/

//variables
  var locUrl, lata, longi;
  var $weatherButton = $('.weatherButton');
	var $newItemForm = $('form');
  var $days = $('#days li');
  var $selected;
  var currentIndex;
/*this function adds li elements to the to do list.*/
  $newItemForm.submit( function(e) {
		e.preventDefault();
		var newText = $('input:text').val();
		$('#toDoList ol').append('<li>' + newText + '</li>');
		 $('input:text').val('');
	});
	/*event handler for the weather forecast of days.  the index corresponds to the days in the api 
  used and is set during this function*/
  $days.click(function(){
    if ($selected !== undefined){
      $selected.removeClass('selected');
    }
    $selected = $(this);
    $(this).addClass('selected');

    currentIndex = $('#days li').index($(this));
    //if lata is undefined then get geolocation. else get weather
    if(lata === undefined){
       getLocation();
    }else{
      getTheWeather(currentIndex);
    }
  });
/*uses html5 api to get the user's location*/
	function getLocation() {
    $('#latlon').fadeIn('slow');
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        } else {
            $('#latlon').text(
                'Geolocation is not supported by this browser.');
        }
    }
/*caches the goodies from the location grab, then calls the getTheWeather function*/
	function showPosition(position){
		  lata = position.coords.latitude;
    	longi = position.coords.longitude;
    	locUrl = "http://api.openweathermap.org/data/2.5/forecast/daily?lat=" + lata +"&lon="+ 
      longi+"&appid=";
      getTheWeather(currentIndex);
		}
/*does just what it says. uses .ajax method */
  function getTheWeather(index){
    $.ajax({
			url: locUrl,
			method: 'get',
			dataType: 'json',
			success: function(data){
				var low = data.list[index].temp.min ;
				low = parseFloat(low) ; 				    //text to number
				low = ((low - 273.15)*9/5)+32;			//conversion
				low = Math.round(low);					    //round it
				var high = data.list[index].temp.max;
				high = parseFloat(high);
				high =  ((high - 273.15)*9/5)+32 ;  //should make a method for this conversion.
				high = Math.round(high);
        /*weather man*/
				$('#latlon').text('');
				$('#latlon').append("<br>low temp: " + low + "\xB0 F");
				$('#latlon').append("<br>high temp: " + high + "\xB0 F");
				$('#latlon').append("<br>"+data.list[index].weather[0].description);
				var image = data.list[index].weather[0].icon;
				$('#latlon').append("<br><img width='75px' id='icon' src='http://openweathermap.org/img/w/"+ 
          image +".png'>");
			}
		});
	}
