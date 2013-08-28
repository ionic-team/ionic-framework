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

#import "CDVCommandDelegateImpl.h"
#import "CDVJSON.h"
#import "CDVCommandQueue.h"
#import "CDVPluginResult.h"
#import "CDVViewController.h"

@implementation CDVCommandDelegateImpl

- (id)initWithViewController:(CDVViewController*)viewController
{
    self = [super init];
    if (self != nil) {
        _viewController = viewController;
        _commandQueue = _viewController.commandQueue;
    }
    return self;
}

- (NSString*)pathForResource:(NSString*)resourcepath
{
    NSBundle* mainBundle = [NSBundle mainBundle];
    NSMutableArray* directoryParts = [NSMutableArray arrayWithArray:[resourcepath componentsSeparatedByString:@"/"]];
    NSString* filename = [directoryParts lastObject];

    [directoryParts removeLastObject];

    NSString* directoryPartsJoined = [directoryParts componentsJoinedByString:@"/"];
    NSString* directoryStr = _viewController.wwwFolderName;

    if ([directoryPartsJoined length] > 0) {
        directoryStr = [NSString stringWithFormat:@"%@/%@", _viewController.wwwFolderName, [directoryParts componentsJoinedByString:@"/"]];
    }

    return [mainBundle pathForResource:filename ofType:@"" inDirectory:directoryStr];
}

- (void)evalJsHelper2:(NSString*)js
{
    CDV_EXEC_LOG(@"Exec: evalling: %@", [js substringToIndex:MIN([js length], 160)]);
    NSString* commandsJSON = [_viewController.webView stringByEvaluatingJavaScriptFromString:js];
    if ([commandsJSON length] > 0) {
        CDV_EXEC_LOG(@"Exec: Retrieved new exec messages by chaining.");
    }

    [_commandQueue enqueCommandBatch:commandsJSON];
}

- (void)evalJsHelper:(NSString*)js
{
    // Cycle the run-loop before executing the JS.
    // This works around a bug where sometimes alerts() within callbacks can cause
    // dead-lock.
    // If the commandQueue is currently executing, then we know that it is safe to
    // execute the callback immediately.
    // Using    (dispatch_get_main_queue()) does *not* fix deadlocks for some reaon,
    // but performSelectorOnMainThread: does.
    if (![NSThread isMainThread] || !_commandQueue.currentlyExecuting) {
        [self performSelectorOnMainThread:@selector(evalJsHelper2:) withObject:js waitUntilDone:NO];
    } else {
        [self evalJsHelper2:js];
    }
}

- (void)sendPluginResult:(CDVPluginResult*)result callbackId:(NSString*)callbackId
{
    CDV_EXEC_LOG(@"Exec(%@): Sending result. Status=%@", callbackId, result.status);
    // This occurs when there is are no win/fail callbacks for the call.
    if ([@"INVALID" isEqualToString : callbackId]) {
        return;
    }
    int status = [result.status intValue];
    BOOL keepCallback = [result.keepCallback boolValue];
    NSString* argumentsAsJSON = [result argumentsAsJSON];

    NSString* js = [NSString stringWithFormat:@"cordova.require('cordova/exec').nativeCallback('%@',%d,%@,%d)", callbackId, status, argumentsAsJSON, keepCallback];

    [self evalJsHelper:js];
}

- (void)evalJs:(NSString*)js
{
    [self evalJs:js scheduledOnRunLoop:YES];
}

- (void)evalJs:(NSString*)js scheduledOnRunLoop:(BOOL)scheduledOnRunLoop
{
    js = [NSString stringWithFormat:@"cordova.require('cordova/exec').nativeEvalAndFetch(function(){%@})", js];
    if (scheduledOnRunLoop) {
        [self evalJsHelper:js];
    } else {
        [self evalJsHelper2:js];
    }
}

- (BOOL)execute:(CDVInvokedUrlCommand*)command
{
    return [_commandQueue execute:command];
}

- (id)getCommandInstance:(NSString*)pluginName
{
    return [_viewController getCommandInstance:pluginName];
}

- (void)runInBackground:(void (^)())block
{
    dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), block);
}

- (NSString*)userAgent
{
    return [_viewController userAgent];
}

- (BOOL)URLIsWhitelisted:(NSURL*)url
{
    return ![_viewController.whitelist schemeIsAllowed:[url scheme]] ||
           [_viewController.whitelist URLIsAllowed:url];
}

- (NSDictionary*)settings
{
    return _viewController.settings;
}

@end
