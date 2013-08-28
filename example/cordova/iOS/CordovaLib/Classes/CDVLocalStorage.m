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

#import "CDVLocalStorage.h"
#import "CDV.h"

@interface CDVLocalStorage ()

@property (nonatomic, readwrite, strong) NSMutableArray* backupInfo;  // array of CDVBackupInfo objects
@property (nonatomic, readwrite, weak) id <UIWebViewDelegate> webviewDelegate;

@end

@implementation CDVLocalStorage

@synthesize backupInfo, webviewDelegate;

- (void)pluginInitialize
{
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(onResignActive)
                                                 name:UIApplicationWillResignActiveNotification object:nil];
    BOOL cloudBackup = [@"cloud" isEqualToString : self.commandDelegate.settings[@"BackupWebStorage"]];

    self.backupInfo = [[self class] createBackupInfoWithCloudBackup:cloudBackup];
}

#pragma mark -
#pragma mark Plugin interface methods

+ (NSMutableArray*)createBackupInfoWithTargetDir:(NSString*)targetDir backupDir:(NSString*)backupDir targetDirNests:(BOOL)targetDirNests backupDirNests:(BOOL)backupDirNests rename:(BOOL)rename
{
    /*
     This "helper" does so much work and has so many options it would probably be clearer to refactor the whole thing.
     Basically, there are three database locations:

     1. "Normal" dir -- LIB/<nested dires WebKit/LocalStorage etc>/<normal filenames>
     2. "Caches" dir -- LIB/Caches/<normal filenames>
     3. "Backup" dir -- DOC/Backups/<renamed filenames>

     And between these three, there are various migration paths, most of which only consider 2 of the 3, which is why this helper is based on 2 locations and has a notion of "direction".
     */
    NSMutableArray* backupInfo = [NSMutableArray arrayWithCapacity:3];

    NSString* original;
    NSString* backup;
    CDVBackupInfo* backupItem;

    // ////////// LOCALSTORAGE

    original = [targetDir stringByAppendingPathComponent:targetDirNests ? @"WebKit/LocalStorage/file__0.localstorage":@"file__0.localstorage"];
    backup = [backupDir stringByAppendingPathComponent:(backupDirNests ? @"WebKit/LocalStorage" : @"")];
    backup = [backup stringByAppendingPathComponent:(rename ? @"localstorage.appdata.db" : @"file__0.localstorage")];

    backupItem = [[CDVBackupInfo alloc] init];
    backupItem.backup = backup;
    backupItem.original = original;
    backupItem.label = @"localStorage database";

    [backupInfo addObject:backupItem];

    // ////////// WEBSQL MAIN DB

    original = [targetDir stringByAppendingPathComponent:targetDirNests ? @"WebKit/LocalStorage/Databases.db":@"Databases.db"];
    backup = [backupDir stringByAppendingPathComponent:(backupDirNests ? @"WebKit/LocalStorage" : @"")];
    backup = [backup stringByAppendingPathComponent:(rename ? @"websqlmain.appdata.db" : @"Databases.db")];

    backupItem = [[CDVBackupInfo alloc] init];
    backupItem.backup = backup;
    backupItem.original = original;
    backupItem.label = @"websql main database";

    [backupInfo addObject:backupItem];

    // ////////// WEBSQL DATABASES

    original = [targetDir stringByAppendingPathComponent:targetDirNests ? @"WebKit/LocalStorage/file__0":@"file__0"];
    backup = [backupDir stringByAppendingPathComponent:(backupDirNests ? @"WebKit/LocalStorage" : @"")];
    backup = [backup stringByAppendingPathComponent:(rename ? @"websqldbs.appdata.db" : @"file__0")];

    backupItem = [[CDVBackupInfo alloc] init];
    backupItem.backup = backup;
    backupItem.original = original;
    backupItem.label = @"websql databases";

    [backupInfo addObject:backupItem];

    return backupInfo;
}

