
//Our note class we need it because of Record and PlayRecord functions.
class Note {
  constructor(note, ms) {
    this.note = note;
    this.ms = ms;
  }
}

// We need this class because of PlaySelectedSong function.
class Song {
  constructor(songName, song) {
    this.songName = songName;
    this.song = song;
  }
}


var notes = [];
var rotateList = [];

//Fill list with notes at the beginning of the program.
function fillNotesList() {
  for (let i = 0; i < 1; i++) {
    notes.push(document.getElementById(i));
  }
}

fillNotesList();

//Fill tremble list with rotates at the beginning of the program.
function fillRotateList() {
  var frequency = 1;
  for (let i = 0; i < 40; i++) {
    rotateList.push("rotate(" + frequency + "deg)");
    rotateList.push("rotate(-" + frequency + "deg)");
    frequency -= 0.024; // The rotate is running by decreasing.
  }
}

fillRotateList();

var trembleList = { transform: rotateList };


//When we press the string we call this function.
function Play(note) {
  var audio = document.getElementById(note); //We get the audio by the given value. The value is between 0 to 77. all numbers define a note.
  ClearStringSounds(note); // We pause all sound on the string that we press.
  if (audio != null) {
    audio.currentTime = 0; // If we press the same place we restart the audio
    audio.play();
    StringTremble(note);//And when we play sound we tremble the string.
  }
}

function StringTremble(note) {
  var column = (note / 6);
  var row = note % 6;
  // We get our strings.
  var animatedString = document.getElementById("sT" + row);
  var realString = document.getElementById("s" + row);
  // Arrange their width according to the column that the user press.
  animatedString.style.width = 100 - Math.trunc(column) * 7 + "%";
  realString.style.width = Math.trunc(column) * 7 + "%";
  // move animatedString to the end of real string
  animatedString.style.marginLeft = Math.trunc(column) * 7 + ".4%";
  // tremble the string.
  animatedString.animate(trembleList, 2500);
}


//This function waits according to the given ms.
function Wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// The list that we recording in to.
var record = []
// The list that hold records.
var SongList = [];

// Play the song according to the given song.
async function PlaySong(song) {
  for (let i = 0; i < song.length; i++) {
    await Wait(song[i].ms);        // We wait according to ms of record
    if (song.length != 0 && stopSong == 0) {        // If the record is not empty
      SlideTheBar(song.length, i);
      Play(song[i].note);          // We play the note that recorded
      console.log(song[i].note, song[i].ms);
    }
    else {
      console.log("Record is empty or The StopSong worked")
      stopSong = 0;
      break;
    }
  }
}

var stopSong = 0;
function StopSong() {
  var slider = document.getElementById("Slider");
  stopSong = 1;
  slider.value = 0;
}


var isRecording = 0;
var time1;
var titleCount = 0;
//When we press the record button this function called.
function Record() {
  //This function just makes the global variable "isRecording" to 1 or 0 and global variable "time1" equals to dateNow.
  if (isRecording == 0) {
    record = [];
    time1 = Date.now();
    isRecording = 1;
    RecordAnimation();
  }
  else {
    //We add the record to the recordList and the comboBox with name that user give us.
    var selectTag = document.getElementById("songs");
    var option = document.createElement("option");
    var songName = prompt("Please Name Your Song");

    SongList.forEach(element => {
      if (element.songName == songName) {
        alert("This song name has already given.");
        songName = "";
      }
    });

    if (songName == null || songName == "") {
      songName = "Untitled" + titleCount;
      titleCount++;
    }
    option.text = songName;
    selectTag.add(option);
    song = new Song(songName, record);
    SongList.push(song);
    isRecording = 0
    RecordAnimation();
    selectTag.selectedIndex = selectTag.length - 1; // We choose the last added.
  }
  console.log(isRecording);
}

// When we press the play button this function called.
function PlaySelectedSong() {
  var songs = document.getElementById("songs"); // We get comboBox
  var songName = songs.options[songs.selectedIndex].value; // We get the selected song's name.
  console.log(songName);
  for (let i = 0; i < SongList.length; i++) {
    if (SongList[i].songName == songName) {  // We find the song from the SongList
      PlaySong(SongList[i].song);  // And give it to the PlaySong Function.
    }
  }
}

// When we press the record this function calls.
function RecordAnimation() {
  var recordSpan = document.getElementById("recordSpan");
  if (isRecording == 1) {  // until the record is finished the animation goes.
    colorList = ["red", "white", "red"];
    recordSpan.animate({ background: colorList }, { duration: 5000, iterations: Infinity });
  }
  else { // When it's finished we remove the span and we create it again due to finish the animation.
    recordSpan.remove();
    var x = document.createElement("SPAN");
    var recordButton = document.getElementById("RecordButton");
    x.setAttribute("id", "recordSpan");
    x.setAttribute("class", "Record");
    recordButton.appendChild(x);
  }
}

// We call this function in PlaySong.
function SlideTheBar(max, current) {
  var slider = document.getElementById("Slider");
  slider.max = max;  // We set max value.
  slider.value = current + 1;  // And we move the slider.
}

function ClearStringSounds(note) {
  var string = note % 6; // We get the string
  for (let i = string; i < 60; i += 6) {  // And we get all sounds on that string
    if (i != note) {  //except the sound that we press we pause all of it.
      var audio = document.getElementById(i);
      audio.pause();
    }
  }
}

window.onclick = e => {
  if (e.target.tagName == "SPAN") { //if we press a note that means a span
    console.log(e.target.innerText);
    Play(e.target.innerText);       // call the play function.
    if (isRecording == 1) {         // And if we are recording
      let time2 = Date.now();       //we take the time.
      console.log(time2 - time1);
      note = new Note(Number(e.target.innerText), time2 - time1); //We create a note with pressed note and time between 2 note.
      record.push(note);         // we add the note to the record list.
      time1 = Date.now();        // we update the global variable time1.
    }
  }
}
