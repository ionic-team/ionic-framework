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

#import "CDVAvailability.h"
#import "CDVInvokedUrlCommand.h"

@class CDVPlugin;
@class CDVPluginResult;
@class CDVWhitelist;

@protocol CDVCommandDelegate <NSObject>

@property (nonatomic, readonly) NSDictionary* settings;

- (NSString*)pathForResource:(NSString*)resourcepath;
- (id)getCommandInstance:(NSString*)pluginName;

// Plugins should not be using this interface to call other plugins since it
// will result in bogus callbacks being made.
- (BOOL)execute:(CDVInvokedUrlCommand*)command CDV_DEPRECATED(2.2, "Use direct method calls instead.");

// Sends a plugin result to the JS. This is thread-safe.
- (void)sendPluginResult:(CDVPluginResult*)result callbackId:(NSString*)callbackId;
// Evaluates the given JS. This is thread-safe.
- (void)evalJs:(NSString*)js;
// Can be used to evaluate JS right away instead of scheduling it on the run-loop.
// This is required for dispatch resign and pause events, but should not be used
// without reason. Without the run-loop delay, alerts used in JS callbacks may result
// in dead-lock. This method must be called from the UI thread.
- (void)evalJs:(NSString*)js scheduledOnRunLoop:(BOOL)scheduledOnRunLoop;
// Runs the given block on a background thread using a shared thread-pool.
- (void)runInBackground:(void (^)())block;
// Returns the User-Agent of the associated UIWebView.
- (NSString*)userAgent;
// Returns whether the given URL passes the white-list.
- (BOOL)URLIsWhitelisted:(NSURL*)url;

@end
