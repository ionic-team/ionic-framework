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

//
// Testing shows:
//
// In all cases, webView.request.URL is the previous page's URL (or empty) during the didStartLoad callback.
// When loading a page with a redirect:
// 1. shouldStartLoading (requestURL is target page)
// 2. didStartLoading
// 3. shouldStartLoading (requestURL is redirect target)
// 4. didFinishLoad (request.URL is redirect target)
//
// Note the lack of a second didStartLoading **
//
// When loading a page with iframes:
// 1. shouldStartLoading (requestURL is main page)
// 2. didStartLoading
// 3. shouldStartLoading (requestURL is one of the iframes)
// 4. didStartLoading
// 5. didFinishLoad
// 6. didFinishLoad
//
// Note there is no way to distinguish which didFinishLoad maps to which didStartLoad **
//
// Loading a page by calling window.history.go(-1):
// 1. didStartLoading
// 2. didFinishLoad
//
// Note the lack of a shouldStartLoading call **
// Actually - this is fixed on iOS6. iOS6 has a shouldStart. **
//
// Loading a page by calling location.reload()
// 1. shouldStartLoading
// 2. didStartLoading
// 3. didFinishLoad
//
// Loading a page with an iframe that fails to load:
// 1. shouldStart (main page)
// 2. didStart
// 3. shouldStart (iframe)
// 4. didStart
// 5. didFailWithError
// 6. didFinish
//
// Loading a page with an iframe that fails to load due to an invalid URL:
// 1. shouldStart (main page)
// 2. didStart
// 3. shouldStart (iframe)
// 5. didFailWithError
// 6. didFinish
//
// This case breaks our logic since there is a missing didStart. To prevent this,
// we check URLs in shouldStart and return NO if they are invalid.
//
// Loading a page with an invalid URL
// 1. shouldStart (main page)
// 2. didFailWithError
//
// TODO: Record order when page is re-navigated before the first navigation finishes.
//

#import "CDVWebViewDelegate.h"
#import "CDVAvailability.h"

// #define VerboseLog NSLog
#define VerboseLog(...) do {} while (0)

typedef enum {
    STATE_IDLE,
    STATE_WAITING_FOR_LOAD_START,
    STATE_WAITING_FOR_LOAD_FINISH,
    STATE_IOS5_POLLING_FOR_LOAD_START,
    STATE_IOS5_POLLING_FOR_LOAD_FINISH
} State;

@implementation CDVWebViewDelegate

- (id)initWithDelegate:(NSObject <UIWebViewDelegate>*)delegate
{
    self = [super init];
    if (self != nil) {
        _delegate = delegate;
        _loadCount = -1;
        _state = STATE_IDLE;
    }
    return self;
}

- (BOOL)isPageLoaded:(UIWebView*)webView
{
    NSString* readyState = [webView stringByEvaluatingJavaScriptFromString:@"document.readyState"];

    return [readyState isEqualToString:@"loaded"] || [readyState isEqualToString:@"complete"];
}

- (BOOL)isJsLoadTokenSet:(UIWebView*)webView
{
    NSString* loadToken = [webView stringByEvaluatingJavaScriptFromString:@"window.__cordovaLoadToken"];

    return [[NSString stringWithFormat:@"%d", _curLoadToken] isEqualToString:loadToken];
}

- (void)setLoadToken:(UIWebView*)webView
{
    _curLoadToken += 1;
    [webView stringByEvaluatingJavaScriptFromString:[NSString stringWithFormat:@"window.__cordovaLoadToken=%d", _curLoadToken]];
}

