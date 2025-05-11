// Lấy query từ URL
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

const searchInput = getQueryParam('q');
const clientId = "86b991add50145c48d62e709c0f73b8b";
const clientSecret = "1876203686b042419528772a69349995";

if (searchInput) {
  getSpotifyToken(clientId, clientSecret)
    .then(token => searchSpotify(token, searchInput))
    .catch(error => {
      document.getElementById("albumsContainer").innerHTML = "Lỗi khi lấy token";
    });
} else {
  document.getElementById("albumsContainer").innerHTML = "Không có từ khóa tìm kiếm.";
}

async function getSpotifyToken(clientId, clientSecret) {
  const credentials = btoa(`${clientId}:${clientSecret}`);
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${credentials}`,
    },
    body: "grant_type=client_credentials",
  });
  const data = await response.json();
  return data.access_token;
}

async function searchSpotify(query, type) {
  try {
    const token = await getSpotifyToken(clientId, clientSecret);
    const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=${type}&limit=20`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to search Spotify');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error searching Spotify:', error);
    throw error;
  }
}

function displaySearchResults(data, type) {
  const resultsContainer = document.getElementById('searchResults');
  resultsContainer.innerHTML = '';

  if (!data || !data[`${type}s`] || data[`${type}s`].items.length === 0) {
    resultsContainer.innerHTML = '<p class="text-center">Không tìm thấy kết quả nào.</p>';
    return;
  }

  const items = data[`${type}s`].items;
  const resultsHTML = items.map(item => {
    if (type === 'album') {
      return `
        <div class="col-md-4 mb-4">
          <div class="card h-100">
            <img src="${item.images[0]?.url || 'placeholder.jpg'}" class="card-img-top" alt="${item.name}">
            <div class="card-body">
              <h5 class="card-title">${item.name}</h5>
              <p class="card-text">${item.artists.map(artist => artist.name).join(', ')}</p>
              <a href="album.html?id=${item.id}" class="btn btn-primary">Xem chi tiết</a>
            </div>
          </div>
        </div>
      `;
    } else if (type === 'track') {
      return `
        <div class="col-md-4 mb-4">
          <div class="card h-100">
            <img src="${item.album.images[0]?.url || 'placeholder.jpg'}" class="card-img-top" alt="${item.name}">
            <div class="card-body">
              <h5 class="card-title">${item.name}</h5>
              <p class="card-text">${item.artists.map(artist => artist.name).join(', ')}</p>
              <p class="card-text"><small class="text-muted">Album: ${item.album.name}</small></p>
              <a href="album.html?id=${item.album.id}" class="btn btn-primary">Xem album</a>
            </div>
          </div>
        </div>
      `;
    } else if (type === 'artist') {
      return `
        <div class="col-md-4 mb-4">
          <div class="card h-100">
            <img src="${item.images[0]?.url || 'placeholder.jpg'}" class="card-img-top" alt="${item.name}">
            <div class="card-body">
              <h5 class="card-title">${item.name}</h5>
              <p class="card-text">${item.genres.join(', ') || 'Không có thể loại'}</p>
              <a href="artist.html?id=${item.id}" class="btn btn-primary">Xem chi tiết</a>
            </div>
          </div>
        </div>
      `;
    }
  }).join('');

  resultsContainer.innerHTML = `
    <div class="row">
      ${resultsHTML}
    </div>
  `;
}

// Handle search form submission
document.getElementById('searchForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const query = document.getElementById('searchInput').value;
  const type = document.getElementById('searchType').value;
  
  try {
    const data = await searchSpotify(query, type);
    displaySearchResults(data, type);
  } catch (error) {
    const resultsContainer = document.getElementById('searchResults');
    resultsContainer.innerHTML = '<p class="text-center text-danger">Có lỗi xảy ra khi tìm kiếm. Vui lòng thử lại sau.</p>';
  }
});
