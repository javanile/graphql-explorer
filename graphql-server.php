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

$postType = new ObjectType([
    'name' => 'Post',
    'fields' => [
        'id' => Type::id(),
        'title' => Type::string(),
        'content' => Type::string(),
        //'campo' => Type::string(),
    ],
]);

$commentType = new ObjectType([
    'name' => 'Comment',
    'fields' => [
        'id' => Type::int(),
        'text' => Type::string(),
        //'campo' => Type::int(),
    ],
]);


$postCommentType = new UnionType([
    'name' => 'SearchResult',
    'types' => [
        $postType,
        $commentType,
    ],
    'resolveType' => function ($value) use ($commentType, $postType) {
        if (isset($value['text'])) {
            return $commentType;
        } else {
            return $postType;
        }
    },
]);



$stringValue = new ObjectType([
    'name' => 'StringValue',
    'fields' => [
        'value1' => Type::string(),
    ],
]);

$intValue = new ObjectType([
    'name' => 'IntValue',
    'fields' => [
        'value' => Type::int(),
    ],
]);

$searchResultType = new UnionType([
    'name' => 'SearchResult',
    'types' => [
        $stringValue,
        $intValue,
    ],
    'resolveType' => function ($value) use ($stringValue, $intValue) {
        if ($value['value'] > 10 || $value['value1'] > 10) {
            return $stringValue;
        } else {
            return $intValue;
        }
    /*
        if (isset($value['stringValue'])) {
            return $stringValue;
        } else {
            return $intValue;
        }*/
        //return is_string($value) ? $stringValue : $intValue;
    },
]);

//$searchResultType = Type::string();

$queryType = new ObjectType([
    'name' => 'Query',
    'fields' => [
        'echo' => [
            'type' => Type::string(),
            'args' => [
                'message' => Type::nonNull(Type::string()),
            ],
            'resolve' => function ($rootValue, array $args): string {
                return json_encode(explode('#', "1#2#3"));
            },
        ],
        /*'testUnion' => [
            'type' => Type::listOf($searchResultType),
            'resolve' => function () {
                return [
                    [
                        'value' => 1,
                    ],
                    [
                        'value1' => 11,
                    ]
                ];
            },
        ],*/
        'ricerca' => [
            'type' => Type::listOf($postCommentType),
            'resolve' => function () {
                return [
                    [
                        'id' => 1,
                        'title' => 'Post 1',
                        'content' => 'Content 1'
                    ],
                    [
                        'id' => 2,
                        'text' => 'Comment 1'
                    ]
                ];
            },
        ]
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