- (void)pollForPageLoadStart:(UIWebView*)webView
{
    if (_state != STATE_IOS5_POLLING_FOR_LOAD_START) {
        return;
    }
    if (![self isJsLoadTokenSet:webView]) {
        VerboseLog(@"Polled for page load start. result = YES!");
        _state = STATE_IOS5_POLLING_FOR_LOAD_FINISH;
        [self setLoadToken:webView];
        if ([_delegate respondsToSelector:@selector(webViewDidStartLoad:)]) {
            [_delegate webViewDidStartLoad:webView];
        }
        [self pollForPageLoadFinish:webView];
    } else {
        VerboseLog(@"Polled for page load start. result = NO");
        // Poll only for 1 second, and then fall back on checking only when delegate methods are called.
        ++_loadStartPollCount;
        if (_loadStartPollCount < (1000 * .05)) {
            [self performSelector:@selector(pollForPageLoadStart:) withObject:webView afterDelay:.05];
        }
    }
}

- (void)pollForPageLoadFinish:(UIWebView*)webView
{
    if (_state != STATE_IOS5_POLLING_FOR_LOAD_FINISH) {
        return;
    }
    if ([self isPageLoaded:webView]) {
        VerboseLog(@"Polled for page load finish. result = YES!");
        _state = STATE_IDLE;
        if ([_delegate respondsToSelector:@selector(webViewDidFinishLoad:)]) {
            [_delegate webViewDidFinishLoad:webView];
        }
    } else {
        VerboseLog(@"Polled for page load finish. result = NO");
        [self performSelector:@selector(pollForPageLoadFinish:) withObject:webView afterDelay:.05];
    }
}

- (BOOL)webView:(UIWebView*)webView shouldStartLoadWithRequest:(NSURLRequest*)request navigationType:(UIWebViewNavigationType)navigationType
{
    BOOL shouldLoad = YES;

    if ([_delegate respondsToSelector:@selector(webView:shouldStartLoadWithRequest:navigationType:)]) {
        shouldLoad = [_delegate webView:webView shouldStartLoadWithRequest:request navigationType:navigationType];
    }

    VerboseLog(@"webView shouldLoad=%d (before) state=%d loadCount=%d URL=%@", shouldLoad, _state, _loadCount, request.URL);

    if (shouldLoad) {
        BOOL isTopLevelNavigation = [request.URL isEqual:[request mainDocumentURL]];
        if (isTopLevelNavigation) {
            switch (_state) {
                case STATE_WAITING_FOR_LOAD_FINISH:
                    // Redirect case.
                    // We expect loadCount == 1.
                    if (_loadCount != 1) {
                        NSLog(@"CDVWebViewDelegate: Detected redirect when loadCount=%d", _loadCount);
                    }
                    break;

                case STATE_IDLE:
                case STATE_IOS5_POLLING_FOR_LOAD_START:
                    // Page navigation start.
                    _loadCount = 0;
                    _state = STATE_WAITING_FOR_LOAD_START;
                    break;

                default:
                    NSLog(@"CDVWebViewDelegate: Navigation started when state=%d", _state);
                    _loadCount = 0;
                    _state = STATE_WAITING_FOR_LOAD_START;
                    if ([_delegate respondsToSelector:@selector(webView:didFailLoadWithError:)]) {
                        [_delegate webView:webView didFailLoadWithError:nil];
                    }
            }
        } else {
            // Deny invalid URLs so that we don't get the case where we go straight from
            // webViewShouldLoad -> webViewDidFailLoad (messes up _loadCount).
            shouldLoad = shouldLoad && [NSURLConnection canHandleRequest:request];
        }
        VerboseLog(@"webView shouldLoad=%d (after) isTopLevelNavigation=%d state=%d loadCount=%d", shouldLoad, isTopLevelNavigation, _state, _loadCount);
    }
    return shouldLoad;
}

