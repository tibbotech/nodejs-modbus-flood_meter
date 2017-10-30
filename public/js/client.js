angular.module('modbusSample', [])
    .controller('indicatorController', function($scope) {
        var socket = io(); //

        $scope.locked = true; // Disables the view by default

        socket.on('connect', function () { // On connection established
            $scope.locked = false; // Enables the view
            $scope.$apply(); // Re-renders the view
        });

        socket.on('disconnect', function () { // Hides everything on disconnect
            $scope.locked = true;
            $scope.$apply();
        });

        socket.on('flood-event', function (value) { // Catches the 'tps:state:changed' event
            $scope.state = value == 1;
            $scope.$apply();
        });
    });