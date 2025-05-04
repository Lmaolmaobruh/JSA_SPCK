const clientId = "86b991add50145c48d62e709c0f73b8b";
const clientSecret = "1876203686b042419528772a69349995";

async function getSpotifyToken(clientId, clientSecret) {
  // Encode credentials in base64
  const credentials = btoa(`${clientId}:${clientSecret}`);

  try {
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
  } catch (error) {
    console.error("Error getting Spotify token:", error);
    throw error;
  }
}

// Call the function
getSpotifyToken(clientId, clientSecret)
  .then((token) => {
    console.log("Access token:", token);
    getNewReleases(token, 10); // Lấy 50 album mới nhất
  })
  .catch((error) => {
    console.error("Error:", error);
    document.getElementById("albumsContainer").innerHTML = "Lỗi khi lấy token";
  });

async function getNewReleases(token, limit = 10) {
  try {
    const response = await fetch(
      `https://api.spotify.com/v1/browse/new-releases?limit=${limit}`,
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
    displayAlbums(data.albums.items);
  } catch (error) {
    console.error("Lỗi:", error);
    document.getElementById("albumsContainer").innerHTML =
      "Có lỗi xảy ra khi tải danh sách album";
  }
}

function displayAlbums(albums) {
  const container = document.getElementById("albumsContainer");

  const html = `
        <div class="albums-grid">
            ${albums
              .map(
                (album) => `
                <div class="album-card">
                    <img class="album-image" 
                         src="${
                           album.images[0]?.url ||
                           "https://via.placeholder.com/200"
                         }" 
                         alt="${album.name}">
                    <h3>${album.name}</h3>
                    <p class="artist-name">${album.artists
                      .map((artist) => artist.name)
                      .join(", ")}</p>
                    <p class="release-date">Phát hành: ${new Date(
                      album.release_date
                    ).toLocaleDateString()}</p>
                    <a href="${
                      album.external_urls.spotify
                    }" target="_blank" class="spotify-link">
                        Nghe trên Spotify
                    </a>
                </div>
            `
              )
              .join("")}
        </div>
    `;

  container.innerHTML = html;
}

// function searchItem(q, type) {
//     const token = localStorage.getItem("access_token");
//     if (!token) {
//         console.error("No access token found in local storage.");
//         return;
//     }
//     const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(q)}&type=${type}&limit=10`;
//     fetch(url, {
//         method: "GET",
//         headers: {
//             Authorization: `Bearer ${token}`,
//         },
//     })
//         .then((response) => {
//             if (!response.ok) {
//                 throw new Error(`HTTP error! status: ${response.status}`);
//             }
//             return response.json();
//         })
//         .then((data) => {
//             if (type === "album") {
//                 displayAlbums(data.albums.items);
//             } else if (type === "artist") {
//                 displayArtists(data.artists.items);
//             } else if (type === "track") {
//                 displayTracks(data.tracks.items);
//             }
//         })
//         .catch((error) => {
//             console.error("Error:", error);
//         });

// }
