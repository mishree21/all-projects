var app = angular.module("busApp", ["ngRoute"]);

app.config(function($routeProvider){

$routeProvider

.when("/",{
templateUrl : "views/entry.html",
controller : "entryController"
})

.when("/admin",{
templateUrl : "views/admin.html",
controller : "adminController"
})

.when("/home",{
templateUrl : "views/home.html",
controller : "busController"
})

.when("/bus/:busId",{
templateUrl : "views/busDetails.html",
controller : "busDetailsController"
})

.otherwise({
redirectTo : "/"
});

});


// ENTRY CONTROLLER
app.controller("entryController", function($scope,$location){

$scope.user = {};

$scope.enterSite = function(){

localStorage.setItem("username",$scope.user.name);
localStorage.setItem("role",$scope.user.role);

if($scope.user.role == "admin"){
$location.path("/admin");
}
else{
$location.path("/home");
}

};

});


// BUS CONTROLLER
app.controller("busController", function($scope){

$scope.username = localStorage.getItem("username");

var storedBuses = JSON.parse(localStorage.getItem("buses"));

if(storedBuses){

// fix old buses without seats
storedBuses.forEach(function(bus){
if(!bus.seats){
bus.seats = 30;
}
});

$scope.buses = storedBuses;

}
else{

$scope.buses = [

{
number:"101",
helper:"Ramesh",
contact:"9876543210",
seats:30,
stops:["Railway Station","Trikon Baug","Indira Circle","University"]
},

{
number:"202",
helper:"Suresh",
contact:"9876541234",
seats:25,
stops:["Bus Stand","Kalawad Road","Crystal Mall","University"]
},

{
number:"303",
helper:"Mahesh",
contact:"9876509876",
seats:20,
stops:["Airport","Raiya Road","Trikon Baug","Bus Stand"]
}

];

localStorage.setItem("buses", JSON.stringify($scope.buses));

}

$scope.filteredBuses = $scope.buses;


// FIND BUS FUNCTION
$scope.findBus = function(){

$scope.filteredBuses = $scope.buses.filter(function(bus){

var source = ($scope.source || "").toLowerCase();
var destination = ($scope.destination || "").toLowerCase();

var sourceMatch = bus.stops.some(function(stop){
return stop.toLowerCase().includes(source);
});

var destinationMatch = bus.stops.some(function(stop){
return stop.toLowerCase().includes(destination);
});

return sourceMatch && destinationMatch;

});

};

});


// BUS DETAILS CONTROLLER
app.controller("busDetailsController", function($scope,$routeParams,$sce){

var buses = JSON.parse(localStorage.getItem("buses")) || [];

var id = $routeParams.busId;

$scope.bus = buses.find(function(b){
return b.number == id;
});

$scope.ticket = null;

// default seats
if($scope.bus && !$scope.bus.seats){
$scope.bus.seats = 30;
}

// GOOGLE MAP URL
if($scope.bus){
var route = $scope.bus.stops.join(" to ");
$scope.mapUrl = $sce.trustAsResourceUrl(
"https://maps.google.com/maps?q=" + route + "&output=embed"
);
}

$scope.bookSeat = function(){

if($scope.bus.seats > 0){

$scope.bus.seats--;

localStorage.setItem("buses", JSON.stringify(buses));

$scope.ticket = {
passenger: localStorage.getItem("username"),
bus: $scope.bus.number,
route: $scope.bus.stops.join(" → "),
seat: Math.floor(Math.random()*40)+1
};

}
else{
alert("No Seats Available");
}

};

$scope.downloadPDF = function(){

const { jsPDF } = window.jspdf;

var doc = new jsPDF();

doc.setFontSize(18);
doc.text("Bus Ticket", 80, 20);

doc.setFontSize(12);

doc.text("Passenger: " + $scope.ticket.passenger, 20, 40);
doc.text("Bus Number: " + $scope.ticket.bus, 20, 50);
doc.text("Seat Number: " + $scope.ticket.seat, 20, 60);
doc.text("Route: " + $scope.ticket.route, 20, 70);

doc.text("Thank you for traveling with us!", 20, 100);

doc.save("Bus_Ticket.pdf");

};

});

// ADMIN CONTROLLER
app.controller("adminController", function($scope){

$scope.buses = JSON.parse(localStorage.getItem("buses")) || [];

$scope.newBus = {};

$scope.addBus = function(){

var newBus = {
number:$scope.newBus.number,
helper:$scope.newBus.helper,
contact:$scope.newBus.contact,
seats:$scope.newBus.seats,
stops:$scope.newBus.stops.split(",")
};

$scope.buses.push(newBus);

localStorage.setItem("buses", JSON.stringify($scope.buses));

$scope.newBus = {};

alert("Bus Added Successfully");

};


$scope.deleteBus = function(index){

$scope.buses.splice(index,1);

localStorage.setItem("buses", JSON.stringify($scope.buses));

};


$scope.editBus = function(index){

var bus = $scope.buses[index];

$scope.newBus = {
number:bus.number,
helper:bus.helper,
contact:bus.contact,
seats:bus.seats,
stops:bus.stops.join(",")
};

$scope.buses.splice(index,1);

};

});