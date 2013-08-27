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

#import "CDVPlugin.h"
#import "CDVViewController.h"
#import "CDVCommandDelegate.h"
#import "CDVURLProtocol.h"
#import "CDVInvokedUrlCommand.h"

#import "CDVAccelerometer.h"
#import "CDVBattery.h"
#import "CDVCamera.h"
#import "CDVCapture.h"
#import "CDVConnection.h"
#import "CDVContact.h"
#import "CDVContacts.h"
#import "CDVDebug.h"
#import "CDVDevice.h"
#import "CDVFile.h"
#import "CDVFileTransfer.h"
#import "CDVLocation.h"
#import "CDVNotification.h"
#import "CDVPluginResult.h"
#import "CDVReachability.h"
#import "CDVSound.h"
#import "CDVSplashScreen.h"
#import "CDVWhitelist.h"
#import "CDVLocalStorage.h"
#import "CDVInAppBrowser.h"
#import "CDVScreenOrientationDelegate.h"
#import "CDVTimer.h"

#import "NSArray+Comparisons.h"
#import "NSData+Base64.h"
#import "NSDictionary+Extensions.h"
#import "NSMutableArray+QueueAdditions.h"
#import "UIDevice+Extensions.h"

#import "CDVJSON.h"
