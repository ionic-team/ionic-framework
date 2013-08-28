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

#import "CDVLocation.h"
#import "NSArray+Comparisons.h"

#pragma mark Constants

#define kPGLocationErrorDomain @"kPGLocationErrorDomain"
#define kPGLocationDesiredAccuracyKey @"desiredAccuracy"
#define kPGLocationForcePromptKey @"forcePrompt"
#define kPGLocationDistanceFilterKey @"distanceFilter"
#define kPGLocationFrequencyKey @"frequency"

#pragma mark -
#pragma mark Categories

@interface NSError (JSONMethods)

- (NSString*)JSONRepresentation;

@end

@interface CLLocation (JSONMethods)

- (NSString*)JSONRepresentation;

@end

@interface CLHeading (JSONMethods)

- (NSString*)JSONRepresentation;

@end

#pragma mark -
#pragma mark CDVHeadingData

@implementation CDVHeadingData

@synthesize headingStatus, headingInfo, headingCallbacks, headingFilter, headingTimestamp, timeout;
- (CDVHeadingData*)init
{
    self = (CDVHeadingData*)[super init];
    if (self) {
        self.headingStatus = HEADINGSTOPPED;
        self.headingInfo = nil;
        self.headingCallbacks = nil;
        self.headingFilter = nil;
        self.headingTimestamp = nil;
        self.timeout = 10;
    }
    return self;
}

@end

@implementation CDVLocationData

@synthesize locationStatus, locationInfo, locationCallbacks, watchCallbacks;
- (CDVLocationData*)init
{
    self = (CDVLocationData*)[super init];
    if (self) {
        self.locationInfo = nil;
        self.locationCallbacks = nil;
        self.watchCallbacks = nil;
    }
    return self;
}

@end

#pragma mark -
#pragma mark CDVLocation

@implementation CDVLocation

@synthesize locationManager, headingData, locationData;

- (CDVPlugin*)initWithWebView:(UIWebView*)theWebView
{
    self = (CDVLocation*)[super initWithWebView:(UIWebView*)theWebView];
    if (self) {
        self.locationManager = [[CLLocationManager alloc] init];
        self.locationManager.delegate = self; // Tells the location manager to send updates to this object
        __locationStarted = NO;
        __highAccuracyEnabled = NO;
        self.headingData = nil;
        self.locationData = nil;
    }
    return self;
}

- (BOOL)hasHeadingSupport
{
    BOOL headingInstancePropertyAvailable = [self.locationManager respondsToSelector:@selector(headingAvailable)]; // iOS 3.x
    BOOL headingClassPropertyAvailable = [CLLocationManager respondsToSelector:@selector(headingAvailable)]; // iOS 4.x

    if (headingInstancePropertyAvailable) { // iOS 3.x
        return [(id)self.locationManager headingAvailable];
    } else if (headingClassPropertyAvailable) { // iOS 4.x
        return [CLLocationManager headingAvailable];
    } else { // iOS 2.x
        return NO;
    }
}

- (BOOL)isAuthorized
{
    BOOL authorizationStatusClassPropertyAvailable = [CLLocationManager respondsToSelector:@selector(authorizationStatus)]; // iOS 4.2+

    if (authorizationStatusClassPropertyAvailable) {
        NSUInteger authStatus = [CLLocationManager authorizationStatus];
        return (authStatus == kCLAuthorizationStatusAuthorized) || (authStatus == kCLAuthorizationStatusNotDetermined);
    }

    // by default, assume YES (for iOS < 4.2)
    return YES;
}

- (BOOL)isLocationServicesEnabled
{
    BOOL locationServicesEnabledInstancePropertyAvailable = [self.locationManager respondsToSelector:@selector(locationServicesEnabled)]; // iOS 3.x
    BOOL locationServicesEnabledClassPropertyAvailable = [CLLocationManager respondsToSelector:@selector(locationServicesEnabled)]; // iOS 4.x

    if (locationServicesEnabledClassPropertyAvailable) { // iOS 4.x
        return [CLLocationManager locationServicesEnabled];
    } else if (locationServicesEnabledInstancePropertyAvailable) { // iOS 2.x, iOS 3.x
        return [(id)self.locationManager locationServicesEnabled];
    } else {
        return NO;
    }
}

