function deleteRow(r) {
  var i = r.parentNode.parentNode.rowIndex;
  document.getElementById("data_table").deleteRow(i);
}


function myFunction() {
//   var new_name=document.getElementById("new_name").value;
//  var new_country=document.getElementById("new_country").value;
//  var new_age=document.getElementById("new_age").value;
 let table=document.getElementById("data_table");
 var table_len=1;
 
 
 var row = table.insertRow(table_len).outerHTML="<tr id='demo'><td><input type='text' id='new_name' required></td><td><input type='text' id='new_country'></td><td><input type='text' id='new_age'></td><td><div type='button' class='addrow' onclick='addRow()'><i class='material-icons'>&#xE03B;</i></div></td></tr>";
//  document.getElementById("new_name").value="";
//  document.getElementById("new_country").value="";
//  document.getElementById("new_age").value="";
}

function addRow(){
    var new_name;
 var new_country;
 var new_age;
 new_name=document.getElementById("new_name").value;
 new_country=document.getElementById("new_country").value;
 new_age=document.getElementById("new_age").value;


	
 let table=document.getElementById("data_table");
 table_len=(table.rows.length);
 row = table.insertRow(table_len).outerHTML="<tr id='row"+table_len+"'><td id='name_row"+table_len+"'>"+new_name+"<span type='button' id='edit_button1"+ table_len+"' value='Edit' class='edit' onclick='edit_row_cell1("+ table_len +")'><i class='material-icons'>&#xE254;</i></span><span type='button' id='save_button1"+table_len+"' value='Save' class='save' onclick='save_row_cell1(" + table_len + ")'><i class='material-icons'>&#xE03B;</i></span></td><td id='country_row" + table_len + "'>"+new_country+"<span type='button' id='edit_button2"+ table_len+"' value='Edit' class='edit' onclick='edit_row_cell2("+ table_len +")'><i class='material-icons'>&#xE254;</i></span><span type='button' id='save_button2"+table_len+"' value='Save' class='save' onclick='save_row_cell2(" + table_len + ")'><i class='material-icons'>&#xE03B;</i></span></td><td id='age_row"+table_len+"'>"+new_age+
  "<span type='button' id='edit_button3"+ table_len+"' value='Edit' class='edit' onclick='edit_row_cell3("+ table_len +")'><i class='material-icons'>&#xE254;</i></span><span type='button' id='save_button3" +table_len+"' value='Save' class='save' onclick='save_row_cell3(" + table_len + ")'><i class='material-icons'>&#xE03B;</i></span></td><td><div type='button' onclick='deleteRow(this)'><i class='material-icons'>&#xE872;</i></div></td></tr>";
 document.getElementById("new_name").value="";
 document.getElementById("new_country").value="";
 document.getElementById("new_age").value="";
 document.getElementById("data_table").deleteRow(1);
}

function edit_row_cell1(no)
{
 document.getElementById("edit_button1"+no).style.display="none";
 document.getElementById("save_button1"+no).style.display="flex";
	
 
 document.getElementById("name_row"+no).contentEditable=true;
}

function save_row_cell1(no)
{
 document.getElementById("name_row"+no).contentEditable=false;

 document.getElementById("edit_button1"+no).style.display="block";
 document.getElementById("save_button1"+no).style.display="none";
}

function edit_row_cell2(no)
{
 document.getElementById("edit_button2"+no).style.display="none";
 document.getElementById("save_button2"+no).style.display="block";
	
 
 document.getElementById("country_row"+no).contentEditable=true;
}

function save_row_cell2(no)
{
 
 document.getElementById("country_row"+no).contentEditable=false;

 document.getElementById("edit_button2"+no).style.display="block";
 document.getElementById("save_button2"+no).style.display="none";
}

function edit_row_cell3(no)
{
 document.getElementById("edit_button3"+no).style.display="none";
 document.getElementById("save_button3"+no).style.display="block";
	
 
 document.getElementById("age_row"+no).contentEditable=true;
}

function save_row_cell3(no)
{
 
 document.getElementById("age_row"+no).contentEditable=false;

 document.getElementById("edit_button3"+no).style.display="block";
 document.getElementById("save_button3"+no).style.display="none";
}