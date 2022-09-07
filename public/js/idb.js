//Comments from module 18.4.4 - 18.5, used pizza_hunt for code placement

  // create variable to hold db connection
let db;
// establish a connection to IndexedDB database called 'budget' and set it to version 1
const request = indexedDB.open("budget", 1);
// this event will emit if the database version changes (nonexistant to version 1, v1 to v2, etc.)
request.onupgradeneeded = function(event) {
  // save a reference to the database
  const db = event.target.result;
  // create an object store (table) called `new_budget`, set it to have an auto incrementing primary key of sorts
  db.createObjectStore("pending", { autoIncrement: true });
};
// upon a successful
request.onsuccess = function(event) {
  // when db is successfully created with its object store (from onupgradedneeded event above) or simply established a connection, save reference to db in global variable
  db = event.target.result;
  // check if app is online, if yes run collectData(); function to send all local db data to api
  if (navigator.onLine) {
    // we haven't created this yet, but we will soon, so let's comment it out for now
    checkDatabase();
  }
};
request.onerror = function(event) {
  // log error here
  console.log('Oh Noooo ' + event.target.errorCode);
};
// This function will be executed if we attempt to submit a new pizza and there's no internet connection
function saveRecord(record) {
  // open a new transaction with the database with read and write permissions 
  const transaction = db.transaction(["pending"], "readwrite");
   // access the object store for `pending`
  const store = transaction.objectStore("pending");
  // add record to your store with add method
  store.add(record);
}

function checkDatabase() {
  // open a transaction on your db
  const transaction = db.transaction(["pending"], "readwrite");
  // access your object store
  const store = transaction.objectStore("pending");
   // get all records from store and set to a variable
  const getAll = store.getAll();

  getAll.onsuccess = () => {
    if (getAll.result.length > 0) {
      fetch("/api/transaction", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json"
        }
      })
        .then(response => response.json())
         // open one more transaction
        .then(function(serverResponse) {
            if (serverResponse.message) {
              throw new Error(serverResponse);
            }
            // open one more transaction
            const transaction = db.transaction(["pending"], "readwrite");
            // access the new_pizza object store
            const store = transaction.objectStore("pending");
            // clear all items in your store
            store
              .clear();
          })
        .catch((err) => {
          console.warn(err, "oh Noooo something went wrong at function collectData idb.js");
        });
    }
  };
}

window.addEventListener("online", checkDatabase);

console.log(`navigator.connection`, navigator.connection);
console.log(`navigator.hardwareConcurrency`, navigator.hardwareConcurrency);
console.log(`navigator.language:`, navigator.language);
console.log(`navigator.maxTouchPoints: `, navigator.maxTouchPoints);
console.log('navigator.mediaCapabilities:', navigator.mediaCapabilities);
console.log('navigator.mediaDevices:', navigator.mediaDevices);
console.log('navigator.mediaSession:', navigator.mediaSession);
console.log('navigator.serviceWorker:', navigator.serviceWorker);
console.log('navigator.storage:', navigator.storage);
console.log('navigator.userAgent:', navigator.userAgent);
console.log('navigator.userAgentData:', navigator.userAgentData);
console.log('navigator.webdriver:', navigator.webdriver);
console.log('navigator.vibrate(morse code sos) 🤣🤣: ', navigator.vibrate([100,30,100,30,100,30,200,30,200,30,200,30,100,30,100,30,100]));
