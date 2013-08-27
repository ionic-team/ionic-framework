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

#import "CDVWhitelist.h"

NSString* const kCDVDefaultWhitelistRejectionString = @"ERROR whitelist rejection: url='%@'";
NSString* const kCDVDefaultSchemeName = @"cdv-default-scheme";

@interface CDVWhitelist ()

@property (nonatomic, readwrite, strong) NSArray* whitelist;
@property (nonatomic, readwrite, strong) NSDictionary* expandedWhitelists;

- (void)processWhitelist;

@end

@implementation CDVWhitelist

@synthesize whitelist, expandedWhitelists, whitelistRejectionFormatString;

- (id)initWithArray:(NSArray*)array
{
    self = [super init];
    if (self) {
        self.whitelist = array;
        self.expandedWhitelists = nil;
        self.whitelistRejectionFormatString = kCDVDefaultWhitelistRejectionString;
        [self processWhitelist];
    }

    return self;
}

- (BOOL)isIPv4Address:(NSString*)externalHost
{
    // an IPv4 address has 4 octets b.b.b.b where b is a number between 0 and 255.
    // for our purposes, b can also be the wildcard character '*'

    // we could use a regex to solve this problem but then I would have two problems
    // anyways, this is much clearer and maintainable
    NSArray* octets = [externalHost componentsSeparatedByString:@"."];
    NSUInteger num_octets = [octets count];

    // quick check
    if (num_octets != 4) {
        return NO;
    }

    // restrict number parsing to 0-255
    NSNumberFormatter* numberFormatter = [[NSNumberFormatter alloc] init];
    [numberFormatter setMinimum:[NSNumber numberWithUnsignedInteger:0]];
    [numberFormatter setMaximum:[NSNumber numberWithUnsignedInteger:255]];

    // iterate through each octet, and test for a number between 0-255 or if it equals '*'
    for (NSUInteger i = 0; i < num_octets; ++i) {
        NSString* octet = [octets objectAtIndex:i];

        if ([octet isEqualToString:@"*"]) { // passes - check next octet
            continue;
        } else if ([numberFormatter numberFromString:octet] == nil) { // fails - not a number and not within our range, return
            return NO;
        }
    }

    return YES;
}

- (NSString*)extractHostFromUrlString:(NSString*)url
{
    NSURL* aUrl = [NSURL URLWithString:url];

    if ((aUrl != nil) && ([aUrl scheme] != nil)) { // found scheme
        return [aUrl host];
    } else {
        return url;
    }
}

- (NSString*)extractSchemeFromUrlString:(NSString*)url
{
    NSURL* aUrl = [NSURL URLWithString:url];

    if ((aUrl != nil) && ([aUrl scheme] != nil)) { // found scheme
        return [aUrl scheme];
    } else {
        return kCDVDefaultSchemeName;
    }
}

