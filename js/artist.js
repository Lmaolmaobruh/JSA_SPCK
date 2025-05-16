// Lấy artist ID từ URL
function getArtistId() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("id");
}

const artistId = getArtistId();
// const clientId = "86b991add50145c48d62e709c0f73b8b";
const clientSecret = "1876203686b042419528772a69349995";

if (artistId) {
  getSpotifyToken(clientId, clientSecret)
    .then((token) => {
      getArtistInfo(token, artistId);
      getArtistAlbums(token, artistId);
    })
    .catch((error) => {
      document.getElementById("artistInfo").innerHTML = "Lỗi khi lấy token";
    });
} else {
  document.getElementById("artistInfo").innerHTML =
    "Không tìm thấy thông tin nghệ sĩ.";
}

async function getArtistInfo(token, artistId) {
  try {
    const response = await fetch(
      `https://api.spotify.com/v1/artists/${artistId}`,
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

    const artist = await response.json();
    displayArtistInfo(artist);
  } catch (error) {
    console.error("Lỗi:", error);
    document.getElementById("artistInfo").innerHTML =
      "Có lỗi xảy ra khi tải thông tin nghệ sĩ";
  }
}

async function getArtistAlbums(token, artistId) {
  try {
    const response = await fetch(
      `https://api.spotify.com/v1/artists/${artistId}/albums?limit=50`,
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
    displayAlbums(data.items);
  } catch (error) {
    console.error("Lỗi:", error);
    document.getElementById("artistAlbums").innerHTML =
      "Có lỗi xảy ra khi tải danh sách album";
  }
}

function displayArtistInfo(artist) {
  const container = document.getElementById("artistInfo");
  const html = `
    <div class="artist-header">
      <img src="${artist.images[0]?.url || "https://via.placeholder.com/300"}" 
           alt="${artist.name}" 
           class="artist-image">
      <div class="artist-details">
        <h1>${artist.name}</h1>
        <p class="followers">${artist.followers.total.toLocaleString()} người theo dõi</p>
        <div class="genres">
          ${artist.genres
            .map((genre) => `<span class="genre-tag">${genre}</span>`)
            .join("")}
        </div>
        <a href="${
          artist.external_urls.spotify
        }" target="_blank" class="btn btn-success">
          <i class="fab fa-spotify"></i> Xem trên Spotify
        </a>
      </div>
    </div>
  `;
  container.innerHTML = html;
}

function displayAlbums(albums) {
  const container = document.getElementById("artistAlbums");
  const html = `
    <div class="albums-grid">
      ${albums
        .map(
          (album) => `
            <div class="album-card">
              <img class="album-image" 
                   src="${
                     album.images[0]?.url || "https://via.placeholder.com/200"
                   }" 
                   alt="${album.name}">
              <h3>${album.name}</h3>
              <p class="release-date">Phát hành: ${new Date(
                album.release_date
              ).toLocaleDateString()}</p>
              <div class="album-controls">
                <iframe src="https://open.spotify.com/embed/album/${album.id}" 
                        width="300" 
                        height="80" 
                        frameborder="0" 
                        allowtransparency="true" 
                        allow="encrypted-media">
                </iframe>
                <a href="${
                  album.external_urls.spotify
                }" target="_blank" class="btn btn-outline-primary">
                  <i class="fab fa-spotify"></i> Mở trên Spotify
                </a>
              </div>
            </div>
          `
        )
        .join("")}
    </div>
  `;
  container.innerHTML = html;
}
