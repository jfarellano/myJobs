// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('starter', ['ionic', 'ionic-material', 'firebase', 'ngMaterial', 'ngMessages', 'ngStorage']);

app.directive('autoFocus', function($timeout) {
    return {
      scope: { trigger: '@autoFocus' },
      link: function(scope, element) {
        scope.$watch('trigger', function(value) {
          if (value.toString() === "true") {
            $timeout(function() {
              element[0].focus();
            });
          }
        });
      }
    };
})

app.filter('titleCase', function() {
    return function(input) {
      console.log(input)
      input = input || '';
      return input.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    };
})

app.filter('careerDisplay', function() {
    return function(input) {
        input = input || '';
        return input.replace(/_/g, " ");
    };
});

app.run(["$rootScope", "$state", function($rootScope, $state) {
    $rootScope.$on("$stateChangeError", function(event, toState, toParams, fromState, fromParams, error) {
      // We can catch the error thrown when the $requireSignIn promise is rejected
      // and redirect the user back to the home page
      console.log(error)
      if (error === "AUTH_REQUIRED") {
        $state.go("init.login");
      }
    });
}]);

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
        controller: 'initCtrl',
        
    })

    .state('init.login',{
        url: '/login',
        templateUrl: 'templates/init/login.html',
        controller: 'loginCtrl',
        resolve: {
            "currentAuth": ["Auth", "$q", "$window", "$state", function(Auth, $q, $window, $state) {
           
                // $requireSignIn returns a promise so the resolve waits for it to complete
                // If the promise is rejected, it will throw a $stateChangeError (see above)
                // console.log($window.localStorage.getItem('firebase:host:myjobs-uninorte.firebaseio.com'))
                var localStorage = $window.localStorage
                // var deferred = $q.defer();
                return Auth.$requireSignIn().then(function (user) {
                    
                    let auth = JSON.parse(localStorage['firebase:authUser:'+user.j+':'+user.B])
                    // console.log(auth)
                    let now = new Date();
                    if (auth && auth.stsTokenManager.expirationTime > now.valueOf() / 1000) {
                            // deferred.resolve(auth);
                        //    console.log("apto")
                        //    return "apto"
                        $state.go("app.ofertas")

                    } else {
                            // console.log("no apto")
                            // Auth.$signOut()
                            // deferred.reject("AUTH_REQUIRED");
                            // return deferred.promise;
                            return "no apto"
                        }
                        
                    }).catch( function (error) {
                        console.log('error')
                        console.log(error)
                        // deferred.reject("AUTH_REQUIRED");
                        return "no apto"
                });
            }]
        }
    })

    .state('init.signin',{
        url: '/signin',
        templateUrl: 'templates/init/signin.html',
        controller: 'signinCtrl',
        resolve: {
            careers: function ($firebaseObject, Auth) {
                
                var ref = firebase.database().ref().child("careers")

                careers = $firebaseObject(ref)
                
                return careers
            }
        }
    })

    .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl',
        resolve: {
            // controller will not be loaded until $requireSignIn resolves
            // Auth refers to our $firebaseAuth wrapper in the factory below
            "currentAuth": ["Auth", "$q", "$window", function(Auth, $q, $window) {
           
                // $requireSignIn returns a promise so the resolve waits for it to complete
                // If the promise is rejected, it will throw a $stateChangeError (see above)
                // console.log($window.localStorage.getItem('firebase:host:myjobs-uninorte.firebaseio.com'))
                var localStorage = $window.localStorage
                var deferred = $q.defer();
                return Auth.$requireSignIn().then(function (user) {
                    
                    let auth = JSON.parse(localStorage['firebase:authUser:'+user.j+':'+user.B])
                    // console.log(auth)
                    let now = new Date();
                    if (auth && auth.stsTokenManager.expirationTime > now.valueOf() / 1000) {
                            // deferred.resolve(auth);
                           console.log("apto")
                    } else {
                            console.log("no apto")
                            Auth.$signOut()
                            deferred.reject("AUTH_REQUIRED");
                            return deferred.promise;
                        }
                        
                    }).catch( function (error) {
                        console.log('error')
                        console.log(error)
                        deferred.reject("AUTH_REQUIRED");
                        return deferred.promise;
                });
            }],

            userData: function ($firebaseObject, Auth) {
                return Auth.$requireSignIn().then( function (user) {
                    // console.log("userData: "+user.user_id)
                    var _uid = user.user_id

                    var ref = firebase.database().ref().child("users").child(user.uid)
                    
                    var syncObject = $firebaseObject(ref);
                    // console.log(syncObject.$key())
                    return syncObject
                    
                }).
                catch( function () {
                    console.log("aja")
                })
                
            },
            careers: function ($firebaseObject, Auth) {
                
                var ref = firebase.database().ref().child("careers")

                careers = $firebaseObject(ref)
                
                return careers
            }

        }
    })
    //Empresas
    .state('app.empresas', {
        url: '/empresas',
        views: {
            'menuContent': {
                templateUrl: 'templates/empresas/empresas.html',
                controller: 'empresasCtrl', 
                resolve: {
                    "currentAuth": ["Auth", "$q", "$window", function(Auth, $q, $window) {
                        // $requireSignIn returns a promise so the resolve waits for it to complete
                        // If the promise is rejected, it will throw a $stateChangeError (see above)
                        var deferred = $q.defer();
                        var localStorage = $window.localStorage
                        return Auth.$requireSignIn().then(function (user) {
                            
                            let auth = JSON.parse(localStorage['firebase:authUser:'+user.j+':'+user.B])
                            // var auth = Auth.$getAuth();
                            let now = new Date();
                            if (auth && auth.stsTokenManager.expirationTime > now.valueOf() / 1000) {
                                //    deferred.resolve(auth);
                                   console.log("apto")
                            } else {
                                    console.log("no apto")
                                    Auth.$signOut()
                                    deferred.reject("AUTH_REQUIRED");
                                    return deferred.promise;
                                }
                                
                            }).catch( function (error) {
                                console.log(error)
                                deferred.reject("AUTH_REQUIRED");
                                // return deferred.promise;
                        });
                    }],
                    users: function ($firebaseArray) {
                        // console.log("hola")
                        var ref = firebase.database().ref().child("users")

                        var syncObject = $firebaseArray(ref);
                        // var syncObject ={};

                        return syncObject
                    }
                }
            }
        }
    })
    .state('app.empresasShow', {
        url: '/showempresas/{id}',
        views: {
            'menuContent': {
                templateUrl: 'templates/empresas/showempresas.html',
                controller: 'showempresasCtrl',
                resolve: {
                    company: function($firebaseObject, $stateParams, $state, userData) {
                        let companyId = $stateParams.id;

                        if (companyId != userData.user_id){
                            
                            var ref = firebase.database().ref().child("users").child(companyId)
                            
                            var syncObject = $firebaseObject(ref);
                            
                            return syncObject 

                        } else {

                            $state.go('app.miperfil', {}, {reload: true})

                        }
                    },

                    perfilJobs: function ($firebaseArray, userData, $stateParams) {
                        // console.log(userData.$id)
                        let companyId = $stateParams.id;
                        var ref = firebase.database().ref().child("company_jobs").child(companyId)
                        perfilJobs = $firebaseArray(ref)
                        console.log(perfilJobs)
                        return perfilJobs
                            // console.log(userData.name)
                    },

                    userJobs: function ($firebaseObject, userData, perfilJobs) {
                
                        // var ref = firebase.database().ref().child("user_jobs")
        
                        // userJobs = $firebaseArray(ref)
                        // console.log(userJobs)
                        return perfilJobs.$loaded().then(function (dataJobs) {
                        for (let i = 0; i < dataJobs.length; i++) {
                            const userElement = dataJobs[i];
                            dataJobs[i].working = false
                            dataJobs[i].applying = false
                            var ref = firebase.database().ref("user_jobs/"+userData.$id+'/'+dataJobs[i].$id)
                            let syncObjectUserJob = $firebaseObject(ref);
                            syncObjectUserJob.$loaded().then(function (dataUserJob) {
                                console.log(dataUserJob)
                                if(dataUserJob.$value != null) {
                                    dataJobs[i].working = true 
                                    // applications.push({job: companyJob, application: dataFriend[0]})
                                    // console.log(applications)
                                }
                                var ref = firebase.database().ref("job_applications/"+dataJobs[i].$id+'/'+userData.$id)
                                let syncObjectApplication = $firebaseObject(ref);
                                syncObjectApplication.$loaded().then(function (dataApplication) {
                                    if(dataApplication.$value != null) {
                                        dataJobs[i].applying = true 
                                        // applications.push({job: companyJob, application: dataFriend[0]})
                                        // console.log(applications)
                                    }
                                })
                            })
                        }
                        return dataJobs 
                        })
                    }
                }
            }
        }
    })
    .state('app.userShow', {
        url: '/showuser/{id}',
        views: {
            'menuContent': {
                templateUrl: 'templates/showuser.html',
                controller: 'showuserCtrl',
                resolve: {
                    user: function($firebaseObject, $stateParams, $state, userData) {
                        let userId = $stateParams.id;

                        if (userId != userData.user_id){
                            
                            var ref = firebase.database().ref().child("users").child(userId)
                            
                            var syncObject = $firebaseObject(ref);
                            
                            return syncObject 

                        } else {

                            $state.go('app.miperfil', {}, {reload: true})

                        }
                    },

                    perfilJobs: function ($firebaseArray, userData, $stateParams) {
                        // console.log(userData.$id)
                        let userId = $stateParams.id;
                        var ref = firebase.database().ref().child("user_jobs").child(userId)
                        perfilJobs = $firebaseArray(ref)
                        console.log(perfilJobs)
                        return perfilJobs
                            // console.log(userData.name)
                    }
                }
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
                controller: 'miperfilCtrl',
                resolve: {
                    "currentAuth": ["Auth", "$q", "$window", function(Auth, $q, $window) {
                        // $requireSignIn returns a promise so the resolve waits for it to complete
                        // If the promise is rejected, it will throw a $stateChangeError (see above)
                        var localStorage = $window.localStorage
                        var deferred = $q.defer();
                        return Auth.$requireSignIn().then(function (user) {
                            console.log(user)
                            // console.log($localStorage.getItem('firebase:host:myjobs-uninorte.firebaseio.com'))
                            console.log(localStorage)
                            let auth = JSON.parse(localStorage['firebase:authUser:'+user.j+':'+user.B])
                            // var auth = Auth.$getAuth();
                            console.log(auth)
                            let now = new Date();
                            if (auth && auth.stsTokenManager.expirationTime > now.valueOf() / 1000) {
                                    deferred.resolve(auth);
                                   console.log("apto")
                            } else {
                                    console.log("no apto")
                                    // Auth.$signOut()
                                    deferred.reject("AUTH_REQUIRED");
                                }
                                return deferred.promise;
                                
                            }).catch( function (error) {
                                console.log(error)
                                deferred.reject("AUTH_REQUIRED");
                                return deferred.promise;
                        });
                    }],

                    perfilData: function ($firebaseObject, $firebaseAuth) {
                        return $firebaseAuth().$requireSignIn().then( function (user) {
                            // var _uid = user.uid

                            var ref = firebase.database().ref().child("users").child(user.uid)
                            
                            var syncObject = $firebaseObject(ref);
                            
                            // console.log(firebase.database().ref().child("users"))
                            console.log(syncObject)
                            // console.log(syncObject[''+user.uid])
                            return syncObject
                        
                            
                        }).
                        catch( function () {
                            console.log("aja")
                        })
                    },

                    perfilJobs: function ($firebaseArray, userData) {
                        // console.log(userData.$id)
                        return userData.$loaded().then(function (data) {
                            if (userData.is_company) {
                                var ref = firebase.database().ref().child("company_jobs").child(userData.$id)
                                perfilJobs = $firebaseArray(ref)
                                console.log(perfilJobs)
                                return perfilJobs
                            } else {
                                // var ref = firebase.database().ref().child("user_jobs").orderByKey().equalTo(userData.$id)
                                // console.log(userData.$id)
                                var ref = firebase.database().ref("user_jobs/"+userData.$id)
                                perfilJobs = $firebaseArray(ref)
                                console.log(perfilJobs)
                                // console.log(userJobs)
                                return perfilJobs
                            }
                            // console.log(userData.name)
                        })
                    }
                }
            }
        }
    })
    //Ofertas
    .state('app.ofertas', {
        url: '/ofertas',
        views: {
            'menuContent': {
                templateUrl: 'templates/ofertas/ofertas.html',
                controller: 'ofertasCtrl', 
                resolve: {
                    "currentAuth": ["Auth", "$q", "$window", "$state", function(Auth, $q, $window, $state) {
                        // $requireSignIn returns a promise so the resolve waits for it to complete
                        // If the promise is rejected, it will throw a $stateChangeError (see above)
                        var localStorage = $window.localStorage
                        var deferred = $q.defer();
                        console.log("hey aca")
                        return Auth.$requireSignIn().then(function (user) {
                            console.log(user)
                            // console.log($localStorage.getItem('firebase:host:myjobs-uninorte.firebaseio.com'))
                            console.log(localStorage)
                            let auth = JSON.parse(localStorage['firebase:authUser:'+user.j+':'+user.B])
                            // var auth = Auth.$getAuth();
                            console.log(auth)
                            let now = new Date();
                            if (auth && auth.stsTokenManager.expirationTime > now.valueOf() / 1000) {
                                deferred.resolve(auth);
                                console.log("apto")
                            } else {
                                console.log("no apto")
                                // Auth.$signOut()
                                deferred.reject("AUTH_REQUIRED");
                            }
                            return deferred.promise;
                            
                        }).catch( function (error) {
                                console.log("hey aca")
                                console.log(error)
                                $state.go("init.login")
                                deferred.reject("AUTH_REQUIRED");
                                return deferred.promise;
                        });
                    }],

                    jobs: function ($firebaseArray, Auth) {
                        return Auth.$requireSignIn().then( function (user) {
                            // var _uid = user.uid

                            var ref = firebase.database().ref().child("jobs")
                            
                            var syncObject = $firebaseArray(ref);
                            
                            // console.log(firebase.database().ref().child("users"))
                            console.log(syncObject)
                            // console.log(syncObject[''+user.uid])
                            return syncObject
                        
                            
                        }).
                        catch( function () {
                            console.log("aja")
                        })
                    },

                    careers: function ($firebaseArray) {
                
                        var ref = firebase.database().ref().child("careers")
        
                        careers = $firebaseArray(ref)
                        console.log(careers)
                        return careers
                    },
                    userJobs: function ($firebaseObject, userData, jobs) {
                
                        // var ref = firebase.database().ref().child("user_jobs")
        
                        // userJobs = $firebaseArray(ref)
                        // console.log(userJobs)
                        return jobs.$loaded().then(function (dataJobs) {
                        for (let i = 0; i < dataJobs.length; i++) {
                            const userElement = dataJobs[i];
                            dataJobs[i].working = false
                            dataJobs[i].applying = false
                            var ref = firebase.database().ref("user_jobs/"+userData.$id+'/'+dataJobs[i].$id)
                            let syncObjectUserJob = $firebaseObject(ref);
                            syncObjectUserJob.$loaded().then(function (dataUserJob) {
                                console.log(dataUserJob)
                                if(dataUserJob.$value != null) {
                                    dataJobs[i].working = true 
                                    // applications.push({job: companyJob, application: dataFriend[0]})
                                    // console.log(applications)
                                }
                                var ref = firebase.database().ref("job_applications/"+dataJobs[i].$id+'/'+userData.$id)
                                let syncObjectApplication = $firebaseObject(ref);
                                syncObjectApplication.$loaded().then(function (dataApplication) {
                                    if(dataApplication.$value != null) {
                                        dataJobs[i].applying = true 
                                        // applications.push({job: companyJob, application: dataFriend[0]})
                                        // console.log(applications)
                                    }
                                })
                            })
                        }
                        console.log(dataJobs)
                        return dataJobs 
                        })
                    }
                }
            }
        }
    })
    //Amigos
    .state('app.amigos', {
        url: '/amigos',
        views: {
            'menuContent': {
                templateUrl: 'templates/amigos.html',
                controller: 'amigosCtrl',
                resolve: {
                    userFriends: function ($firebaseArray, userData) {
                        console.log(userData.$id)
                        var ref = firebase.database().ref("friendship/"+userData.$id)
        
                        userFriends = $firebaseArray(ref)
                        // console.log(userFriends)
                        return userFriends
                    }
                }
            }
        }
    })
    .state('app.explorar', {
        url: '/explorar',
        views: {
            'menuContent': {
                templateUrl: 'templates/explorar.html',
                controller: 'explorarCtrl',
                resolve: {
                    users: function ($firebaseArray) {
                        // console.log("hola")
                        var ref = firebase.database().ref().child("users")

                        var syncObject = $firebaseArray(ref);
                        // var syncObject ={};

                        return syncObject
                    },
                    userFriends: function ($firebaseArray, $firebaseObject, userData, users) {
                        var ref = firebase.database().ref("friendship/"+userData.$id)
                        console.log(users)
                        userFriends = $firebaseArray(ref)
                        // console.log(userFriends)
                        return userFriends.$loaded().then(function (dataUserFriends) {
                            for (let i = 0; i < users.length; i++) {
                                const userElement = users[i];
                                users[i].friend = false
                                console.log(userData.$id)
                                var ref = firebase.database().ref("friendship/"+userData.$id+'/'+users[i].$id)
                                let syncObjectFriend = $firebaseObject(ref);
                                syncObjectFriend.$loaded().then(function (dataFriend) {
                                        console.log(dataFriend)
                                        if(dataFriend.$value != null) {
                                            users[i].friend = true 
                                            // applications.push({job: companyJob, application: dataFriend[0]})
                                            // console.log(applications)
                                        }
                                })
                            }
                            return users
                        })
                    },
                    suggestedFriends: function ($firebaseArray, $firebaseObject, userData, users) {
                   
                        var user_id = userData.$id;
                        totalFriends = {};
                        return firebase.database().ref('friendship/' + user_id).once('value')
                        .then(function(snapshot){
                            snapshot.forEach(function(childSnapshot) {
                                var childKey = childSnapshot.key;
                                firebase.database().ref('friendship/' + childKey).once('value')
                                .then(function(friendsnapshot){
                                    totalFriends = angular.extend(totalFriends, friendsnapshot.val());
                                    for(var friend in totalFriends) {
                                        for (var myfriend in snapshot.val()) {
                                            if (friend == myfriend ) {
                                                delete totalFriends[friend];
                                            }
                                        }
                                        if (friend == user_id) {
                                            delete totalFriends[friend];
                                        }
                                    }
                                });
                            })
                            // console.log(totalFriends);  
                            console.log(totalFriends);
                            return totalFriends;
                        })
                        .catch(function(error) {
                            // Handle Errors here.
                            console.log(error);
                            // var errorCode = error.code;
                            // var errorMessage = error.message;
                            return totalFriends;
                        });
                    }
                }
            }
        }
    })
    .state('app.aplicaciones', {
        url: '/aplicaciones',
        views: {
            'menuContent': {
                templateUrl: 'templates/aplicaciones.html',
                controller: 'aplicacionesCtrl',
                resolve: {
                    // applications: function ($firebaseArray, userData) {
                    //     console.log(userData.$id)
                    //     var ref = firebase.database().ref("job_applications/")

                    //     var syncObject = $firebaseArray(ref);
                    //     // var syncObject ={};
                    //     console.log(syncObject)
                    //     return syncObject
                    // },
                    
                    applications: function ($firebaseArray, userData) {
                            // var _uid = user.uid
                            var ref = firebase.database().ref("company_jobs/"+userData.$id)
                            
                            var syncObject = $firebaseArray(ref);
                            
                            // console.log(firebase.database().ref().child("users"))
                            console.log(syncObject)
                            // console.log(syncObject[''+user.uid])
                            var applications = []
                            syncObject.$loaded().then(function (dataCompanyJobs) {
                                for (let i = 0; i < dataCompanyJobs.length; i++) {
                                    console.log(syncObject[i])
                                    console.log(dataCompanyJobs[i])
                                    const companyJob = dataCompanyJobs[i];
                                    var ref = firebase.database().ref("job_applications/"+companyJob.$id)

                                    let syncObjectApplication = $firebaseArray(ref);
                                    syncObjectApplication.$loaded().then(function (dataApplication) {
                                        console.log(dataApplication)
                                        if(dataApplication.length > 0) {
                                            dataApplication[0].job_id = syncObjectApplication[0].$id 
                                            applications.push({job: companyJob, application: dataApplication[0]})
                                            // console.log(applications)
                                        }
                                    })
                                    // console.log(syncObjectApplication.length)
                                }
                            })
                            console.log(applications)
                            return applications

                            
                    }
                }
            }
        }
    });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/showempresas');
});
