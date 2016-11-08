  // Initialize Firebase
  var config = {
  	apiKey: "AIzaSyDze0UDGT3D95WLp2URy0zbJ3LkcwVgDG4",
  	authDomain: "fir-testproject-8baca.firebaseapp.com",
  	databaseURL: "https://fir-testproject-8baca.firebaseio.com",
  	storageBucket: "fir-testproject-8baca.appspot.com",
  	messagingSenderId: "655500419495"
  };
  firebase.initializeApp(config);

 // Create a variable to reference the database
 var database = firebase.database();

  // set up variables
  var count=0;
  var savedSnapshot = null;


  database.ref('/trains/counter').on("value", function(snapshot) {
    count = snapshot.val().count;
  });

  function update() {
   $('#wallClock').html(moment().format('D MMMM YYYY H:mm:ss'));
 }

 setInterval(update, 1000);


 function calculateTime(firstTime, tFrequency, id) {


  var firstTimeConverted = moment(firstTime,"hh:mm").subtract(1, "years");
    //console.log(firstTimeConverted);

    // Current Time
    var currentTime = moment();
    //console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    //console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % tFrequency;
   // console.log(tRemainder);

    // Minute Until Train
    var tMinutesTillTrain = tFrequency - tRemainder;
    //console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    //console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

    var id1 = "minsAway" + id;
    document.getElementById(id1).innerHTML = tMinutesTillTrain;
    var id2 = "nextArr" + id;
    document.getElementById(id2).innerHTML = moment(nextTrain).format("hh:mm a");

  }


  function updateTimes2(childSnapshot) {
    var theData= null;
    savedSnapshot.forEach(function(theData) {
      if(theData.val().count === undefined) {
        arrivalTime = theData.val().data.arrivalTime;
        freq = theData.val().data.freq;
        id = theData.val().data.id;

        calculateTime(arrivalTime, freq, id, 'U');
      }
    });
  }

  setInterval(updateTimes2, 1000);

  database.ref('/trains').on("value", function(snapshot) {
    savedSnapshot = snapshot;
  });


  // onclick to add employee
  $("#addTrain").on("click", function() {
  count++;
  // Save new value to Firebase
  database.ref('/trains/counter').set({
    count: count
  });
  var data = {
    name : $('#name').val().trim(),
    dest : $('#dest').val().trim(),
    freq : $('#freq').val().trim(),
    arrivalTime : $('#arrivalTime').val().trim(),
    id : count,
    timestamp : firebase.database.ServerValue.TIMESTAMP
  };

  // Code for handling the push
  database.ref('/trains').push({data});

  // Don't refresh the page!
  return false;
  });



  function display2(childSnapshot) {
    //count++;
    if(childSnapshot.val().count === undefined) {
      id = childSnapshot.val().data.id;
      var row = $('<tr id="emp' + id + '">');
      name = childSnapshot.val().data.name;
      dest = childSnapshot.val().data.dest;
      
      firstTime = childSnapshot.val().data.arrivalTime;
      tFrequency = childSnapshot.val().data.freq;


    //calculateTime(arrivalTime, freq, id, 'I');
    var firstTimeConverted = moment(firstTime,"hh:mm").subtract(1, "years");
    //console.log(firstTimeConverted);

    // Current Time
    var currentTime = moment();
    //console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    //console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % tFrequency;
   // console.log(tRemainder);

    // Minute Until Train
    var tMinutesTillTrain = tFrequency - tRemainder;
    //console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    //console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));
    
    row.append( $('<td id="name' + id + '">').html(childSnapshot.val().data.name));
    row.append( $('<td id="dest' + id + '">').html(childSnapshot.val().data.dest));
    row.append( $('<td id="freq' + id + '">').html(childSnapshot.val().data.freq));
    row.append( $('<td id="nextArr' + id + '">').html(nextTrain.format("hh:mm a")));
    row.append( $('<td id="minsAway' + id + '">').html(tMinutesTillTrain));

    $("#employeeTable").append(row);
  }
}



function displayError(error) {
	console.log(error);
}

  //Firebase watcher + initial loader HINT: .on("value")
  database.ref('/trains').orderByChild("timestamp").on("child_added", display2, displayError);
