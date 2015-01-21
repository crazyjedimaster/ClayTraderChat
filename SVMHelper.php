<?php
require_once("../../../wp-load.php");

$q=$_REQUEST["q"];
$i=$_REQUEST["i"];

if  ($i) {
    echo get_avatar(1, 32 );
}

if  ($q) {
    $current_user = wp_get_current_user();
    $wpdb->replace( "user_chat_ban", array('userName' => $q,'isBanned'=>'1'));
    echo $q;
}
?>

