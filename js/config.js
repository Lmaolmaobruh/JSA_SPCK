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
