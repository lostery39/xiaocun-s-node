//1. - home, lists all your Notes
//2. - add, lets you add a Note
// 3. - lets you delete a note.

// define an array to hold our data.  Later this should be stored on the sever
Games = [];
function GameComment(Gname,comment)
{
  this.GName=Gname;
  this.Comment=comment;
}
ServerGamesComments = [];

ServerGamesComments.push(new GameComment("GTR","Nice Game"));
ServerGamesComments.push(new GameComment("CSGO","just ok"));
ServerGamesComments.push(new GameComment("QQGame", "boring"));


// Now comes the code that must wait to run until the document is fully loaded
document.addEventListener("DOMContentLoaded", function (event) {


    commentelement=document.getElementById("acoment");

    commentelement.addEventListener('click', function(){
        const gName=document.getElementById("hideName").innerHTML;
        for(var i = 0; i < ServerGamesComments.length; i++) // find the match
        {
          if(ServerGamesComments[i].GName === gName)
            {
              document.getElementById("onecGName").innerHTML =ServerGamesComments[i].GName;
                document.getElementById("onecComment").innerHTML =ServerGamesComments[i].Comment;
                break;
            }
        }
    });

    // update the li's on our homepage
    let listUl = document.getElementById("listUl");
    UpdateDisplay(listUl);  // call shared code with delete and home

    // sometimes you want data to be current as you switch from one page to another
    // to do that we get a DOM event  "pagebeforeshow"
  
    // this will refresh the data each time you navigate back to the Home page
    $(document).on('pagebeforeshow', '#Show', function () {
        let listUl = document.getElementById("listUl");
        UpdateDisplay(listUl);
    }
    );

    // this will refresh the data each time you navigate back to the Delete page
    $(document).on('pagebeforeshow', '#AddDelete', function () {
        let deleteListUl = document.getElementById("deleteListUl");
        UpdateDisplay(deleteListUl);   // call shared code with delete and home
        document.getElementById("deleteItem").value = "";  // clear this text box

        
     // this will clear the text boxes  each time you navigate back to the Add page
             document.getElementById("GName").value = ""; 
             document.getElementById("GPrice").value = ""; 
             document.getElementById("GCount").value = ""; 
             document.getElementById("GDesc").value = ""; 
    }
    );


// button event code

    $(document).on("pagebeforeshow", "#Details", function (event) {   // have to use jQuery 
        let localGName = document.getElementById("IDparmHere").innerHTML;  // read the vaule written bu the li event
     
        // use it as a key to find the correct array element
        for(let i=0; i < Games.length; i++) {  
            
            // had to encode the title string as items passed in URLs can't have plane spaces

            if( encodeURI(Games[i].GName) == localGName){
                document.getElementById("oneGName").innerHTML =  Games[i].GName;
                document.getElementById("oneGPrice").innerHTML =  Games[i].GPrice;
                document.getElementById("oneGCount").innerHTML =  Games[i].GCount;
                document.getElementById("oneGDesc").innerHTML =  Games[i].GDesc;
                break;
            }  
        }
    });

    // add a button event for adding new notes on Add page
    document.getElementById("newGame").addEventListener("click", function () {
        // use constructor, build new object and put it in array
        // Notes.push( new Note( document.getElementById("title").value, 
        // document.getElementById("detail").value,
        // document.getElementById("priority").value ) );
        let newGame = new Game( document.getElementById("GName").value, 
           document.getElementById("GPrice").value,
           document.getElementById("GCount").value,
           document.getElementById("GDesc").value ) ;

        $.ajax({
            url : "/AddGame",
            type: "POST",
            data: JSON.stringify(newGame),
            contentType: "application/json; charset=utf-8",
            dataType   : "json",
            success: function (result) {
                console.log(result);
                document.location.href = "index.html#Show";  // go to this page to show item was added
            }
        });
     });

     // add a button even for deleting a note on Delete page
     document.getElementById("delete").addEventListener("click", function () {
        let which = document.getElementById("deleteItem").value;

        $.ajax({
            type: "DELETE",
                url: "/DeleteNote/" +which,
                success: function(result){
                    console.log(result);
                    document.location.href = "index.html#Show";  // go to this page to show item was deleted
                },
                error: function (xhr, textStatus, errorThrown) {  
                    console.log('Error in Operation');  
                    alert("Server could not delete Note with title " + which)
                }  
            });

     });
 

});  // end of code that must wait for document to load before running


// our constructor
function Game(gName, gPrice, gCount,gDesc) {
    this.GName= gName;
    this.GPrice = gPrice;
    this.GCount=gCount
    this.GDesc = gDesc;
  }

// this function is shared by Home and Delete page to add li's to which ever ul is passed in
 function UpdateDisplay(whichElement) {

    $.get("/getAllGames", function(data, status){  // AJAX get
        Games = data;  // put the returned server json data into our local array
 //   });

    whichElement.innerHTML = "";

    
    // sort by priority
    Games.sort(function(a, b) {
        return (a.priority) - (b.priority);
    });
    Games.forEach(function(item, index) {   // build one li for each item in array
        var li = document.createElement('li');
        whichElement.appendChild(li);
        //li.innerHTML=li.innerHTML + ": " + " Priority: " + item.priority + "  " + item.title;

        var uriName = encodeURI(item.GName);
        li.innerHTML =  item.GName + "    " + item.GPrice+ "          " + item.GDesc +"    <a data-transition='pop' class='oneGame' data-parm=" + uriName + "  href='#Details'>Get Details </a> "
      // the li contains text for priority and title, then an embedded anchor to make the li be able to link to the Details page, plus an embedded data-parm value
    });   // end of forEach array 
    // that code WOULD jump us to the Details page, but it would not have written the hidden title into the page
    // so now we loop thru the li's and add an event for each one that does that.

     //set up an event for each new li item, if user clicks any, it writes >>that<< items data-parm into the hidden html 
     var classname = document.getElementsByClassName("oneGame");  // using css class to mark a collection of elements, or li's
     
     Array.from(classname).forEach(function (element) {
         element.addEventListener('click', function(){
             var parm = this.getAttribute("data-parm");  // passing in the note.title
             console.log(parm);
             document.getElementById("hideName").innerHTML = parm;
             document.getElementById("IDparmHere").innerHTML = parm;
             document.location.href = "index.html#Details";
         });
     });  // end of adding li events
});  // end of call $.get

}  // end of function




