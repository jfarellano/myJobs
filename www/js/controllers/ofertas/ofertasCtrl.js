app.controller('ofertasCtrl', function ($scope, $stateParams, ionicMaterialInk, $window, $mdDialog, jobs, userJobs, careers, userData, $firebaseObject, $firebaseArray, Auth) {
    //ionic.material.ink.displayEffect();

    var authObj = Auth
    $scope.careers = careers
    // $scope.jobs = jobs
    userJobs.$loaded().then(function (data) {
        for (i = 0; i < userJobs.length; i++) {
            let id = Object.keys(userJobs[i]['company'])
            userJobs[i]['owner_name'] = userJobs[i]['company'][id[0]]
        }
        $scope.jobs = userJobs
    })
    // console.log(userJobs)
    // $scope.userJobs = userJobs
    ionicMaterialInk.displayEffect();
    $scope.apply = function(job){
            let jobId = job.$id
            firebase.database().ref("job_applications/"+jobId+'/'+userData.$id).set(userData.username)
            userJob = job
            delete userJob.$$hashKey
            delete userJob.$id
            delete userJob.$priority
            delete userJob.applying
            delete userJob.working
            firebase.database().ref("users_applications/"+userData.$id+'/'+jobId).set(userJob)
            $window.location.reload();
    }

    $scope.showAdvanced = function(ev) {
        $mdDialog.show({
        controller: DialogController,
        // preserveScope: true,
        // scope: $scope,
        // controllerAs: 'questList',
        templateUrl: '../templates/makeOfert.tmpl.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        locals: {user: userData, authObj: authObj, careers: careers},
        focusOnOpen: false,
        clickOutsideToClose:true
        })
        .then(function() {
        $scope.status = 'You said the information was ' ;
        console.log('You said the information was ')
        //   console.log(perfilData)
        }, function() {
        $scope.status = 'You cancelled the dialog.';
        });
    };

    function DialogController($scope, $mdDialog, $firebaseArray, user, authObj, careers) {
        $scope.today = new Date()
        $scope.careers = careers
        $scope.ofert = {company: {}, start_date: $scope.today, end_date: $scope.today}
        $scope.hide = function() {
            $mdDialog.hide();
        };

        $scope.moveDate = function() {
            if  ($scope.ofert.end_date < $scope.ofert.start_date){
                $scope.ofert.end_date = $scope.ofert.start_date 
            }
        };

        $scope.cancel = function() {
            $mdDialog.cancel();
            // console.log("aja")
        };

        $scope.answer = function() {
            console.log($scope.ofert)
            console.log($scope.ofert.start_date.toDateString())
            console.log($scope.ofert.start_date.toISOString().slice(0,10))
            var jobsRef = firebase.database().ref().child("jobs")
            
            
            var ofertsDatabase = $firebaseArray(jobsRef);
            
            
            ofertsDatabase.$loaded().then(function () {
                $scope.ofert.company[user.user_id] = user.username 
                $scope.ofert.hired_users = 0
                $scope.ofert.start_date = $scope.ofert.start_date.toISOString().slice(0,10) + ""
                $scope.ofert.end_date = $scope.ofert.end_date.toISOString().slice(0,10) + ""
                console.log($scope.ofert)
                ofertsDatabase.$add($scope.ofert).then(function (firebaseObject) {
                    console.log(firebaseObject)
                    // let companyJob = {}
                    // companyJob[firebaseObject.key] = $scope.ofert 
                    firebase.database().ref("company_jobs/"+user.user_id+"/"+firebaseObject.key).set($scope.ofert)
                })
                $mdDialog.hide();
            })
            // console.log($scope.email)
            // console.log(action)
            
        };
    }
});