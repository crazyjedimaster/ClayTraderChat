<?php
    require_once("../../../wp-load.php");

      $current_user = wp_get_current_user();
      $userName = $current_user->user_login;
      $userID = $current_user->ID; 
      $role = current_user_can("delete_posts")== 1? 1 : 0; 
      $avatar = get_avatar($userid,24);
      $row = $wpdb->get_row("SELECT * FROM user_chat_ban WHERE userName = 'steven'", ARRAY_N);     
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
            <iframe src="http://claytrader.jit.su/?room2?<?php echo $userName; ?>?<?php echo $role?>?<?php echo $userID?>?<?php echo $avatar?>" id="chatFrame" height=700px width=700px frameborder="0" name="targetframe"></iframe>
        </div>
    </body>
</html>
<?php } ?>

