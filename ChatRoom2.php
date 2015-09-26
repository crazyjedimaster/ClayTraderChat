<?php
    require_once("../../../wp-load.php");
    require_once("../../../Easy-Digital-Downloads-master/includes/user-functions.php");
      $current_user = wp_get_current_user();
      $userName = $current_user->display_name;
      $userID = $current_user->ID; 
      $role = current_user_can("delete_posts")== 1? 1 : 0; 
      $avatar = get_avatar($userID,24);
      $row = $wpdb->get_row("SELECT * FROM user_chat_ban WHERE userName = " + $userName, ARRAY_N);
      echo $row[1];
     
      $user_id = get_current_user_id();
      $download_id = '23899';
      //if( edd_has_user_purchased($user_id, $download_id) && $user_id != "0" ) {
      //  $classAddition = '<mark>- TCU </mark>'
      //}
      //else{
      //    $classAddition = ''
      //}
      //$userName = $userName . $classAddition

?>

<?php if (!is_user_logged_in() ||$row[1] == 1) {  ?>
<div>ERROR</div>
<?php }else{ ?>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js"></script>
<html lang="en">
    <head>
        <meta charset="utf-8" />
        <title>Stocks Over $1</title>
    </head>
    <body>
        <div id="test">
          <iframe src="http://localhost:8080/?room2?<?php echo $userName; ?>?<?php echo $role?>?<?php echo $userID?>?<?php echo $avatar?>" id="chatFrame" height=700px width=700px frameborder="0" name="targetframe"></iframe>
        </div>
    </body>
</html>
<script>
    window.addEventListener("message", receiveMessage, false);

    function receiveMessage(event) {
        var source = event.source.frameElement; //this is the iframe that sent the message
        var message = event.data; //this is the message
        document.title = message;
    }
</script>
<?php } ?>

