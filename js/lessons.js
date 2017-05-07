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



$("#editorBar.toolButtons.collapse").click(function(){
        alert("Editor collapse button pressed");
});

$("#lessonBar.toolButtons.collapse").click(function(){
        alert("Lessons collapse button pressed");
});

$("#lessons_open").click(function(){
    alert("open lessons");
});

$("#menu_open").click(function(){
    alert("open lessons");
});

$("#editor_open").click(function(){
    alert("open editor");
});
