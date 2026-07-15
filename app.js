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
            '<div class="welcome">Start typing to search...</div>';

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

matches.sort((a, b) => {

    const artistCompare = a.Artist.localeCompare(b.Artist, 'ru');

    if (artistCompare !== 0) return artistCompare;

    return cleanTitle(a.Title).localeCompare(cleanTitle(b.Title), 'ru');

});

    displayResults(matches.slice(0,25));

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
const shown = Math.min(total, 25);

document.getElementById("counter").innerHTML =
    `Showing ${shown} of ${total} songs`;

    if(matches.length===0){

        resultsDiv.innerHTML="<div class='welcome'>No songs found.</div>";

        return;

    }

    matches.forEach(song=>{

        resultsDiv.innerHTML += `

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

}