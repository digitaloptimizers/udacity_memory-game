
///////////////////////
////// THE GAME ///////
///////////////////////

var game = {
  name: "Matching Game",
  nr_or_set_cards: 6, // Total number of cards (per set)
  total_nr_of_cards: 12, // Total number of cards (per set)
  icons: ["store","subject","theaters","opacity","label","receipt","loyalty","lock","polymer","reorder","room","rowing","schedule"], // We've made a few, so we can choose.
  selected_icons: [],
  matched_items: 0,
  max_open_cards: 2,
  nr_of_tries: 0,
  levels: [6,"Godlike!",9,"Mediocre",12,"N00b"], // The number of tries & the name of the level
  your_level: '',
  time_started: new Date(),
  time_stopped: new Date(),
  timer: 0
};


///////////////////////
////// FUNCTIONS //////
///////////////////////

// Function to shuffle an Array
function shuffle(a) {
  // Function used to randomize the content of an Array.
  var j, x, i;
  for (i = a.length; i; i--) {
      j = Math.floor(Math.random() * i);
      x = a[i - 1];
      a[i - 1] = a[j];
      a[j] = x;
  }
}

// Initial shuffling and loading of the cards on to the board
load_cards = function() {
  // Get a number of randomly selected icons based on the total amount needed
  shuffle(game.icons);
  game.selected_icons = game.icons.slice(0,game.nr_or_set_cards);
  // Duplicate the elements in the array and shuffle it again
  i = game.selected_icons.length;
  while (i--) { game.selected_icons.splice(i, 0, game.selected_icons[i]); }
  // Shuffle the 12 elements
  shuffle(game.selected_icons);
  console.log(game.selected_icons);
  // Adds icons to the board (html)
  for (var i = 0; i < game.selected_icons.length; i++) {
    $('.board').append('<div class="item '+game.selected_icons[i]+' '+game.selected_icons.indexOf(game.selected_icons[i])+'"><div class="closed">&nbsp;</div><i class="material-icons">'+game.selected_icons[i]+'</i></div>');
  }
}

// Showing the cards once it's clicked upon
function show_the_card(element) {
  // Start the timer if the timer isn't running already.
  if(!game.time_started) { game.time_started = new Date(); }
  $(element).parent().addClass('item_shown');
  $(element).css({'display':'none'});
  if( $(".item_shown:visible").length > game.max_open_cards-1) {
    // Validate if the 2 cards are a match
    check_match();
  }
}

function reset_game() {
  // Reset the game
  location.reload();
}

function update_nr_of_tries() {
  // Update the nr. of tries per game.
  game.nr_of_tries += 1
  var tries = '';
  if (game.nr_of_tries > 1) { var tries = "s"; }
  $('#nr_of_moves SPAN').text(game.nr_of_tries+" move"+tries);

  // Remove a star for every 5 steps int he game...
  if(game.nr_of_tries > game.levels[4]) {
    $('.status .stars i.material-icons').slice(-3).text('star_border');
    game.your_level = game.levels[5]
  } else if(game.nr_of_tries > game.levels[2]) {
    $('.status .stars i.material-icons').slice(-2).text('star_border');
    game.your_level = game.levels[3]
  } else if(game.nr_of_tries > game.levels[0]) {
    $('.status .stars i.material-icons').slice(-1).text('star_border');
    game.your_level = game.levels[1]
  }
}

function process_valid_answer() {
  $('.item_shown').addClass('matched').removeClass('item_shown');
  $('.item_shown.matched .closed').remove();
  $('.item .closed').bind("click", function(e){ show_the_card(e.currentTarget) });
  game.matched_items+=1;
}

function process_invalid_answer() {
  $(".item_shown").effect( "bounce", { direction: "up", times: 8, distance: 16});
  setTimeout(function(){
    $('.item_shown .closed').css({'display':'block'});
    $(".item").removeClass("item_shown");
    // Enable the click for until validating the answer
    $('.item .closed').bind("click", function(e){ show_the_card(e.currentTarget) });
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
  $('#counts').text('').text(game.nr_of_tries);
  $('#timed').text('').text((game.time_stopped-game.time_started)/1000);
  $('#rank').text('').text(game.your_level);
  $('.game_over').css('display','block');
}


load_cards();

$( ".item .closed" ).click(function(e) {
  show_the_card(e.currentTarget);
});


$( ".retry" ).click(function(e) {
  reset_game();
});


// Load them randomly into the website

// Make an onClick statement

// Check if the two selected items are the statement


// If not, one extra move

// Minis 1 star for ever 5 moves

// If all turned, thank you!
