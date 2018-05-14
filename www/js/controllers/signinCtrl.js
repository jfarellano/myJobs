app.controller('signinCtrl', function($scope, $state, $firebaseObject, $firebaseArray, Auth, careers) {
    console.log('hola, caremonda');
    $scope.user = {is_company: false}
    $scope.careers = careers
    $scope.create = function(){
        console.log($scope.user);
        Auth.$createUserWithEmailAndPassword($scope.user.email, $scope.user.password).then(function (firebaseUser) {
            
            console.log(firebaseUser)
            var _uid = firebaseUser.uid

            // var ref = firebase.database().ref().child("users")

            // users = $firebaseArray(ref)
            
            // console.log(careers)
            if ($scope.user.is_company) {
                var updatedUser = {
                    user_id: _uid,
                    username: $scope.user.username,
                    email: $scope.user.email,
                    company_description: $scope.user.company_description,
                    is_company: $scope.user.is_company,
                    name: $scope.user.name,
                    phone: $scope.user.phone,
                    address: $scope.user.address
                    // semester: parseInt($scope.user.semester)
                }
            
            } else {
                var updatedUser = {
                    user_id: _uid,
                    username: $scope.user.username,
                    email: $scope.user.email,
                    career: $scope.user.career,
                    is_company: $scope.user.is_company,
                    name: $scope.user.name,
                    lastname: $scope.user.lastname,
                    semester: parseInt($scope.user.semester)
                }
            }

            
            // var updates = {};
            // updates['/users/' + _uid] = updatedUser;
            firebase.database().ref().child("users").child(_uid).set(updatedUser)
            $state.go('app.empresas', {reload: true});
            // firebase.database().ref().update(updates).catch(function (err) {
                //     console.log(err)
            // });
            // var syncObject = $firebaseObject(ref);
            
        })
        .catch(function () {
            
        })
    }
});