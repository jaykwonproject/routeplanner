var totalDistance = 0;
var totalDuration = 0;
var totalCalories = 0;
var totalMile = 0;
var walkingTime = 0;
var walkingCal = 0;
var joggingTime = 0;
var joggingCal =0;
var marr = [];
var ds;
var dr;
var mp;
var fin = 0;
var map2;
var UB = {lat: 43.0014, lng: -78.7894};
var controlUI;
var controlText
var opened =0;

function travelType() {
  if(document.getElementById("mySelect").selectedIndex==0){
    walkingTime = totalDuration;
    walkingCal = totalCalories;
    controlText.innerHTML  = "Total Distance: " + totalDistance + "m<br>Total Time: " + Math.trunc(walkingTime / 60) + "mins"+
    "<br>"+walkingCal.toFixed(0)+" Calories" 
  }
  else if(document.getElementById("mySelect").selectedIndex==1){
    joggingTime = totalDuration/1.6;
    joggingCal = totalCalories*1.5;
    controlText.innerHTML  = "Total Distance: " + totalDistance + "m<br>Total Time: " + Math.trunc(joggingTime / 60) + "mins"
    +"<br>"+joggingCal.toFixed(0)+" Calories" 
  }
}
function CenterControl(controlDiv, map) {

  controlUI = document.createElement("div");
  controlUI.style.backgroundColor = "#fff";
  controlUI.style.border = "2px solid #fff";
  controlUI.style.borderRadius = "3px";
  controlUI.style.boxShadow = "0 2px 6px rgba(0,0,0,.3)";
  controlUI.style.cursor = "pointer";
  controlUI.style.marginBottom = "1px";
  controlUI.style.textAlign = "center";
  controlUI.title = "Click to recenter the map";
  controlDiv.appendChild(controlUI);

  controlText = document.createElement("div");
  controlText.style.color = "rgb(25,25,25)";
  controlText.style.fontFamily = "Roboto,Arial,sans-serif";
  controlText.style.fontSize = "16px";
  controlText.style.lineHeight = "38px";
  controlText.style.paddingLeft = "5px";
  controlText.style.paddingRight = "5px";
  controlText.innerHTML = "";
  controlUI.appendChild(controlText);
  controlUI.addEventListener("click", () => {
    map.setCenter(UB);
  });
}


function initMap() {
var lat = 0;
var lon = 0;
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
    lat = position.coords.latitude
    lon = position.coords.longitude
    var UB = {lat: 43.0014, lng: -78.7894};
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;
    ds = directionsService; dr = directionsDisplay;
    directionsDisplay.setMap(map);
    var map = new google.maps.Map(
      document.getElementById('map'), {zoom: 15, center: UB});
      mp = map;

      const centerControlDiv = document.createElement("div");
  CenterControl(centerControlDiv, map);
  map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(centerControlDiv);

    google.maps.event.addListener(map, 'click', function(e) {
      if(fin==0){
        console.log(e.latLng.lat()+' '+e.latLng.lng());
      marr.push({lat:e.latLng.lat(),lng:e.latLng.lng()});
      placeMarker(e.latLng, map);
      if(marr.length>=2){
        calr(directionsService, directionsDisplay) 
      }
      }else{
        alert("FINISHED!")
      }
    });
    
    function calr(directionsService) {
      var request0 = {
        origin: new google.maps.LatLng(marr[marr.length - 2].lat, marr[marr.length - 2].lng),
        destination: new google.maps.LatLng(marr[marr.length - 1].lat, marr[marr.length - 1].lng),
        travelMode: google.maps.TravelMode.WALKING  
      };
      directionsService.route(request0, function (result, status) {
        if (status == google.maps.DirectionsStatus.OK) {
          var legs = result.routes[0].legs;
          for (var i = 0; i < legs.length; ++i) {
            totalDistance += legs[i].distance.value;
            totalDuration += legs[i].duration.value;
          }
           totalCalories =  ((totalDistance*0.000621371)/1)*100
           
         
          controlText.innerHTML  = "Total Distance: " + totalDistance + "m<br>Total Time: " + Math.trunc(totalDuration / 60) + "mins"
          +"<br>"+totalCalories.toFixed(0)+" Calories" 
          var renderer = new google.maps.DirectionsRenderer({
            polylineOptions: {
              strokeColor: "#C71585",
              strokeWeight: 4,
            },
            suppressMarkers: true,
            preserveViewport: true,
            map: map
          });
          renderer.setDirections(result);
        } else
          console.log("status=" + status);
      });
     
    }
    

    function placeMarker(position, map) {
       marker = new google.maps.Marker({
        position: position,
        map: map,
        label:marr.length.toString()
      }); 
    }

  });
  }else{
    alert("Please allow GPS permission")
  }
}

