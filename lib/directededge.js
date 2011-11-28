/**
 * DirectedEdge Client for Node.js
 * @author Josh Smith
 * @todo Implement call throttling to maintain 
    10,000 calls/day and 10 calls/sec
 * @todo Implement database resource PUT
 */

var QueryString = require('querystring'),
    https = require('https'),
		builder = require('xmlbuilder'),
		request = require('request'),
		xml2js = require('xml2js');

function emptyFn () {}

var DirectedEdge = exports.DirectedEdge = function(username,password,database) {
		// Your database name is currently the same as your user name
		if (typeof database === "undefined") database = username;
		
		var hostname = 'webservices.directededge.com';
		var version = '/api/v1/';
		var auth = username + ':' + password;
		
		var url = 'https://' + auth + '@' + hostname + version + database + '/';

    this.post = function (path,xml,callback) {
				url += path;
				
        request.post({url:url, body:xml}, function(e, r, body) {
					if(e) {
						if (typeof e == 'string')
							e = JSON.parse(e);
						else if (typeof e.data == 'string')
							e.data = JSON.parse(e.data);
					}
					
					callback(e, body, r);
				});
    }

    this.get = function (path,callback) {
				url += path;
								
        request.get({url:url}, function(e, r, body) {
					if(e) {
						if (typeof e == 'string')
							e = JSON.parse(e);
						else if (typeof e.data == 'string')
							e.data = JSON.parse(e.data);						
					} else {
						var parser = new xml2js.Parser();
						parser.parseString(body, function(err, result) {
							var body = JSON.stringify(result);
							callback(e, body, r);
						});
					}
				});
    }

    this.delete = function (path,callback) {
				url += path;
				
        request.del({url:url}, function(e, r, body) {
					if(e) {
						if (typeof e == 'string')
							e = JSON.parse(e);
						else if (typeof e.data == 'string')
							e.data = JSON.parse(e.data);
					}
					
					callback(e, body, r);
				});
    }
}

/////////////////////////////////////////////////////
/** Database Resources                            **/
/////////////////////////////////////////////////////

/**
 * DirectedEdge
 * Dumps the entire database to XML
 * DO THIS SPARINGLY AS IT HITS THE DATABASE HARD
 * @see http://developer.directededge.com/article/REST_API#HTTP_GET
 */
DirectedEdge.prototype.getDatabase = function (itemId,callback) {
		var path = itemId;

    var path = QueryString.stringify(path);
		this.get('', callback);
}

/////////////////////////////////////////////////////
/** Item Resources		                            **/
/////////////////////////////////////////////////////

/**
 * DirectedEdge: Item Resources
 * Update a given item with some parameters
 * @see http://developer.directededge.com/article/REST_API#Item_resource
 */
DirectedEdge.prototype.putItem = function (itemId,method,params,callback) {
		if (typeof params == 'function') {
	      callback = params;
	      params = [];
	  }
  
		switch(method) {
			case 'add':
				var path = itemId + '/add';
				break;
			case 'remove':
				var path = itemId + '/remove';
				break;
			case 'overwrite':
				var path = itemId
				break;
		}
				
		var doc = builder.create();

    var item = doc.begin('xml')
			.att('version', '1.0').att('encoding', 'utf-8')
			.ele('directedege')
				.att('version', '0.1')
				.ele('item')
					.att('id', itemId);
	
		if (params.hasOwnProperty("links")) {
			for (i=0; i < params.links.length; i++) {
				item.ele('link').txt(params.links[i]).up();
			}
		}
	
		if (params.hasOwnProperty("weighted_links")) {
			for (i=0; i < params.weighted_links.length; i++) {
				item.ele('link')
					.att('weight', params.weighted_links[i][1])
					.txt(params.weighted_links[i][0]).
					up();
			}
		}

		if (params.hasOwnProperty("tags")) {
			for (i=0; i < params.tags.length; i++) {
				item.ele('tag').txt(params.tags[i]).up();
			}
		}
	
		xml = doc.toString();

	  this.post(path,xml,callback);
}

DirectedEdge.prototype.getItem = function (itemId,callback) {
		var path = encodeURIComponent(itemId);
		this.get(path, callback);
}

DirectedEdge.prototype.deleteItem = function (itemId,callback) {
		var path = encodeURIComponent(itemId);
	  this.delete(path,callback);
}

/////////////////////////////////////////////////////
/** Related and Recommended Resources             **/
/////////////////////////////////////////////////////

/**
 * DirectedEdge: Related and Recommended Resources
 * Gets similar things to the item
 * @see http://developer.directededge.com/article/REST_API#Related_.2F_recommended_resources
 */
DirectedEdge.prototype.getRelated = function (itemId,params,callback) {
	  if (typeof params == 'function') {
	      callback = params;
	      params = [];
	  }

    var path = encodeURIComponent(itemId);
		var qs = QueryString.stringify(params);
		this.get(path + '/related?' + qs, callback);
}

/**
 * DirectedEdge: Related and Recommended Resources, cont.
 * Gets recommended items for the user
 * @see http://developer.directededge.com/article/REST_API#Related_.2F_recommended_resources
 */
DirectedEdge.prototype.getRecommended = function (userId,params,callback) {
	  if (typeof params == 'function') {
	      callback = params;
	      params = [];
	  }

    var path = encodeURIComponent(userId);
		var qs = QueryString.stringify(params);
		this.get(path + '/recommended?' + qs, callback);
}