- (void)webViewDidStartLoad:(UIWebView*)webView
{
    VerboseLog(@"webView didStartLoad (before). state=%d loadCount=%d", _state, _loadCount);
    BOOL fireCallback = NO;
    switch (_state) {
        case STATE_IDLE:
            if (IsAtLeastiOSVersion(@"6.0")) {
                break;
            }
            // If history.go(-1) is used pre-iOS6, the shouldStartLoadWithRequest function is not called.
            // Without shouldLoad, we can't distinguish an iframe from a top-level navigation.
            // We could try to distinguish using [UIWebView canGoForward], but that's too much complexity,
            // and would work only on the first time it was used.

            // Our work-around is to set a JS variable and poll until it disappears (from a naviagtion).
            _state = STATE_IOS5_POLLING_FOR_LOAD_START;
            _loadStartPollCount = 0;
            [self setLoadToken:webView];
            [self pollForPageLoadStart:webView];
            break;

        case STATE_WAITING_FOR_LOAD_START:
            if (_loadCount != 0) {
                NSLog(@"CDVWebViewDelegate: Unexpected loadCount in didStart. count=%d", _loadCount);
            }
            fireCallback = YES;
            _state = STATE_WAITING_FOR_LOAD_FINISH;
            _loadCount = 1;
            break;

        case STATE_WAITING_FOR_LOAD_FINISH:
            _loadCount += 1;
            break;

        case STATE_IOS5_POLLING_FOR_LOAD_START:
            [self pollForPageLoadStart:webView];
            break;

        case STATE_IOS5_POLLING_FOR_LOAD_FINISH:
            [self pollForPageLoadFinish:webView];
            break;

        default:
            NSLog(@"CDVWebViewDelegate: Unexpected didStart with state=%d loadCount=%d", _state, _loadCount);
    }
    VerboseLog(@"webView didStartLoad (after). state=%d loadCount=%d fireCallback=%d", _state, _loadCount, fireCallback);
    if (fireCallback && [_delegate respondsToSelector:@selector(webViewDidStartLoad:)]) {
        [_delegate webViewDidStartLoad:webView];
    }
}

- (void)webViewDidFinishLoad:(UIWebView*)webView
{
    VerboseLog(@"webView didFinishLoad (before). state=%d loadCount=%d", _state, _loadCount);
    BOOL fireCallback = NO;
    switch (_state) {
        case STATE_IDLE:
            break;

        case STATE_WAITING_FOR_LOAD_START:
            NSLog(@"CDVWebViewDelegate: Unexpected didFinish while waiting for load start.");
            break;

        case STATE_WAITING_FOR_LOAD_FINISH:
            if (_loadCount == 1) {
                fireCallback = YES;
                _state = STATE_IDLE;
            }
            _loadCount -= 1;
            break;

        case STATE_IOS5_POLLING_FOR_LOAD_START:
            [self pollForPageLoadStart:webView];
            break;

        case STATE_IOS5_POLLING_FOR_LOAD_FINISH:
            [self pollForPageLoadFinish:webView];
            break;
    }
    VerboseLog(@"webView didFinishLoad (after). state=%d loadCount=%d fireCallback=%d", _state, _loadCount, fireCallback);
    if (fireCallback && [_delegate respondsToSelector:@selector(webViewDidFinishLoad:)]) {
        [_delegate webViewDidFinishLoad:webView];
    }
}

- (void)webView:(UIWebView*)webView didFailLoadWithError:(NSError*)error
{
    VerboseLog(@"webView didFailLoad (before). state=%d loadCount=%d", _state, _loadCount);
    BOOL fireCallback = NO;

    switch (_state) {
        case STATE_IDLE:
            break;

        case STATE_WAITING_FOR_LOAD_START:
            _state = STATE_IDLE;
            fireCallback = YES;
            break;

        case STATE_WAITING_FOR_LOAD_FINISH:
            if (_loadCount == 1) {
                _state = STATE_IDLE;
                fireCallback = YES;
            }
            _loadCount = -1;
            break;

        case STATE_IOS5_POLLING_FOR_LOAD_START:
            [self pollForPageLoadStart:webView];
            break;

        case STATE_IOS5_POLLING_FOR_LOAD_FINISH:
            [self pollForPageLoadFinish:webView];
            break;
    }
    VerboseLog(@"webView didFailLoad (after). state=%d loadCount=%d, fireCallback=%d", _state, _loadCount, fireCallback);
    if (fireCallback && [_delegate respondsToSelector:@selector(webView:didFailLoadWithError:)]) {
        [_delegate webView:webView didFailLoadWithError:error];
    }
}

@end
