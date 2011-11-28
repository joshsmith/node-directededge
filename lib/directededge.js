/**
 * DirectedEdge Client for Node.js
 * @author Josh Smith
 * @todo Implement call throttling to maintain 
    10,000 calls/day and 10 calls/sec
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
					} else {
						console.log(body);
					}
				});
    }

    this.get = function (path,callback) {
				url += path;
				
				console.log(url);
				
        request.get({url:url}, function(e, r, body) {
					if(e) {
						
					} else {
						var parser = new xml2js.Parser();
						parser.parseString(body, function(err, result) {
							var body = JSON.stringify(result);
							callback(e, body, r);
						});
					}
				});
    }
}

/////////////////////////////////////////////////////
/** Database Resources                            **/
/////////////////////////////////////////////////////

/**
 * DirectedEdge
 * Dumps the entire database to XML
 * DO THIS SPARINGLY
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
 * Update a given item with a new link
 * @see http://developer.directededge.com/article/REST_API#Item_resource
 */
DirectedEdge.prototype.updateItemWithLink = function (itemId,linkName,callback) {
		var path = itemId + '/add';

		var doc = builder.create();
		
    doc.begin('xml')
			.att('version', '1.0').att('encoding', 'utf-8')
			.ele('directedege')
				.att('version', '0.1')
				.ele('item')
					.att('id', itemId)
						.ele('link')
						.txt(linkName);
		
		xml = doc.toString();

    path = QueryString.stringify(path);
    this.post(path,xml,callback);
}

DirectedEdge.prototype.getItem = function (itemId,callback) {
		var path = encodeURIComponent(itemId);
		this.get(path, callback);
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