app.controller('loginCtrl', function($scope, $mdDialog, $window, $state, Auth) {
    console.log('hola, careverga');

    $scope.login = function(email, password){
        console.log(email)
        console.log(password)
        Auth.$signInWithEmailAndPassword(email, password)
        .then(function(firebaseUser){
            $window.location.reload();
            // Sign-in successful.
            // current_user();
            // alert('User signed in!');
            // console.log(firebaseUser)
        })
        .catch(function(error) {
            // Handle Errors here.
            
                // Appending dialog to document.body to cover sidenav in docs app
                // Modal dialogs should fully cover application
                // to prevent interaction outside of dialog
            $mdDialog.show(
                $mdDialog.alert()
                .parent(angular.element(document.querySelector('#popupContainer')))
                .clickOutsideToClose(true)
                .title('Email or password incorrect')
                .textContent('Please check your email or password.')
                .ariaLabel('Alert Dialog Demo')
                .ok('Ok')
                // .targetEvent(ev)
            );
            console.log(error);
            // var errorCode = error.code;
            // var errorMessage = error.message;
        });
        // setTimeout(() => {
            // $state.go('app.empresas', {}, {reload: true})
        // }, 1000);
        // $state.go('app.ofertas')
    }

    $scope.create = function(){
        $state.go('init.signin')
    }
    
});