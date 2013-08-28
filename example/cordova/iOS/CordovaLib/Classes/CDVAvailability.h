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

#define __CORDOVA_IOS__

#define __CORDOVA_0_9_6 906
#define __CORDOVA_1_0_0 10000
#define __CORDOVA_1_1_0 10100
#define __CORDOVA_1_2_0 10200
#define __CORDOVA_1_3_0 10300
#define __CORDOVA_1_4_0 10400
#define __CORDOVA_1_4_1 10401
#define __CORDOVA_1_5_0 10500
#define __CORDOVA_1_6_0 10600
#define __CORDOVA_1_6_1 10601
#define __CORDOVA_1_7_0 10700
#define __CORDOVA_1_8_0 10800
#define __CORDOVA_1_8_1 10801
#define __CORDOVA_1_9_0 10900
#define __CORDOVA_2_0_0 20000
#define __CORDOVA_2_1_0 20100
#define __CORDOVA_2_2_0 20200
#define __CORDOVA_2_3_0 20300
#define __CORDOVA_2_4_0 20400
#define __CORDOVA_2_5_0 20500
#define __CORDOVA_2_6_0 20600
#define __CORDOVA_2_7_0 20700
#define __CORDOVA_NA 99999      /* not available */

/*
 #if CORDOVA_VERSION_MIN_REQUIRED >= __CORDOVA_1_7_0
    // do something when its at least 1.7.0
 #else
    // do something else (non 1.7.0)
 #endif
 */
#ifndef CORDOVA_VERSION_MIN_REQUIRED
    #define CORDOVA_VERSION_MIN_REQUIRED __CORDOVA_2_7_0
#endif

/*
 Returns YES if it is at least version specified as NSString(X)
 Usage:
     if (IsAtLeastiOSVersion(@"5.1")) {
         // do something for iOS 5.1 or greater
     }
 */
#define IsAtLeastiOSVersion(X) ([[[UIDevice currentDevice] systemVersion] compare:X options:NSNumericSearch] != NSOrderedAscending)

#define CDV_IsIPad() ([[UIDevice currentDevice] respondsToSelector:@selector(userInterfaceIdiom)] && ([[UIDevice currentDevice] userInterfaceIdiom] == UIUserInterfaceIdiomPad))

#define CDV_IsIPhone5() ([[UIScreen mainScreen] bounds].size.height == 568 && [[UIScreen mainScreen] bounds].size.width == 320)

/* Return the string version of the decimal version */
#define CDV_VERSION [NSString stringWithFormat:@"%d.%d.%d", \
    (CORDOVA_VERSION_MIN_REQUIRED / 10000),                 \
    (CORDOVA_VERSION_MIN_REQUIRED % 10000) / 100,           \
    (CORDOVA_VERSION_MIN_REQUIRED % 10000) % 100]

#ifdef __clang__
    #define CDV_DEPRECATED(version, msg) __attribute__((deprecated("Deprecated in Cordova " #version ". " msg)))
#else
    #define CDV_DEPRECATED(version, msg) __attribute__((deprecated()))
#endif

// Enable this to log all exec() calls.
#define CDV_ENABLE_EXEC_LOGGING 0
#if CDV_ENABLE_EXEC_LOGGING
    #define CDV_EXEC_LOG NSLog
#else
    #define CDV_EXEC_LOG(...) do {} while (NO)
#endif
