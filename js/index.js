  var config = {
    apiKey: "AIzaSyDCKr77iFVQAP_3LBq1yWhhO6bB-y0iWZw",
    authDomain: "balloon-659f1.firebaseapp.com",
    databaseURL: "https://balloon-659f1.firebaseio.com",
    storageBucket: "balloon-659f1.appspot.com",
    messagingSenderId: "354031064986"
  };
  firebase.initializeApp(config);

$("#displayRetrieve").hide();
$("#displaySubmit").hide();

(function()
{   
    $("#upload").click(function(){ 
        $("#displayOutput").empty()
        $("#submitInput").show();
        $("#textInput").val("");
        document.getElementById("fileInput").files[0] = null;
        $("#upload").hide();
        $("#retrieve").show();
        $("#displaySubmit").show();
        $("#displayRetrieve").hide();
    });
    
    $("#retrieve").click(function()
    {   
        $("#retrieveOutput").empty();
        $("#retrieveInput").show();
        $("#keyInput").val("");
        $("#retrieve").hide();
        $("#upload").show();
        $("#displayRetrieve").show();
        $("#displaySubmit").hide();
        
    });
    
    $("#submit").click(function()
    {   
        $("#submitInput").hide();
        var key;
        if(document.getElementById("fileInput").files[0] == null){
            key = makeid();
            uploadText(key,$("#textInput").val());
            
        }
        if($("#textInput").val() == ""){
            key = makeid();
            uploadFile(key,document.getElementById("fileInput").files[0]);
        }
        $("#displayOutput").append(
                        '<p align="center"> Your retrieval key is: ' + key + '<p>'
        );   
    });
    $("#retrieveData").click(function()
    {   
        $("#retrieveInput").hide();
        var key = $("#keyInput").val();
        var data = retrieveData(key);
    });
})();

function makeid()
{
    var text = "";
    var possible = "abcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 7; i++ ){
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
}

function uploadText(key,input){
    var space = firebase.database().ref('balloons/' + key);
            space.update({
                    'object': input
            });
}

function uploadFile(key,input){
    console.log(input);
    var uploadTask = firebase.storage().ref('files/' + key).put(input);
        uploadTask.on('state_changed', function(snapshot){
        }, function(error) {
        }, function() {
            var img = uploadTask.snapshot.downloadURL;
            firebase.database().ref('balloons/' + key).update({
                'object':img
            });
        });
}

function retrieveData(key){
    var returnVal;
    var balloon = firebase.database().ref('balloons/' + key);   
    balloon.once('value').then(function(snapshot) 
    {
       if(!(snapshot.val().object).startsWith("https://")){
       $("#retrieveOutput").append(
                        '<img  src="images/RetrievedText.png" class="center"><p align="center">' + snapshot.val().object + '<p>'
        	        );
        } else {
            $("#retrieveOutput").append(
                        '<img  src="images/RetrievedFile.png" class="center"><p align="center"><a href="' + snapshot.val().object + '">Link to file</a><p>'
        	        );
        }
    });
}
