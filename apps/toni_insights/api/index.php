<?php

require_once __DIR__.'/../vendor/autoload.php';

define('BASE_DIR', __DIR__ . '/../');
define('FILE_UPLOADS_FOLDER', BASE_DIR . 'uploads/');

use Insights\Framework;
use Insights\Api\ApiController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing;
use Symfony\Component\HttpKernel;

use Symfony\Component\Routing\Generator\UrlGenerator;

use Symfony\Component\Debug\Debug;
use Symfony\Component\Debug\ExceptionHandler;

Debug::enable();
ExceptionHandler::register();

/**
 * handle incoming request
 */
$request = Request::createFromGlobals();

/**
 * handle routes
 */
$routes = require_once __DIR__.'/../src/routes.php';

$context = new Routing\RequestContext();
$context->fromRequest($request);
$matcher = new Routing\Matcher\UrlMatcher($routes, $context);
$resolver = new HttpKernel\Controller\ControllerResolver();

//print_r($url);

$framework = new Framework($matcher, $resolver);
$response = $framework->handle($request);

$response->send();