- (void)processWhitelist
{
    if (self.whitelist == nil) {
        NSLog(@"ERROR: CDVWhitelist was not initialized properly, all urls will be disallowed.");
        return;
    }

    NSMutableDictionary* _expandedWhitelists = [@{kCDVDefaultSchemeName: [NSMutableArray array]} mutableCopy];

    // only allow known TLDs (since Aug 23rd 2011), and two character country codes
    // does not match internationalized domain names with non-ASCII characters
    NSString* tld_match = @"(aero|asia|arpa|biz|cat|com|coop|edu|gov|info|int|jobs|mil|mobi|museum|name|net|org|pro|tel|travel|xxx|[a-z][a-z])";

    // iterate through settings ExternalHosts, check for equality
    for (NSString* externalHost in self.whitelist) {
        NSString* host = [self extractHostFromUrlString:externalHost];
        NSString* scheme = [self extractSchemeFromUrlString:externalHost];

        // check for single wildcard '*', if found set allowAll to YES
        if ([host isEqualToString:@"*"]) {
            [_expandedWhitelists setObject:[NSArray arrayWithObject:host] forKey:scheme];
            continue;
        }

        // if this is the first value for this scheme, create a new entry
        if ([_expandedWhitelists objectForKey:scheme] == nil) {
            [_expandedWhitelists setObject:[NSMutableArray array] forKey:scheme];
        }

        // starts with wildcard match - we make the first '.' optional (so '*.org.apache.cordova' will match 'org.apache.cordova')
        NSString* prefix = @"*.";
        if ([host hasPrefix:prefix]) {
            // replace the first two characters '*.' with our regex
            host = [host stringByReplacingCharactersInRange:NSMakeRange(0, [prefix length]) withString:@"(\\s{0}|*.)"]; // the '*' and '.' will be substituted later
        }

        // ends with wildcard match for TLD
        if (![self isIPv4Address:host] && [host hasSuffix:@".*"]) {
            // replace * with tld_match
            host = [host stringByReplacingCharactersInRange:NSMakeRange([host length] - 1, 1) withString:tld_match];
        }
        // escape periods - since '.' means any character in regex
        host = [host stringByReplacingOccurrencesOfString:@"." withString:@"\\."];
        // wildcard is match 1 or more characters (to make it simple, since we are not doing verification whether the hostname is valid)
        host = [host stringByReplacingOccurrencesOfString:@"*" withString:@".*"];

        [[_expandedWhitelists objectForKey:scheme] addObject:host];
    }

    self.expandedWhitelists = _expandedWhitelists;
}

- (BOOL)schemeIsAllowed:(NSString*)scheme
{
    if ([scheme isEqualToString:@"http"] ||
        [scheme isEqualToString:@"https"] ||
        [scheme isEqualToString:@"ftp"] ||
        [scheme isEqualToString:@"ftps"]) {
        return YES;
    }

    return (self.expandedWhitelists != nil) && ([self.expandedWhitelists objectForKey:scheme] != nil);
}

- (BOOL)URLIsAllowed:(NSURL*)url
{
    NSString* scheme = [url scheme];

    // http[s] and ftp[s] should also validate against the common set in the kCDVDefaultSchemeName list
    if ([scheme isEqualToString:@"http"] || [scheme isEqualToString:@"https"] || [scheme isEqualToString:@"ftp"] || [scheme isEqualToString:@"ftps"]) {
        NSURL* newUrl = [NSURL URLWithString:[NSString stringWithFormat:@"%@://%@", kCDVDefaultSchemeName, [url host]]];
        // If it is allowed, we are done.  If not, continue to check for the actual scheme-specific list
        if ([self URLIsAllowed:newUrl]) {
            return YES;
        }
    }

    // Check that the scheme is supported
    if (![self schemeIsAllowed:scheme]) {
        return NO;
    }

    NSArray* expandedWhitelist = [self.expandedWhitelists objectForKey:scheme];

    // Are we allowing everything for this scheme?
    // TODO: consider just having a static sentinel value for the "allow all" list, so we can use object equality
    if (([expandedWhitelist count] == 1) && [[expandedWhitelist objectAtIndex:0] isEqualToString:@"*"]) {
        return YES;
    }

    // iterate through settings ExternalHosts, check for equality
    NSEnumerator* enumerator = [expandedWhitelist objectEnumerator];
    id regex = nil;
    NSString* urlHost = [url host];

    // if the url host IS found in the whitelist, load it in the app (however UIWebViewNavigationTypeOther kicks it out to Safari)
    // if the url host IS NOT found in the whitelist, we do nothing
    while (regex = [enumerator nextObject]) {
        NSPredicate* regex_test = [NSPredicate predicateWithFormat:@"SELF MATCHES %@", regex];

        if ([regex_test evaluateWithObject:urlHost] == YES) {
            // if it matches at least one rule, return
            return YES;
        }
    }

    NSLog(@"%@", [self errorStringForURL:url]);
    // if we got here, the url host is not in the white-list, do nothing
    return NO;
}

- (NSString*)errorStringForURL:(NSURL*)url
{
    return [NSString stringWithFormat:self.whitelistRejectionFormatString, [url absoluteString]];
}

@end
