app.controller('miperfilCtrl', function ($state, $scope, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion, perfilJobs, careers, perfilData, $mdDialog, Auth, $firebaseObject) {

    var fab = document.getElementById('fab');
    var authObj = Auth
    $scope.perfilData = perfilData
    perfilJobs.$loaded().then(function (data) {
        for (i = 0; i < perfilJobs.length; i++) {
            let id = Object.keys(perfilJobs[i]['company'])
            perfilJobs[i]['name'] = perfilJobs[i]['company'][id[0]]
        }
        $scope.perfilJobs = perfilJobs
    })
    $scope.careers = careers
    // perfilJobs
    $scope.moveFab = function (dir) {
        fab.style.display = 'none';
        fab.className = fab.className.replace('button-fab-top-left', '');
        fab.className = fab.className.replace('button-fab-top-right', '');
        fab.className = fab.className.replace('button-fab-bottom-left', '');
        fab.className = fab.className.replace('button-fab-bottom-right', '');
        fab.className += ' button-fab-' + dir;
        $timeout(function () {
            fab.style.display = 'block';
        }, 100);
    };

    $scope.motionFab = function (type) {
        var shouldAnimate = false;
        var classes = type instanceof Array ? type : [type];
        for (var i = 0; i < classes.length; i++) {
            fab.classList.toggle(classes[i]);
            shouldAnimate = fab.classList.contains(classes[i]);
            if (shouldAnimate) {
                (function (theClass) {
                    $timeout(function () {
                        fab.classList.toggle(theClass);
                    }, 300);
                })(classes[i]);
            }
        }
    };

    var reset = function () {
        var inClass = document.querySelectorAll('.in');
        for (var i = 0; i < inClass.length; i++) {
            inClass[i].classList.remove('in');
            inClass[i].removeAttribute('style');
        }
        var done = document.querySelectorAll('.done');
        for (var i = 0; i < done.length; i++) {
            done[i].classList.remove('done');
            done[i].removeAttribute('style');
        }
        var ionList = document.getElementsByTagName('ion-list');
        for (var i = 0; i < ionList.length; i++) {
            var toRemove = ionList[i].className;
            if (/animate-/.test(toRemove)) {
                ionList[i].className = ionList[i].className.replace(/(?:^|\s)animate-\S*(?:$|\s)/, '');
            }
        }
    };

    $scope.ripple = function () {
        reset();
        document.getElementsByTagName('ion-list')[0].className += ' animate-ripple';
        setTimeout(function () {
            ionicMaterialMotion.ripple();
        }, 500);
    };

    $scope.fadeSlideInRight = function () {
        reset();
        document.getElementsByTagName('ion-list')[0].className += ' animate-fade-slide-in-right';
        setTimeout(function () {
            ionicMaterialMotion.fadeSlideInRight();
        }, 500);
    };

    $scope.fadeSlideIn = function () {
        reset();
        document.getElementsByTagName('ion-list')[0].className += ' animate-fade-slide-in';
        setTimeout(function () {
            ionicMaterialMotion.fadeSlideIn();
        }, 500);
    };

    $scope.blinds = function () {
        reset();
        document.getElementsByTagName('ion-list')[0].className += ' animate-blinds';
        setTimeout(function () {
            ionicMaterialMotion.blinds();
        }, 500);
    };

    $scope.auth = function () {
        console.log(Auth.$getAuth().uid)
    }

    $scope.blinds();
    //ionic.material.ink.displayEffect(); ionicMaterialMotion
    ionicMaterialInk.displayEffect();

    $scope.showHints = true;

    $scope.showConfirm = function (ev) {
        // Appending dialog to document.body to cover sidenav in docs app
        var confirm = $mdDialog.confirm()
            .title('Are you sure to delete your account?')
            .textContent('All your data will be deleted.')
            .ariaLabel('Lucky day')
            .targetEvent(ev)
            .ok('Delete account')
            .cancel("Don't delete");

        $mdDialog.show(confirm).then(function () {
            //   $scope.status = 'You decided to get rid of your debt.';
            // console.log(perfilData)
            let ref = firebase.database().ref().child('users').child(perfilData.user_id)
            userDatabase = $firebaseObject(ref)
            userDatabase.$loaded().then(function () {
                console.log(userDatabase)
                userDatabase.$remove()
                Auth.$deleteUser()
                Auth.$signOut()
                $state.go('init.login', {}, { reload: true })
            })
        }, function () {
            $scope.status = 'You decided to keep your debt.';
        });
    };

    $scope.showAdvanced = function (ev, element) {
        $mdDialog.show({
            controller: DialogController,
            // preserveScope: true,
            // scope: $scope,
            // controllerAs: 'questList',
            templateUrl: '../templates/changeInfo.tmpl.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            locals: { action: element, user: perfilData, authObj: authObj, ev: ev },
            focusOnOpen: false,
            clickOutsideToClose: true
        })
            .then(function (answer) {
                // Appending dialog to document.body to cover sidenav in docs app
                // Modal dialogs should fully cover application
                // to prevent interaction outside of dialog
                $mdDialog.show(
                    $mdDialog.alert()
                        .parent(angular.element(document.querySelector('#popupContainer')))
                        .clickOutsideToClose(true)
                        .title('Email changed successfully')
                        // .textContent('You chang')
                        .ariaLabel('Alert Dialog Demo')
                        .ok('Okay')
                        .targetEvent(ev)
                );
            }, function () {
                $scope.status = 'You cancelled the dialog.';
            });
    };

    function DialogController($scope, $mdDialog, $firebaseObject, user, authObj, action, ev) {
        // $scope.parent = perfilData
        // $scope.questList = this
        $scope.action = action
        $scope.oldPassword = ""
        $scope.password = ""
        $scope.confirmPassword = ""
        $scope.oldInfo = user[action]
        $scope.newInfo = user[action]
        $scope.hide = function () {
            $mdDialog.hide();
        };

        $scope.cancel = function () {
            $mdDialog.cancel();
            // console.log("aja")
        };

        $scope.answer = function (answer) {

            if (action == 'email') {

                authObj.$signInWithEmailAndPassword($scope.oldInfo, $scope.password).then(function (firebaseUser) {
                    authObj.$updateEmail(answer).then(function () {
                        // $mdDialog.hide(answer);
                        var ref = firebase.database().ref().child("users").child(perfilData.user_id)

                        var userDatabase = $firebaseObject(ref);
                        userDatabase.$loaded().then(function () {
                            userDatabase.email = answer
                            userDatabase.$save()
                            $mdDialog.hide();
                        })
                        console.log("Email changed successfully!");
                    }).catch(function (error) {
                        $mdDialog.cancel();
                        console.error("Error: ", error);
                        if (error.message.includes("already in use")) {
                            $mdDialog.show(
                                $mdDialog.alert()
                                    .parent(angular.element(document.querySelector('#popupContainer')))
                                    .clickOutsideToClose(true)
                                    .title(error.message)
                                    // .textContent('You chang')
                                    .ariaLabel('Alert Dialog Demo')
                                    .ok('Okay')
                                    .targetEvent(ev)
                            );
                        }
                    });
                }).catch(function (error) {
                    $mdDialog.show(
                        $mdDialog.alert()
                            .parent(angular.element(document.querySelector('#popupContainer')))
                            .clickOutsideToClose(true)
                            .title('Incorrect password')
                            // .textContent('You chang')
                            .ariaLabel('Alert Dialog Demo')
                            .ok('Okay')
                            .targetEvent(ev)
                    );
                });

            } else {
                if (action == 'password') {
                    console.log(user)
                    console.log(user.email)
                    console.log(oldPassword)
                    authObj.$signInWithEmailAndPassword(user.email, $scope.oldPassword).then(function (firebaseUser) {
                        authObj.$updatePassword($scope.oldPassword).then(function () {
                            // $mdDialog.hide(answer);
                            var ref = firebase.database().ref().child("users").child(perfilData.user_id)

                            var userDatabase = $firebaseObject(ref);
                            userDatabase.$loaded().then(function () {
                                userDatabase.email = answer
                                userDatabase.$save()
                                $mdDialog.hide();
                            })
                            console.log("Password changed successfully!");
                        }).catch(function (error) {
                            $mdDialog.cancel();
                            console.error("Error: ", error);
                            // if (error.message.includes("already in use")) {
                            $mdDialog.show(
                                $mdDialog.alert()
                                    .parent(angular.element(document.querySelector('#popupContainer')))
                                    .clickOutsideToClose(true)
                                    .title(error.message)
                                    // .textContent('You chang')
                                    .ariaLabel('Alert Dialog Demo')
                                    .ok('Okay')
                                    .targetEvent(ev)
                            );
                            // }
                        });
                    }).catch(function (error) {
                        $mdDialog.show(
                            $mdDialog.alert()
                                .parent(angular.element(document.querySelector('#popupContainer')))
                                .clickOutsideToClose(true)
                                .title(error.message)
                                // .textContent('You chang')
                                .ariaLabel('Alert Dialog Demo')
                                .ok('Okay')
                                .targetEvent(ev)
                        );
                    });
                } else {
                    if (action == "username") {
                        var user_id = user.$id;//currentUser["user_id"];
                        var username = answer;
                        firebase.database().ref('/users/' + user_id).once('value')
                            .then(function (snapshot) {

                                if (snapshot.val().is_company == true) {

                                    var upd = {};

                                    //Create an entry for the user profile
                                    upd['users/' + user_id + '/username'] = username;

                                    firebase.database().ref().update(upd);

                                    firebase.database().ref('company_jobs/' + user_id).once('value')
                                        .then(function (snap) {
                                            if (snap.val() != null) {

                                                var eventKeys = Object.keys(snap.val());
                                                var upd1 = {};

                                                eventKeys.forEach(key => {
                                                    upd1['company_jobs/' + user_id + '/' + key + '/company/' + user_id] = username;
                                                    //Create an entry for each job
                                                    upd1['jobs/' + key + '/company/' + user_id] = username;

                                                    firebase.database().ref('job_applications/' + key).once('value')
                                                        .then(function (snap) {
                                                            if (snap.val() != null) {

                                                                var eventKeys2 = Object.keys(snap.val());
                                                                var upd2 = {};

                                                                //Create an entry for each user application
                                                                eventKeys2.forEach(key2 => {
                                                                    upd2['users_applications/' + key2 + '/' + key + '/company/' + user_id] = username;
                                                                })

                                                                firebase.database().ref().update(upd2);
                                                            } else {
                                                                console.log('The company does not have applications on the job' + key);
                                                            }
                                                        })
                                                        .catch(function (error) {
                                                            // Handle Errors here.
                                                            console.log(error);
                                                            // var errorCode = error.code;
                                                            // var errorMessage = error.message;
                                                            alert('The user applications update failed!');
                                                        });

                                                    firebase.database().ref('job_hires/' + key).once('value')
                                                        .then(function (snap) {
                                                            if (snap.val() != null) {
                                                                console.log("el snap 3");
                                                                console.log(snap);

                                                                var eventKeys3 = Object.keys(snap.val());
                                                                var upd3 = {};

                                                                //Create an entry for each user job
                                                                eventKeys3.forEach(key3 => {
                                                                    upd3['user_jobs/' + key3 + '/' + key + '/company/' + user_id] = username;
                                                                })

                                                                console.log("el upd 3");
                                                                console.log(upd3);

                                                                firebase.database().ref().update(upd3);
                                                            } else {
                                                                console.log('The user does not have hires on the job' + key);
                                                            }
                                                        })
                                                        .catch(function (error) {
                                                            // Handle Errors here.
                                                            console.log(error);
                                                            // var errorCode = error.code;
                                                            // var errorMessage = error.message;
                                                            alert('The user applications update failed!');
                                                        });
                                                })

                                                firebase.database().ref().update(upd1);
                                            } else {
                                                console.log('The company does not have jobs');
                                            }
                                        })
                                        .catch(function (error) {
                                            // Handle Errors here.
                                            console.log(error);
                                            // var errorCode = error.code;
                                            // var errorMessage = error.message;
                                            alert('The company jobs update failed!');
                                        });
                                } else {
                                    console.log("El else");

                                    var upd = {};

                                    //Create an entry for the user profile
                                    upd['users/' + user_id + '/username'] = username;

                                    console.log("el upd");
                                    console.log(upd);

                                    firebase.database().ref().update(upd);

                                    firebase.database().ref('user_jobs/' + user_id).once('value')
                                        .then(function (snap) {
                                            if (snap.val() != null) {
                                                var eventKeys = Object.keys(snap.val());
                                                var upd = {};

                                                //Create an entry for each job_hire 
                                                eventKeys.forEach(key => {
                                                    upd['job_hires/' + key + '/' + user_id + '/username'] = username;
                                                })

                                                firebase.database().ref().update(upd);
                                            } else {
                                                console.log('The user does not have jobs');
                                            }
                                        })
                                        .catch(function (error) {
                                            // Handle Errors here.
                                            console.log(error);
                                            // var errorCode = error.code;
                                            // var errorMessage = error.message;
                                            alert('The jobs hire update failed!');
                                        });

                                    firebase.database().ref('users_applications/' + user_id).once('value')
                                        .then(function (snap) {
                                            if (snap.val() != null) {
                                                var eventKeys = Object.keys(snap.val());
                                                var upd = {};

                                                //Create an entry for each job_application 
                                                eventKeys.forEach(key => {
                                                    upd['job_applications/' + key + '/' + user_id] = username;
                                                })

                                                firebase.database().ref().update(upd);
                                            } else {
                                                console.log('The user does not have applications');
                                            }
                                        })
                                        .catch(function (error) {
                                            // Handle Errors here.
                                            console.log(error);
                                            alert('The jobs application update failed!');
                                        });

                                    firebase.database().ref('friendship/' + user_id).once('value')
                                        .then(function (snap) {
                                            if (snap.val() != null) {
                                                var eventKeys = Object.keys(snap.val());
                                                var upd = {};

                                                //Create an entry for each friendship 
                                                eventKeys.forEach(key => {
                                                    upd['friendship/' + key + '/' + user_id] = username;
                                                })

                                                firebase.database().ref().update(upd);
                                            } else {
                                                console.log('The user does not have friends');
                                            }
                                        })
                                        .catch(function (error) {
                                            // Handle Errors here.
                                            console.log(error);
                                        });
                                }
                                $mdDialog.show(
                                    $mdDialog.alert()
                                        .parent(angular.element(document.querySelector('#popupContainer')))
                                        .clickOutsideToClose(true)
                                        .title(action + ' changed successfully')
                                        // .textContent('You chang')
                                        .ariaLabel('Alert Dialog Demo')
                                        .ok('Okay')
                                        .targetEvent(ev)
                                );
                            })
                            .catch(function (error) {
                                // Handle Errors here.
                                console.log(error);
                                $mdDialog.show(
                                    $mdDialog.alert()
                                        .parent(angular.element(document.querySelector('#popupContainer')))
                                        .clickOutsideToClose(true)
                                        .title('The user update failed')
                                        // .textContent('You chang')
                                        .ariaLabel('Alert Dialog Demo')
                                        .ok('Okay')
                                        .targetEvent(ev)
                                );
                            });


                    } else {
                        var ref = firebase.database().ref().child("users").child(perfilData.user_id)

                        var userDatabase = $firebaseObject(ref);
                        userDatabase.$loaded().then(function () {
                            userDatabase[action] = answer
                            userDatabase.$save()
                            $mdDialog.show(
                                $mdDialog.alert()
                                    .parent(angular.element(document.querySelector('#popupContainer')))
                                    .clickOutsideToClose(true)
                                    .title(action + ' changed successfully')
                                    // .textContent('You chang')
                                    .ariaLabel('Alert Dialog Demo')
                                    .ok('Okay')
                                    .targetEvent(ev)
                            );
                        })
                    }
                }
            }
        };
    }

    //
});