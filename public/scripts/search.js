console.log('search js connected');

$(`#username-nav-link`).text(`${window.sessionStorage.username}`);

const resultLinks = [];

// user submits a search query
const onSuccess = (res) => {
  const $searchResults = $('#results');
  $searchResults.empty();
  res.results.forEach((result) => {
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
          <i class="far fa-heart heart open-heart"
          data-name="${result.collectionName}"
          data-artist="${result.artistName}"
          data-itunes-link="${result.collectionViewUrl}"
          data-image-source="${result.artworkUrl600}"></i>
        </div>
      </div>
    </div>
  </div>`;
  $searchResults.append(temp);

  // Push each result's itunesLink into resultLinks array
  resultLinks.push(result.collectionViewUrl);
  });
};

$('form').on('submit', (e) => {
  e.preventDefault();
  let term = $('#search-bar').val();
  term = term.replace(' ', '+');
  // $.ajax({
  //   method: 'GET',
  //   url: `https://itunes.apple.com/search?term=${term}&media=podcast&limit=10`,
  //   dataType: 'json',
  //   success: onSuccess,
  //   error: (err) => {
  //     console.log({err});
  //   }
  // })
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


// Compare search results to user feed by itunesLink. If podcast is loved in feed, change icon in search to filled heart

// Get user's loved podcasts
const getLovedPods = (jsonData) => {
  const LovedPodcasts = [];
  jsonData.data.forEach((podcast) => {
    LovedPodcasts.push(podcast.itunesLink)
  });
  return LovedPodcasts;
}

const lovedLinks = getLovedPods();

const getUserPodcasts = () => {
  $.ajax({
    method: 'GET',
    url: `http://localhost:4000/api/v1/podcasts/${window.sessionStorage.userId}`,
    success: getLovedPods,
    error: (err) => {
      console.log(err)
    }
  });
};

getUserPodcasts();


// // Compare user's podcasts to search results
// lovedLinks.forEach(link => {
//   if (resultLinks.includes(link)) {
//     console.log(true);
//   }
// })