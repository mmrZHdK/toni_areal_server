<?php

use Insights\Api\ApiController;
use Symfony\Component\Routing\RouteCollection;
use Symfony\Component\Routing\Route;

$routes = new RouteCollection();

$routes->add('api_file', new Route('/post/', array(
    '_controller' => 'Insights\\Api\\ApiController::postAction',
    array('action' => ''),
)));

$routes->add('api_room', new Route('/room/{id}', array(
    '_controller' => 'Insights\\Api\\ApiController::roomAction',
    array('id' => '')
)));

$routes->add('api_search_index', new Route('/search/', array(
    '_controller' => 'Insights\\Api\\ApiController::searchIndex',
    array('query' => '')
)));

$routes->add('api_get_entries', new Route('/entries/', array(
    '_controller' => 'Insights\\Api\\ApiController::entriesAction',
    array('id' => '')
)));

return $routes;
