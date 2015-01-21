angular.module('app.services').factory('Auth', [	'Base64',
													'$rootScope',
													'$cookieStore',
													'$http',
													'$state', 	function(	Base64,
																			$rootScope,
																			$cookieStore,
																			$http,
																			$state	) {

	    // initialize to whatever is in the cookie, if anything
	    $http.defaults.headers.common['Authorization'] = 'Basic ' + $cookieStore.get('authdata');

	    if (typeof($cookieStore.get('authdata')) == "undefined") {
	        $state.go('access.signin');
	    }

	    return {
			getCredential: function(credentialField){
				var value					= $cookieStore.get(credentialField);
				$rootScope.credentialField	= value;
				return value;
			},
			setCredentials: function(username, password, user_data) {
	            var encoded = Base64.encode(username + ':' + password);
				$http.defaults.headers.common.Authorization = 'Basic ' + encoded;

				$cookieStore.put('authdata', encoded);
				console.log($cookieStore.put('authdata', encoded));

				$rootScope.user_data				= user_data;
				$cookieStore.put('user_data', user_data);

				var user_has_network 				= (user_data.network != null) ? true : false;
				$rootScope.user_has_network			= user_has_network;
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
				$cookieStore.remove('user_data');
				$rootScope.user_data					= null;
				$cookieStore.remove('user_has_network');
				$rootScope.user_has_network				= null;
				$cookieStore.remove('user_is_network_admin');
				$rootScope.user_is_network_admin		= null;
				$cookieStore.remove('user_is_network_super_admin');
				$rootScope.user_is_network_super_admin	= null;
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
	});