function gobr(directionsService, directionsDisplay) {
  var color           = '';
  var characters       = 'ABCDEF0123456789';
  for ( var i = 0; i < 6; i++ ) {
     color += characters.charAt(Math.floor(Math.random() * 6));
  }
  var request0 = {
    origin:  new google.maps.LatLng(marr[marr.length-1].lat,marr[marr.length-1].lng),
    destination: new google.maps.LatLng(marr[0].lat,marr[0].lng),
    travelMode: google.maps.TravelMode.WALKING
  };
directionsService.route(request0, function(result, status) {
if(status == google.maps.DirectionsStatus.OK){
var legs = result.routes[0].legs;
for(var i=0; i<legs.length; ++i) {
  totalDistance += legs[i].distance.value;
  totalDuration += legs[i].duration.value;
}
totalCalories =  ((totalDistance*0.000621371)/1)*100
controlText.innerHTML  = "Total Distance: " + totalDistance + "m<br>Total Time: " + Math.trunc(totalDuration / 60) + "mins"
+"<br>"+totalCalories.toFixed(0)+" Calories"

  var renderer = new google.maps.DirectionsRenderer({
    polylineOptions: {
      strokeColor: "#C71585"
    },
    preserveViewport: true,
    suppressMarkers: true,
    map: mp
  });
  renderer.setDirections(result);
} else
  console.log("status=" + status);
});
}

function chi(){
  fin = 1;
  gobr(ds,dr);
}



function login(){
  document.getElementById("login").style.transform="scale(1)"
  document.getElementById("overlay").style.transform="scale(1)"
}
function signup(){
  document.getElementById("signup").style.transform="scale(1)"
}
function exitPopup(){
  document.getElementById("login").style.transform="scale(0)"
  document.getElementById("signup").style.transform="scale(0)"
  document.getElementById("overlay").style.transform="scale(0)"
  document.getElementById("logout").style.transform="scale(0)"
  document.getElementById("postForum").style.transform="scale(0)"
  document.getElementById("savePopup").style.transform="scale(0)"
}
function logOut(){
  document.getElementById("logout").style.transform="scale(1)"
}
function userSignup(){
  const email = document.getElementById("singunpName").value
  const password = document.getElementById("signupPassword").value
  const nickname = document.getElementById("nickname").value
  firebase.auth().createUserWithEmailAndPassword(email, password).then(function(value) {

    alert("successfully signed up")
    firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).set({
      username: nickname,
    })
    .catch(function(error) {
      console.error("Error writing document: ", error);
     });

    document.getElementById("singunpName").value = ""
    document.getElementById("signupPassword").value = ""
    document.getElementById("nickname").value =" "
    exitPopup()
  }).catch(function(error) {
        alert("sign up fail")
    });

   
}
function userLogin(){
  const email = document.getElementById("username").value
  const password = document.getElementById("password").value
  firebase.auth().signInWithEmailAndPassword(email, password).then(function(value) {
    alert("Logged in")
    firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).get().then(function(doc) {
      document.getElementById("loginpage").innerHTML = doc.get('username')
    }).catch(function(error) {
      console.log("Error getting document:", error);
    });
    document.getElementById("username").value = ""
    document.getElementById("password").value = ""  
    document.getElementById('loginpage').removeAttribute("onclick")
    document.getElementById('loginpage').setAttribute("onclick", "logOut()")
    exitPopup()
    location.reload();
  }).catch(function(error) {
      alert("Log in fail")
    });
}
function signOut(){
  firebase.auth().signOut().then(function() {
    alert("successfully logged out")
    document.getElementById("loginpage").innerHTML = "login"
    document.getElementById('loginpage').removeAttribute("onclick")
    document.getElementById('loginpage').setAttribute("onclick", "login()")
    exitPopup()
  }).catch(function(error) {
    alert("log out fail")
  });
}
function Forum(){
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      document.getElementById("postForum").style.transform="scale(1)"
      document.getElementById("overlay").style.transform="scale(1)"
      if(opened==0){
        loadm();
      }
      opened = 1;
    } else {
      alert("Not Logged In")
    }
    });

 

}
var i=0;
function addelement() {
        i+=1;
        var l = '<div id="map'+i+'" style="width: 80%;height: 500px;margin-left: auto;margin-right: auto;border:2px solid black"> </div>';
        var ht = $.parseHTML(l);
        var con = $('#thelist');
        con.append(ht);
        var map = new google.maps.Map(document.getElementById('map'+i), {zoom: 15, center: UB});
}


