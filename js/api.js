const baseUrl = "https://api.football-data.org/v2";
const token = "6c17965719d74f56a87603a09f3d3786";

const endpointStandings = `${baseUrl}/competitions/2021/standings?standingType=TOTAL`;
const endpointMatches = `${baseUrl}/competitions/2021/matches?status=SCHEDULED`;
const endpointDetailTeam = `${baseUrl}/teams/`;


// Blok kode yang akan di panggil jika fetch berhasil
function status(response) {
    if (response.status !== 200) {
        console.log("Error : " + response.status);
        // Method reject() akan membuat blok catch terpanggil
        return Promise.reject(new Error(response.statusText));
    } else {
        // Mengubah suatu objek menjadi Promise agar bisa "di-then-kan"
        return Promise.resolve(response);
    }
}

// Blok kode untuk memparsing json menjadi array JavaScript
function json(response) {
    return response.json();
}

// Blok kode untuk meng-handle kesalahan di blok catch
function error(error) {
    // Parameter error berasal dari Promise.reject()
    console.log("Error : " + error);
}

function fetchAPI(endpoint) {
    return fetch(endpoint, {
        headers: {
            "X-Auth-Token": token
        }
    });
}



// Blok kode untuk melakukan request data json
function getStanding() {
    return new Promise(function (resolve, reject) {
        if ("caches" in window) {
            caches.match(endpointStandings).then(function (response) {
                if (response) {
                    response.json().then(function (data) {
                        standingJson(data);
                        resolve(data);
                    });
                }
            });
        }

        fetchAPI(endpointStandings)
            .then(status)
            .then(json)
            .then(function (data) {
                standingJson(data)
                    .resolve(data)
            })
            .catch(error)
    });
}
// batas get standing

