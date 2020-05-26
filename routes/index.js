var express = require('express');
var router = express.Router();

// our constructor
function Game(gName, gPrice, gCount,gDesc) {
  this.GName= gName;
  this.GPrice = gPrice;
  this.GCount=gCount
  this.GDesc = gDesc;
}
function GameComment(Gname,comment)
{
  this.GName=Gname;
  this.Comment=comment;
}

ServerGames = [];
ServerGamesComments = [];
// save typing time, make up 3 for testing
ServerGames.push(new Game("GTR","$10" ,3,"Dirve Game"));
ServerGames.push(new Game("CSGO",'$30',2, "biu biu biu"));
ServerGames.push(new Game("QQGame", "$5",1," Crad Game"));

ServerGamesComments.push(new GameComment("GTR","Nice Game"));
ServerGamesComments.push(new GameComment("CSGO","just ok"));
ServerGamesComments.push(new GameComment("QQGame", "boring"));

/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });
  res.sendFile('index.html');
});

/* GET All Notes data */
router.get('/getAllGames', function(req, res) {
  res.status(200).json(ServerGames);
});
router.get('/Comments', function(req, res) {
  const gName=document.getElementById("hideName").innerHTML;
  alert(gName);
  for(var i = 0; i < ServerGamesComments.length; i++) // find the match
  {
    if(ServerGamesComments[i].GName === gName)
      {
        document.getElementById("onecGName").innerHTML =ServerGamesComments[i].GName;
          document.getElementById("onecComment").innerHTML =ServerGamesComments[i].Comment;
          break;
      }
  }
  res.status(200).json(ServerGames);
});


/* Add one new note */
router.post('/AddGame', function(req, res) {
  const newGame = req.body;
  ServerGames.push(newGame);
  res.status(200).json(newGame);
});


router.delete('/DeleteNote/:GName', (req, res) => {
  const gName = req.params.GName;
  let found = false;
  console.log(gName);    

  for(var i = 0; i < ServerGames.length; i++) // find the match
  {
      if(ServerGames[i].GName === gName){
        ServerGames.splice(i,1);  // remove object from array
          found = true;
          break;
      }
  }

  if (!found) {
    console.log("not found");
    return res.status(500).json({
      status: "error"
    });
  } else {
  res.send('Game ' + GName + ' deleted!');
  }
});

module.exports = router;
