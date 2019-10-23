console.log('search js connected');

$(`#username-nav-link`).text(`${window.sessionStorage.username}`);
$('#username-nav-link').parent().attr('href', `/feed/${window.sessionStorage.userId}`);

let loved;

$.ajax({
  method: 'GET',
  url: `http://localhost:4000/api/v1/podcasts/${window.sessionStorage.userId}`,
  success: (res) => {
    loved = res.data;
  },
  error: (err) => console.log(err)
})

// user submits a search query
const onSuccess = (res) => {
  const lovedNames = loved.map(x => x.name);
  let heartCount = 0;
  let heartClasses = '';
  const $searchResults = $('#results');
  $searchResults.empty();
  res.results.forEach((result) => {
    heartClasses = 'far fa-heart heart open-heart'
    if (lovedNames.includes(result.collectionName)) {
      heartCount = loved.find(x => x.name === result.collectionName).heartCount;
      heartClasses = 'fas fa-heart heart closed-heart';
    }
    const temp = `<div class="col-sm-6">
      <div class="card mb-4 shadow-sm">
        <img class="result-img" src="${result.artworkUrl600}" />
        <div class="card-body">
          <p class="card-text podcast-name">${result.collectionName}</p>
          <div class="d-flex justify-content-between align-items-center">
            <div class="btn-group">
              <a href="${result.collectionViewUrl}" target="_blank">
                <button type="button" class="btn btn-sm btn-outline-secondary">iTunes</button>
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

$('form').on('submit', (e) => {
  e.preventDefault();
  let term = $('#search-bar').val();
  term = term.replace(' ', '+');
  $.getScript(`https://itunes.apple.com/search?term=${term}&media=podcast&limit=10&callback=onSuccess`);
});

$('#results').on('click', '.open-heart', function() {
  $(this).removeClass('open-heart');
  $(this).addClass('closed-heart');

  $(this).removeClass('far');
  $(this).addClass('fas');

  // ajax call to create new podcast in User document
  $.ajax({
    method: 'POST',
    url: `http://localhost:4000/api/v1/podcasts/${window.sessionStorage.userId}`,
    data: {
      name: $(this).data('name'),
      artist: $(this).data('artist'),
      itunesLink: $(this).data('itunes-link'),
      imageSource: $(this).data('image-source'),
    },
    success: (req)=>{
      console.log($(this).data('name'));
      console.log(`window stored Id: ${window.sessionStorage.userId}`)
      console.log('success');
    },
    error: (err) => {
      console.log(err);
    }
  });
});

$('#results').on('click', '.closed-heart', function() {
  $(this).removeClass('closed-heart');
  $(this).addClass('open-heart');

  $(this).removeClass('fas');
  $(this).addClass('far');

  // ajax call to delete podcast from User document
  $.ajax({
    method: 'DELETE',
    url: `http://localhost:4000/api/v1/podcasts/${window.sessionStorage.userId}`,
    data: {
      name: $(this).data('name'),
      artist: $(this).data('artist'),
      itunesLink: $(this).data('itunes-link'),
      imageSource: $(this).data('image-source'),
    },
    success: (res) => {
      console.log('successfully deleted')
    },
    error: (err) => {
      console.log(err);
    }

  })
});

// Sign Out
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
