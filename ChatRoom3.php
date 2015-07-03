<?php
    require_once("../../../wp-load.php");

      $current_user = wp_get_current_user();
      $userName = $current_user->display_name;
      $userID = $current_user->ID; 
      $role = current_user_can("delete_posts")== 1? 1 : 0; 
      $avatar = get_avatar($userID,24);
      $row = $wpdb->get_row("SELECT * FROM user_chat_ban WHERE userName = " + $userName, ARRAY_N);
      echo $row[1];     
?>

<?php if (!is_user_logged_in() ||$row[1] == 1) {  ?>
<div>ERROR</div>
<?php }else{ ?>
<html lang="en" >
    <head>
        <meta charset="utf-8" />
        <title>Traders Lounge</title>
    </head>
    <body >
        <div>
            <iframe onfocus="document.title = 'focused'" src="http://localhost:8080/?room3?<?php echo $userName; ?>?<?php echo $role?>?<?php echo $userID?>?<?php echo $avatar?>" id="chatFrame" height=700px width=700px frameborder="0" name="targetframe"></iframe>
        </div>
    </body>
</html>
<?php } ?>

