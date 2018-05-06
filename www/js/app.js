// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('starter', ['ionic', 'ionic-material']);

app.run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)

        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
    });
})

app.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider

    .state('init',{
        url: '/init',
        abstract: true,
        templateUrl: 'templates/init/header.html',
        controller: 'initCtrl'
    })

    .state('init.login',{
        url: '/login',
        templateUrl: 'templates/init/login.html',
        controller: 'loginCtrl'
    })

    .state('init.signin',{
        url: '/signin',
        templateUrl: 'templates/init/signin.html',
        controller: 'signinCtrl'
    })

    .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
    })
    //Empresas
    .state('app.empresas', {
        url: '/empresas',
        views: {
            'menuContent': {
                templateUrl: 'templates/empresas/empresas.html',
                controller: 'empresasCtrl'
            }
        }
    })
    .state('app.empresasShow', {
        url: '/showempresas',
        views: {
            'menuContent': {
                templateUrl: 'templates/empresas/showempresas.html',
                controller: 'showempresasCtrl'
            }
        }
    })
    //Se va, Es cerrar sesion
    .state('app.ink', {
        url: '/ink',
        views: {
            'menuContent': {
                templateUrl: 'templates/ink.html',
                controller: 'InkCtrl'
            }
        }
    })
    //Mi perfil
    .state('app.miperfil', {
        url: '/miperfil',
        views: {
            'menuContent': {
                templateUrl: 'templates/miperfil.html',
                controller: 'miperfilCtrl'
            }
        }
    })
    //Ofertas
    .state('app.ofertas', {
        url: '/ofertas',
        views: {
            'menuContent': {
                templateUrl: 'templates/ofertas/ofertas.html',
                controller: 'ofertasCtrl'
            }
        }
    })
    //Amigos
    .state('app.amigos', {
        url: '/amigos',
        views: {
            'menuContent': {
                templateUrl: 'templates/amigos.html',
                controller: 'amigosCtrl'
            }
        }
    })
    ;

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/showempresas');
});