var maparr=[];
var mapss=[];
function loadm(){
  firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).collection('routes').get().then(function(snap){
    snap.forEach(it=>{
      maparr.push(it.data());
    })
    for(var j=0;j<maparr.length;j++){
        i+=1;
        var l = '<div id="map'+i+'" style="width: 80%;height: 500px;margin-left: auto;margin-right: auto;border:2px solid black"> </div>';
        var ht = $.parseHTML(l);
        var con = $('#thelist');
        con.append(ht);
        var mapobj = new google.maps.Map(document.getElementById('map'+i), {zoom: 15, center: UB});
        mapss.push(mapobj);
    }
    for(var x=0;x<maparr.length;x++){
      for(var y=0;y<maparr[x].marker.length;y++){
        remark({lat:maparr[x].marker[y].lat,lng:maparr[x].marker[y].lng},mapss[x],y)
        if(y+1!==maparr[x].marker.length){
          gobr2(ds,dr,mapss[x],maparr[x].marker,y);
        }
        if(y+1==maparr[x].marker.length){
          gobr3(ds,dr,mapss[x],maparr[x].marker,y);
        }
      }
    }
  })
}

function remark(position, map,ind) {
  marker = new google.maps.Marker({
   position: position,
   map: map,
   label:(ind+1).toString()
 }); 
}

function gobr2(directionsService, directionsDisplay,mapobj,marks,ind) {
  var color           = '';
  var characters       = 'ABCDEF0123456789';
  for ( var i = 0; i < 6; i++ ) {
     color += characters.charAt(Math.floor(Math.random() * 6));
  }
  var request0 = {
    origin:  new google.maps.LatLng(marks[ind].lat,marks[ind].lng),
    destination: new google.maps.LatLng(marks[ind+1].lat,marks[ind+1].lng),
    travelMode: google.maps.TravelMode.WALKING
  };
directionsService.route(request0, function(result, status) {
if(status == google.maps.DirectionsStatus.OK){
var legs = result.routes[0].legs;
for(var i=0; i<legs.length; ++i) {
  totalDistance += legs[i].distance.value;
  totalDuration += legs[i].duration.value;
}
  var renderer = new google.maps.DirectionsRenderer({
    polylineOptions: {
      strokeColor: "#C71585"
    },
    preserveViewport: true,
    suppressMarkers: true,
    map: mapobj
  });
  renderer.setDirections(result);
} else
  console.log("status=" + status);
});
}
function gobr3(directionsService, directionsDisplay,mapobj,marks,ind) {
  var color           = '';
  var characters       = 'ABCDEF0123456789';
  for ( var i = 0; i < 6; i++ ) {
     color += characters.charAt(Math.floor(Math.random() * 6));
  }
  var request0 = {
    origin:  new google.maps.LatLng(marks[ind].lat,marks[ind].lng),
    destination: new google.maps.LatLng(marks[0].lat,marks[0].lng),
    travelMode: google.maps.TravelMode.WALKING
  };
directionsService.route(request0, function(result, status) {
if(status == google.maps.DirectionsStatus.OK){
var legs = result.routes[0].legs;
for(var i=0; i<legs.length; ++i) {
  totalDistance += legs[i].distance.value;
  totalDuration += legs[i].duration.value;
}
  var renderer = new google.maps.DirectionsRenderer({
    polylineOptions: {
      strokeColor: "#C71585"
    },
    preserveViewport: true,
    suppressMarkers: true,
    map: mapobj
  });
  renderer.setDirections(result);
} else
  console.log("status=" + status);
});
}
function save(){
  document.getElementById("savePopup").style.transform="scale(1)"
}

function saveRoute(){


  var link ="https://maps.googleapis.com/maps/api/staticmap?center=43.0014,-78.7894&zoom=15&size=600x300&maptype=roadmap&markers="

  var ms = "";

  var ps = "&path=color:0x0000ff|weight:5";

  var fi = "&key=AIzaSyBiQShUsVBUWvgaHHSHS1diWf4Be5LNH14";

  for(var i=0;i<marr.length;i++){
    ms+="&markers=color:red%7Clabel:"+(i+1)+"%7C"+marr[i].lat+','+marr[i].lng;
    ps+="|"+marr[i].lat+","+marr[i].lng;
  }
  link += ms+ps+fi;


  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      if(marr.length!=0){
        var ke =firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).collection("routes").doc();
        var key = ke.id;
          ke.set({
          time: firebase.firestore.FieldValue.serverTimestamp(),
          marker: marr,
          link:link,
          key:key
        })
        .catch(function(error) {
          console.error("Error writing document: ", error);
         });
         alert("Saved!")
         exitPopup()
      }
      else{
        alert("There is no route to save")
      }
    } else {
      alert("Not Logged In")
    }
    });

    

}