// Starts off with start.txt
$.get('js/text_files/start.txt', function(results){
    $("#consoleText").empty();
    $("#consoleText").html(results);
});

// Files are numbered 1-n, so initializing with 0 will make the first file 1
var numberOfFiles = 8;
var currentText = 0;

// Get txt file
function getText(index) {
    if(index > numberOfFiles) {
        index = 1;
    }
    if(index < 1) {
        index = numberOfFiles;   
    }
    currentText = index;
    $("#consoleText").empty();
    $.get('js/text_files/' + index + '.txt', function(text){
        $("#consoleText").html(text);
    });
}

$("#next").on("click", function(){
    currentText++;
    getText(currentText)
});

$("#prev").on("click", function(){
    currentText--;
    getText(currentText);
});

$("#run").on("click", function(){
    eval( editor.getValue() + editor2.getValue() );
});


var wasDocked;
$("#closeE").button().click(function(){
    if( $("#editorWrap").hasClass("docked") ){
        $("#editorWrap").removeClass("docked");
        $("#game_wrap").css("width", "calc(100%)");
        wasDocked = true;       
    }
        $("#editorWrap").hide();
});

$("#closeL").button().click(function(){
        $("#lessons").hide();
});

$("#lessons_open").click(function(){
    $("#lessons").show();
});

$("#menu_open").click(function(){
    alert("open main menu");
});

$("#editor_open").click(function(){
    if(wasDocked){
        $("#editorWrap").addClass("docked");
        $("#game_wrap").css("width", "calc(100% - 400px)");
        wasDocked = false;
    }
    $("#editorWrap").show();
});

setInterval(function() {
  $("#lessons").css({"font-size": "1.925vmax"})
  $("#editorWrap").css({"font-size": "1.925vmax"})
}, 15);
