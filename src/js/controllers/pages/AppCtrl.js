angular.module('app.controllers').controller('AppCtrl', [	'$scope',
															'$rootScope',
															'$state',
															'$translate',
															'$localStorage',
															'$window',	function(   $scope,
																					$rootScope,
																					$state,
																					$translate,
																					$localStorage,
																					$window 	) {
	// add 'ie' classes to html
	var isIE = !!navigator.userAgent.match(/MSIE/i);
	isIE && angular.element($window.document.body).addClass('ie');
	isSmartDevice( $window ) && angular.element($window.document.body).addClass('smart');

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
			container: true
		}
	}

	// save settings to local storage
	if ( angular.isDefined($localStorage.settings) ) {
		$scope.app.settings 	= $localStorage.settings;
	} else {
		$localStorage.settings 	= $scope.app.settings;
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
	$scope.lang 		= { isopen: false };
	$scope.langs 		= { en_EN:'English', de_DE:'German', it_IT:'Italian' };
	$scope.selectLang 	= $scope.langs[$translate.proposedLanguage()] || "English";
	$scope.setLang 		= function(langKey, $event) {
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

	//	If there is an error on one of the pages, i.e. the
	$rootScope.$on('$stateChangeError', function(	event,
													toState,
													toParams,
													fromState,
													fromParams,
													error 	) {
		$state.go('app.home');
	});


}]);