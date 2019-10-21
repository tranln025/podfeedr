
// user submits a search query
const onSuccess = (res) => {
  const $searchResults = $('#searchResults');
  $searchResults.empty();
  res.results.forEach((result) => {
  const temp = `
    <div class="container">
      <div class="card">
        <div class="search-result card-body">
          <div>
          <img class="result-img" src="${result.artworkUrl600}" />
          <div class="podcast-name">${result.collectionName}</div>
          </div>
          <div>
          <i class="far fa-heart heart open-heart"></i>
          </div>
        </div>
      </div>
    </div>
  `;
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