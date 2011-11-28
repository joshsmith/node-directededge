# node-directededge

A client implementation of DirectedEdge's REST API in Node.js.

## Example 1

### Get 5 new recommended interests for a user

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
    