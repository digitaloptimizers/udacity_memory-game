

///////////////////////
////// THE PLAN ///////
///////////////////////

// 1) Load the cards + symbols randomly into the board
// 2) Make an onClick statement for clicking cards
// 3) Check if the two selected cards are the same
// 4) If not, one extra move and turn back the cards
// 5) Minus 1 star for ever X moves (variable)
// 6) If all cards turned, show modalbox 'thank you'!



///////////////////////
////// THE GAME ///////
///////////////////////

var game = {
  nr_or_set_cards: 6, // Total number of cards (per set)
  icons: ["store","subject","theaters","opacity","label","receipt","loyalty","lock","polymer","reorder","room","rowing","schedule"], // We've made a few, so we can choose.
  selected_icons: [],
  matched_items: 0,
  max_open_cards: 2,
  nr_of_tries: 0,
  your_level: '',
  time_started: new Date(),
  time_stopped: new Date(),
  timer: 0
};

var star_levels = [
  {
    'level_threshold': 6,
    'level_description': 'Godlike!'
  },
  {
    'level_threshold': 9,
    'level_description': 'Mediocre'
  },
  {
    'level_threshold': 12,
    'level_description': 'N00b'
  }
];


///////////////////////
////// FUNCTIONS //////
///////////////////////

function shuffle(a) {
  // Function to shuffle an Array and randomize the content (the cards).
  var j, x, i;
  for (i = a.length; i; i--) {
      j = Math.floor(Math.random() * i);
      x = a[i - 1];
      a[i - 1] = a[j];
      a[j] = x;
  }
}

// Initial shuffling and loading of the cards on to the board
function load_cards() {
  // Get a number of randomly selected icons based on the total amount needed
  shuffle(game.icons);
  game.selected_icons = game.icons.slice(0,game.nr_or_set_cards);
  // Duplicate the elements in the array and shuffle it again
  i = game.selected_icons.length;
  while (i--) { game.selected_icons.splice(i, 0, game.selected_icons[i]); }
  // Shuffle the 12 elements
  shuffle(game.selected_icons);
  // Adds icons to the board (html)
  for (var i = 0; i < game.selected_icons.length; i++) {
    $('.board').append('<div class="item '+game.selected_icons[i]+' '+game.selected_icons.indexOf(game.selected_icons[i])+'"><div class="closed">&nbsp;</div><i class="material-icons">'+game.selected_icons[i]+'</i></div>');
  }
}

// Showing the cards once it's clicked upon
function show_the_card(element) {
  // Start the timer if the timer isn't running already.
  if(!game.time_started) {
    game.time_started = new Date();
  }
  $(element).parent().addClass('item_shown');
  $(element).css({'display':'none'});
  if( $(".item_shown:visible").length > game.max_open_cards-1) {
    // Validate if the 2 cards are a match
    check_match();
  }
}

function reset_game() {
  // Reset the game
  var r = confirm("Are you sure you want to restart the game?");
    if (r == true) {
        location.reload();
    } else {
        return false;
    }
}

function changeStars() {
  // Remove a star for every X steps (variable, can be adjusted in the  OBJECT "GAME")
  if(game.nr_of_tries > star_levels[2].level_threshold) {
    // Let's keep 1 star, but the user drops a level regardlessly.
    game.your_level = star_levels[2].level_description;
  } else if(game.nr_of_tries > star_levels[1].level_threshold) {
    $('.star_result i.material-icons').slice(-2).text('star_border');
    $('.star_result i.material-icons').slice(-1).text('star_border');
    $('.star_ranking i.material-icons').slice(-2).text('star_border');
    $('.star_ranking i.material-icons').slice(-1).text('star_border');
    game.your_level = star_levels[1].level_description;
  } else if(game.nr_of_tries > star_levels[0].level_threshold) {
    $('.star_result i.material-icons').slice(-1).text('star_border');
    $('.star_ranking i.material-icons').slice(-1).text('star_border');
    game.your_level = star_levels[0].level_description;
  }
}

function update_nr_of_tries() {
  // Update the nr. of tries per game.
  game.nr_of_tries += 1;
  var display_move_count = game.nr_of_tries + " move";
  // If there are multiple moves, pluralize the word
  display_move_count += game.nr_of_tries > 1 ? "s" : "";
  $("#nr_of_moves SPAN").text(display_move_count);
  changeStars();
}

function process_valid_answer() {
  $('.item_shown').addClass('matched').removeClass('item_shown');
  $('.item_shown.matched .closed').remove();
  $('.item .closed').bind("click", function(e){ show_the_card(e.currentTarget); });
  game.matched_items+=1;
}

function process_invalid_answer() {
  $(".item_shown").effect( "bounce", { direction: "up", times: 8, distance: 16});
  setTimeout(function(){
    $('.item_shown .closed').css({'display':'block'});
    $(".item").removeClass("item_shown");
    // Enable the click for until validating the answer
    $('.item .closed').bind("click", function(e){ show_the_card(e.currentTarget); });
  }, 1000);
}

function check_match() {
  // Find given answers and add them to a list
  var answers = [];
  // Disable the click for until validating the answer
  $('.item .closed').unbind('click');
  $(".item_shown").each(function() {
    // Add the two selected answers to the array
    answers.push($(this).text());
  });
  // Check if the values in this given answer are the statement
  if(answers[0] === answers[1]) {
    process_valid_answer();
  } else {
    process_invalid_answer();
  }
  answer = [];
  update_nr_of_tries();

  // If this is the final answer, finish the game!
  if(game.matched_items === 6) {
    game.time_stopped = new Date();
    finished_game();
  }
}

function finished_game() {
  var timed = (game.time_stopped-game.time_started)/1000;
  $('#counts').text('').text(game.nr_of_tries);
  $('#timed').text('').text(timed);
  $('#rank').text('').text(game.your_level);
  var modal = document.getElementById('dialog');
  modal.style.display = "block";

  // Show previous scores
  var total_tries = localStorage.getItem('total_tries');
  if(localStorage.getItem('total_tries') != null) {
    previous_tries = localStorage.getItem('nr_of_tries');
    previous_timed = localStorage.getItem('timed');
    $('.last_score').html('<br /><strong>Previous score</strong><br />Previous score: <span>'+previous_timed+'</span> seconds and <span>'+previous_tries+'</span> moves.<br />Total games played: <span>'+total_tries+'</span>');
  }

  // Update localStorage with current scores
  localStorage.setItem('nr_of_tries',game.nr_of_tries);
  localStorage.setItem('timed',timed);
  total_tries = parseInt(localStorage.getItem('total_tries'))+1;
  localStorage.setItem('total_tries',total_tries);
}


// Initialize board
load_cards();

// Event listeners
$( ".item .closed" ).click(function(e) {
  show_the_card(e.currentTarget);
});
$( ".retry" ).click(function(e) {
  reset_game();
});
