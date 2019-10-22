console.log('showfeed');

const userId = window.location.pathname.split('/')[2];

const displayFeed = (res) => {
  const podcasts = res;
  const $results = $('#results');
  $results.empty();
  podcasts.forEach((result) => {
  const temp = `<div class="col-sm-6">
    <div class="card mb-4 shadow-sm">
      <img class="result-img" src="${result.imageSource}" />
      <div class="card-body">
        <p class="card-text podcast-name">${result.name}</p>
        <div class="d-flex justify-content-between align-items-center">
          <div class="btn-group">
            <a href="${result.itunesLink}" target="_blank">
              <button type="button" class="btn btn-sm btn-outline-secondary">View</button>
            </a>
          </div>
          <i class="fas fa-heart heart closed-heart"
          data-name="${result.name}"
          data-artist="${result.artist}"
          data-itunes-link="${result.itunesLink}"
          data-image-source="${result.imageSource}"></i>
        </div>
      </div>
    </div>
  </div>`;
  $results.append(temp);
  });
};

$('document').ready(
  $.ajax({
    method: 'GET',
    url: 'http://localhost:4000/api/v1/podcasts',
    success: displayFeed,
  })
);

