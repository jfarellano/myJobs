app.controller('showempresasCtrl', function ($scope, $state, $window, company, perfilJobs, userJobs, userData) {
    // console.log(company_id)
    $scope.company = company
    // $scope.perfilJobs = perfilJobs
    $scope.perfilJobs = userJobs

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
});