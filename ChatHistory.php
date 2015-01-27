<?php
    require_once("../../../wp-load.php");

      $current_user = wp_get_current_user();
      $userName = $current_user->user_login;
      $userID = $current_user->ID; 
      $role = current_user_can("delete_posts")== 1? 1 : 0; 
      $avatar = get_avatar($userid,24);
      $row = $wpdb->get_row("SELECT * FROM user_chat_ban WHERE userName = 'steven'", ARRAY_N);     

      //get file name from path
      $file = $_SERVER['REQUEST_URI'];
      $file2 = explode("?r=",$file)[1];
      $file2 = $file2 . ".txt";
?>

<?php if ($row[1] == 1) {  ?>
<div>ERROR</div>
<?php }else{ ?>
<html lang="en">
    <head>
        <meta charset="utf-8" />
        <title>Stocks Over $1</title>
    </head>
    <body>
        <div>
            <iframe src="http://localhost:8080/?logRoom?<?php echo $file2?>" id="chatFrame" height=700px width=700px frameborder="0" name="targetframe"></iframe>
        </div>
    </body>
</html>
<?php } ?>

<script type="text/javascript">
    var deleteClass;
    var deleteID = [];
    var messageClass;
    var deleteDiv;
    
    deleteClass = document.getElementsByClassName("Deleted");
    messageClass = document.getElementsByClassName("Message");
    for (var i = 0; i < deleteClass.length; i++) {
        deleteID.push(deleteClass[i].getAttribute("data-id"));
        //alert(deleteClass[i].getAttribute("data-id"));
    }

    //alert("delete ID " + deleteID.length);
    for (var i = 0; i < deleteID.length; i++) {
        //alert("new " + deleteID[i]);
        deleteDiv = document.getElementById(deleteID[i]);
        //alert("new " + deleteDiv.innerHTML);
        document.getElementById(deleteID[i]).style.display = "none";
        //alert("new " + deleteID[i]);
        deleteDiv.style.display = "none";
        //alert("new " + deleteID[i]);
    } 

</script>