- (void)startLocation:(BOOL)enableHighAccuracy
{
    if (![self isLocationServicesEnabled]) {
        [self returnLocationError:PERMISSIONDENIED withMessage:@"Location services are not enabled."];
        return;
    }
    if (![self isAuthorized]) {
        NSString* message = nil;
        BOOL authStatusAvailable = [CLLocationManager respondsToSelector:@selector(authorizationStatus)]; // iOS 4.2+
        if (authStatusAvailable) {
            NSUInteger code = [CLLocationManager authorizationStatus];
            if (code == kCLAuthorizationStatusNotDetermined) {
                // could return POSITION_UNAVAILABLE but need to coordinate with other platforms
                message = @"User undecided on application's use of location services.";
            } else if (code == kCLAuthorizationStatusRestricted) {
                message = @"Application's use of location services is restricted.";
            }
        }
        // PERMISSIONDENIED is only PositionError that makes sense when authorization denied
        [self returnLocationError:PERMISSIONDENIED withMessage:message];

        return;
    }

    // Tell the location manager to start notifying us of location updates. We
    // first stop, and then start the updating to ensure we get at least one
    // update, even if our location did not change.
    [self.locationManager stopUpdatingLocation];
    [self.locationManager startUpdatingLocation];
    __locationStarted = YES;
    if (enableHighAccuracy) {
        __highAccuracyEnabled = YES;
        // Set to distance filter to "none" - which should be the minimum for best results.
        self.locationManager.distanceFilter = kCLDistanceFilterNone;
        // Set desired accuracy to Best.
        self.locationManager.desiredAccuracy = kCLLocationAccuracyBest;
    } else {
        __highAccuracyEnabled = NO;
        // TODO: Set distance filter to 10 meters? and desired accuracy to nearest ten meters? arbitrary.
        self.locationManager.distanceFilter = 10;
        self.locationManager.desiredAccuracy = kCLLocationAccuracyNearestTenMeters;
    }
}

- (void)_stopLocation
{
    if (__locationStarted) {
        if (![self isLocationServicesEnabled]) {
            return;
        }

        [self.locationManager stopUpdatingLocation];
        __locationStarted = NO;
        __highAccuracyEnabled = NO;
    }
}

- (void)locationManager:(CLLocationManager*)manager
    didUpdateToLocation:(CLLocation*)newLocation
           fromLocation:(CLLocation*)oldLocation
{
    CDVLocationData* cData = self.locationData;

    cData.locationInfo = newLocation;
    if (self.locationData.locationCallbacks.count > 0) {
        for (NSString* callbackId in self.locationData.locationCallbacks) {
            [self returnLocationInfo:callbackId andKeepCallback:NO];
        }

        [self.locationData.locationCallbacks removeAllObjects];
    }
    if (self.locationData.watchCallbacks.count > 0) {
        for (NSString* timerId in self.locationData.watchCallbacks) {
            [self returnLocationInfo:[self.locationData.watchCallbacks objectForKey:timerId] andKeepCallback:YES];
        }
    } else {
        // No callbacks waiting on us anymore, turn off listening.
        [self _stopLocation];
    }
}

- (void)getLocation:(CDVInvokedUrlCommand*)command
{
    NSString* callbackId = command.callbackId;
    BOOL enableHighAccuracy = [[command.arguments objectAtIndex:0] boolValue];

    if ([self isLocationServicesEnabled] == NO) {
        NSMutableDictionary* posError = [NSMutableDictionary dictionaryWithCapacity:2];
        [posError setObject:[NSNumber numberWithInt:PERMISSIONDENIED] forKey:@"code"];
        [posError setObject:@"Location services are disabled." forKey:@"message"];
        CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:posError];
        [self.commandDelegate sendPluginResult:result callbackId:callbackId];
    } else {
        if (!self.locationData) {
            self.locationData = [[CDVLocationData alloc] init];
        }
        CDVLocationData* lData = self.locationData;
        if (!lData.locationCallbacks) {
            lData.locationCallbacks = [NSMutableArray arrayWithCapacity:1];
        }

        if (!__locationStarted || (__highAccuracyEnabled != enableHighAccuracy)) {
            // add the callbackId into the array so we can call back when get data
            if (callbackId != nil) {
                [lData.locationCallbacks addObject:callbackId];
            }
            // Tell the location manager to start notifying us of heading updates
            [self startLocation:enableHighAccuracy];
        } else {
            [self returnLocationInfo:callbackId andKeepCallback:NO];
        }
    }
}

