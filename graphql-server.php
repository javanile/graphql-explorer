<?php

use GraphQL\Server\StandardServer;
use GraphQL\Server\ServerConfig;
use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\UnionType;
use GraphQL\Type\Definition\Type;
use GraphQL\Type\Schema;
use GraphQL\Error\Debug;
use GraphQL\Error\Error;

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, DELETE, PUT, PATCH, OPTIONS');
header('Access-Control-Allow-Headers: *');
header('Access-Control-Max-Age: 1728000');
header('Content-Type: application/json');

require_once '../vendor/autoload.php';

$searchResultType = new UnionType([
    'name' => 'SearchResult',
    'types' => [
        Type::int(),
        Type::string(),
    ],
    'resolveType' => function ($value): ObjectType {
        return is_string($value) ? Type::string() : Type::int();
    },
]);

$searchResultType = Type::string();

$queryType = new ObjectType([
    'name' => 'Query',
    'fields' => [
        'echo' => [
            'type' => Type::string(),
            'args' => [
                'message' => Type::nonNull(Type::string()),
            ],
            'resolve' => function ($rootValue, array $args): string {
                return $rootValue['prefix'] . $args['message'];
            },
        ],
        'testUnion' => [
            'type' => $searchResultType,
            'resolve' => function () {
                return 'test';
            },
        ],
    ],
]);

$debug = Debug::INCLUDE_DEBUG_MESSAGE;

$schema = new Schema([
    'query' => $queryType,
]);

$config = ServerConfig::create()
    ->setSchema($schema)
    ->setQueryBatching(true)
    ->setDebug($debug)
;

$server = new StandardServer($config);

$server->handleRequest();
