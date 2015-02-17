'use strict';

// Declare app level module which depends on filters, and services
var app = angular.module('app', [	'ngAnimate',
									'ngCookies',
									'ngResource',
									'ngStorage',
									'ui.router',
									'ui.bootstrap',
									'easypiechart',
									'ui.load',
									'ui.jq',
									'ui.validate',
									'oc.lazyLoad',
									'pascalprecht.translate',
									'app.filters',
									'app.services',
									'app.directives',
									'app.controllers',
									'angularMoment',
									'toaster',
									'xeditable',
									'truncate',
									'angular-lodash',
									'infinite-scroll',
									'angularFileUpload',
									'uiGmapgoogle-maps']).run([ '$rootScope',
																'$state',
																'$stateParams',
																'$cookieStore',
																'$http',	function(	$rootScope,
																						$state,
																						$stateParams,
																						$cookieStore,
																						$http 	) {
		$rootScope.$state 									= $state;
		$rootScope.$stateParams 							= $stateParams;
		$rootScope.api_url									= 'http://api.meti.net';
		$rootScope.api_url_version							= 'http://api.meti.net/v1';
		$http.defaults.headers.common['Authorization'] 		= 'Basic ' + $cookieStore.get('authdata');
	}])
	.config([ 	'$stateProvider',
				'$urlRouterProvider',
				'$httpProvider',
				'$controllerProvider',
				'$compileProvider',
				'$filterProvider',
				'$provide',	function(	$stateProvider,
										$urlRouterProvider,
										$httpProvider,
										$controllerProvider,
										$compileProvider,
										$filterProvider,
										$provide	) {

		// lazy controller, directive and service
		app.controller 	= $controllerProvider.register;
		app.directive  	= $compileProvider.directive;
		app.filter     	= $filterProvider.register;
		app.factory    	= $provide.factory;
		app.service    	= $provide.service;
		app.constant   	= $provide.constant;
		app.value      	= $provide.value;

		var interceptor = ['$rootScope', '$q', function (scope, $q) {
			function success(response) {
				return response;
			}
			function error(response) {
				var status = response.status;
				if (status == 401) {
					window.location = "#/access/sign-in";
					return;
				}
				// otherwise
				return $q.reject(response);
			}
			return function (promise) {
				return promise.then(success, error);
			}
		}];
		$httpProvider.responseInterceptors.push(interceptor);

		$urlRouterProvider
			.otherwise('/home');
		$stateProvider
			.state('app', {
				abstract: true,
				templateUrl: 'tpl/app.html',
				access: 'private'
			})
			.state('app.home', {
				url: '/home',
				controller: 'HomepageController',
				templateUrl: 'tpl/page_homepage.html',
				access: 'private',
				resolve: {
					deps: ['uiLoad',
						function( uiLoad ){
							return uiLoad.load([
								'js/libs/moment.min.js'
							]);
					}]
				}
			})
			.state('app.page', {
				template: '<div class="hbox hbox-auto-xs bg-light " ng-init="" ui-view></div>',
				access: 'private'
			})
			.state('app.page.profile', {
				url: '/profile/:id',
				controller: 'ProfileViewController',
				templateUrl: 'tpl/user_profile/main.html',
				access: 'private'
			})
			.state('app.page.notifications', {
				url: '/notifications',
				controller: 'NotificationViewController',
				templateUrl: 'tpl/notifications/main.html',
				access: 'private'
			})
			.state('app.page.create_network', {
				url: '/network/create',
				controller: 'NetworkCreateController',
				templateUrl: 'tpl/networks/create.html',
				access: 'private',
				resolve: {
					deps: ['uiLoad',
						function( uiLoad ){
							return uiLoad.load([
								'https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=places'
							]);
						}]
				}
			})
			.state('app.page.network_settings', {
				url: '/network/settings',
				controller: 'NetworkSettingsController',
				templateUrl: 'tpl/networks/settings.html',
				access: 'private'
			})
			.state('app.page.network', {
				url: '/network/:id',
				controller: 'NetworkViewController',
				templateUrl: 'tpl/page_company.html',
				access: 'private'
			})
			.state('app.page.settings', {
				url: '/settings',
				templateUrl: 'tpl/user_settings/main.html',
				controller: 'UserSettingsController',
				access: 'private',
				resolve: {
					deps: ['uiLoad',
						function(uiLoad) {
							return uiLoad.load([
								'js/jquery/sticky/jquery.sticky.js'
							]);
					}]
				}
			})
				.state('app.page.settings.account', {
					url: '/account',
					templateUrl: 'tpl/user_settings/sections/account_settings.html',
					controller: 'UserSettingsController',
					access: 'private'
				})
				.state('app.page.settings.network', {
					url: '/network',
					templateUrl: 'tpl/user_settings/sections/network_settings.html',
					controller: 'UserSettingsController',
					access: 'private'
				})
				.state('app.page.settings.email_notifications', {
					url: '/email_notifications',
					templateUrl: 'tpl/user_settings/sections/email_notifications_settings.html',
					controller: 'UserSettingsController',
					access: 'private'
				})
				.state('app.page.settings.password', {
					url: '/password',
					templateUrl: 'tpl/user_settings/sections/change_password.html',
					controller: 'UserSettingsController',
					access: 'private'
				})
				.state('app.page.settings.privacy', {
					url: '/password',
					templateUrl: 'tpl/user_settings/sections/privacy_settings.html',
					controller: 'UserSettingsController',
					access: 'private'
				})

			.state('app.page.projects', {
				url: '/projects',
				templateUrl: 'tpl/project/all.html',
				controller: 'ProjectListController',
				access: 'private',
				resolve: {
					deps: ['uiLoad',
						function( uiLoad ){
							return uiLoad.load([
								'js/libs/moment.min.js',
								'js/jquery/charts/sparkline/jquery.sparkline.min.js',
								'js/jquery/charts/flot/jquery.flot.min.js',
								'js/jquery/charts/flot/jquery.flot.resize.js'
							]);
						}]
				}
			})
			.state('app.page.gantt', {
				url: '/projects/:project_id/gantt',
				templateUrl: 'tpl/page_gantt.html',
				controller: 'ProjectViewGanttController',
				access: 'private'
			})
			.state('app.page.newproject', {
				url:'/projects/new',
				templateUrl: 'tpl/project/new_project/main.html',
				controller: 'ProjectCreateController',
				access: 'private',
				resolve: {
					deps: ['uiLoad',
						function( uiLoad ){
							return uiLoad.load([
								'js/libs/moment.min.js'
							]);
					}]
				}
			})
			.state('app.page.project', {
				url:'/projects/:project_id',
				templateUrl: 'tpl/project/main_view.html',
				controller: 'ProjectController',
				access: 'private'
			})
				.state('app.page.project.overview', {
					url:'/overview',
					templateUrl: 'tpl/project/components/overview.html',
					controller: 'ProjectOverviewController',
					access: 'private',
					resolve: {
						deps: ['uiLoad',
							function( uiLoad ){
								return uiLoad.load([
									'js/jquery/charts/flot/jquery.flot.min.js',
									'js/jquery/charts/flot/jquery.flot.resize.js'
								]);
							}]
					}
				})
				.state('app.page.project.audit-history', {
					url:'/audit-history',
					templateUrl: 'tpl/project/components/audit_history.html',
					controller: 'ProjectAuditHistoryController',
					access: 'private'
				})
				.state('app.page.project.long-leads', {
					url:'/long-leads',
					templateUrl: 'tpl/project/components/long_lead_items.html',
					controller: 'ProjectLongLeadController',
					access: 'private'
				})
				.state('app.page.project.permits', {
					url:'/permits',
					templateUrl: 'tpl/project/components/permits.html',
					controller: 'ProjectPermitController',
					access: 'private'
				})
				.state('app.page.project.rfis', {
					url:'/rfis',
					templateUrl: 'tpl/project/components/rfis.html',
					controller: 'ProjectRFIController',
					access: 'private'
				})
				.state('app.page.project.discussions', {
					url:'/discussions',
					templateUrl: 'tpl/project/components/discussions.html',
					controller: 'ProjectDiscussionsController',
					access: 'private'
				})
					.state('app.page.project.discussion', {
						url:'/discussions/:discussion_id',
						templateUrl: 'tpl/project/components/discussion.html',
						controller: 'ProjectDiscussionController',
						access: 'private'
					})
				.state('app.page.project.settings', {
					url:'/settings',
					templateUrl: 'tpl/project/components/settings.html',
					controller: 'ProjectSettingsController',
					access: 'private'
				})
					.state('app.page.project.settings.general', {
						url:'/general',
						templateUrl: 'tpl/project/components/settings/general_settings.html',
						controller: 'ProjectGeneralSettingsController',
						access: 'private'
					})
					.state('app.page.project.settings.networks', {
						url:'/networks',
						templateUrl: 'tpl/project/components/settings/networks_settings.html',
						controller: 'ProjectNetworksSettingsController',
						access: 'private'
					})
					.state('app.page.project.settings.users', {
						url:'/users',
						templateUrl: 'tpl/project/components/settings/users_settings.html',
						controller: 'ProjectUsersSettingsController',
						access: 'private'
					})
					.state('app.page.project.settings.location', {
						url:'/location',
						templateUrl: 'tpl/project/components/settings/location_settings.html',
						controller: 'ProjectLocationSettingsController',
						access: 'private'
					})
					.state('app.page.project.settings.tracking', {
						url:'/tracking',
						templateUrl: 'tpl/project/components/settings/tracking_settings.html',
						controller: 'ProjectTrackingSettingsController',
						access: 'private'
					})
				.state('app.page.project.tasks', {
					url:'/tasks',
					templateUrl: 'tpl/project/components/leaf_nodes.html',
					controller: 'ProjectLeafNodeController',
					access: 'private'
				})
				.state('app.page.project.task', {
					url:'/tasks/:node_id',
					templateUrl: 'tpl/nodes/main.html',
					controller: 'NodeViewController',
					access: 'private',
					resolve: {
						deps: ['uiLoad',
							function( uiLoad ){
								return uiLoad.load([
									'js/libs/moment.min.js',
									'js/jquery/charts/sparkline/jquery.sparkline.min.js',
									'js/jquery/slider/slider.css'
								]);
						}]
					}
				})

				// mail
				.state('app.mail', {
					abstract: true,
					url: '/mail',
					controller: 'MailController',
					templateUrl: 'tpl/messaging/mail.html',
					access: 'private',
					// use resolve to load other dependences
					resolve: {
						deps: ['uiLoad',
							function( uiLoad ){
								return uiLoad.load([
									'js/app/mail/mail.js',
									'js/app/mail/mail-service.js',
									'js/libs/moment.min.js'
								]);
						}]
					}
				})
					.state('app.mail.list', {
						url: '/inbox/{fold}',
						controller: 'MailListController',
						templateUrl: 'tpl/messaging/list.html',
						access: 'private'
					})
					.state('app.mail.detail', {
						url: '/{conversation_id:[0-9]+}',
						controller: 'MailDetailController',
						templateUrl: 'tpl/messaging/detail.html',
						access: 'private'
					})
					.state('app.mail.compose', {
						url: '/compose',
						controller: 'MailNewController',
						templateUrl: 'tpl/messaging/new.html',
						access: 'private'
					})

			.state('app.page.search', {
				url: '/search',
				templateUrl: 'tpl/page_search.html'
			})
			.state('app.docs', {
				url: '/docs',
				templateUrl: 'tpl/docs.html'
			})
			// others
			.state('lockme', {
				url: '/lockme',
				templateUrl: 'tpl/page_lockme.html'
			})
			.state('access', {
				url: '/access',
				templateUrl: 'tpl/access/main.html',
				access: 'public'
			})
			.state('access.signin', {
				url: '/sign-in',
				templateUrl: 'tpl/access/components/sign_in.html',
				controller: 'SignInController',
				access: 'public'
			})
			.state('access.signup', {
				url: '/sign-up',
				templateUrl: 'tpl/access/components/sign_up.html',
				controller: 'SignUpController',
				access: 'public'
			})
			.state('access.activate', {
				url: '/activate/:activation_code',
				templateUrl: 'tpl/access/components/activate.html',
				controller: 'ActivationController',
				access: 'public'
			})
			.state('access.forgotpwd', {
				url: '/forgotpwd',
				templateUrl: 'tpl/page_forgotpwd.html',
				access: 'public'
			})
			.state('access.404', {
				url: '/404',
				templateUrl: 'tpl/page_404.html',
				access: 'public'
			})
			.state('apps', {
				abstract: true,
				url: '/apps',
				templateUrl: 'tpl/layout.html'
			})
			.state('apps.users', {
				url: '/users',
				templateUrl: 'tpl/apps_users.html',
				resolve: {
					deps: ['uiLoad',
						function( uiLoad ){
							return uiLoad.load([
								'js/app/users/users.js'
							]);
					}]
				}
			})
		}
	]
)

