var dbPromised = idb.open("soccer", 1, function (upgradeDb) {
  var soccerObjectStore = upgradeDb.createObjectStore("teams", {
    keyPath: "id"
  });
  soccerObjectStore.createIndex("teams", "name", {
    unique: false
  });
});

function saveForLater(teams) {
  dbPromised
    .then(function (db) {
      var tx = db.transaction("teams", "readwrite");
      var store = tx.objectStore("teams");
      store.put(teams);
      return tx.complete;
    })
    .then(function () {
      M.toast({
        html: "Berhasil disimpan",
      });
    });
}

function getAll() {
  return new Promise(function (resolve, reject) {
    dbPromised
      .then(function (db) {
        var tx = db.transaction("teams", "readonly");
        var store = tx.objectStore("teams");
        return store.getAll();
      })
      .then(function (teams) {
        resolve(teams);
      });
  });
}

function getById(id) {
  return new Promise(function (resolve, reject) {
    dbPromised
      .then(function (db) {
        var tx = db.transaction("teams", "readonly");
        var store = tx.objectStore("teams");
        return store.get(id);
      })
      .then(function (teams) {
        resolve(teams);
      });
  });
}

function removeFromFavorites(ID) {
  dbPromised
    .then(function (db) {
      var tx = db.transaction("teams", "readwrite");
      var store = tx.objectStore("teams");
      store.delete(ID);
      return tx.complete;
    })
    .then(function () {
      M.toast({
        html: "Berhasil dihapus dari favorite",
      });
    });

  location.reload();
}