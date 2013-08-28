/*
 Licensed to the Apache Software Foundation (ASF) under one
 or more contributor license agreements.  See the NOTICE file
 distributed with this work for additional information
 regarding copyright ownership.  The ASF licenses this file
 to you under the Apache License, Version 2.0 (the
 "License"); you may not use this file except in compliance
 with the License.  You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an
 "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 KIND, either express or implied.  See the License for the
 specific language governing permissions and limitations
 under the License.
 */

#import "CDVConfigParser.h"

@interface CDVConfigParser ()

@property (nonatomic, readwrite, strong) NSMutableDictionary* pluginsDict;
@property (nonatomic, readwrite, strong) NSMutableDictionary* settings;
@property (nonatomic, readwrite, strong) NSMutableArray* whitelistHosts;
@property (nonatomic, readwrite, strong) NSMutableArray* startupPluginNames;
@property (nonatomic, readwrite, strong) NSString* startPage;

@end

@implementation CDVConfigParser

@synthesize pluginsDict, settings, whitelistHosts, startPage, startupPluginNames;

- (id)init
{
    self = [super init];
    if (self != nil) {
        self.pluginsDict = [[NSMutableDictionary alloc] initWithCapacity:30];
        self.settings = [[NSMutableDictionary alloc] initWithCapacity:30];
        self.whitelistHosts = [[NSMutableArray alloc] initWithCapacity:30];
        self.startupPluginNames = [[NSMutableArray alloc] initWithCapacity:8];
    }
    return self;
}

- (void)parser:(NSXMLParser*)parser didStartElement:(NSString*)elementName namespaceURI:(NSString*)namespaceURI qualifiedName:(NSString*)qualifiedName attributes:(NSDictionary*)attributeDict
{
    if ([elementName isEqualToString:@"preference"]) {
        settings[attributeDict[@"name"]] = attributeDict[@"value"];
    } else if ([elementName isEqualToString:@"plugin"]) {
        NSString* name = [attributeDict[@"name"] lowercaseString];
        pluginsDict[name] = attributeDict[@"value"];
        if ([@"true" isEqualToString : attributeDict[@"onload"]]) {
            [self.startupPluginNames addObject:name];
        }
    } else if ([elementName isEqualToString:@"access"]) {
        [whitelistHosts addObject:attributeDict[@"origin"]];
    } else if ([elementName isEqualToString:@"content"]) {
        self.startPage = attributeDict[@"src"];
    }
}

- (void)parser:(NSXMLParser*)parser parseErrorOccurred:(NSError*)parseError
{
    NSAssert(NO, @"config.xml parse error line %d col %d", [parser lineNumber], [parser columnNumber]);
}

@end
