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

#import <UIKit/UIKit.h>
#import <CoreLocation/CoreLocation.h>
#import "CDVPlugin.h"

enum CDVHeadingStatus {
    HEADINGSTOPPED = 0,
    HEADINGSTARTING,
    HEADINGRUNNING,
    HEADINGERROR
};
typedef NSUInteger CDVHeadingStatus;

enum CDVLocationStatus {
    PERMISSIONDENIED = 1,
    POSITIONUNAVAILABLE,
    TIMEOUT
};
typedef NSUInteger CDVLocationStatus;

// simple object to keep track of heading information
@interface CDVHeadingData : NSObject {}

@property (nonatomic, assign) CDVHeadingStatus headingStatus;
@property (nonatomic, strong) CLHeading* headingInfo;
@property (nonatomic, strong) NSMutableArray* headingCallbacks;
@property (nonatomic, copy) NSString* headingFilter;
@property (nonatomic, strong) NSDate* headingTimestamp;
@property (assign) NSInteger timeout;

@end

// simple object to keep track of location information
@interface CDVLocationData : NSObject {
    CDVLocationStatus locationStatus;
    NSMutableArray* locationCallbacks;
    NSMutableDictionary* watchCallbacks;
    CLLocation* locationInfo;
}

@property (nonatomic, assign) CDVLocationStatus locationStatus;
@property (nonatomic, strong) CLLocation* locationInfo;
@property (nonatomic, strong) NSMutableArray* locationCallbacks;
@property (nonatomic, strong) NSMutableDictionary* watchCallbacks;

@end

@interface CDVLocation : CDVPlugin <CLLocationManagerDelegate>{
    @private BOOL __locationStarted;
    @private BOOL __highAccuracyEnabled;
    CDVHeadingData* headingData;
    CDVLocationData* locationData;
}

@property (nonatomic, strong) CLLocationManager* locationManager;
@property (strong) CDVHeadingData* headingData;
@property (nonatomic, strong) CDVLocationData* locationData;

- (BOOL)hasHeadingSupport;
- (void)getLocation:(CDVInvokedUrlCommand*)command;
- (void)addWatch:(CDVInvokedUrlCommand*)command;
- (void)clearWatch:(CDVInvokedUrlCommand*)command;
- (void)returnLocationInfo:(NSString*)callbackId andKeepCallback:(BOOL)keepCallback;
- (void)returnLocationError:(NSUInteger)errorCode withMessage:(NSString*)message;
- (void)startLocation:(BOOL)enableHighAccuracy;

- (void)locationManager:(CLLocationManager*)manager
    didUpdateToLocation:(CLLocation*)newLocation
           fromLocation:(CLLocation*)oldLocation;

- (void)locationManager:(CLLocationManager*)manager
       didFailWithError:(NSError*)error;

- (BOOL)isLocationServicesEnabled;

- (void)getHeading:(CDVInvokedUrlCommand*)command;
- (void)returnHeadingInfo:(NSString*)callbackId keepCallback:(BOOL)bRetain;
- (void)watchHeadingFilter:(CDVInvokedUrlCommand*)command;
- (void)stopHeading:(CDVInvokedUrlCommand*)command;
- (void)startHeadingWithFilter:(CLLocationDegrees)filter;
- (void)locationManager:(CLLocationManager*)manager
       didUpdateHeading:(CLHeading*)heading;

- (BOOL)locationManagerShouldDisplayHeadingCalibration:(CLLocationManager*)manager;

@end