+ (NSMutableArray*)createBackupInfoWithCloudBackup:(BOOL)cloudBackup
{
    // create backup info from backup folder to caches folder
    NSString* appLibraryFolder = [NSSearchPathForDirectoriesInDomains(NSLibraryDirectory, NSUserDomainMask, YES) objectAtIndex:0];
    NSString* appDocumentsFolder = [NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES) objectAtIndex:0];
    NSString* cacheFolder = [appLibraryFolder stringByAppendingPathComponent:@"Caches"];
    NSString* backupsFolder = [appDocumentsFolder stringByAppendingPathComponent:@"Backups"];

    // create the backups folder, if needed
    [[NSFileManager defaultManager] createDirectoryAtPath:backupsFolder withIntermediateDirectories:YES attributes:nil error:nil];

    [self addSkipBackupAttributeToItemAtURL:[NSURL fileURLWithPath:backupsFolder] skip:!cloudBackup];

    return [self createBackupInfoWithTargetDir:cacheFolder backupDir:backupsFolder targetDirNests:NO backupDirNests:NO rename:YES];
}

+ (BOOL)addSkipBackupAttributeToItemAtURL:(NSURL*)URL skip:(BOOL)skip
{
    NSAssert(IsAtLeastiOSVersion(@"5.1"), @"Cannot mark files for NSURLIsExcludedFromBackupKey on iOS less than 5.1");

    NSError* error = nil;
    BOOL success = [URL setResourceValue:[NSNumber numberWithBool:skip] forKey:NSURLIsExcludedFromBackupKey error:&error];
    if (!success) {
        NSLog(@"Error excluding %@ from backup %@", [URL lastPathComponent], error);
    }
    return success;
}

+ (BOOL)copyFrom:(NSString*)src to:(NSString*)dest error:(NSError* __autoreleasing*)error
{
    NSFileManager* fileManager = [NSFileManager defaultManager];

    if (![fileManager fileExistsAtPath:src]) {
        NSString* errorString = [NSString stringWithFormat:@"%@ file does not exist.", src];
        if (error != NULL) {
            (*error) = [NSError errorWithDomain:kCDVLocalStorageErrorDomain
                                           code:kCDVLocalStorageFileOperationError
                                       userInfo:[NSDictionary dictionaryWithObject:errorString
                                                                            forKey:NSLocalizedDescriptionKey]];
        }
        return NO;
    }

    // generate unique filepath in temp directory
    CFUUIDRef uuidRef = CFUUIDCreate(kCFAllocatorDefault);
    CFStringRef uuidString = CFUUIDCreateString(kCFAllocatorDefault, uuidRef);
    NSString* tempBackup = [[NSTemporaryDirectory() stringByAppendingPathComponent:(__bridge NSString*)uuidString] stringByAppendingPathExtension:@"bak"];
    CFRelease(uuidString);
    CFRelease(uuidRef);

    BOOL destExists = [fileManager fileExistsAtPath:dest];

    // backup the dest
    if (destExists && ![fileManager copyItemAtPath:dest toPath:tempBackup error:error]) {
        return NO;
    }

    // remove the dest
    if (destExists && ![fileManager removeItemAtPath:dest error:error]) {
        return NO;
    }

    // create path to dest
    if (!destExists && ![fileManager createDirectoryAtPath:[dest stringByDeletingLastPathComponent] withIntermediateDirectories:YES attributes:nil error:error]) {
        return NO;
    }

    // copy src to dest
    if ([fileManager copyItemAtPath:src toPath:dest error:error]) {
        // success - cleanup - delete the backup to the dest
        if ([fileManager fileExistsAtPath:tempBackup]) {
            [fileManager removeItemAtPath:tempBackup error:error];
        }
        return YES;
    } else {
        // failure - we restore the temp backup file to dest
        [fileManager copyItemAtPath:tempBackup toPath:dest error:error];
        // cleanup - delete the backup to the dest
        if ([fileManager fileExistsAtPath:tempBackup]) {
            [fileManager removeItemAtPath:tempBackup error:error];
        }
        return NO;
    }
}

