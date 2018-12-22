

var link = " ";
function  imageOfDay() 
{
  
  getApi(1);
  startWebRequest(link, function(status, type, content) {
    
  var x = content;
  var startIndexD = x.indexOf("date")+7;
  var endIndexD = x.indexOf("explanation")-3;
  setText("label1", "Date: " + x.substring(startIndexD, endIndexD));
  
  if(x.length == 0)
  {
    setText("outputTextArea", "error");
  }
  else
  {
    var startIndexT = x.indexOf("explanation")+14;
    var correctedString = x.substring(startIndexT,x.length-1)  
    var endIndexT = correctedString.indexOf("hdurl")-4;
    setText("outputTextArea", correctedString.substring(0, endIndexT) + ".");
  }
  var correctedStringImage = x.substring(x.indexOf("service_version"))
  var startIndexI = correctedStringImage.indexOf('"url":')+7;
  var endIndexI = correctedStringImage.indexOf(".jpg")+4;
  setImageURL("outputImage", correctedStringImage.substring(startIndexI,endIndexI));
  //setText("outputTextArea",correctedStringImage.substring(startIndexI,endIndexI));
  
  
  var startIndexT = x.indexOf("title") + 8;
  var newString = x.substring(startIndexT, x.length-1);
  var endIndexT = newString.indexOf(",")
  setText("titleLabel",newString.substring(1, endIndexT-1));
  loading();
  });
}

function getApi(typeRequest, inputValue1, inputValue2)
{
  if(typeRequest == 1)
  {
    link = "https://api.nasa.gov/planetary/apod?api_key=jBzGCcTvPiEzd2UXhkfQGmLvuULM6YpoJ4nAKEKb"
  }
  else if(typeRequest == 2)
  {
    link = ("https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?earth_date=" + inputValue1 + "&api_key=jBzGCcTvPiEzd2UXhkfQGmLvuULM6YpoJ4nAKEKb");
  }
  else if(typeRequest == 3)
  {
    link = ("https://api.nasa.gov/neo/rest/v1/feed?start_date=" + inputValue1 + "&end_date=" +  inputValue2 + "&api_key=jBzGCcTvPiEzd2UXhkfQGmLvuULM6YpoJ4nAKEKb");
  }
}


function loading()
{
  setScreen("loadingScreen");
  
}
var errorRS = true;
var inputDay = 0;
var roverPics = [""];
var currentView = 0;
var arrayLength = 0;
function getRoverPics(inputValue)
{
  errorRS = false;
  getApi(2, inputValue);
  startWebRequest(link, function(status, type, content) {
  var index = 0;
  var picNumber = 0;
  var updatedString = content;

    while(index < updatedString.length)
      {
        updatedString = updatedString.substring(index, content.length-1);
        var picStart = updatedString.indexOf("img_src")+10;
        var picEnd = updatedString.indexOf("earth_date");
        if(picNumber == 0)
        {
          removeItem(roverPics, 0);
          
        }
        if(picStart != -1 && picEnd != -1)
        {
          insertItem(roverPics,picNumber,updatedString.substring(picStart,picEnd-3));
          picNumber++;
          index = picEnd+12;
         
        }
        else
        {
  
          index = content.length;
          arrayLength = picNumber + 1;
        }
      }


  if(content.length == 0)
  {
    errorRS = true;
  }
  
  });
}
function prev() {
  currentView--;
  if(currentView < 0)
  {
    currentView = roverPics.length-1
  }
  update();
}  
function next() {
  currentView++;
  if(currentView>= roverPics.length)
  {
    currentView = 0;
  }
  update();
}

function update() {
  setImageURL("roverPics", roverPics[currentView]);
  setText("indexLabel",currentView+1 + "of" + roverPics.length);
  if(currentView>= roverPics.length)
  {
    currentView = 0;
  }
  else if(currentView < 0)
  {
    currentView = roverPics.length-1
  }
}


onEvent("startI", "click", function(event) {
  console.log("startButton clicked!");
  imageOfDay();
  loading();
  setTimeout(function() {
    setScreen("dScreen")
  }, 750);
});

