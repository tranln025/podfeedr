// set dynamic links
$(`#username-nav-link`).text(`${window.sessionStorage.username}`);
$('#username-nav-link').parent().attr('href', `/feed/${window.sessionStorage.userId}`);
$('.navbar-brand').attr('href', `/feed/${window.sessionStorage.userId}`);

// search bar
$('.searchbar').on('mouseover', () => {
  $(`.searchbar`).addClass('searchbar-hover');
});

$(`.search_input`).on('blur', () => {
  $(`.searchbar`).removeClass('searchbar-hover');
});

// number of results
let numResults = 12;
let lucky;
let random;
$('.num-results').on('click', function () {
  $(this).toggleClass('active');
  numResults = Number($(this).attr('id'));

  $(this).siblings().removeClass('active');

  if (lucky) {
    $.getScript(`https://itunes.apple.com/search?term=${random}&media=podcast&limit=${numResults}&callback=onSuccess`);
  } else {
    let term = $('.search_input').val();
    if (term.length !== 0) {
      term = term.replace(' ', '+');
      $.getScript(`https://itunes.apple.com/search?term=${term}&media=podcast&limit=${numResults}&callback=onSuccess`);
    }
  }
});

// Instead of initializing variables everywhere, create central location for global variables
const state = {
  all: [],
  loved:[]
}

// get all podcasts to check heart count
$.ajax({
  method: 'GET',
  url: `/api/v1/podcasts/`,
  success: (res) => {
    all = res.data;
  },
  error: (err) => console.log(err)
});

// check user's podcasts to see if user hearted a podcast
$.ajax({
  method: 'GET',
  url: `/api/v1/podcasts/${window.sessionStorage.userId}`,
  success: (res) => {
    loved = res.data;
  },
  error: (err) => console.log(err)
});

// user submits a search query
const onSuccess = (res) => {
  const allNames = state.all.map(x => x.name);
  const lovedNames = state.loved.map(x => x.name);
  const $searchResults = $('#results');
  $searchResults.empty();
  res.results.forEach((result) => {
    let heartCount = 0;
    let heartClasses = 'far fa-heart heart open-heart'
    if (allNames.includes(result.collectionName)) {
      heartCount = state.all.find(x => x.name === result.collectionName).heartCount;
    }
    if (lovedNames.includes(result.collectionName)) {
      heartClasses = 'fas fa-heart heart closed-heart';
    }
    const temp = `
    <div class="card-deck col-sm-6">
      <div class="card border-info mb-4 shadow-sm">
        <img class="result-img" src="${result.artworkUrl600}" />
        <div class="card-body">
          <p class="card-text podcast-name">${result.collectionName}<br/>
          <small class="text-muted">${result.artistName}</small></p>
        </div>
        <div class="card-footer">
          <div class="d-flex justify-content-between align-items-center">
            <div class="btn-group">
              <a href="${result.collectionViewUrl}" target="_blank">
                <button type="button" class="btn btn-sm btn-outline-info">iTunes</button>
              </a>
            </div>
            <div class="heart-container">
              <span class="heart-count">${heartCount}</span>
              <i class="${heartClasses}"
              data-name="${result.collectionName}"
              data-artist="${result.artistName}"
              data-itunes-link="${result.collectionViewUrl}"
              data-image-source="${result.artworkUrl600}"></i>
            </div>
          </div>
        </div>
      </div>
    </div>`;
    $searchResults.append(temp);
  });
};

// i'm feeling lucky
const chooseRandomSearchChar = () => {
  /* choose random num between 97 and 122
     then convert to letter */
  const num = Math.floor(97 + Math.random()*((122 - 97) + 1));
  const letter = String.fromCharCode(num);
  return letter;
};

$('#luckyButton').on('click', () => {
  lucky = true;
  random = chooseRandomSearchChar();
  $.getScript(`https://itunes.apple.com/search?term=${random}&media=podcast&entity=podcast&limit=${numResults}&callback=onSuccess`);
});

// search input
$(`.search_input`).on('keyup', () => {
  lucky = false;
  let term = $('.search_input').val();
  term = term.replace(' ', '+');
  $.getScript(`https://itunes.apple.com/search?term=${term}&media=podcast&limit=${numResults}&callback=onSuccess`);
})

// heart count
const displayNewHeartCount = (element, op) => {
  /* op is 'increase' or 'decrease' */
  const $count = $(element).siblings('.heart-count').eq(0);

  let currentCount = Number($count.text());
  $count.empty();
  $count.hide();
  if (op === 'increase') {
    currentCount += 1;
  } else if (op === 'decrease') {
    currentCount -= 1;
  }
  $count.text(`${currentCount}`);
  $count.slideDown();
};

$('#results').on('click', '.open-heart', function() {
  $(this).removeClass('open-heart');
  $(this).addClass('closed-heart');

  $(this).removeClass('far');
  $(this).addClass('fas');

  displayNewHeartCount(event.target, 'increase');

  // ajax call to create new podcast in User document
  $.ajax({
    method: 'POST',
    url: `/api/v1/podcasts/${window.sessionStorage.userId}`,
    data: {
      name: $(this).data('name'),
      artist: $(this).data('artist'),
      itunesLink: $(this).data('itunes-link'),
      imageSource: $(this).data('image-source'),
    },
    success: (req)=>{
      console.log('success');
    },
    error: (err) => {
      console.log(err);
    }
  });
});

// remove podcast from User and decrease heart count
$('#results').on('click', '.closed-heart', function(event) {
  $(this).removeClass('closed-heart');
  $(this).addClass('open-heart');

  $(this).removeClass('fas');
  $(this).addClass('far');

  displayNewHeartCount(event.target, 'decrease');

  $.ajax({
    method: 'PUT',
    url: `/api/v1/podcasts/${window.sessionStorage.userId}`,
    data: {
      name: $(this).data('name'),
      artist: $(this).data('artist'),
      itunesLink: $(this).data('itunes-link'),
      imageSource: $(this).data('image-source'),
    },
    success: (res) => {
      console.log('successfully removed')
    },
    error: (err) => {
      console.log(err);
    }
  })
});

// sign out
$(`.signout`).on('click', (event) => {
  event.preventDefault();
  fetch('/api/v1/signout', {
      method: 'DELETE',
      credentials: 'include',
      headers: {
          'Content-Type': 'application/json'
      },
  })
  .then(dataStream => dataStream.json())
  .then(res => {
      if (res.status === 200) {
      window.location = '/signup';
      }
  });
});