- (BOOL)shouldBackup
{
    for (CDVBackupInfo* info in self.backupInfo) {
        if ([info shouldBackup]) {
            return YES;
        }
    }

    return NO;
}

- (BOOL)shouldRestore
{
    for (CDVBackupInfo* info in self.backupInfo) {
        if ([info shouldRestore]) {
            return YES;
        }
    }

    return NO;
}

/* copy from webkitDbLocation to persistentDbLocation */
- (void)backup:(CDVInvokedUrlCommand*)command
{
    NSString* callbackId = command.callbackId;

    NSError* __autoreleasing error = nil;
    CDVPluginResult* result = nil;
    NSString* message = nil;

    for (CDVBackupInfo* info in self.backupInfo) {
        if ([info shouldBackup]) {
            [[self class] copyFrom:info.original to:info.backup error:&error];

            if (callbackId) {
                if (error == nil) {
                    message = [NSString stringWithFormat:@"Backed up: %@", info.label];
                    NSLog(@"%@", message);

                    result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:message];
                    [self.commandDelegate sendPluginResult:result callbackId:callbackId];
                } else {
                    message = [NSString stringWithFormat:@"Error in CDVLocalStorage (%@) backup: %@", info.label, [error localizedDescription]];
                    NSLog(@"%@", message);

                    result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:message];
                    [self.commandDelegate sendPluginResult:result callbackId:callbackId];
                }
            }
        }
    }
}

/* copy from persistentDbLocation to webkitDbLocation */
- (void)restore:(CDVInvokedUrlCommand*)command
{
    NSError* __autoreleasing error = nil;
    CDVPluginResult* result = nil;
    NSString* message = nil;

    for (CDVBackupInfo* info in self.backupInfo) {
        if ([info shouldRestore]) {
            [[self class] copyFrom:info.backup to:info.original error:&error];

            if (error == nil) {
                message = [NSString stringWithFormat:@"Restored: %@", info.label];
                NSLog(@"%@", message);

                result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:message];
                [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
            } else {
                message = [NSString stringWithFormat:@"Error in CDVLocalStorage (%@) restore: %@", info.label, [error localizedDescription]];
                NSLog(@"%@", message);

                result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:message];
                [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
            }
        }
    }
}

+ (void)__fixupDatabaseLocationsWithBackupType:(NSString*)backupType
{
    [self __verifyAndFixDatabaseLocations];
    [self __restoreLegacyDatabaseLocationsWithBackupType:backupType];
}

+ (void)__verifyAndFixDatabaseLocations
{
    NSBundle* mainBundle = [NSBundle mainBundle];
    NSString* bundlePath = [[mainBundle bundlePath] stringByDeletingLastPathComponent];
    NSString* bundleIdentifier = [[mainBundle infoDictionary] objectForKey:@"CFBundleIdentifier"];
    NSString* appPlistPath = [bundlePath stringByAppendingPathComponent:[NSString stringWithFormat:@"Library/Preferences/%@.plist", bundleIdentifier]];

    NSMutableDictionary* appPlistDict = [NSMutableDictionary dictionaryWithContentsOfFile:appPlistPath];
    BOOL modified = [[self class] __verifyAndFixDatabaseLocationsWithAppPlistDict:appPlistDict
                                                                       bundlePath:bundlePath
                                                                      fileManager:[NSFileManager defaultManager]];

    if (modified) {
        BOOL ok = [appPlistDict writeToFile:appPlistPath atomically:YES];
        [[NSUserDefaults standardUserDefaults] synchronize];
        NSLog(@"Fix applied for database locations?: %@", ok ? @"YES" : @"NO");
    }
}

