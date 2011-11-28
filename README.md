# node-directededge

A client implementation of Directed Edge's REST API in Node.js. 

## What is Directed Edge?
Directed Edge (http://directededge.com) helps you find related stuff.

It's a recommendations engine that plugs into your site to deliver Amazon-like recommendations. You can show your users personalized recommendations and similar content or products based on data you're already collecting.

## Installation

### Installing node-directededge
``` bash
  $ npm install node-directedge
```

## Examples

### Example 1

#### Get 5 new recommended interests for a user

``` javascript
  var de = new DirectedEdge('username', 'password');

  var params = {
  	excludeLinked: true,
  	maxResults: 5,
  	tags: 'interest'
  }

  de.getRecommended('user1', params, function(err, data, res) {
  	console.log(data);
  });

  // Outputs:
  // {"@":{"version":"0.1"},"item":{"@":{"id":"user1"},"count":"5",
  // "recommended":["interest2014","interest2098","interest1989","interest1932","interest1977"]}}
```

### Example 2

#### Update an item

``` javascript
  var de = new DirectedEdge('username', 'password');

  // Params for puts are object literals with arrays, and
  // in the case of weighted_links, nested arrays
  var params = {
    links: ['interest1', 'interest2'], // Creates links
    weighted_links: [ ['interest3', 10], ['interest4', 0] ], // Creates links with weights
  	tags: ['user'] // Creates tags
  }

  de.putItem('user1', 'add', params, function(err, data, res) {
  	// Updates the item
  });
```

### Example 3

#### Remove from an item

``` javascript
  var de = new DirectedEdge('username', 'password');

  // We'll remove the links and tags created in Example 2
  var params = {
    links: ['interest1', 'interest2'], // Creates links
    weighted_links: [ ['interest3', 10], ['interest4', 0] ], // Creates links with weights
  	tags: ['user'] // Creates tags
  }

  de.putItem('user1', 'remove', params, function(err, data, res) {
  	// Removes from the item
  });
```

### Example 4

#### Overwrite an item

``` javascript
  var de = new DirectedEdge('username', 'password');

  // We'll remove the links and tags created in Example 2
  var params = {
    links: ['interest5', 'interest6'] // Creates links
  }

  de.putItem('user1', 'overwrite', params, function(err, data, res) {
  	// Overwrites the item by passing in the overwrite method
  });
```

### Example 5

#### Delete a resource
``` javascript
  var de = new DirectedEdge('username', 'password');

  de.deleteItem('user1', function(err, data, res) {
    // This deletes user1 from DE
  });
```