- (void)addWatch:(CDVInvokedUrlCommand*)command
{
    NSString* callbackId = command.callbackId;
    NSString* timerId = [command.arguments objectAtIndex:0];
    BOOL enableHighAccuracy = [[command.arguments objectAtIndex:1] boolValue];

    if (!self.locationData) {
        self.locationData = [[CDVLocationData alloc] init];
    }
    CDVLocationData* lData = self.locationData;

    if (!lData.watchCallbacks) {
        lData.watchCallbacks = [NSMutableDictionary dictionaryWithCapacity:1];
    }

    // add the callbackId into the dictionary so we can call back whenever get data
    [lData.watchCallbacks setObject:callbackId forKey:timerId];

    if ([self isLocationServicesEnabled] == NO) {
        NSMutableDictionary* posError = [NSMutableDictionary dictionaryWithCapacity:2];
        [posError setObject:[NSNumber numberWithInt:PERMISSIONDENIED] forKey:@"code"];
        [posError setObject:@"Location services are disabled." forKey:@"message"];
        CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:posError];
        [self.commandDelegate sendPluginResult:result callbackId:callbackId];
    } else {
        if (!__locationStarted || (__highAccuracyEnabled != enableHighAccuracy)) {
            // Tell the location manager to start notifying us of location updates
            [self startLocation:enableHighAccuracy];
        }
    }
}

- (void)clearWatch:(CDVInvokedUrlCommand*)command
{
    NSString* timerId = [command.arguments objectAtIndex:0];

    if (self.locationData && self.locationData.watchCallbacks && [self.locationData.watchCallbacks objectForKey:timerId]) {
        [self.locationData.watchCallbacks removeObjectForKey:timerId];
    }
}

- (void)stopLocation:(CDVInvokedUrlCommand*)command
{
    [self _stopLocation];
}

- (void)returnLocationInfo:(NSString*)callbackId andKeepCallback:(BOOL)keepCallback
{
    CDVPluginResult* result = nil;
    CDVLocationData* lData = self.locationData;

    if (lData && !lData.locationInfo) {
        // return error
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageToErrorObject:POSITIONUNAVAILABLE];
    } else if (lData && lData.locationInfo) {
        CLLocation* lInfo = lData.locationInfo;
        NSMutableDictionary* returnInfo = [NSMutableDictionary dictionaryWithCapacity:8];
        NSNumber* timestamp = [NSNumber numberWithDouble:([lInfo.timestamp timeIntervalSince1970] * 1000)];
        [returnInfo setObject:timestamp forKey:@"timestamp"];
        [returnInfo setObject:[NSNumber numberWithDouble:lInfo.speed] forKey:@"velocity"];
        [returnInfo setObject:[NSNumber numberWithDouble:lInfo.verticalAccuracy] forKey:@"altitudeAccuracy"];
        [returnInfo setObject:[NSNumber numberWithDouble:lInfo.horizontalAccuracy] forKey:@"accuracy"];
        [returnInfo setObject:[NSNumber numberWithDouble:lInfo.course] forKey:@"heading"];
        [returnInfo setObject:[NSNumber numberWithDouble:lInfo.altitude] forKey:@"altitude"];
        [returnInfo setObject:[NSNumber numberWithDouble:lInfo.coordinate.latitude] forKey:@"latitude"];
        [returnInfo setObject:[NSNumber numberWithDouble:lInfo.coordinate.longitude] forKey:@"longitude"];

        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:returnInfo];
        [result setKeepCallbackAsBool:keepCallback];
    }
    if (result) {
        [self.commandDelegate sendPluginResult:result callbackId:callbackId];
    }
}

- (void)returnLocationError:(NSUInteger)errorCode withMessage:(NSString*)message
{
    NSMutableDictionary* posError = [NSMutableDictionary dictionaryWithCapacity:2];

    [posError setObject:[NSNumber numberWithInt:errorCode] forKey:@"code"];
    [posError setObject:message ? message:@"" forKey:@"message"];
    CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:posError];

    for (NSString* callbackId in self.locationData.locationCallbacks) {
        [self.commandDelegate sendPluginResult:result callbackId:callbackId];
    }

    [self.locationData.locationCallbacks removeAllObjects];

    for (NSString* callbackId in self.locationData.watchCallbacks) {
        [self.commandDelegate sendPluginResult:result callbackId:callbackId];
    }
}

// called to get the current heading
// Will call location manager to startUpdatingHeading if necessary

