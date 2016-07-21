<?php

//Slim Framwork initialization
require 'Slim/Slim.php';
\Slim\Slim::registerAutoloader();
error_reporting(E_ALL);
ini_set('display_errors', 1);
$app = new \Slim\Slim(); //using the slim API


//Get requests
$app->get('/getIngredient', 'getIngredient');

//post requests 
$app->post('/login', 'login');


$app->run();

//get DB connection, default root access.
function getConnection($user = 'root', $pw = 'root', $host = 'localhost') 
{
    $dbConnection = new mysqli($host, $user, $pw, 'PantryQuest'); 
    
    // Check mysqli connection
    if (mysqli_connect_errno()) 
    {
        printf("Connect failed: %s\n", mysqli_connect_error());
        exit();
    }
    return $dbConnection;
}
function getIngredient() 
{
    //get DB connection with custom access 
    $con = getConnection($_SESSION['notLoggedInUsername'], $_SESSION['notLoggedInPW']);
    $app = \Slim\Slim::getInstance();
    $request = $app->request()->getBody();
    
    //initialise list 
    $ingredient_list = array();
    
    //query DB 
    $result = $con->query(  "SELECT * FROM ingredient");
    
    while ($rows = mysqli_fetch_row($result)) 
    {
        $ingredient_list[] = $rows;
    }
    //return the result 
    echo json_encode($ingredient_list);
    $con->close();
}// end function getIngredient 

function login()
{
    $con = getConnection();
	$app = \Slim\Slim::getInstance();
    $request = $app->request()->getBody();
    $information = array();

    //encode types password so that it matches encryption
    $decodedPW = base64_encode($_POST['pw']);
    
    $name = $_POST['name'];


    $query = $con->prepare("select firstname from users where username = ? and pw = ?");
     
    $query->bind_param('ss', $name, $decodedPW);
    $query->execute();
    $query->bind_result($temp);
    $firstname;
    
    //attempt to retrive first name from that user 
    while ($query->fetch())
    {
        $firstname = $temp;
    }
    
    //invalis login if firstName is not set 
    if (!isset($firstname))
    {
        $information[] = "Invalid login";
    }
    else
    {
        //valid login return username and name 
            $_SESSION['id'] = true;
            $_SESSION['username'] = $name;
            $information[] = $name;
            $information[] = $firstname;
    }
    
    //return infromation
    echo json_encode($information);
}//end funtion


>