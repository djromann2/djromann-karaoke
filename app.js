let songs = [];

const searchBox = document.getElementById("searchBox");
const resultsDiv = document.getElementById("results");

Papa.parse("songs.csv", {
    download: true,
    header: true,
    skipEmptyLines: true,

    complete: function(results) {

        songs = results.data;

        console.log("Songs Loaded:", songs.length);

    }
});

searchBox.addEventListener("input", function () {

    const search = searchBox.value.trim().toLowerCase();

    if (search.length < 2) {

        resultsDiv.innerHTML =
            `
<div class="welcome">
    <h2>🎤 Welcome!</h2>
    <p>Search by artist or song title.</p>
    <br>
    <p>When you find your song, write the <strong>Artist</strong> and <strong>Song Title</strong> on your request card.</p>
</div>
`;

        return;
    }

    const words = search.split(/\s+/);

   const uniqueSongs = new Map();

songs.forEach(song => {

    const clean = cleanTitle(song.Title);

    const text = (song.Artist + " " + clean).toLowerCase();

    const match = words.every(word => text.includes(word));

    if (!match) return;

    const key = (song.Artist + "|" + clean).toLowerCase();

    if (!uniqueSongs.has(key)) {
        uniqueSongs.set(key, song);
    }

});

const matches = Array.from(uniqueSongs.values());
console.log("Total matches:", matches.length);

matches.sort((a, b) => {

    const artistCompare = a.Artist.localeCompare(b.Artist, 'ru');

    if (artistCompare !== 0) return artistCompare;

    return cleanTitle(a.Title).localeCompare(cleanTitle(b.Title), 'ru');

});

    displayResults(matches);

});


function cleanTitle(title){

    return title
        .replace(/\[.*?\]/g,"")
        .replace(/\s+\d+$/,"")
        .trim();

}


function displayResults(matches){

    resultsDiv.innerHTML="";

   const total = matches.length;
const shownSongs = matches.slice(0, 25);
const shown = shownSongs.length;

if (total === 0) {
    document.getElementById("counter").innerHTML = "";
} else if (total <= 25) {
    document.getElementById("counter").innerHTML =
        `${total} song${total === 1 ? "" : "s"} found`;
} else {
    document.getElementById("counter").innerHTML =
        `Showing first ${shown} of ${total} songs`;
}

    if(matches.length===0){

        resultsDiv.innerHTML=`
<div class="welcome">
    <h2>😕 No songs found</h2>
    <p>Try another spelling or search by the artist's name.</p>
</div>`;

        return;

    }

    let html = "";

shownSongs.forEach(song => {

    html += `

        <div class="song">

            <div class="title">
                ${cleanTitle(song.Title)}
            </div>

            <div class="artist">
                ${song.Artist}
            </div>

        </div>

    `;

});

resultsDiv.innerHTML = html;

}