// translate config
.config(['$translateProvider', function($translateProvider){

	// Register a loader for the static files
	// So, the module will search missing translation tables under the specified urls.
	// Those urls are [prefix][langKey][suffix].
	$translateProvider.useStaticFilesLoader({
		prefix: 'l10n/',
		suffix: '.js'
	});

	// Tell the module what language to use by default
	$translateProvider.preferredLanguage('en');

	// Tell the module to store the language in the local storage
	$translateProvider.useLocalStorage();

}])

// maps config
.config(function(uiGmapGoogleMapApiProvider) {
	uiGmapGoogleMapApiProvider.configure({
		//    key: 'your api key',
		v: '3.17',
		libraries: 'weather,geometry,visualization'
	});
})

/**
 * jQuery plugin config use ui-jq directive , config the js and css files that required
 * key: function name of the jQuery plugin
 * value: array of the css js file located
 */
.constant('JQ_CONFIG', {
		easyPieChart:   [
							'js/jquery/charts/easypiechart/jquery.easy-pie-chart.js'
						],
		sparkline:      [
							'js/jquery/charts/sparkline/jquery.sparkline.min.js'
						],
		plot:           [
							'js/jquery/charts/flot/jquery.flot.min.js',
							'js/jquery/charts/flot/jquery.flot.resize.js',
							'js/jquery/charts/flot/jquery.flot.tooltip.min.js',
							'js/jquery/charts/flot/jquery.flot.spline.js',
							'js/jquery/charts/flot/jquery.flot.orderBars.js',
							'js/jquery/charts/flot/jquery.flot.time.js',
							'js/jquery/charts/flot/jquery.flot.pie.min.js'
						],
		slimScroll:     [
							'js/jquery/slimscroll/jquery.slimscroll.min.js'
						],
		sortable:       [
							'js/jquery/sortable/jquery.sortable.js'
						],
		nestable:       [
							'js/jquery/nestable/jquery.nestable.js',
							'js/jquery/nestable/nestable.css'
						],
		filestyle:      [
							'js/jquery/file/bootstrap-filestyle.min.js'
						],
		slider:         [
							'js/jquery/slider/bootstrap-slider.js',
							'js/jquery/slider/slider.css'
						],
		chosen:         [
							'js/jquery/chosen/chosen.jquery.min.js',
							'js/jquery/chosen/chosen.css'
						],
		TouchSpin:      [
							'js/jquery/spinner/jquery.bootstrap-touchspin.min.js',
							'js/jquery/spinner/jquery.bootstrap-touchspin.css'
						],
		wysiwyg:        [
							'js/jquery/wysiwyg/bootstrap-wysiwyg.js',
							'js/jquery/wysiwyg/jquery.hotkeys.js'
						],
		dataTable:      [
							'js/jquery/datatables/jquery.dataTables.min.js',
							'js/jquery/datatables/dataTables.bootstrap.js',
							'js/jquery/datatables/dataTables.bootstrap.css'
						],
		vectorMap:      [
							'js/jquery/jvectormap/jquery-jvectormap.min.js',
							'js/jquery/jvectormap/jquery-jvectormap-world-mill-en.js',
							'js/jquery/jvectormap/jquery-jvectormap-us-aea-en.js',
							'js/jquery/jvectormap/jquery-jvectormap.css'
						],
		footable:       [
							'js/jquery/footable/footable.all.min.js',
							'js/jquery/footable/footable.core.css'
						]
		}
)

// modules config
.constant('MODULE_CONFIG', {
		select2:        ['js/jquery/select2/select2.css',
							'js/jquery/select2/select2-bootstrap.css',
							'js/jquery/select2/select2.min.js',
							'js/modules/ui-select2.js']
		}
)

// oclazyload config
.config(['$ocLazyLoadProvider', function($ocLazyLoadProvider) {
		// We configure ocLazyLoad to use the lib script.js as the async loader
		$ocLazyLoadProvider.config({
			debug: true,
			events: true,
			modules: [
					{
						name: 'ngGrid',
						files: [
							'js/modules/ng-grid/ng-grid.min.js',
							'js/modules/ng-grid/ng-grid.css',
							'js/modules/ng-grid/theme.css'
						]
					},
					{
						name: 'toaster',
						files: [
							'js/modules/toaster/toaster.js',
							'js/modules/toaster/toaster.css'
						]
					}
			]
		});
}])
app.run(function(editableOptions) {
	editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
});

var pusher = new Pusher('6b5abd6806ff36f34495');