# node-directededge

A client implementation of Directed Edge's REST API in Node.js. 

## What is Directed Edge?
Directed Edge (http://directededge.com) helps you find related stuff.

It's a recommendations engine that plugs into your site to deliver Amazon-like recommendations. You can show your users personalized recommendations and similar content or products based on data you're already collecting.

## Installation

### Installing node-directededge
`$ npm install node-directedge`

## Examples

### Example 1

#### Get 5 new recommended interests for a user

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
    