- (void)getHeading:(CDVInvokedUrlCommand*)command
{
    NSString* callbackId = command.callbackId;
    NSDictionary* options = [command.arguments objectAtIndex:0 withDefault:nil];
    NSNumber* filter = [options valueForKey:@"filter"];

    if (filter) {
        [self watchHeadingFilter:command];
        return;
    }
    if ([self hasHeadingSupport] == NO) {
        CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsInt:20];
        [self.commandDelegate sendPluginResult:result callbackId:callbackId];
    } else {
        // heading retrieval does is not affected by disabling locationServices and authorization of app for location services
        if (!self.headingData) {
            self.headingData = [[CDVHeadingData alloc] init];
        }
        CDVHeadingData* hData = self.headingData;

        if (!hData.headingCallbacks) {
            hData.headingCallbacks = [NSMutableArray arrayWithCapacity:1];
        }
        // add the callbackId into the array so we can call back when get data
        [hData.headingCallbacks addObject:callbackId];

        if ((hData.headingStatus != HEADINGRUNNING) && (hData.headingStatus != HEADINGERROR)) {
            // Tell the location manager to start notifying us of heading updates
            [self startHeadingWithFilter:0.2];
        } else {
            [self returnHeadingInfo:callbackId keepCallback:NO];
        }
    }
}

// called to request heading updates when heading changes by a certain amount (filter)
- (void)watchHeadingFilter:(CDVInvokedUrlCommand*)command
{
    NSString* callbackId = command.callbackId;
    NSDictionary* options = [command.arguments objectAtIndex:0 withDefault:nil];
    NSNumber* filter = [options valueForKey:@"filter"];
    CDVHeadingData* hData = self.headingData;

    if ([self hasHeadingSupport] == NO) {
        CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsInt:20];
        [self.commandDelegate sendPluginResult:result callbackId:callbackId];
    } else {
        if (!hData) {
            self.headingData = [[CDVHeadingData alloc] init];
            hData = self.headingData;
        }
        if (hData.headingStatus != HEADINGRUNNING) {
            // Tell the location manager to start notifying us of heading updates
            [self startHeadingWithFilter:[filter doubleValue]];
        } else {
            // if already running check to see if due to existing watch filter
            if (hData.headingFilter && ![hData.headingFilter isEqualToString:callbackId]) {
                // new watch filter being specified
                // send heading data one last time to clear old successCallback
                [self returnHeadingInfo:hData.headingFilter keepCallback:NO];
            }
        }
        // save the new filter callback and update the headingFilter setting
        hData.headingFilter = callbackId;
        // check if need to stop and restart in order to change value???
        self.locationManager.headingFilter = [filter doubleValue];
    }
}

- (void)returnHeadingInfo:(NSString*)callbackId keepCallback:(BOOL)bRetain
{
    CDVPluginResult* result = nil;
    CDVHeadingData* hData = self.headingData;

    self.headingData.headingTimestamp = [NSDate date];

    if (hData && (hData.headingStatus == HEADINGERROR)) {
        // return error
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsInt:0];
    } else if (hData && (hData.headingStatus == HEADINGRUNNING) && hData.headingInfo) {
        // if there is heading info, return it
        CLHeading* hInfo = hData.headingInfo;
        NSMutableDictionary* returnInfo = [NSMutableDictionary dictionaryWithCapacity:4];
        NSNumber* timestamp = [NSNumber numberWithDouble:([hInfo.timestamp timeIntervalSince1970] * 1000)];
        [returnInfo setObject:timestamp forKey:@"timestamp"];
        [returnInfo setObject:[NSNumber numberWithDouble:hInfo.magneticHeading] forKey:@"magneticHeading"];
        id trueHeading = __locationStarted ? (id)[NSNumber numberWithDouble : hInfo.trueHeading] : (id)[NSNull null];
        [returnInfo setObject:trueHeading forKey:@"trueHeading"];
        [returnInfo setObject:[NSNumber numberWithDouble:hInfo.headingAccuracy] forKey:@"headingAccuracy"];

        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:returnInfo];
        [result setKeepCallbackAsBool:bRetain];
    }
    if (result) {
        [self.commandDelegate sendPluginResult:result callbackId:callbackId];
    }
}

- (void)stopHeading:(CDVInvokedUrlCommand*)command
{
    // CDVHeadingData* hData = self.headingData;
    if (self.headingData && (self.headingData.headingStatus != HEADINGSTOPPED)) {
        if (self.headingData.headingFilter) {
            // callback one last time to clear callback
            [self returnHeadingInfo:self.headingData.headingFilter keepCallback:NO];
            self.headingData.headingFilter = nil;
        }
        [self.locationManager stopUpdatingHeading];
        NSLog(@"heading STOPPED");
        self.headingData = nil;
    }
}

// helper method to check the orientation and start updating headings
- (void)startHeadingWithFilter:(CLLocationDegrees)filter
{
    // FYI UIDeviceOrientation and CLDeviceOrientation enums are currently the same
    self.locationManager.headingOrientation = (CLDeviceOrientation)self.viewController.interfaceOrientation;
    self.locationManager.headingFilter = filter;
    [self.locationManager startUpdatingHeading];
    self.headingData.headingStatus = HEADINGSTARTING;
}

