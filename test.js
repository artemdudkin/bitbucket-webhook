const axios = require('axios');

let url = "http://localhost:8096/hook"
let data = {
  "eventKey": "repo:refs_changed",
  "date": "2022-06-20T20:53:27+0300",
  "actor": {
      "name": "***",
      "emailAddress": "***",
      "id": 580,
      "displayName": "***",
      "active": true,
      "slug": "***",
      "type": "NORMAL",
      "links": {
          "self": [
              {
                  "href": "http://***:8080/users/***"
              }
          ]
      }
  },
  "repository": {
      "slug": "test1",
      "id": 256,
      "name": "test1",
      "scmId": "git",
      "state": "AVAILABLE",
      "statusMessage": "Available",
      "forkable": true,
      "project": {
          "key": "TCR",
          "id": 280,
          "name": "TestCodeReview",
          "public": false,
          "type": "NORMAL",
          "links": {
              "self": [
                  {
                      "href": "http://***:8080/projects/TCR"
                  }
              ]
          }
      },
      "public": false,
      "links": {
          "clone": [
              {
                  "href": "ssh://git@***:7999/tcr/test1.git",
                  "name": "ssh"
              },
              {
                  "href": "http://***:8080/scm/tcr/test1.git",
                  "name": "http"
              }
          ],
          "self": [
              {
                  "href": "http://***:8080/projects/TCR/repos/test1/browse"
              }
          ]
      }
  },
  "changes": [
      {
          "ref": {
              "id": "refs/heads/test-123",
              "displayId": "test-123",
              "type": "BRANCH"
          },
          "refId": "refs/heads/test-123",
          "fromHash": "745a321a1255a5f1c1c8b014e4817466ace24f33",
          "toHash": "39c39378bafbfcacf0fa4b8e7e2697da6da40b4b",
          "type": "UPDATE"
      }
  ]
}


console.log('  >> POST', url);
axios.post(url, data)
     .then( res   => console.log('  << ok', res.status))
     .catch(error => console.log('  << error', error));
