console.log('search js connected');

// user submits a search query
const onSuccess = (res) => {
  const $searchResults = $('#searchResults');
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
              <button type="button" class="btn btn-sm btn-outline-secondary">View</button>
            </a>
          </div>
          <i class="far fa-heart heart"></i>
        </div>
      </div>
    </div>
  </div>`;
  $searchResults.append(temp);
  });
  console.log(res);
};

$('form').on('submit', (e) => {
  e.preventDefault();
  let term = $('#search-bar').val();
  term = term.replace(' ', '+');
  $.ajax({
    method: 'GET',
    url: `https://itunes.apple.com/search?term=${term}&media=podcast&limit=10`,
    dataType: 'json',
    success: onSuccess,
    error: (err) => {
      console.log({err});
    }
  })
});