+ (BOOL)__verifyAndFixDatabaseLocationsWithAppPlistDict:(NSMutableDictionary*)appPlistDict
                                             bundlePath:(NSString*)bundlePath
                                            fileManager:(NSFileManager*)fileManager
{
    NSString* libraryCaches = @"Library/Caches";
    NSString* libraryWebKit = @"Library/WebKit";

    NSArray* keysToCheck = [NSArray arrayWithObjects:
        @"WebKitLocalStorageDatabasePathPreferenceKey",
        @"WebDatabaseDirectory",
        nil];

    BOOL dirty = NO;

    for (NSString* key in keysToCheck) {
        NSString* value = [appPlistDict objectForKey:key];
        // verify key exists, and path is in app bundle, if not - fix
        if ((value != nil) && ![value hasPrefix:bundlePath]) {
            // the pathSuffix to use may be wrong - OTA upgrades from < 5.1 to 5.1 do keep the old path Library/WebKit,
            // while Xcode synced ones do change the storage location to Library/Caches
            NSString* newBundlePath = [bundlePath stringByAppendingPathComponent:libraryCaches];
            if (![fileManager fileExistsAtPath:newBundlePath]) {
                newBundlePath = [bundlePath stringByAppendingPathComponent:libraryWebKit];
            }
            [appPlistDict setValue:newBundlePath forKey:key];
            dirty = YES;
        }
    }

    return dirty;
}

+ (void)__restoreLegacyDatabaseLocationsWithBackupType:(NSString*)backupType
{
    // on iOS 6, if you toggle between cloud/local backup, you must move database locations.  Default upgrade from iOS5.1 to iOS6 is like a toggle from local to cloud.
    if (!IsAtLeastiOSVersion(@"6.0")) {
        return;
    }

    NSString* appLibraryFolder = [NSSearchPathForDirectoriesInDomains(NSLibraryDirectory, NSUserDomainMask, YES) objectAtIndex:0];
    NSString* appDocumentsFolder = [NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES) objectAtIndex:0];

    NSMutableArray* backupInfo = [NSMutableArray arrayWithCapacity:0];

    if ([backupType isEqualToString:@"cloud"]) {
        // We would like to restore old backups/caches databases to the new destination (nested in lib folder)
        [backupInfo addObjectsFromArray:[self createBackupInfoWithTargetDir:appLibraryFolder backupDir:[appDocumentsFolder stringByAppendingPathComponent:@"Backups"] targetDirNests:YES backupDirNests:NO rename:YES]];
        [backupInfo addObjectsFromArray:[self createBackupInfoWithTargetDir:appLibraryFolder backupDir:[appLibraryFolder stringByAppendingPathComponent:@"Caches"] targetDirNests:YES backupDirNests:NO rename:NO]];
    } else {
        // For ios6 local backups we also want to restore from Backups dir -- but we don't need to do that here, since the plugin will do that itself.
        [backupInfo addObjectsFromArray:[self createBackupInfoWithTargetDir:[appLibraryFolder stringByAppendingPathComponent:@"Caches"] backupDir:appLibraryFolder targetDirNests:NO backupDirNests:YES rename:NO]];
    }

    NSFileManager* manager = [NSFileManager defaultManager];

    for (CDVBackupInfo* info in backupInfo) {
        if ([manager fileExistsAtPath:info.backup]) {
            if ([info shouldRestore]) {
                NSLog(@"Restoring old webstorage backup. From: '%@' To: '%@'.", info.backup, info.original);
                [self copyFrom:info.backup to:info.original error:nil];
            }
            NSLog(@"Removing old webstorage backup: '%@'.", info.backup);
            [manager removeItemAtPath:info.backup error:nil];
        }
    }

    [[NSUserDefaults standardUserDefaults] setBool:[backupType isEqualToString:@"cloud"] forKey:@"WebKitStoreWebDataForBackup"];
}

#pragma mark -
#pragma mark Notification handlers

