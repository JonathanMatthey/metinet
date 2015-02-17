angular.module('app.controllers').controller('AppCtrl', [   '$scope',
															'$rootScope',
															'$state',
															'$translate',
															'$localStorage',
															'$window',
															'Auth', function(   $scope,
																				$rootScope,
																				$state,
																				$translate,
																				$localStorage,
																				$window,
																				Auth    ) {
	// add 'ie' classes to html
	var isIE = !!navigator.userAgent.match(/MSIE/i);
	isIE && angular.element($window.document.body).addClass('ie');
	isSmartDevice( $window ) && angular.element($window.document.body).addClass('smart');

	var user_data	= Auth.getCredential('user_data');
	if (!user_data) {
		$state.go('access.signin');
	}

	// config
	$scope.app = {
		brand_name: 'MetiNet',
		slogan: 'Collaborative Construction Solutions',
		version: '0.0.2',
		// for chart colors
		color: {
			primary: '#eee',
			info:    '#23b7e5',
			success: '#27c24c',
			warning: '#fad733',
			danger:  '#f05050',
			light:   '#e8eff0',
			dark:    '#3a3f51',
			black:   '#1c2b36'
		},
		settings: {
			themeID: 1,
			navbarHeaderColor: 'bg-black',
			navbarCollapseColor: 'bg-white',
			asideColor: 'bg-black',
			headerFixed: true,
			asideFixed: false,
			asideFolded: true,
			asideDock: false,
			container: false
		}
	}

	// save settings to local storage
	if ( angular.isDefined($localStorage.settings) ) {
		$scope.app.settings     = $localStorage.settings;
	} else {
		$localStorage.settings  = $scope.app.settings;
	}

	$scope.$watch('app.settings', function() {
		if( $scope.app.settings.asideDock  &&  $scope.app.settings.asideFixed ) {
			// aside dock and fixed must set the header fixed.
			$scope.app.settings.headerFixed = true;
		}
		// save to local storage
		$localStorage.settings = $scope.app.settings;
	}, true);

	// angular translate
	$scope.lang         = { isopen: false };
	$scope.langs        = { en_EN:'English', de_DE:'German', it_IT:'Italian' };
	$scope.selectLang   = $scope.langs[$translate.proposedLanguage()] || "English";
	$scope.setLang      = function(langKey, $event) {
		// set the current lang
		$scope.selectLang = $scope.langs[langKey];
		// You can change the language during runtime
		$translate.use(langKey);
		$scope.lang.isopen = !$scope.lang.isopen;
	};

	function isSmartDevice($window) {
		// Adapted from http://www.detectmobilebrowsers.com
		var ua = $window['navigator']['userAgent'] || $window['navigator']['vendor'] || $window['opera'];
		// Checks for iOs, Android, Blackberry, Opera Mini, and Windows mobile devices
		return (/iPhone|iPod|iPad|Silk|Android|BlackBerry|Opera Mini|IEMobile/).test(ua);
	}

	//**    Configuration for UI-Router State Events

	//  If there is an error on one of the pages
	//  Send them to the homepage.
	$rootScope.$on('$stateChangeError', function(   event,
													toState,
													toParams,
													fromState,
													fromParams,
													error   ) {
		$state.go('app.home');
	});

	//  If the current user does not have the correct access rights..
	//  Refuse access to private areas.
	$rootScope.$on('$stateChangeStart', function(   event,
													toState,
													toParams,
													fromState,
													fromParams,
													error   ) {

		var user_data   = Auth.getCredential('user_data');

		if (!user_data && toState.access === 'private') {
			$state.go('access.signin');
		}

		if (user_data) {
			if (!user_data.active && toState.access === 'private') {
				$state.go('access.signin');
			}
		}

	});

}]);