- (BOOL)locationManagerShouldDisplayHeadingCalibration:(CLLocationManager*)manager
{
    return YES;
}

- (void)locationManager:(CLLocationManager*)manager
       didUpdateHeading:(CLHeading*)heading
{
    CDVHeadingData* hData = self.headingData;

    // normally we would clear the delegate to stop getting these notifications, but
    // we are sharing a CLLocationManager to get location data as well, so we do a nil check here
    // ideally heading and location should use their own CLLocationManager instances
    if (hData == nil) {
        return;
    }

    // save the data for next call into getHeadingData
    hData.headingInfo = heading;
    BOOL bTimeout = NO;
    if (!hData.headingFilter && hData.headingTimestamp) {
        bTimeout = fabs([hData.headingTimestamp timeIntervalSinceNow]) > hData.timeout;
    }

    if (hData.headingStatus == HEADINGSTARTING) {
        hData.headingStatus = HEADINGRUNNING; // so returnHeading info will work

        // this is the first update
        for (NSString* callbackId in hData.headingCallbacks) {
            [self returnHeadingInfo:callbackId keepCallback:NO];
        }

        [hData.headingCallbacks removeAllObjects];
    }
    if (hData.headingFilter) {
        [self returnHeadingInfo:hData.headingFilter keepCallback:YES];
    } else if (bTimeout) {
        [self stopHeading:nil];
    }
    hData.headingStatus = HEADINGRUNNING;  // to clear any error
}

- (void)locationManager:(CLLocationManager*)manager didFailWithError:(NSError*)error
{
    NSLog(@"locationManager::didFailWithError %@", [error localizedFailureReason]);

    // Compass Error
    if ([error code] == kCLErrorHeadingFailure) {
        CDVHeadingData* hData = self.headingData;
        if (hData) {
            if (hData.headingStatus == HEADINGSTARTING) {
                // heading error during startup - report error
                for (NSString* callbackId in hData.headingCallbacks) {
                    CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsInt:0];
                    [self.commandDelegate sendPluginResult:result callbackId:callbackId];
                }

                [hData.headingCallbacks removeAllObjects];
            } // else for frequency watches next call to getCurrentHeading will report error
            if (hData.headingFilter) {
                CDVPluginResult* resultFilter = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsInt:0];
                [self.commandDelegate sendPluginResult:resultFilter callbackId:hData.headingFilter];
            }
            hData.headingStatus = HEADINGERROR;
        }
    }
    // Location Error
    else {
        CDVLocationData* lData = self.locationData;
        if (lData && __locationStarted) {
            // TODO: probably have to once over the various error codes and return one of:
            // PositionError.PERMISSION_DENIED = 1;
            // PositionError.POSITION_UNAVAILABLE = 2;
            // PositionError.TIMEOUT = 3;
            NSUInteger positionError = POSITIONUNAVAILABLE;
            if (error.code == kCLErrorDenied) {
                positionError = PERMISSIONDENIED;
            }
            [self returnLocationError:positionError withMessage:[error localizedDescription]];
        }
    }

    [self.locationManager stopUpdatingLocation];
    __locationStarted = NO;
}

- (void)dealloc
{
    self.locationManager.delegate = nil;
}

- (void)onReset
{
    [self _stopLocation];
    [self.locationManager stopUpdatingHeading];
    self.headingData = nil;
}

@end

#pragma mark -
#pragma mark CLLocation(JSONMethods)

@implementation CLLocation (JSONMethods)

- (NSString*)JSONRepresentation
{
    return [NSString stringWithFormat:
           @"{ timestamp: %.00f, \
            coords: { latitude: %f, longitude: %f, altitude: %.02f, heading: %.02f, speed: %.02f, accuracy: %.02f, altitudeAccuracy: %.02f } \
            }",
           [self.timestamp timeIntervalSince1970] * 1000.0,
           self.coordinate.latitude,
           self.coordinate.longitude,
           self.altitude,
           self.course,
           self.speed,
           self.horizontalAccuracy,
           self.verticalAccuracy
    ];
}

@end

#pragma mark NSError(JSONMethods)

@implementation NSError (JSONMethods)

- (NSString*)JSONRepresentation
{
    return [NSString stringWithFormat:
           @"{ code: %d, message: '%@'}",
           self.code,
           [self localizedDescription]
    ];
}

@end
