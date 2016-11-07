(function() {
  'use strict';

  var movies = [];
  var plots = [];
  var renderMovies = function() {
    for (var i = 0; i < plots.length; i++) {
      console.log('looping',i);
      movies[i]['plot'] = plots[i];
      console.log(plots[i]);
    }
    $('#listings').empty();
    // console.log(movies);

    for (var movie of movies) {
      var $col = $('<div class="col s6">');
      var $card = $('<div class="card hoverable">');
      var $content = $('<div class="card-content center">');
      var $title = $('<h6 class="card-title truncate">');

      $title.attr({
        'data-position': 'top',
        'data-tooltip': movie.title
      });

      $title.tooltip({ delay: 50, });
      $title.text(movie.title);

      var $poster = $('<img class="poster">');

      $poster.attr({
        src: movie.poster,
        alt: `${movie.poster} Poster`
      });

      $content.append($title, $poster);
      $card.append($content);

      var $action = $('<div class="card-action center">');
      var $plot = $('<a class="waves-effect waves-light btn modal-trigger">');

      $plot.attr('href', `#${movie.id}`);
      $plot.text('Plot Synopsis');

      $action.append($plot);
      $card.append($action);

      var $modal = $(`<div id="${movie.id}" class="modal">`);
      var $modalContent = $('<div class="modal-content">');
      var $modalHeader = $('<h4>').text(movie.title);
      var $movieYear = $('<h6>').text(`Released in ${movie.year}`);
      var $modalText = $('<p>').text(movie.plot);
      // console.log(movie.plot);
      // console.log('modalText', $modalText);
      $modalContent.append($modalHeader, $movieYear, $modalText);
      $modal.append($modalContent);

      $col.append($card, $modal);

      $('#listings').append($col);

      $('.modal-trigger').leanModal();
    }
  };

  $('#submit').click(
    function(event){
      if($('#search').val().length > 0){
        event.preventDefault();
        var tl = $('#listings');
        var tlc = $(tl).children();
        $(tlc).each(function(){
          $(this).remove();
          console.log();
        });
        movies = [];
        var searchTerms = $('#search').val();
        var temp = searchTerms.split(' ');
        var searchTerms2 = temp.join('+');
        console.log(searchTerms2);
        // console.log(`http://www.omdbapi.com/?s=${searchTerms2}&y=&plot=short&r=json`);
        $.get(`https://www.omdbapi.com/?s=${searchTerms2}&y=&plot=short&r=json`, function(){})
        .done(function(data){
          // console.log('data', data);
          // console.log('# results returned', data.Search.length);
          // console.log(data[i]['imdbID']);
          for (var i = 0; i < data.Search.length; i++) {
            var movie = {
              id: data['Search'][i]['imdbID'],
              poster: data['Search'][i]['Poster'],
              title: data['Search'][i]['Title'],
              year: data['Search'][i]['Year'],
              plot: ''
            };
            movies.push(movie);
            // console.log('new: ', newMovie);
          } // end of for loop about data results length
          console.log('movies', movies);
          console.log('first',movies[0]);
          for (var j = 0; j < movies.length; j++) {
            var thisId = movies[j]['id'];
            $.get(`http://www.omdbapi.com/?i=${thisId}&plot=full&r=json`, function(){})
            .success(function(data){
              plots.push(data['Plot']);
              // console.log(data);
              // console.log(data['Plot']);
              // console.log(j);
              // console.log(movies);
              // movies[j]['plot'] = data['Plot'];
            });//end of second ajax
        } //end of for loop
        console.log('plot', plots);


          setTimeout(function(){renderMovies()}, 500);


        }); //end of ajax call

      }
    }
  )


})();
