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

#import "CDVPlugin.h"

#define kCDVLocalStorageErrorDomain @"kCDVLocalStorageErrorDomain"
#define kCDVLocalStorageFileOperationError 1

@interface CDVLocalStorage : CDVPlugin

@property (nonatomic, readonly, strong) NSMutableArray* backupInfo;

- (BOOL)shouldBackup;
- (BOOL)shouldRestore;
- (void)backup:(CDVInvokedUrlCommand*)command;
- (void)restore:(CDVInvokedUrlCommand*)command;

+ (void)__fixupDatabaseLocationsWithBackupType:(NSString*)backupType;
// Visible for testing.
+ (BOOL)__verifyAndFixDatabaseLocationsWithAppPlistDict:(NSMutableDictionary*)appPlistDict
                                             bundlePath:(NSString*)bundlePath
                                            fileManager:(NSFileManager*)fileManager;
@end

@interface CDVBackupInfo : NSObject

@property (nonatomic, copy) NSString* original;
@property (nonatomic, copy) NSString* backup;
@property (nonatomic, copy) NSString* label;

- (BOOL)shouldBackup;
- (BOOL)shouldRestore;

@end
