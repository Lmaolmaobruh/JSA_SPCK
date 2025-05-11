// Lấy album ID từ URL
function getAlbumId() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('id');
}

const albumId = getAlbumId();
const clientId = "86b991add50145c48d62e709c0f73b8b";
const clientSecret = "1876203686b042419528772a69349995";

if (albumId) {
  getSpotifyToken(clientId, clientSecret)
    .then(token => {
      getAlbumInfo(token, albumId);
      getAlbumTracks(token, albumId);
    })
    .catch(error => {
      document.getElementById("albumInfo").innerHTML = "Lỗi khi lấy token";
    });
} else {
  document.getElementById("albumInfo").innerHTML = "Không tìm thấy thông tin album.";
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

async function getAlbumInfo(token, albumId) {
  try {
    const response = await fetch(
      `https://api.spotify.com/v1/albums/${albumId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const album = await response.json();
    displayAlbumInfo(album);
  } catch (error) {
    console.error("Lỗi:", error);
    document.getElementById("albumInfo").innerHTML = "Có lỗi xảy ra khi tải thông tin album";
  }
}

async function getAlbumTracks(token, albumId) {
  try {
    const response = await fetch(
      `https://api.spotify.com/v1/albums/${albumId}/tracks?limit=50`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    displayTracks(data.items);
  } catch (error) {
    console.error("Lỗi:", error);
    document.getElementById("albumTracks").innerHTML = "Có lỗi xảy ra khi tải danh sách bài hát";
  }
}

function displayAlbumInfo(album) {
  const container = document.getElementById("albumInfo");
  const playerContainer = document.querySelector(".album-player");
  
  const html = `
    <div class="album-header">
      <img src="${album.images[0]?.url || 'https://via.placeholder.com/300'}" 
           alt="${album.name}" 
           class="album-image">
      <div class="album-details">
        <h1>${album.name}</h1>
        <p class="artist-name">${album.artists.map(artist => 
          `<a href="artist.html?id=${artist.id}">${artist.name}</a>`
        ).join(', ')}</p>
        <p class="release-date">Phát hành: ${new Date(album.release_date).toLocaleDateString()}</p>
        <p class="total-tracks">${album.total_tracks} bài hát</p>
        <div class="album-controls">
          <a href="${album.external_urls.spotify}" target="_blank" class="btn btn-success">
            <i class="fab fa-spotify"></i> Mở trên Spotify
          </a>
        </div>
      </div>
    </div>
  `;

  const playerHtml = `
    <iframe src="https://open.spotify.com/embed/album/${album.id}" 
            width="100%" 
            height="380" 
            frameborder="0" 
            allowtransparency="true" 
            allow="encrypted-media">
    </iframe>
  `;

  container.innerHTML = html;
  playerContainer.innerHTML = playerHtml;
}

function displayTracks(tracks) {
  const container = document.getElementById("albumTracks");
  const html = `
    <div class="tracks-list">
      ${tracks.map((track, index) => `
        <div class="track-item">
          <div class="track-number">${index + 1}</div>
          <div class="track-info">
            <div class="track-name">${track.name}</div>
            <div class="track-artists">${track.artists.map(artist => 
              `<a href="artist.html?id=${artist.id}">${artist.name}</a>`
            ).join(', ')}</div>
          </div>
          <div class="track-duration">${formatDuration(track.duration_ms)}</div>
        </div>
      `).join('')}
    </div>
  `;
  container.innerHTML = html;
}

function formatDuration(ms) {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// Handle search form submission
document.getElementById('searchForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const query = document.getElementById('searchInput').value;
  const type = document.getElementById('searchType').value;
  if (query.trim() !== "") {
    window.location.href = `search.html?q=${encodeURIComponent(query)}&type=${type}`;
  }
}); 