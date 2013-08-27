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

#import "CDVUserAgentUtil.h"

#import <UIKit/UIKit.h>

// #define VerboseLog NSLog
#define VerboseLog(...) do {} while (0)

static NSString* const kCdvUserAgentKey = @"Cordova-User-Agent";
static NSString* const kCdvUserAgentVersionKey = @"Cordova-User-Agent-Version";

static NSString* gOriginalUserAgent = nil;
static NSInteger gNextLockToken = 0;
static NSInteger gCurrentLockToken = 0;
static NSMutableArray* gPendingSetUserAgentBlocks = nil;

@implementation CDVUserAgentUtil

+ (NSString*)originalUserAgent
{
    if (gOriginalUserAgent == nil) {
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(onAppLocaleDidChange:)
                                                     name:NSCurrentLocaleDidChangeNotification object:nil];

        NSUserDefaults* userDefaults = [NSUserDefaults standardUserDefaults];
        NSString* systemVersion = [[UIDevice currentDevice] systemVersion];
        NSString* localeStr = [[NSLocale currentLocale] localeIdentifier];
        NSString* systemAndLocale = [NSString stringWithFormat:@"%@ %@", systemVersion, localeStr];

        NSString* cordovaUserAgentVersion = [userDefaults stringForKey:kCdvUserAgentVersionKey];
        gOriginalUserAgent = [userDefaults stringForKey:kCdvUserAgentKey];
        BOOL cachedValueIsOld = ![systemAndLocale isEqualToString:cordovaUserAgentVersion];

        if ((gOriginalUserAgent == nil) || cachedValueIsOld) {
            UIWebView* sampleWebView = [[UIWebView alloc] initWithFrame:CGRectZero];
            gOriginalUserAgent = [sampleWebView stringByEvaluatingJavaScriptFromString:@"navigator.userAgent"];

            [userDefaults setObject:gOriginalUserAgent forKey:kCdvUserAgentKey];
            [userDefaults setObject:systemAndLocale forKey:kCdvUserAgentVersionKey];

            [userDefaults synchronize];
        }
    }
    return gOriginalUserAgent;
}

+ (void)onAppLocaleDidChange:(NSNotification*)notification
{
    // TODO: We should figure out how to update the user-agent of existing UIWebViews when this happens.
    // Maybe use the PDF bug (noted in setUserAgent:).
    gOriginalUserAgent = nil;
}

+ (void)acquireLock:(void (^)(NSInteger lockToken))block
{
    if (gCurrentLockToken == 0) {
        gCurrentLockToken = ++gNextLockToken;
        VerboseLog(@"Gave lock %d", gCurrentLockToken);
        block(gCurrentLockToken);
    } else {
        if (gPendingSetUserAgentBlocks == nil) {
            gPendingSetUserAgentBlocks = [[NSMutableArray alloc] initWithCapacity:4];
        }
        VerboseLog(@"Waiting for lock");
        [gPendingSetUserAgentBlocks addObject:block];
    }
}

+ (void)releaseLock:(NSInteger*)lockToken
{
    if (*lockToken == 0) {
        return;
    }
    NSAssert(gCurrentLockToken == *lockToken, @"Got token %d, expected %d", *lockToken, gCurrentLockToken);

    VerboseLog(@"Released lock %d", *lockToken);
    if ([gPendingSetUserAgentBlocks count] > 0) {
        void (^block)() = [gPendingSetUserAgentBlocks objectAtIndex:0];
        [gPendingSetUserAgentBlocks removeObjectAtIndex:0];
        gCurrentLockToken = ++gNextLockToken;
        NSLog(@"Gave lock %d", gCurrentLockToken);
        block(gCurrentLockToken);
    } else {
        gCurrentLockToken = 0;
    }
    *lockToken = 0;
}

+ (void)setUserAgent:(NSString*)value lockToken:(NSInteger)lockToken
{
    NSAssert(gCurrentLockToken == lockToken, @"Got token %d, expected %d", lockToken, gCurrentLockToken);
    VerboseLog(@"User-Agent set to: %@", value);

    // Setting the UserAgent must occur before a UIWebView is instantiated.
    // It is read per instantiation, so it does not affect previously created views.
    // Except! When a PDF is loaded, all currently active UIWebViews reload their
    // User-Agent from the NSUserDefaults some time after the DidFinishLoad of the PDF bah!
    NSDictionary* dict = [[NSDictionary alloc] initWithObjectsAndKeys:value, @"UserAgent", nil];
    [[NSUserDefaults standardUserDefaults] registerDefaults:dict];
}

@end