- (void)onResignActive
{
    UIDevice* device = [UIDevice currentDevice];
    NSNumber* exitsOnSuspend = [[NSBundle mainBundle] objectForInfoDictionaryKey:@"UIApplicationExitsOnSuspend"];

    BOOL isMultitaskingSupported = [device respondsToSelector:@selector(isMultitaskingSupported)] && [device isMultitaskingSupported];

    if (exitsOnSuspend == nil) { // if it's missing, it should be NO (i.e. multi-tasking on by default)
        exitsOnSuspend = [NSNumber numberWithBool:NO];
    }

    if (exitsOnSuspend) {
        [self backup:nil];
    } else if (isMultitaskingSupported) {
        __block UIBackgroundTaskIdentifier backgroundTaskID = UIBackgroundTaskInvalid;

        backgroundTaskID = [[UIApplication sharedApplication] beginBackgroundTaskWithExpirationHandler:^{
                [[UIApplication sharedApplication] endBackgroundTask:backgroundTaskID];
                backgroundTaskID = UIBackgroundTaskInvalid;
                NSLog(@"Background task to backup WebSQL/LocalStorage expired.");
            }];
        CDVLocalStorage __weak* weakSelf = self;
        [self.commandDelegate runInBackground:^{
            [weakSelf backup:nil];

            [[UIApplication sharedApplication] endBackgroundTask:backgroundTaskID];
            backgroundTaskID = UIBackgroundTaskInvalid;
        }];
    }
}

- (void)onAppTerminate
{
    [self onResignActive];
}

- (void)onReset
{
    [self restore:nil];
}

@end

#pragma mark -
#pragma mark CDVBackupInfo implementation

@implementation CDVBackupInfo

@synthesize original, backup, label;

- (BOOL)file:(NSString*)aPath isNewerThanFile:(NSString*)bPath
{
    NSFileManager* fileManager = [NSFileManager defaultManager];
    NSError* __autoreleasing error = nil;

    NSDictionary* aPathAttribs = [fileManager attributesOfItemAtPath:aPath error:&error];
    NSDictionary* bPathAttribs = [fileManager attributesOfItemAtPath:bPath error:&error];

    NSDate* aPathModDate = [aPathAttribs objectForKey:NSFileModificationDate];
    NSDate* bPathModDate = [bPathAttribs objectForKey:NSFileModificationDate];

    if ((nil == aPathModDate) && (nil == bPathModDate)) {
        return NO;
    }

    return [aPathModDate compare:bPathModDate] == NSOrderedDescending || bPathModDate == nil;
}

- (BOOL)item:(NSString*)aPath isNewerThanItem:(NSString*)bPath
{
    NSFileManager* fileManager = [NSFileManager defaultManager];

    BOOL aPathIsDir = NO, bPathIsDir = NO;
    BOOL aPathExists = [fileManager fileExistsAtPath:aPath isDirectory:&aPathIsDir];

    [fileManager fileExistsAtPath:bPath isDirectory:&bPathIsDir];

    if (!aPathExists) {
        return NO;
    }

    if (!(aPathIsDir && bPathIsDir)) { // just a file
        return [self file:aPath isNewerThanFile:bPath];
    }

    // essentially we want rsync here, but have to settle for our poor man's implementation
    // we get the files in aPath, and see if it is newer than the file in bPath
    // (it is newer if it doesn't exist in bPath) if we encounter the FIRST file that is newer,
    // we return YES
    NSDirectoryEnumerator* directoryEnumerator = [fileManager enumeratorAtPath:aPath];
    NSString* path;

    while ((path = [directoryEnumerator nextObject])) {
        NSString* aPathFile = [aPath stringByAppendingPathComponent:path];
        NSString* bPathFile = [bPath stringByAppendingPathComponent:path];

        BOOL isNewer = [self file:aPathFile isNewerThanFile:bPathFile];
        if (isNewer) {
            return YES;
        }
    }

    return NO;
}

- (BOOL)shouldBackup
{
    return [self item:self.original isNewerThanItem:self.backup];
}

- (BOOL)shouldRestore
{
    return [self item:self.backup isNewerThanItem:self.original];
}

@end
