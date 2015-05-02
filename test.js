var fakeIndexedDB = require('./');

var request = fakeIndexedDB.open('test');
request.onupgradeneeded = function () {
    console.log('UPGRADE NEEDED');

    var db = request.result;
    var store = db.createObjectStore("books", {keyPath: "isbn"});
    var titleIndex = store.createIndex("by_title", "title", {unique: true});
    var authorIndex = store.createIndex("by_author", "author");

    store.put({title: "Quarry Memories", author: "Fred", isbn: 123456}).onsuccess = function (event) {
        console.log('PUT SUCCESS', event.target.result);
    };
    store.put({title: "Water Buffaloes", author: "Fred", isbn: 234567}).onsuccess = function (event) {
        console.log('PUT SUCCESS', event.target.result);
    };
    store.put({title: "Bedrock Nights", author: "Barney", isbn: 345678}).onsuccess = function (event) {
        console.log('PUT SUCCESS', event.target.result);
    };
}
request.onsuccess = function (event) {
    console.log('CONNECT SUCCESS');
    
    var db = event.target.result;

    var tx = db.transaction("books");

    tx.objectStore("books").get(234567).onsuccess = function (event) {
        console.log('GET SUCCESS', event.target.result);
    };
    tx.oncomplete = function () {
        console.log('ONCOMPLETE');
    };
    tx.objectStore("books").index("by_title").get("Quarry Memories").addEventListener('success', function (event) {
        console.log('GET SUCCESS 2', event.target.result);
    });
    tx.objectStore("books").index("by_author").get("Barney").onsuccess = function (event) {
        console.log('GET SUCCESS 3', event.target.result);
    };
};