onEvent("homeI", "click", function(event) {
  console.log("startButton clicked!");
  setScreen("homeScreen");
});
onEvent("otherBtn", "click", function(event) {
  console.log("startButton clicked!");
  setScreen("selectDayScreen");
});
onEvent("arrowNextRSButton", "click", function(event) {
  console.log("arrowNextRSButton clicked!");
  inputDay = getText("dayinputArea");
  if(inputDay.length != 0)
  {
    getRoverPics(inputDay);
    loading();
    setTimeout(function() {
      setScreen("roverScreen");
    }, 750);
    update();
    showElement("strtBtnRS");
  }
  
  else
  {
    setScreen("errorScreen");
  }
  
});

onEvent("strtBtnRS", "click", function(event) {
  console.log("strtBtn clicked!");
  hideElement("strtBtnRS")
  showElement("lastBtn");
  showElement("nextBtn");
  showElement("indexLabel");
  showElement("roverPics");
  hideElement("labelErrorRS");
  update();
  if(roverPics.length== 0)
  {
    showElement("labelErrorRS");
    hideElement("lastBtn");
    hideElement("nextBtn");
    hideElement("indexLabel");
    hideElement("roverPics");
  }
  
});

onEvent("lastBtn", "click", function(event) {
  console.log("lastBtn clicked!");
  prev();
});
onEvent("nextBtn", "click", function(event) {
  console.log("nextBtn clicked!");
  setImageURL("roverPics","https://zagerguitar.com/wp-content/uploads/2015/12/blue_loading.gif");
 setTimeout(function() {
    next();
  }, 20);
   
});

onEvent("backBtnToSD", "click", function(event) {
  console.log("backBtnToSD clicked!");
  setScreen("selectDayScreen");
  showElement("strtBtnRS")
  hideElement("roverPics");
  hideElement("lastBtn");
  hideElement("nextBtn");
  hideElement("indexLabel");
  hideElement("roverPics");
  hideElement("labelErrorRS");
  while(roverPics.length > 0)
  {
    i = roverPics.length-1;
    removeItem(roverPics,i);
  }
  currentView = 0;
  update();
});


onEvent("homefromRSBtn", "click", function(event) {
  console.log("homefromRSBtn clicked!");
  setScreen("homeScreen");
});
onEvent("homeBtnFromSelectDay", "click", function(event) {
  console.log("homeBtnFromSelectDay clicked!");
  setScreen("homeScreen");
});
onEvent("asteroidBtn", "click", function(event) {
  console.log("asteroidBtn clicked!");
  setScreen("FindAsteroidScreen");
});
var startDate = "";
var endDate = "";
function getAsteroidData()
{
  getAsteroidInput();
  getApi(3, "2015-09-07","2015-09-08");
  
  
}

function getAsteroidInput()
{
  startDate = getText("startDateInput");
  endDate = getText("endDateInput");
  getApi(3,startDate,endDate);
  startWebRequest(link, function(status, type, content) {
  idIndex = content.indexOf("neo_reference_id")
  content = shortenString(content,idIndex);
  setText("asteroidID","ID:" + content.substring(19,26));
  content = shortenString(content,28);
  idNameIndexStart = content.indexOf("(");
  idNameIndexEnd = content.indexOf(")");
  setText("asteroidName","Name: " + content.substring(idNameIndexStart + 1,idNameIndexEnd));
  shortenString(content, content.indexOf("feet"));
  setText("diamterMin","Min Diameter: " + content.substring(content.indexOf("estimated_diameter_min")+24,content.indexOf("estimated_diameter_max")-8) + " feet");
  setText("diameterMax", " Max Diameter: " + content.substring(content.indexOf("estimated_diameter_max")+ 24,content.indexOf("}")-6) + " feet")
  content = shortenString(content,content.indexOf("is_potentially_hazardous_asteroid"));
  setText("hazardous", "Hazardous? " + content.substring(35,content.indexOf("close_approach_data")-2));
  
    
  });
}

function shortenString(stringInput, index)
{
  stringInput = stringInput.substring(index);
  return stringInput;
}
onEvent("submitBtn", "click", function(event) {
  console.log("submitBtn clicked!");
  getAsteroidInput();
  loading();
  setTimeout(function() {
  setScreen("displayAsteroidScreen");
  }, 750);

});
onEvent("backBtnFromDisplayAsteroid", "click", function(event) {
  console.log("backBtnFromDisplayAsteroid clicked!");
  setScreen("FindAsteroidScreen");
});
onEvent("homeBtnFromDisplayAsteroid", "click", function(event) {
  console.log("homeBtnFromDisplayAsteroid clicked!");
  setScreen("homeScreen");
});