function standingJson(data) {
    let tableStandingsHtml = "";

    data.standings.forEach(function (standing) {
        let tableDataStanding = "";

        standing.table.forEach(function (team) {
            team = JSON.parse(JSON.stringify(team).replace(/^http:\/\//i, 'https://'));

            tableDataStanding += `
              <tr>
                  <td class="center-align">${team.position}</td>
                  <td>
                      <a href="./profile.html?id=${team.team.id}">
                          <p style="display: flex; align-items: center;">
                              <img class="materialboxed" alt="logo team" style="float:left; margin-right:20px" width="50" height="50" src="${team.team.crestUrl}">
                              ${team.team.name}
                          </p>
                      </a>
                  </td>
                  <td class="center-align">${team.playedGames}</td>
                  <td class="center-align">${team.won}</td>
                  <td class="center-align">${team.draw}</td>
                  <td class="center-align">${team.lost}</td>
                  <td class="center-align">${team.points}</td>
                  <td class="center-align">${team.goalsFor}</td>
                  <td class="center-align">${team.goalsAgainst}</td>
                  <td class="center-align">${team.goalDifference}</td>
              </tr>
          `;
        })

        tableStandingsHtml += `
          <div class="card">
              <div class="card-content">
                  <table class="responsive-table striped centered">
                      <thead>
                          <tr>
                              <th class="center-align">Position</th>
                              <th class="center-align">Team</th>
                              <th class="center-align">Played</th>
                              <th class="center-align">Won</th>
                              <th class="center-align">Draw</th>
                              <th class="center-align">Lost</th>
                              <th class="center-align">Points</th>
                              <th class="center-align">Goals For</th>
                              <th class="center-align">Goals Against</th>
                              <th class="center-align">Goals Difference</th>
                          </tr>
                      </thead>

                      <tbody>
                          ` + tableDataStanding + `
                      </tbody>
                  </table>
              </div>
          </div>
      `;
    });

    document.getElementById("standings").innerHTML = tableStandingsHtml;
}

function getTeamById() {
    return new Promise(function (resolve, reject) {
        // Ambil nilai query parameter (?id=)
        const urlParams = new URLSearchParams(window.location.search);
        const idParam = urlParams.get("id");
        if ("caches" in window) {
            caches.match(endpointDetailTeam + idParam).then(function (response) {
                if (response) {
                    response.json().then(function (data) {

                        showTeamById(data);
                        resolve(data);
                    })
                }
            })
        }

        fetchAPI(endpointDetailTeam + idParam)
            .then(status)
            .then(json)
            .then(function (data) {
                showTeamById(data);
                resolve(data);
            })
            .catch(error);

    });
}



function showTeamById(data) {
    let squads = "";
    let info = "";
    let teamElement = document.getElementById("body-content");

    info += `
      <div class="card  center-align" id="team">
        <div class="row" >
          <div class="col s6">
              <img class="responsive-img" src="${data.crestUrl}" alt="logo" width="210" height="210" >
          </div>

          <div class="col s6">
              <h3 class-"flow-text" >${data.name}</h3>
              <h5 class-"flow-text">Founded on ${data.founded} </h5>
              <h5 class-"flow-text"> Stadium ${data.venue}</h5>
          </div>
          </div>
        </div>
  `;

    data.squad.forEach(function (member) {

        squads += `
          <tr>
            
              <td class="center-align">${member.name}</td>
              <td class="center-align">${member.nationality}</td>
              <td class="center-align">${member.role}</td>
              <td class="center-align">${member.position}</td>
           
          </tr>
      `;

    });

    teamElement.innerHTML = `
  ` + info + `
  <h4 class= "center-align">SQUADS LIST</h4>
  <div class="card">
      <div class="card-content">
          <table class="responsive-table striped centered">
              <thead>
                  <tr>
                      <th class="center-align">name</th>
                      <th class="center-align">nationality</th>
                      <th class="center-align">role</th>
                      <th class="center-align">position</th>
                    
                  </tr>
              </thead>

              <tbody>
                  ` + squads + `
              </tbody>
          </table>
      </div>
  </div>
`;

}

function convertDate(dateString) {
    let date = new Date(dateString);

    const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "December"
    ];

    let day = String(date.getDate()).padStart(2, '0');
    let month = monthNames[date.getMonth()];
    let year = date.getFullYear();

    let result = day + " " + month + " " + year;

    return result
}

function getMatches() {
    return new Promise(function (resolve, reject) {
        if ("caches" in window) {
            caches.match(endpointMatches).then(function (response) {
                if (response) {
                    response.json().then(function (data) {
                        MatchesJSON(data);
                        resolve(data);
                    });
                }
            });
        }

        fetchAPI(endpointMatches)
            .then(status)
            .then(json)
            .then(function (data) {
                MatchesJSON(data);
                resolve(data);
            })
            .catch(error);
    });
}

function MatchesJSON(data) {
    let tableDataMatches = "";
    let tableMatchesHtml = "";

    let dataMatch = data.matches;
    let matchDays = [];
    const unique = (value, index, self) => {
        return self.indexOf(value) === index;
    };

    for (let i = 0; i < dataMatch.length; i++) {
        matchDays.push(dataMatch[i].matchday);
    }


    let idx = 0;
    for (let i = 0; i < dataMatch.length; i++) {
        if (dataMatch[i].matchday === matchDays.filter(unique)[idx]) {

            tableDataMatches += `
              <tr>
                  <td> ${dataMatch[i].homeTeam.name} </td>
                  <td> (${new Date(dataMatch[i].utcDate).toLocaleTimeString()}) </td>
                  <td> ${dataMatch[i].awayTeam.name} </td>
              </tr>
          `;
        } else {

            tableMatchesHtml += `
              <div class="card">
                  <div class="card-content">
                      <span class="card-title">${convertDate(new Date(dataMatch[i-1].utcDate).toLocaleDateString())}</span>
                      <table class="responsive-table striped centered">
                          <thead>
                              <tr>
                                  <th>Home</th>
                                  <th>Kick Off</th>
                                  <th>Away</th>
                              </tr>
                          </thead>
                          <tbody>
                              ` + tableDataMatches + `
                          </tbody>
                      </table>
                  </div>
              </div>
          `;

            tableDataMatches = "";

            tableDataMatches += `
              <tr>
                  <td> ${dataMatch[i].homeTeam.name} </td>
                  <td> (${new Date(dataMatch[i].utcDate).toLocaleTimeString()}) </td>
                  <td> ${dataMatch[i].awayTeam.name} </td>
              </tr>
          `;

            idx++;
        }
    }

    tableMatchesHtml += `
      <div class="card">
          <div class="card-content">
              <span class="card-title">${convertDate(new Date(dataMatch[dataMatch.length-1].utcDate).toLocaleDateString())}</span>
              <table class="responsive-table striped centered">
                  <thead>
                      <tr>
                          <th>Home</th>
                          <th>Kick Off</th>
                          <th>Away</th>
                      </tr>
                  </thead>
                  <tbody>
                      ` + tableDataMatches + `
                  </tbody>
              </table>
          </div>
      </div>
  `;

    document.getElementById("matches").innerHTML = tableMatchesHtml;
}





function getSavedTeams() {
    getAll().then(function (teams) {
        // Menyusun komponen card artikel secara dinamis
        let articlesHTML = "";
        teams.forEach(function (data) {
            articlesHTML += `
          <div class="card  " id="team">
            <a href="./profile.html?id=${data.id}&saved=true">
                <div class="row" >
                    <div class="col s6">
                        <img class="responsive-img" src="${data.crestUrl}" alt="logo" width="210" height="210" >
                    </div>
            </a>
                    <div class="col s6">
                        <h3 class-"flow-text" >${data.name}</h3>
                        <h5 class-"flow-text">Founded on ${data.founded} </h5>
                        <h5 class-"flow-text"> Stadium ${data.venue}</h5>
                        <a class="waves-effect waves-light btn-small red" onclick="removeFromFavorites(${data.id}, 'favorite_player')">
                            <i class="large material-icons">delete</i>
                        </a>
                    </div>
              </div>
            
            </div>
      `;
        });
        // Sisipkan komponen card ke dalam elemen dengan id #body-content
        document.getElementById("body-content").innerHTML = articlesHTML;
    });
}

function getSavedTeamsById() {
    let urlParams = new URLSearchParams(window.location.search);
    let idParam = urlParams.get("id");

    getById(idParam).then(function (data) {

        let squads = "";
        let info = "";
        let teamElement = document.getElementById("body-content");

        info += `
        <div class="card  center-align" id="team">
            <div class="row" >
                <div class="col s6">
                    <img class="responsive-img" src="${data.crestUrl}" alt="logo" width="210" height="210" >
                </div>

                <div class="col s6">
                    <h3 class-"flow-text" >${data.name}</h3>
                    <h5 class-"flow-text">Founded on ${data.founded} </h5>
                    <h5 class-"flow-text"> Stadium ${data.venue}</h5>
                </div>
          </div>
        </div>
  `;

        data.squad.forEach(function (member) {

            squads += `
          <tr>
            
          <td class="center-align">${member.name}</td>
              <td class="center-align">${member.nationality}</td>
              <td class="center-align">${member.role}</td>
              <td class="center-align">${member.position}</td>
           
          </tr>
      `;

        });

        teamElement.innerHTML = `
  ` + info + `
  <h4 class= "center-align">SQUADS LIST</h4>
  <div class="card">
  <div class="card-content">
  <table class="responsive-table striped centered">
  <thead>
  <tr>
  <th class="center-align">name</th>
  <th class="center-align">nationality</th>
  <th class="center-align">role</th>
  <th class="center-align">position</th>
  
  </tr>
  </thead>
  
  <tbody>
  ` + squads + `
  </tbody>
  </table>
  </div>
  </div>
  `;
    });
}