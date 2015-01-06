'use strict';

/* Services */
angular.module('app.services',[])
	.factory('AccountTypes', ['$resource', function($resource) {
		return $resource('http://api.meti.net/account-types', {}, {
			query: {
				method: 'GET'
			}
		});
	}])
	.factory('Project', ['$resource', function($resource) {
	    return $resource('http://api.meti.net/projects/:id',{
	      id:'@_id'
	    },{
	        query: {
	            method: 'GET',
	            transformResponse: function (res) {
	                var res = JSON.parse(res);
	                return res.data;
	            },
	            isArray: true
	        },
	        store: {
	            method: 'POST'
	        },
	        update: {
	            method: 'PUT'
	        }
	    });
	}])
	.factory('ProjectProgressPlot', ['$resource', function($resource) {
	    return $resource('http://api.meti.net/projects/:id/progress-plot',{
	      id:'@_id'
	    },{
	        query: {
	            method: 'GET',
	            transformResponse: function (res) {
	                var res = JSON.parse(res);
	                console.log(res.data);
	                return res.data;
	            },
	            isArray: true
	        },
	        update: {
	            method: 'PUT'
	        }
	    });
	}])
	.factory('ProjectUsers', ['$resource', function($resource) {
	    return $resource('http://api.meti.net/projects/:id/users/:userId',{
	      id:'@_id',
	      userId:'@userId'
	    },{
	        query: {
	            method: 'GET',
	            transformResponse: function (res) {
	                var res = JSON.parse(res);
	                console.log(res.data);
	                return res.data;
	            },
	            isArray: true
	        },
	        update: {
	            method: 'PUT'
	        }
	    });
	}])
	.factory('ProjectNetworks', ['$resource', function($resource) {
	    return $resource('http://api.meti.net/projects/:id/networks',{
	      id:'@_id'
	    },{
	        query: {
	            method: 'GET',
	            transformResponse: function (res) {
	                var res = JSON.parse(res);
	                console.log(res.data);
	                return res.data;
	            },
	            isArray: true
	        },
	        update: {
	            method: 'PUT'
	        }
	    });
	}])
	.factory('Conversations', ['$resource', function($resource) {
	    return $resource('http://api.meti.net/conversations/:id',{
	      id:'@id'
	    },{
	        query: {
	            method: 'GET',
	            transformResponse: function (res) {
	                var res = JSON.parse(res);
	                console.log(res.data);
	                return res.data;
	            },
	            isArray: true
	        },
	        update: {
	            method: 'PUT'
	        }
	    });
	}])
	.factory('Networks', ['$resource', function($resource) {
		return $resource('http://api.meti.net/networks/:id',{
			id:'@_id'
		}, {
			query: {
				method: 'GET'
			},
			store: {
				method: 'POST'
			},
			update: {
				method: 'PUT'
			},
			delete: {
				method: 'DELETE'
			}
		});
	}])
	.factory('NetworkUsers', ['$resource', function($resource) {
		return $resource('http://api.meti.net/networks/:network_id/users/:user_id',{
			network_id:'@network_id',
			user_id:'@user_id'
		}, {
			confirm: {
				method: 'POST',
				params: {
					action: 'confirm'
				}
			}
		});
	}])		
	.factory('User', ['$resource', function($resource) {
		return $resource('http://api.meti.net/user/:userId', {
			userId:'@user_id'
		}, {
			get: {
				method: 'GET'
			},
			store: {
				method: 'POST'
			},
			put: {
				method: 'PUT'
			}
		});
	}])
	.factory('Activate', ['$resource', function($resource) {
		return $resource('http://api.meti.net/activate/:activation_code', {activation_code:'@code'}, {
			execute: {
				method: 'POST'				
			}
		});
	}])		
	.factory('NetworkProjects', ['$resource', function($resource) {
	    return $resource('http://api.meti.net/networks/:id/projects',{
	      id:'@_id'
	    },{
	        query: {
	            method: 'GET',
	            transformResponse: function (res) {
	                var res = JSON.parse(res);
	                return res.data;
	            },
	            isArray: true
	        }
	    });
	}])
	.factory('ProjectGantt', ['$resource', function($resource) {
	    return $resource('http://api.meti.net/projects/:id/gantt',{
	      id:'@_id'
	    },{
	        query: {
	            method: 'GET',
	            transformResponse: function (res) {
	                var res = JSON.parse(res);
	                console.log(res.data);
	                return res.data;
	            },
	            isArray: true
	        },
	        update: {
	            method: 'PUT'
	        }
	    });
	}])
	.factory('ProjectRFIs', ['$resource', function($resource) {
	    return $resource('http://api.meti.net/projects/:id/rfis',{
	      id:'@_id'
	    },{
	        query: {
	            method: 'GET',
	            transformResponse: function (res) {
					var res = JSON.parse(res);
					return res.data;
	            },
	            isArray: true
	        },
	        update: {
	            method: 'PUT'
	        }
	    });
	}])
	.factory('ProjectLongLeads', ['$resource', function($resource) {
	    return $resource('http://api.meti.net/projects/:id/long-leads',{
	      id:'@_id'
	    },{
	        query: {
	            method: 'GET',
	            transformResponse: function (res) {
					var res = JSON.parse(res);
					return res.data;
	            },
	            isArray: true
	        },
	        update: {
	            method: 'PUT'
	        }
	    });
	}])
	.factory('ProjectNodes', ['$resource', function($resource) {
		return $resource('http://api.meti.net/projects/:id/nodes',{
			id:'@_id'
		},
		{
			store: {
				method: 'POST'
			}
		});
	}])	
	.factory('LongLeads', ['$resource', function($resource) {
	    return $resource('http://api.meti.net/long-leads/:id',{
	      id:'@id'
	    },{
	        query: {
	            method: 'GET',
	            transformResponse: function (res) {
					var res = JSON.parse(res);
					return res.data;
	            },
	            isArray: true
	        },
	        update: {
	            method: 'PUT'
	        }
	    });
	}])
	.factory('Permits', ['$resource', function($resource) {
	    return $resource('http://api.meti.net/permits/:id',{
	      id:'@id'
	    },{
	        query: {
	            method: 'GET',
	            transformResponse: function (res) {
					var res = JSON.parse(res);
					return res.data;
	            },
	            isArray: true
	        },
	        update: {
	            method: 'PUT'
	        }
	    });
	}])
	.factory('ProjectAudit', ['$resource', function($resource) {
	    return $resource('http://api.meti.net/projects/:id/audit',{
	      id:'@_id'
	    },{
	        query: {
	            method: 'GET',
	            transformResponse: function (res) {
					var res = JSON.parse(res);
					return res.data;
	            },
	            isArray: true
	        },
	        update: {
	            method: 'PUT'
	        }
	    });
	}])
	.factory('ProjectPermits', ['$resource', function($resource) {
	    return $resource('http://api.meti.net/projects/:id/permits',{
	      id:'@_id'
	    },{
	        query: {
	            method: 'GET',
	            transformResponse: function (res) {
	                var res = JSON.parse(res);
	                console.log(res.data);
	                return res.data;
	            },
	            isArray: true
	        },
	        update: {
	            method: 'PUT'
	        }
	    });
	}])
	.factory('ProjectLeaves', ['$resource', function($resource) {
	    return $resource('http://api.meti.net/projects/:id/leaves',{
	      id:'@_id'
	    },{
	        query: {
	            method: 'GET',
	            transformResponse: function (res) {
	                var res = JSON.parse(res);
	                console.log(res.data);
	                return res.data;
	            },
	            isArray: true
	        },
	        update: {
	            method: 'PUT'
	        }
	    });
	}])
	.factory('NodePermits', ['$resource', function($resource) {
	    return $resource('http://api.meti.net/nodes/:id/permits',{
	      id:'@_id'
	    },{
	        query: {
	            method: 'GET',
	            transformResponse: function (res) {
	                var res = JSON.parse(res);
	                console.log(res.data);
	                return res.data;
	            },
	            isArray: true
	        },
	        update: {
	            method: 'PUT'
	        }
	    });
	}])
	.factory('NodeAudit', ['$resource', function($resource) {
	    return $resource('http://api.meti.net/nodes/:id/audit',{
	      id:'@_id'
	    },{
	        query: {
	            method: 'GET',
	            transformResponse: function (res) {
	                var res = JSON.parse(res);
	                console.log(res.data);
	                return res.data;
	            },
	            isArray: true
	        },
	        update: {
	            method: 'PUT'
	        }
	    });
	}])
	.factory('NodeLongLeads', ['$resource', function($resource) {
	    return $resource('http://api.meti.net/nodes/:id/long-leads',{
	      id:'@_id'
	    },{
	        query: {
	            method: 'GET',
	            transformResponse: function (res) {
	                var res = JSON.parse(res);
	                console.log(res.data);
	                return res.data;
	            },
	            isArray: true
	        },
	        update: {
	            method: 'PUT'
	        }
	    });
	}])
	.factory('NodeDependencies', ['$resource', function($resource) {
	    return $resource('http://api.meti.net/nodes/:node_id/dependencies/:id',{
	      node_id:'@node_id',
	      id:'@id'
	    },{
	        query: {
	            method: 'GET',
	            transformResponse: function (res) {
	                var res = JSON.parse(res);
	                return res.data;
	            },
	            isArray: true
	        },
	        update: {
	            method: 'PUT'
	        }
	    });
	}])
	.factory('NodeUsers', ['$resource', function($resource) {
	    return $resource('http://api.meti.net/nodes/:id/users',{
	      id:'@_id'
	    },{
	        query: {
	            method: 'GET',
	            transformResponse: function (res) {
	                var res = JSON.parse(res);
	                console.log(res.data);
	                return res.data;
	            },
	            isArray: true
	        },
	        update: {
	            method: 'PUT'
	        }
	    });
	}])
	.factory('Node', ['$resource', function($resource) {
	    return $resource('http://api.meti.net/nodes/:id',{
	      id:'@id'
	    },{
	        query: {
	            method: 'GET',
	            transformResponse: function (res) {
	                console.log(res);
	                var res = JSON.parse(res);
	                return res.data;
	            },
	            isArray: true
	        },
	        update: {
	            method: 'PUT'
	        }
	    });
	}])
	.factory('UserHomepage', ['$resource', function($resource) {
	    return $resource('http://api.meti.net/user/homepage',{
	      id:'@_id'
	    },{
	        query: {
	            method: 'GET',
	            transformResponse: function (res) {
	                var res = JSON.parse(res);
	                console.log(res.data);
	                return res.data;
	            },
	            isArray: true
	        },
	        update: {
	            method: 'PUT'
	        }
	    });
	}])
	.factory('UserConnections', ['$resource', function($resource) {
	    return $resource('http://api.meti.net/user/:id/connections',{
	      id:'@id'
	    },{
	        query: {
	            method: 'GET',
	            transformResponse: function (res) {
	                var res = JSON.parse(res);
	                return res.data;
	            },
	            isArray: true
	        }
	    });
	}])
	.factory('UserProjects', ['$resource', function($resource) {
	    return $resource('http://api.meti.net/user/:id/projects',{
	      id:'@id'
	    },{
	        query: {
	            method: 'GET',
	            transformResponse: function (res) {
	                var res = JSON.parse(res);
	                return res.data;
	            },
	            isArray: true
	        }
	    });
	}])
	.factory('Profile', ['$resource', function($resource) {
	    return $resource('http://api.meti.net/profiles/:id',{
	      id:'@id'
	    },{
	        query: {
	            method: 'GET',
	            transformResponse: function (res) {
	                var res = JSON.parse(res);
	                return res.data;
	            }
	        }
	    });
	}])
	.factory('Auth', [	'Base64',
						'$cookieStore',
						'$http',
						'$state', 	function(	Base64,
												$cookieStore,
												$http,
												$state	) {

	    // initialize to whatever is in the cookie, if anything
	    $http.defaults.headers.common['Authorization'] = 'Basic ' + $cookieStore.get('authdata');

	    if(typeof($cookieStore.get('authdata')) == "undefined") {
	        $state.go('access.signin');
	    }

	    return {
	        getCredential: function(credentialField){
	            return $cookieStore.get(credentialField);
	        },
	        setCredentials: function(username, password, user_data) {
	            var encoded = Base64.encode(username + ':' + password);
				$http.defaults.headers.common.Authorization = 'Basic ' + encoded;
				$cookieStore.put('authdata', encoded);
				$cookieStore.put('user_data', user_data);
				
				var user_has_network 				= (user_data.network != null) ? true : false;
				$cookieStore.put('user_has_network', user_has_network);					
				if (user_has_network) {
					var user_is_network_admin 		= (user_data.network.pivot.role < 3) ? true : false;
					var user_is_network_super_admin = (user_data.network.pivot.role == 1) ? true : false;
					$cookieStore.put('user_is_network_admin', user_is_network_admin);
					$cookieStore.put('user_is_network_super_admin', user_is_network_super_admin);				
				}
	        },
	        resetUserData: function(user_data) {
				$cookieStore.remove('user_data');
				$cookieStore.remove('user_has_network');
				$cookieStore.remove('user_is_network_admin');
				$cookieStore.remove('user_is_network_super_admin');

	        	console.log(user_data);
	        	$cookieStore.put('user_data', user_data);

				var user_has_network 				= (user_data.network != null) ? true : false;
				$cookieStore.put('user_has_network', user_has_network);					
				if (user_has_network) {
					var user_is_network_admin 		= (user_data.network.pivot.role < 3) ? true : false;
					var user_is_network_super_admin = (user_data.network.pivot.role == 1) ? true : false;
					$cookieStore.put('user_is_network_admin', user_is_network_admin);
					$cookieStore.put('user_is_network_super_admin', user_is_network_super_admin);				
				}	        	
	        },
	        clearCredentials: function() {
	            document.execCommand("ClearAuthenticationCache");
	            $cookieStore.remove('authdata');
	            $http.defaults.headers.common.Authorization = 'Basic ';
	        }
	    };

	}])
	.factory('Base64', function() {
	    var keyStr = 'ABCDEFGHIJKLMNOP' +
	        'QRSTUVWXYZabcdef' +
	        'ghijklmnopqrstuv' +
	        'wxyz0123456789+/' +
	        '=';
	    return {
	        encode: function (input) {
	            var output = "";
	            var chr1, chr2, chr3 = "";
	            var enc1, enc2, enc3, enc4 = "";
	            var i = 0;

	            do {
	                chr1 = input.charCodeAt(i++);
	                chr2 = input.charCodeAt(i++);
	                chr3 = input.charCodeAt(i++);

	                enc1 = chr1 >> 2;
	                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
	                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
	                enc4 = chr3 & 63;

	                if (isNaN(chr2)) {
	                    enc3 = enc4 = 64;
	                } else if (isNaN(chr3)) {
	                    enc4 = 64;
	                }

	                output = output +
	                    keyStr.charAt(enc1) +
	                    keyStr.charAt(enc2) +
	                    keyStr.charAt(enc3) +
	                    keyStr.charAt(enc4);
	                chr1 = chr2 = chr3 = "";
	                enc1 = enc2 = enc3 = enc4 = "";
	            } while (i < input.length);

	            return output;
	        },

	        decode: function (input) {
	            var output = "";
	            var chr1, chr2, chr3 = "";
	            var enc1, enc2, enc3, enc4 = "";
	            var i = 0;

	            // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
	            var base64test = /[^A-Za-z0-9\+\/\=]/g;
	            if (base64test.exec(input)) {
	                alert("There were invalid base64 characters in the input text.\n" +
	                    "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
	                    "Expect errors in decoding.");
	            }
	            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

	            do {
	                enc1 = keyStr.indexOf(input.charAt(i++));
	                enc2 = keyStr.indexOf(input.charAt(i++));
	                enc3 = keyStr.indexOf(input.charAt(i++));
	                enc4 = keyStr.indexOf(input.charAt(i++));

	                chr1 = (enc1 << 2) | (enc2 >> 4);
	                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
	                chr3 = ((enc3 & 3) << 6) | enc4;

	                output = output + String.fromCharCode(chr1);

	                if (enc3 != 64) {
	                    output = output + String.fromCharCode(chr2);
	                }
	                if (enc4 != 64) {
	                    output = output + String.fromCharCode(chr3);
	                }

	                chr1 = chr2 = chr3 = "";
	                enc1 = enc2 = enc3 = enc4 = "";

	            } while (i < input.length);

	            return output;
	        }
	    };
	})
	.service('popupService',function($window){
	    this.showPopup=function(message){
	        return $window.confirm(message);
	    }
	})
;