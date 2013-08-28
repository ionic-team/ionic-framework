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

#include <objc/message.h>
#import "CDV.h"
#import "CDVCommandQueue.h"
#import "CDVViewController.h"
#import "CDVCommandDelegateImpl.h"

@interface CDVCommandQueue () {
    NSInteger _lastCommandQueueFlushRequestId;
    __weak CDVViewController* _viewController;
    NSMutableArray* _queue;
    BOOL _currentlyExecuting;
}
@end

@implementation CDVCommandQueue

@synthesize currentlyExecuting = _currentlyExecuting;

- (id)initWithViewController:(CDVViewController*)viewController
{
    self = [super init];
    if (self != nil) {
        _viewController = viewController;
        _queue = [[NSMutableArray alloc] init];
    }
    return self;
}

- (void)dispose
{
    // TODO(agrieve): Make this a zeroing weak ref once we drop support for 4.3.
    _viewController = nil;
}

- (void)resetRequestId
{
    _lastCommandQueueFlushRequestId = 0;
}

- (void)enqueCommandBatch:(NSString*)batchJSON
{
    if ([batchJSON length] > 0) {
        [_queue addObject:batchJSON];
        [self executePending];
    }
}

- (void)maybeFetchCommandsFromJs:(NSNumber*)requestId
{
    // Use the request ID to determine if we've already flushed for this request.
    // This is required only because the NSURLProtocol enqueues the same request
    // multiple times.
    if ([requestId integerValue] > _lastCommandQueueFlushRequestId) {
        _lastCommandQueueFlushRequestId = [requestId integerValue];
        [self fetchCommandsFromJs];
    }
}

- (void)fetchCommandsFromJs
{
    // Grab all the queued commands from the JS side.
    NSString* queuedCommandsJSON = [_viewController.webView stringByEvaluatingJavaScriptFromString:
        @"cordova.require('cordova/exec').nativeFetchMessages()"];

    [self enqueCommandBatch:queuedCommandsJSON];
    if ([queuedCommandsJSON length] > 0) {
        CDV_EXEC_LOG(@"Exec: Retrieved new exec messages by request.");
    }
}

- (void)executePending
{
    // Make us re-entrant-safe.
    if (_currentlyExecuting) {
        return;
    }
    @try {
        _currentlyExecuting = YES;

        for (NSUInteger i = 0; i < [_queue count]; ++i) {
            // Parse the returned JSON array.
            NSArray* commandBatch = [[_queue objectAtIndex:i] JSONObject];

            // Iterate over and execute all of the commands.
            for (NSArray* jsonEntry in commandBatch) {
                CDVInvokedUrlCommand* command = [CDVInvokedUrlCommand commandFromJson:jsonEntry];
                CDV_EXEC_LOG(@"Exec(%@): Calling %@.%@", command.callbackId, command.className, command.methodName);

                if (![self execute:command]) {
#ifdef DEBUG
                        NSString* commandJson = [jsonEntry JSONString];
                        static NSUInteger maxLogLength = 1024;
                        NSString* commandString = ([commandJson length] > maxLogLength) ?
                            [NSString stringWithFormat:@"%@[...]", [commandJson substringToIndex:maxLogLength]] :
                            commandJson;

                        DLog(@"FAILED pluginJSON = %@", commandString);
#endif
                }
            }
        }

        [_queue removeAllObjects];
    } @finally
    {
        _currentlyExecuting = NO;
    }
}

- (BOOL)execute:(CDVInvokedUrlCommand*)command
{
    if ((command.className == nil) || (command.methodName == nil)) {
        NSLog(@"ERROR: Classname and/or methodName not found for command.");
        return NO;
    }

    // Fetch an instance of this class
    CDVPlugin* obj = [_viewController.commandDelegate getCommandInstance:command.className];

    if (!([obj isKindOfClass:[CDVPlugin class]])) {
        NSLog(@"ERROR: Plugin '%@' not found, or is not a CDVPlugin. Check your plugin mapping in config.xml.", command.className);
        return NO;
    }
    BOOL retVal = YES;

    // Find the proper selector to call.
    NSString* methodName = [NSString stringWithFormat:@"%@:", command.methodName];
    NSString* methodNameWithDict = [NSString stringWithFormat:@"%@:withDict:", command.methodName];
    SEL normalSelector = NSSelectorFromString(methodName);
    SEL legacySelector = NSSelectorFromString(methodNameWithDict);
    // Test for the legacy selector first in case they both exist.
    if ([obj respondsToSelector:legacySelector]) {
        NSMutableArray* arguments = nil;
        NSMutableDictionary* dict = nil;
        [command legacyArguments:&arguments andDict:&dict];
        // [obj performSelector:legacySelector withObject:arguments withObject:dict];
        objc_msgSend(obj, legacySelector, arguments, dict);
    } else if ([obj respondsToSelector:normalSelector]) {
        // [obj performSelector:normalSelector withObject:command];
        objc_msgSend(obj, normalSelector, command);
    } else {
        // There's no method to call, so throw an error.
        NSLog(@"ERROR: Method '%@' not defined in Plugin '%@'", methodName, command.className);
        retVal = NO;
    }

    return retVal;
}

@end
