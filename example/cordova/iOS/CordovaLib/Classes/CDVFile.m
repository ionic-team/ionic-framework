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

#import "CDVFile.h"
#import "NSArray+Comparisons.h"
#import "NSDictionary+Extensions.h"
#import "CDVJSON.h"
#import "NSData+Base64.h"
#import <AssetsLibrary/ALAsset.h>
#import <AssetsLibrary/ALAssetRepresentation.h>
#import <AssetsLibrary/ALAssetsLibrary.h>
#import <MobileCoreServices/MobileCoreServices.h>
#import "CDVAvailability.h"
#import "sys/xattr.h"

extern NSString * const NSURLIsExcludedFromBackupKey __attribute__((weak_import));

#ifndef __IPHONE_5_1
    NSString* const NSURLIsExcludedFromBackupKey = @"NSURLIsExcludedFromBackupKey";
#endif

NSString* const kCDVAssetsLibraryPrefix = @"assets-library://";

@implementation CDVFile

@synthesize appDocsPath, appLibraryPath, appTempPath, persistentPath, temporaryPath, userHasAllowed;

- (id)initWithWebView:(UIWebView*)theWebView
{
    self = (CDVFile*)[super initWithWebView:theWebView];
    if (self) {
        // get the documents directory path
        NSArray* paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
        self.appDocsPath = [paths objectAtIndex:0];

        paths = NSSearchPathForDirectoriesInDomains(NSLibraryDirectory, NSUserDomainMask, YES);
        self.appLibraryPath = [paths objectAtIndex:0];

        self.appTempPath = [NSTemporaryDirectory()stringByStandardizingPath];   // remove trailing slash from NSTemporaryDirectory()

        self.persistentPath = [NSString stringWithFormat:@"/%@", [self.appDocsPath lastPathComponent]];
        self.temporaryPath = [NSString stringWithFormat:@"/%@", [self.appTempPath lastPathComponent]];
        // NSLog(@"docs: %@ - temp: %@", self.appDocsPath, self.appTempPath);
    }

    return self;
}

- (NSNumber*)checkFreeDiskSpace:(NSString*)appPath
{
    NSFileManager* fMgr = [[NSFileManager alloc] init];

    NSError* __autoreleasing pError = nil;

    NSDictionary* pDict = [fMgr attributesOfFileSystemForPath:appPath error:&pError];
    NSNumber* pNumAvail = (NSNumber*)[pDict objectForKey:NSFileSystemFreeSize];

    return pNumAvail;
}

// figure out if the pathFragment represents a persistent of temporary directory and return the full application path.
// returns nil if path is not persistent or temporary
- (NSString*)getAppPath:(NSString*)pathFragment
{
    NSString* appPath = nil;
    NSRange rangeP = [pathFragment rangeOfString:self.persistentPath];
    NSRange rangeT = [pathFragment rangeOfString:self.temporaryPath];

    if ((rangeP.location != NSNotFound) && (rangeT.location != NSNotFound)) {
        // we found both in the path, return whichever one is first
        if (rangeP.length < rangeT.length) {
            appPath = self.appDocsPath;
        } else {
            appPath = self.appTempPath;
        }
    } else if (rangeP.location != NSNotFound) {
        appPath = self.appDocsPath;
    } else if (rangeT.location != NSNotFound) {
        appPath = self.appTempPath;
    }
    return appPath;
}

/* get the full path to this resource
 * IN
 *	NSString* pathFragment - full Path from File or Entry object (includes system path info)
 * OUT
 *	NSString* fullPath - full iOS path to this resource,  nil if not found
 */

/*  Was here in order to NOT have to return full path, but W3C synchronous DirectoryEntry.toURI() killed that idea since I can't call into iOS to
 * resolve full URI.  Leaving this code here in case W3C spec changes.
-(NSString*) getFullPath: (NSString*)pathFragment
{
    return pathFragment;
    NSString* fullPath = nil;
    NSString *appPath = [ self getAppPath: pathFragment];
    if (appPath){

        // remove last component from appPath
        NSRange range = [appPath rangeOfString:@"/" options: NSBackwardsSearch];
        NSString* newPath = [appPath substringToIndex:range.location];
        // add pathFragment to get test Path
        fullPath = [newPath stringByAppendingPathComponent:pathFragment];
    }
    return fullPath;
} */

/* Request the File System info
 *
 * IN:
 * arguments[0] - type (number as string)
 *	TEMPORARY = 0, PERSISTENT = 1;
 * arguments[1] - size
 *
 * OUT:
 *	Dictionary representing FileSystem object
 *		name - the human readable directory name
 *		root = DirectoryEntry object
 *			bool isDirectory
 *			bool isFile
 *			string name
 *			string fullPath
 *			fileSystem = FileSystem object - !! ignored because creates circular reference !!
 */

- (void)requestFileSystem:(CDVInvokedUrlCommand*)command
{
    NSArray* arguments = command.arguments;

    // arguments
    NSString* strType = [arguments objectAtIndex:0];
    unsigned long long size = [[arguments objectAtIndex:1] longLongValue];

    int type = [strType intValue];
    CDVPluginResult* result = nil;

    if (type > 1) {
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsInt:NOT_FOUND_ERR];
        NSLog(@"iOS only supports TEMPORARY and PERSISTENT file systems");
    } else {
        // NSString* fullPath = [NSString stringWithFormat:@"/%@", (type == 0 ? [self.appTempPath lastPathComponent] : [self.appDocsPath lastPathComponent])];
        NSString* fullPath = (type == 0 ? self.appTempPath  : self.appDocsPath);
        // check for avail space for size request
        NSNumber* pNumAvail = [self checkFreeDiskSpace:fullPath];
        // NSLog(@"Free space: %@", [NSString stringWithFormat:@"%qu", [ pNumAvail unsignedLongLongValue ]]);
        if (pNumAvail && ([pNumAvail unsignedLongLongValue] < size)) {
            result = [CDVPluginResult resultWithStatus:CDVCommandStatus_IO_EXCEPTION messageAsInt:QUOTA_EXCEEDED_ERR];
        } else {
            NSMutableDictionary* fileSystem = [NSMutableDictionary dictionaryWithCapacity:2];
            [fileSystem setObject:(type == TEMPORARY ? kW3FileTemporary : kW3FilePersistent) forKey:@"name"];
            NSDictionary* dirEntry = [self getDirectoryEntry:fullPath isDirectory:YES];
            [fileSystem setObject:dirEntry forKey:@"root"];
            result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:fileSystem];
        }
    }
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

/* Creates a dictionary representing an Entry Object
 *
 * IN:
 * NSString* fullPath of the entry
 * FileSystem type
 * BOOL isDirectory - YES if this is a directory, NO if is a file
 * OUT:
 * NSDictionary*
 Entry object
 *		bool as NSNumber isDirectory
 *		bool as NSNumber isFile
 *		NSString*  name - last part of path
 *		NSString* fullPath
 *		fileSystem = FileSystem object - !! ignored because creates circular reference FileSystem contains DirectoryEntry which contains FileSystem.....!!
 */
- (NSDictionary*)getDirectoryEntry:(NSString*)fullPath isDirectory:(BOOL)isDir
{
    NSMutableDictionary* dirEntry = [NSMutableDictionary dictionaryWithCapacity:4];
    NSString* lastPart = [fullPath lastPathComponent];

    [dirEntry setObject:[NSNumber numberWithBool:!isDir]  forKey:@"isFile"];
    [dirEntry setObject:[NSNumber numberWithBool:isDir]  forKey:@"isDirectory"];
    // NSURL* fileUrl = [NSURL fileURLWithPath:fullPath];
    // [dirEntry setObject: [fileUrl absoluteString] forKey: @"fullPath"];
    [dirEntry setObject:fullPath forKey:@"fullPath"];
    [dirEntry setObject:lastPart forKey:@"name"];

    return dirEntry;
}

/*
 * Given a URI determine the File System information associated with it and return an appropriate W3C entry object
 * IN
 *	NSString* fileURI  - currently requires full file URI
 * OUT
 *	Entry object
 *		bool isDirectory
 *		bool isFile
 *		string name
 *		string fullPath
 *		fileSystem = FileSystem object - !! ignored because creates circular reference FileSystem contains DirectoryEntry which contains FileSystem.....!!
 */
- (void)resolveLocalFileSystemURI:(CDVInvokedUrlCommand*)command
{
    // arguments
    NSString* inputUri = [command.arguments objectAtIndex:0];

    // don't know if string is encoded or not so unescape
    NSString* cleanUri = [inputUri stringByReplacingPercentEscapesUsingEncoding:NSUTF8StringEncoding];
    // now escape in order to create URL
    NSString* strUri = [cleanUri stringByAddingPercentEscapesUsingEncoding:NSUTF8StringEncoding];
    NSURL* testUri = [NSURL URLWithString:strUri];
    CDVPluginResult* result = nil;

    if (!testUri) {
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsInt:ENCODING_ERR];
    } else if ([testUri isFileURL]) {
        NSFileManager* fileMgr = [[NSFileManager alloc] init];
        NSString* path = [testUri path];
        // NSLog(@"url path: %@", path);
        BOOL isDir = NO;
        // see if exists and is file or dir
        BOOL bExists = [fileMgr fileExistsAtPath:path isDirectory:&isDir];
        if (bExists) {
            // see if it contains docs path
            NSRange range = [path rangeOfString:self.appDocsPath];
            NSString* foundFullPath = nil;
            // there's probably an api or easier way to figure out the path type but I can't find it!
            if ((range.location != NSNotFound) && (range.length == [self.appDocsPath length])) {
                foundFullPath = self.appDocsPath;
            } else {
                // see if it contains the temp path
                range = [path rangeOfString:self.appTempPath];
                if ((range.location != NSNotFound) && (range.length == [self.appTempPath length])) {
                    foundFullPath = self.appTempPath;
                }
            }
            if (foundFullPath == nil) {
                // error SECURITY_ERR - not one of the two paths types supported
                result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsInt:SECURITY_ERR];
            } else {
                NSDictionary* fileSystem = [self getDirectoryEntry:path isDirectory:isDir];
                result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:fileSystem];
            }
        } else {
            // return NOT_FOUND_ERR
            result = [CDVPluginResult resultWithStatus:CDVCommandStatus_IO_EXCEPTION messageAsInt:NOT_FOUND_ERR];
        }
    } else if ([strUri hasPrefix:@"assets-library://"]) {
        NSDictionary* fileSystem = [self getDirectoryEntry:strUri isDirectory:NO];
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:fileSystem];
    } else {
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsInt:ENCODING_ERR];
    }

    if (result != nil) {
        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
    }
}

/* Part of DirectoryEntry interface,  creates or returns the specified directory
 * IN:
 *	NSString* fullPath - full path for this directory
 *	NSString* path - directory to be created/returned; may be full path or relative path
 *	NSDictionary* - Flags object
 *		boolean as NSNumber create -
 *			if create is true and directory does not exist, create dir and return directory entry
 *			if create is true and exclusive is true and directory does exist, return error
 *			if create is false and directory does not exist, return error
 *			if create is false and the path represents a file, return error
 *		boolean as NSNumber exclusive - used in conjunction with create
 *			if exclusive is true and create is true - specifies failure if directory already exists
 *
 *
 */
- (void)getDirectory:(CDVInvokedUrlCommand*)command
{
    NSMutableArray* arguments = [NSMutableArray arrayWithArray:command.arguments];
    NSMutableDictionary* options = nil;

    if ([arguments count] >= 3) {
        options = [arguments objectAtIndex:2 withDefault:nil];
    }
    // add getDir to options and call getFile()
    if (options != nil) {
        options = [NSMutableDictionary dictionaryWithDictionary:options];
    } else {
        options = [NSMutableDictionary dictionaryWithCapacity:1];
    }
    [options setObject:[NSNumber numberWithInt:1] forKey:@"getDir"];
    if ([arguments count] >= 3) {
        [arguments replaceObjectAtIndex:2 withObject:options];
    } else {
        [arguments addObject:options];
    }
    CDVInvokedUrlCommand* subCommand =
        [[CDVInvokedUrlCommand alloc] initWithArguments:arguments
                                             callbackId:command.callbackId
                                              className:command.className
                                             methodName:command.methodName];

    [self getFile:subCommand];
}

/* Part of DirectoryEntry interface,  creates or returns the specified file
 * IN:
 *	NSString* fullPath - full path for this file
 *	NSString* path - file to be created/returned; may be full path or relative path
 *	NSDictionary* - Flags object
 *		boolean as NSNumber create -
 *			if create is true and file does not exist, create file and return File entry
 *			if create is true and exclusive is true and file does exist, return error
 *			if create is false and file does not exist, return error
 *			if create is false and the path represents a directory, return error
 *		boolean as NSNumber exclusive - used in conjunction with create
 *			if exclusive is true and create is true - specifies failure if file already exists
 *
 *
 */
- (void)getFile:(CDVInvokedUrlCommand*)command
{
    // arguments are URL encoded
    NSString* fullPath = [command.arguments objectAtIndex:0];
    NSString* requestedPath = [command.arguments objectAtIndex:1];
    NSDictionary* options = [command.arguments objectAtIndex:2 withDefault:nil];

    // return unsupported result for assets-library URLs
    if ([fullPath hasPrefix:kCDVAssetsLibraryPrefix]) {
        CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_MALFORMED_URL_EXCEPTION messageAsString:@"getFile not supported for assets-library URLs."];
        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
        return;
    }

    CDVPluginResult* result = nil;
    BOOL bDirRequest = NO;
    BOOL create = NO;
    BOOL exclusive = NO;
    int errorCode = 0;  // !!! risky - no error code currently defined for 0

    if ([options valueForKeyIsNumber:@"create"]) {
        create = [(NSNumber*)[options valueForKey:@"create"] boolValue];
    }
    if ([options valueForKeyIsNumber:@"exclusive"]) {
        exclusive = [(NSNumber*)[options valueForKey:@"exclusive"] boolValue];
    }

    if ([options valueForKeyIsNumber:@"getDir"]) {
        // this will not exist for calls directly to getFile but will have been set by getDirectory before calling this method
        bDirRequest = [(NSNumber*)[options valueForKey:@"getDir"] boolValue];
    }
    // see if the requested path has invalid characters - should we be checking for  more than just ":"?
    if ([requestedPath rangeOfString:@":"].location != NSNotFound) {
        errorCode = ENCODING_ERR;
    } else {
        // was full or relative path provided?
        NSRange range = [requestedPath rangeOfString:fullPath];
        BOOL bIsFullPath = range.location != NSNotFound;

        NSString* reqFullPath = nil;

        if (!bIsFullPath) {
            reqFullPath = [fullPath stringByAppendingPathComponent:requestedPath];
        } else {
            reqFullPath = requestedPath;
        }

        // NSLog(@"reqFullPath = %@", reqFullPath);
        NSFileManager* fileMgr = [[NSFileManager alloc] init];
        BOOL bIsDir;
        BOOL bExists = [fileMgr fileExistsAtPath:reqFullPath isDirectory:&bIsDir];
        if (bExists && (create == NO) && (bIsDir == !bDirRequest)) {
            // path exists and is of requested type  - return TYPE_MISMATCH_ERR
            errorCode = TYPE_MISMATCH_ERR;
        } else if (!bExists && (create == NO)) {
            // path does not exist and create is false - return NOT_FOUND_ERR
            errorCode = NOT_FOUND_ERR;
        } else if (bExists && (create == YES) && (exclusive == YES)) {
            // file/dir already exists and exclusive and create are both true - return PATH_EXISTS_ERR
            errorCode = PATH_EXISTS_ERR;
        } else {
            // if bExists and create == YES - just return data
            // if bExists and create == NO  - just return data
            // if !bExists and create == YES - create and return data
            BOOL bSuccess = YES;
            NSError __autoreleasing* pError = nil;
            if (!bExists && (create == YES)) {
                if (bDirRequest) {
                    // create the dir
                    bSuccess = [fileMgr createDirectoryAtPath:reqFullPath withIntermediateDirectories:NO attributes:nil error:&pError];
                } else {
                    // create the empty file
                    bSuccess = [fileMgr createFileAtPath:reqFullPath contents:nil attributes:nil];
                }
            }
            if (!bSuccess) {
                errorCode = ABORT_ERR;
                if (pError) {
                    NSLog(@"error creating directory: %@", [pError localizedDescription]);
                }
            } else {
                // NSLog(@"newly created file/dir (%@) exists: %d", reqFullPath, [fileMgr fileExistsAtPath:reqFullPath]);
                // file existed or was created
                result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:[self getDirectoryEntry:reqFullPath isDirectory:bDirRequest]];
            }
        } // are all possible conditions met?
    }

    if (errorCode > 0) {
        // create error callback
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_IO_EXCEPTION messageAsInt:errorCode];
    }

    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

/*
 * Look up the parent Entry containing this Entry.
 * If this Entry is the root of its filesystem, its parent is itself.
 * IN:
 * NSArray* arguments
 *	0 - NSString* fullPath
 * NSMutableDictionary* options
 *	empty
 */
- (void)getParent:(CDVInvokedUrlCommand*)command
{
    // arguments are URL encoded
    NSString* fullPath = [command.arguments objectAtIndex:0];

    // we don't (yet?) support getting the parent of an asset
    if ([fullPath hasPrefix:kCDVAssetsLibraryPrefix]) {
        CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_IO_EXCEPTION messageAsInt:NOT_READABLE_ERR];
        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
        return;
    }

    CDVPluginResult* result = nil;
    NSString* newPath = nil;

    if ([fullPath isEqualToString:self.appDocsPath] || [fullPath isEqualToString:self.appTempPath]) {
        // return self
        newPath = fullPath;
    } else {
        // since this call is made from an existing Entry object - the parent should already exist so no additional error checking
        // remove last component and return Entry
        NSRange range = [fullPath rangeOfString:@"/" options:NSBackwardsSearch];
        newPath = [fullPath substringToIndex:range.location];
    }

    if (newPath) {
        NSFileManager* fileMgr = [[NSFileManager alloc] init];
        BOOL bIsDir;
        BOOL bExists = [fileMgr fileExistsAtPath:newPath isDirectory:&bIsDir];
        if (bExists) {
            result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:[self getDirectoryEntry:newPath isDirectory:bIsDir]];
        }
    }
    if (!result) {
        // invalid path or file does not exist
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_IO_EXCEPTION messageAsInt:NOT_FOUND_ERR];
    }
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

/*
 * get MetaData of entry
 * Currently MetaData only includes modificationTime.
 */
- (void)getMetadata:(CDVInvokedUrlCommand*)command
{
    // arguments
    NSString* argPath = [command.arguments objectAtIndex:0];
    __block CDVPluginResult* result = nil;

    if ([argPath hasPrefix:kCDVAssetsLibraryPrefix]) {
        // In this case, we need to use an asynchronous method to retrieve the file.
        // Because of this, we can't just assign to `result` and send it at the end of the method.
        // Instead, we return after calling the asynchronous method and send `result` in each of the blocks.
        ALAssetsLibraryAssetForURLResultBlock resultBlock = ^(ALAsset* asset) {
            if (asset) {
                // We have the asset!  Retrieve the metadata and send it off.
                NSDate* date = [asset valueForProperty:ALAssetPropertyDate];
                result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDouble:[date timeIntervalSince1970] * 1000];
                [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
            } else {
                // We couldn't find the asset.  Send the appropriate error.
                result = [CDVPluginResult resultWithStatus:CDVCommandStatus_IO_EXCEPTION messageAsInt:NOT_FOUND_ERR];
                [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
            }
        };
        // TODO(maxw): Consider making this a class variable since it's the same every time.
        ALAssetsLibraryAccessFailureBlock failureBlock = ^(NSError* error) {
            // Retrieving the asset failed for some reason.  Send the appropriate error.
            result = [CDVPluginResult resultWithStatus:CDVCommandStatus_IO_EXCEPTION messageAsString:[error localizedDescription]];
            [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
        };

        ALAssetsLibrary* assetsLibrary = [[ALAssetsLibrary alloc] init];
        [assetsLibrary assetForURL:[NSURL URLWithString:argPath] resultBlock:resultBlock failureBlock:failureBlock];
        return;
    }

    NSString* testPath = argPath; // [self getFullPath: argPath];

    NSFileManager* fileMgr = [[NSFileManager alloc] init];
    NSError* __autoreleasing error = nil;

    NSDictionary* fileAttribs = [fileMgr attributesOfItemAtPath:testPath error:&error];

    if (fileAttribs) {
        NSDate* modDate = [fileAttribs fileModificationDate];
        if (modDate) {
            result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDouble:[modDate timeIntervalSince1970] * 1000];
        }
    } else {
        // didn't get fileAttribs
        CDVFileError errorCode = ABORT_ERR;
        NSLog(@"error getting metadata: %@", [error localizedDescription]);
        if ([error code] == NSFileNoSuchFileError) {
            errorCode = NOT_FOUND_ERR;
        }
        // log [NSNumber numberWithDouble: theMessage] objCtype to see what it returns
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsInt:errorCode];
    }
    if (!result) {
        // invalid path or file does not exist
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_IO_EXCEPTION];
    }
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

/*
 * set MetaData of entry
 * Currently we only support "com.apple.MobileBackup" (boolean)
 */
- (void)setMetadata:(CDVInvokedUrlCommand*)command
{
    // arguments
    NSString* filePath = [command.arguments objectAtIndex:0];
    NSDictionary* options = [command.arguments objectAtIndex:1 withDefault:nil];
    CDVPluginResult* result = nil;
    BOOL ok = NO;

    // setMetadata doesn't make sense for asset library files
    if (![filePath hasPrefix:kCDVAssetsLibraryPrefix]) {
        // we only care about this iCloud key for now.
        // set to 1/true to skip backup, set to 0/false to back it up (effectively removing the attribute)
        NSString* iCloudBackupExtendedAttributeKey = @"com.apple.MobileBackup";
        id iCloudBackupExtendedAttributeValue = [options objectForKey:iCloudBackupExtendedAttributeKey];

        if ((iCloudBackupExtendedAttributeValue != nil) && [iCloudBackupExtendedAttributeValue isKindOfClass:[NSNumber class]]) {
            if (IsAtLeastiOSVersion(@"5.1")) {
                NSURL* url = [NSURL fileURLWithPath:filePath];
                NSError* __autoreleasing error = nil;

                ok = [url setResourceValue:[NSNumber numberWithBool:[iCloudBackupExtendedAttributeValue boolValue]] forKey:NSURLIsExcludedFromBackupKey error:&error];
            } else { // below 5.1 (deprecated - only really supported in 5.01)
                u_int8_t value = [iCloudBackupExtendedAttributeValue intValue];
                if (value == 0) { // remove the attribute (allow backup, the default)
                    ok = (removexattr([filePath fileSystemRepresentation], [iCloudBackupExtendedAttributeKey cStringUsingEncoding:NSUTF8StringEncoding], 0) == 0);
                } else { // set the attribute (skip backup)
                    ok = (setxattr([filePath fileSystemRepresentation], [iCloudBackupExtendedAttributeKey cStringUsingEncoding:NSUTF8StringEncoding], &value, sizeof(value), 0, 0) == 0);
                }
            }
        }
    }

    if (ok) {
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    } else {
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR];
    }
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

/* removes the directory or file entry
 * IN:
 * NSArray* arguments
 *	0 - NSString* fullPath
 *
 * returns NO_MODIFICATION_ALLOWED_ERR  if is top level directory or no permission to delete dir
 * returns INVALID_MODIFICATION_ERR if is non-empty dir or asset library file
 * returns NOT_FOUND_ERR if file or dir is not found
*/
- (void)remove:(CDVInvokedUrlCommand*)command
{
    // arguments
    NSString* fullPath = [command.arguments objectAtIndex:0];
    CDVPluginResult* result = nil;
    CDVFileError errorCode = 0;  // !! 0 not currently defined

    // return error for assets-library URLs
    if ([fullPath hasPrefix:kCDVAssetsLibraryPrefix]) {
        errorCode = INVALID_MODIFICATION_ERR;
    } else if ([fullPath isEqualToString:self.appDocsPath] || [fullPath isEqualToString:self.appTempPath]) {
        // error if try to remove top level (documents or tmp) dir
        errorCode = NO_MODIFICATION_ALLOWED_ERR;
    } else {
        NSFileManager* fileMgr = [[NSFileManager alloc] init];
        BOOL bIsDir = NO;
        BOOL bExists = [fileMgr fileExistsAtPath:fullPath isDirectory:&bIsDir];
        if (!bExists) {
            errorCode = NOT_FOUND_ERR;
        }
        if (bIsDir && ([[fileMgr contentsOfDirectoryAtPath:fullPath error:nil] count] != 0)) {
            // dir is not empty
            errorCode = INVALID_MODIFICATION_ERR;
        }
    }
    if (errorCode > 0) {
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_IO_EXCEPTION messageAsInt:errorCode];
    } else {
        // perform actual remove
        result = [self doRemove:fullPath];
    }
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

/* recursively removes the directory
 * IN:
 * NSArray* arguments
 *	0 - NSString* fullPath
 *
 * returns NO_MODIFICATION_ALLOWED_ERR  if is top level directory or no permission to delete dir
 * returns NOT_FOUND_ERR if file or dir is not found
 */
- (void)removeRecursively:(CDVInvokedUrlCommand*)command
{
    // arguments
    NSString* fullPath = [command.arguments objectAtIndex:0];

    // return unsupported result for assets-library URLs
    if ([fullPath hasPrefix:kCDVAssetsLibraryPrefix]) {
        CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_MALFORMED_URL_EXCEPTION messageAsString:@"removeRecursively not supported for assets-library URLs."];
        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
        return;
    }

    CDVPluginResult* result = nil;

    // error if try to remove top level (documents or tmp) dir
    if ([fullPath isEqualToString:self.appDocsPath] || [fullPath isEqualToString:self.appTempPath]) {
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_IO_EXCEPTION messageAsInt:NO_MODIFICATION_ALLOWED_ERR];
    } else {
        result = [self doRemove:fullPath];
    }
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

/* remove the file or directory (recursively)
 * IN:
 * NSString* fullPath - the full path to the file or directory to be removed
 * NSString* callbackId
 * called from remove and removeRecursively - check all pubic api specific error conditions (dir not empty, etc) before calling
 */

- (CDVPluginResult*)doRemove:(NSString*)fullPath
{
    CDVPluginResult* result = nil;
    BOOL bSuccess = NO;
    NSError* __autoreleasing pError = nil;
    NSFileManager* fileMgr = [[NSFileManager alloc] init];

    @try {
        bSuccess = [fileMgr removeItemAtPath:fullPath error:&pError];
        if (bSuccess) {
            result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
        } else {
            // see if we can give a useful error
            CDVFileError errorCode = ABORT_ERR;
            NSLog(@"error getting metadata: %@", [pError localizedDescription]);
            if ([pError code] == NSFileNoSuchFileError) {
                errorCode = NOT_FOUND_ERR;
            } else if ([pError code] == NSFileWriteNoPermissionError) {
                errorCode = NO_MODIFICATION_ALLOWED_ERR;
            }

            result = [CDVPluginResult resultWithStatus:CDVCommandStatus_IO_EXCEPTION messageAsInt:errorCode];
        }
    } @catch(NSException* e) {  // NSInvalidArgumentException if path is . or ..
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsInt:SYNTAX_ERR];
    }

    return result;
}

- (void)copyTo:(CDVInvokedUrlCommand*)command
{
    [self doCopyMove:command isCopy:YES];
}

- (void)moveTo:(CDVInvokedUrlCommand*)command
{
    [self doCopyMove:command isCopy:NO];
}

/**
 * Helper function to check to see if the user attempted to copy an entry into its parent without changing its name,
 * or attempted to copy a directory into a directory that it contains directly or indirectly.
 *
 * IN:
 *  NSString* srcDir
 *  NSString* destinationDir
 * OUT:
 *  YES copy/ move is allows
 *  NO move is onto itself
 */
- (BOOL)canCopyMoveSrc:(NSString*)src ToDestination:(NSString*)dest
{
    // This weird test is to determine if we are copying or moving a directory into itself.
    // Copy /Documents/myDir to /Documents/myDir-backup is okay but
    // Copy /Documents/myDir to /Documents/myDir/backup not okay
    BOOL copyOK = YES;
    NSRange range = [dest rangeOfString:src];

    if (range.location != NSNotFound) {
        NSRange testRange = {range.length - 1, ([dest length] - range.length)};
        NSRange resultRange = [dest rangeOfString:@"/" options:0 range:testRange];
        if (resultRange.location != NSNotFound) {
            copyOK = NO;
        }
    }
    return copyOK;
}

/* Copy/move a file or directory to a new location
 * IN:
 * NSArray* arguments
 *	0 - NSString* fullPath of entry
 *  1 - NSString* newName the new name of the entry, defaults to the current name
 *	NSMutableDictionary* options - DirectoryEntry to which to copy the entry
 *	BOOL - bCopy YES if copy, NO if move
 *
 */
- (void)doCopyMove:(CDVInvokedUrlCommand*)command isCopy:(BOOL)bCopy
{
    NSArray* arguments = command.arguments;

    // arguments
    NSString* srcFullPath = [arguments objectAtIndex:0];
    NSString* destRootPath = [arguments objectAtIndex:1];
    // optional argument
    NSString* newName = ([arguments count] > 2) ? [arguments objectAtIndex:2] : [srcFullPath lastPathComponent];          // use last component from appPath if new name not provided

    __block CDVPluginResult* result = nil;
    CDVFileError errCode = 0;  // !! Currently 0 is not defined, use this to signal error !!

    /*NSString* destRootPath = nil;
    NSString* key = @"fullPath";
    if([options valueForKeyIsString:key]){
       destRootPath = [options objectForKey:@"fullPath"];
    }*/

    if (!destRootPath) {
        // no destination provided
        errCode = NOT_FOUND_ERR;
    } else if ([newName rangeOfString:@":"].location != NSNotFound) {
        // invalid chars in new name
        errCode = ENCODING_ERR;
    } else {
        NSString* newFullPath = [destRootPath stringByAppendingPathComponent:newName];
        NSFileManager* fileMgr = [[NSFileManager alloc] init];
        if ([newFullPath isEqualToString:srcFullPath]) {
            // source and destination can not be the same
            errCode = INVALID_MODIFICATION_ERR;
        } else if ([srcFullPath hasPrefix:kCDVAssetsLibraryPrefix]) {
            if (bCopy) {
                // Copying (as opposed to moving) an assets library file is okay.
                // In this case, we need to use an asynchronous method to retrieve the file.
                // Because of this, we can't just assign to `result` and send it at the end of the method.
                // Instead, we return after calling the asynchronous method and send `result` in each of the blocks.
                ALAssetsLibraryAssetForURLResultBlock resultBlock = ^(ALAsset* asset) {
                    if (asset) {
                        // We have the asset!  Get the data and try to copy it over.
                        if (![fileMgr fileExistsAtPath:destRootPath]) {
                            // The destination directory doesn't exist.
                            result = [CDVPluginResult resultWithStatus:CDVCommandStatus_IO_EXCEPTION messageAsInt:NOT_FOUND_ERR];
                            [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
                            return;
                        } else if ([fileMgr fileExistsAtPath:newFullPath]) {
                            // A file already exists at the destination path.
                            result = [CDVPluginResult resultWithStatus:CDVCommandStatus_IO_EXCEPTION messageAsInt:PATH_EXISTS_ERR];
                            [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
                            return;
                        }

                        // We're good to go!  Write the file to the new destination.
                        ALAssetRepresentation* assetRepresentation = [asset defaultRepresentation];
                        Byte* buffer = (Byte*)malloc([assetRepresentation size]);
                        NSUInteger bufferSize = [assetRepresentation getBytes:buffer fromOffset:0.0 length:[assetRepresentation size] error:nil];
                        NSData* data = [NSData dataWithBytesNoCopy:buffer length:bufferSize freeWhenDone:YES];
                        [data writeToFile:newFullPath atomically:YES];
                        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:[self getDirectoryEntry:newFullPath isDirectory:NO]];
                        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
                    } else {
                        // We couldn't find the asset.  Send the appropriate error.
                        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_IO_EXCEPTION messageAsInt:NOT_FOUND_ERR];
                        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
                    }
                };
                ALAssetsLibraryAccessFailureBlock failureBlock = ^(NSError* error) {
                    // Retrieving the asset failed for some reason.  Send the appropriate error.
                    result = [CDVPluginResult resultWithStatus:CDVCommandStatus_IO_EXCEPTION messageAsString:[error localizedDescription]];
                    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
                };

                ALAssetsLibrary* assetsLibrary = [[ALAssetsLibrary alloc] init];
                [assetsLibrary assetForURL:[NSURL URLWithString:srcFullPath] resultBlock:resultBlock failureBlock:failureBlock];
                return;
            } else {
                // Moving an assets library file is not doable, since we can't remove it.
                errCode = INVALID_MODIFICATION_ERR;
            }
        } else {
            BOOL bSrcIsDir = NO;
            BOOL bDestIsDir = NO;
            BOOL bNewIsDir = NO;
            BOOL bSrcExists = [fileMgr fileExistsAtPath:srcFullPath isDirectory:&bSrcIsDir];
            BOOL bDestExists = [fileMgr fileExistsAtPath:destRootPath isDirectory:&bDestIsDir];
            BOOL bNewExists = [fileMgr fileExistsAtPath:newFullPath isDirectory:&bNewIsDir];
            if (!bSrcExists || !bDestExists) {
                // the source or the destination root does not exist
                errCode = NOT_FOUND_ERR;
            } else if (bSrcIsDir && (bNewExists && !bNewIsDir)) {
                // can't copy/move dir to file
                errCode = INVALID_MODIFICATION_ERR;
            } else { // no errors yet
                NSError* __autoreleasing error = nil;
                BOOL bSuccess = NO;
                if (bCopy) {
                    if (bSrcIsDir && ![self canCopyMoveSrc:srcFullPath ToDestination:newFullPath] /*[newFullPath hasPrefix:srcFullPath]*/) {
                        // can't copy dir into self
                        errCode = INVALID_MODIFICATION_ERR;
                    } else if (bNewExists) {
                        // the full destination should NOT already exist if a copy
                        errCode = PATH_EXISTS_ERR;
                    } else {
                        bSuccess = [fileMgr copyItemAtPath:srcFullPath toPath:newFullPath error:&error];
                    }
                } else { // move
                    // iOS requires that destination must not exist before calling moveTo
                    // is W3C INVALID_MODIFICATION_ERR error if destination dir exists and has contents
                    //
                    if (!bSrcIsDir && (bNewExists && bNewIsDir)) {
                        // can't move a file to directory
                        errCode = INVALID_MODIFICATION_ERR;
                    } else if (bSrcIsDir && ![self canCopyMoveSrc:srcFullPath ToDestination:newFullPath]) {    // [newFullPath hasPrefix:srcFullPath]){
                        // can't move a dir into itself
                        errCode = INVALID_MODIFICATION_ERR;
                    } else if (bNewExists) {
                        if (bNewIsDir && ([[fileMgr contentsOfDirectoryAtPath:newFullPath error:NULL] count] != 0)) {
                            // can't move dir to a dir that is not empty
                            errCode = INVALID_MODIFICATION_ERR;
                            newFullPath = nil;  // so we won't try to move
                        } else {
                            // remove destination so can perform the moveItemAtPath
                            bSuccess = [fileMgr removeItemAtPath:newFullPath error:NULL];
                            if (!bSuccess) {
                                errCode = INVALID_MODIFICATION_ERR; // is this the correct error?
                                newFullPath = nil;
                            }
                        }
                    } else if (bNewIsDir && [newFullPath hasPrefix:srcFullPath]) {
                        // can't move a directory inside itself or to any child at any depth;
                        errCode = INVALID_MODIFICATION_ERR;
                        newFullPath = nil;
                    }

                    if (newFullPath != nil) {
                        bSuccess = [fileMgr moveItemAtPath:srcFullPath toPath:newFullPath error:&error];
                    }
                }
                if (bSuccess) {
                    // should verify it is there and of the correct type???
                    NSDictionary* newEntry = [self getDirectoryEntry:newFullPath isDirectory:bSrcIsDir];  // should be the same type as source
                    result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:newEntry];
                } else {
                    errCode = INVALID_MODIFICATION_ERR; // catch all
                    if (error) {
                        if (([error code] == NSFileReadUnknownError) || ([error code] == NSFileReadTooLargeError)) {
                            errCode = NOT_READABLE_ERR;
                        } else if ([error code] == NSFileWriteOutOfSpaceError) {
                            errCode = QUOTA_EXCEEDED_ERR;
                        } else if ([error code] == NSFileWriteNoPermissionError) {
                            errCode = NO_MODIFICATION_ALLOWED_ERR;
                        }
                    }
                }
            }
        }
    }
    if (errCode > 0) {
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_IO_EXCEPTION messageAsInt:errCode];
    }
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

/* return the URI to the entry
 * IN:
 * NSArray* arguments
 *	0 - NSString* fullPath of entry
 *	1 - desired mime type of entry - ignored - always returns file://
 */

/*  Not needed since W3C toURI is synchronous.  Leaving code here for now in case W3C spec changes.....
- (void) toURI:(CDVInvokedUrlCommand*)command
{
    NSString* callbackId = command.callbackId;
    NSString* argPath = [command.arguments objectAtIndex:0];
    PluginResult* result = nil;
    NSString* jsString = nil;

    NSString* fullPath = [self getFullPath: argPath];
    if (fullPath) {
        // do we need to make sure the file actually exists?
        // create file uri
        NSString* strUri = [fullPath stringByReplacingPercentEscapesUsingEncoding: NSUTF8StringEncoding];
        NSURL* fileUrl = [NSURL fileURLWithPath:strUri];
        if (fileUrl) {
            result = [PluginResult resultWithStatus:CDVCommandStatus_OK messageAsString: [fileUrl absoluteString]];
            jsString = [result toSuccessCallbackString:callbackId];
        } // else NOT_FOUND_ERR
    }
    if(!jsString) {
        // was error
        result = [PluginResult resultWithStatus:CDVCommandStatus_OK messageAsInt: NOT_FOUND_ERR cast:  @"window.localFileSystem._castError"];
        jsString = [result toErrorCallbackString:callbackId];
    }

    [self writeJavascript:jsString];
}*/
- (void)getFileMetadata:(CDVInvokedUrlCommand*)command
{
    // arguments
    NSString* argPath = [command.arguments objectAtIndex:0];

    __block CDVPluginResult* result = nil;

    NSString* fullPath = argPath; // [self getFullPath: argPath];

    if (fullPath) {
        if ([fullPath hasPrefix:kCDVAssetsLibraryPrefix]) {
            // In this case, we need to use an asynchronous method to retrieve the file.
            // Because of this, we can't just assign to `result` and send it at the end of the method.
            // Instead, we return after calling the asynchronous method and send `result` in each of the blocks.
            ALAssetsLibraryAssetForURLResultBlock resultBlock = ^(ALAsset* asset) {
                if (asset) {
                    // We have the asset!  Populate the dictionary and send it off.
                    NSMutableDictionary* fileInfo = [NSMutableDictionary dictionaryWithCapacity:5];
                    ALAssetRepresentation* assetRepresentation = [asset defaultRepresentation];
                    [fileInfo setObject:[NSNumber numberWithUnsignedLongLong:[assetRepresentation size]] forKey:@"size"];
                    [fileInfo setObject:argPath forKey:@"fullPath"];
                    NSString* filename = [assetRepresentation filename];
                    [fileInfo setObject:filename forKey:@"name"];
                    [fileInfo setObject:[self getMimeTypeFromPath:filename] forKey:@"type"];
                    NSDate* creationDate = [asset valueForProperty:ALAssetPropertyDate];
                    NSNumber* msDate = [NSNumber numberWithDouble:[creationDate timeIntervalSince1970] * 1000];
                    [fileInfo setObject:msDate forKey:@"lastModifiedDate"];

                    result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:fileInfo];
                    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
                } else {
                    // We couldn't find the asset.  Send the appropriate error.
                    result = [CDVPluginResult resultWithStatus:CDVCommandStatus_IO_EXCEPTION messageAsInt:NOT_FOUND_ERR];
                    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
                }
            };
            ALAssetsLibraryAccessFailureBlock failureBlock = ^(NSError* error) {
                // Retrieving the asset failed for some reason.  Send the appropriate error.
                result = [CDVPluginResult resultWithStatus:CDVCommandStatus_IO_EXCEPTION messageAsString:[error localizedDescription]];
                [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
            };

            ALAssetsLibrary* assetsLibrary = [[ALAssetsLibrary alloc] init];
            [assetsLibrary assetForURL:[NSURL URLWithString:argPath] resultBlock:resultBlock failureBlock:failureBlock];
            return;
        } else {
            NSFileManager* fileMgr = [[NSFileManager alloc] init];
            BOOL bIsDir = NO;
            // make sure it exists and is not a directory
            BOOL bExists = [fileMgr fileExistsAtPath:fullPath isDirectory:&bIsDir];
            if (!bExists || bIsDir) {
                result = [CDVPluginResult resultWithStatus:CDVCommandStatus_IO_EXCEPTION messageAsInt:NOT_FOUND_ERR];
            } else {
                // create dictionary of file info
                NSError* __autoreleasing error = nil;
                NSDictionary* fileAttrs = [fileMgr attributesOfItemAtPath:fullPath error:&error];
                NSMutableDictionary* fileInfo = [NSMutableDictionary dictionaryWithCapacity:5];
                [fileInfo setObject:[NSNumber numberWithUnsignedLongLong:[fileAttrs fileSize]] forKey:@"size"];
                [fileInfo setObject:argPath forKey:@"fullPath"];
                [fileInfo setObject:@"" forKey:@"type"];  // can't easily get the mimetype unless create URL, send request and read response so skipping
                [fileInfo setObject:[argPath lastPathComponent] forKey:@"name"];
                NSDate* modDate = [fileAttrs fileModificationDate];
                NSNumber* msDate = [NSNumber numberWithDouble:[modDate timeIntervalSince1970] * 1000];
                [fileInfo setObject:msDate forKey:@"lastModifiedDate"];
                result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:fileInfo];
            }
        }
    }
    if (!result) {
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_INSTANTIATION_EXCEPTION];
    }
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

- (void)readEntries:(CDVInvokedUrlCommand*)command
{
    // arguments
    NSString* fullPath = [command.arguments objectAtIndex:0];

    // return unsupported result for assets-library URLs
    if ([fullPath hasPrefix:kCDVAssetsLibraryPrefix]) {
        CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_MALFORMED_URL_EXCEPTION messageAsString:@"readEntries not supported for assets-library URLs."];
        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
        return;
    }

    CDVPluginResult* result = nil;

    NSFileManager* fileMgr = [[NSFileManager alloc] init];
    NSError* __autoreleasing error = nil;
    NSArray* contents = [fileMgr contentsOfDirectoryAtPath:fullPath error:&error];

    if (contents) {
        NSMutableArray* entries = [NSMutableArray arrayWithCapacity:1];
        if ([contents count] > 0) {
            // create an Entry (as JSON) for each file/dir
            for (NSString* name in contents) {
                // see if is dir or file
                NSString* entryPath = [fullPath stringByAppendingPathComponent:name];
                BOOL bIsDir = NO;
                [fileMgr fileExistsAtPath:entryPath isDirectory:&bIsDir];
                NSDictionary* entryDict = [self getDirectoryEntry:entryPath isDirectory:bIsDir];
                [entries addObject:entryDict];
            }
        }
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsArray:entries];
    } else {
        // assume not found but could check error for more specific error conditions
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_IO_EXCEPTION messageAsInt:NOT_FOUND_ERR];
    }

    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

- (void)readFileWithPath:(NSString*)path start:(NSInteger)start end:(NSInteger)end callback:(void (^)(NSData*, NSString* mimeType, CDVFileError))callback
{
    if (path == nil) {
        callback(nil, nil, SYNTAX_ERR);
    } else {
        [self.commandDelegate runInBackground:^ {
            if ([path hasPrefix:kCDVAssetsLibraryPrefix]) {
                // In this case, we need to use an asynchronous method to retrieve the file.
                // Because of this, we can't just assign to `result` and send it at the end of the method.
                // Instead, we return after calling the asynchronous method and send `result` in each of the blocks.
                ALAssetsLibraryAssetForURLResultBlock resultBlock = ^(ALAsset* asset) {
                    if (asset) {
                        // We have the asset!  Get the data and send it off.
                        ALAssetRepresentation* assetRepresentation = [asset defaultRepresentation];
                        Byte* buffer = (Byte*)malloc([assetRepresentation size]);
                        NSUInteger bufferSize = [assetRepresentation getBytes:buffer fromOffset:0.0 length:[assetRepresentation size] error:nil];
                        NSData* data = [NSData dataWithBytesNoCopy:buffer length:bufferSize freeWhenDone:YES];
                        NSString* MIMEType = (__bridge_transfer NSString*)UTTypeCopyPreferredTagWithClass((__bridge CFStringRef)[assetRepresentation UTI], kUTTagClassMIMEType);

                        callback(data, MIMEType, NO_ERROR);
                    } else {
                        callback(nil, nil, NOT_FOUND_ERR);
                    }
                };
                ALAssetsLibraryAccessFailureBlock failureBlock = ^(NSError* error) {
                    // Retrieving the asset failed for some reason.  Send the appropriate error.
                    NSLog(@"Error: %@", error);
                    callback(nil, nil, SECURITY_ERR);
                };

                ALAssetsLibrary* assetsLibrary = [[ALAssetsLibrary alloc] init];
                [assetsLibrary assetForURL:[NSURL URLWithString:path] resultBlock:resultBlock failureBlock:failureBlock];
            } else {
                NSString* mimeType = [self getMimeTypeFromPath:path];
                if (mimeType == nil) {
                    mimeType = @"*/*";
                }
                NSFileHandle* file = [NSFileHandle fileHandleForReadingAtPath:path];
                if (start > 0) {
                    [file seekToFileOffset:start];
                }

                NSData* readData;
                if (end < 0) {
                    readData = [file readDataToEndOfFile];
                } else {
                    readData = [file readDataOfLength:(end - start)];
                }

                [file closeFile];

                callback(readData, mimeType, readData != nil ? NO_ERROR : NOT_FOUND_ERR);
            }
        }];
    }
}

/* read and return file data
 * IN:
 * NSArray* arguments
 *	0 - NSString* fullPath
 *	1 - NSString* encoding
 *	2 - NSString* start
 *	3 - NSString* end
 */
- (void)readAsText:(CDVInvokedUrlCommand*)command
{
    // arguments
    NSString* path = [command argumentAtIndex:0];
    NSString* encoding = [command argumentAtIndex:1];
    NSInteger start = [[command argumentAtIndex:2] integerValue];
    NSInteger end = [[command argumentAtIndex:3] integerValue];

    // TODO: implement
    if (![@"UTF-8" isEqualToString : encoding]) {
        NSLog(@"Only UTF-8 encodings are currently supported by readAsText");
        CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_IO_EXCEPTION messageAsInt:ENCODING_ERR];
        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
        return;
    }

    [self readFileWithPath:path start:start end:end callback:^(NSData* data, NSString* mimeType, CDVFileError errorCode) {
        CDVPluginResult* result = nil;
        if (data != nil) {
            NSString* str = [[NSString alloc] initWithBytesNoCopy:(void*)[data bytes] length:[data length] encoding:NSUTF8StringEncoding freeWhenDone:NO];
            // Check that UTF8 conversion did not fail.
            if (str != nil) {
                result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:str];
                result.associatedObject = data;
            } else {
                errorCode = ENCODING_ERR;
            }
        }
        if (result == nil) {
            result = [CDVPluginResult resultWithStatus:CDVCommandStatus_IO_EXCEPTION messageAsInt:errorCode];
        }

        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
    }];
}

/* Read content of text file and return as base64 encoded data url.
 * IN:
 * NSArray* arguments
 *	0 - NSString* fullPath
 *	1 - NSString* start
 *	2 - NSString* end
 *
 * Determines the mime type from the file extension, returns ENCODING_ERR if mimetype can not be determined.
 */

- (void)readAsDataURL:(CDVInvokedUrlCommand*)command
{
    NSString* path = [command argumentAtIndex:0];
    NSInteger start = [[command argumentAtIndex:1] integerValue];
    NSInteger end = [[command argumentAtIndex:2] integerValue];

    [self readFileWithPath:path start:start end:end callback:^(NSData* data, NSString* mimeType, CDVFileError errorCode) {
        CDVPluginResult* result = nil;
        if (data != nil) {
            // TODO: Would be faster to base64 encode directly to the final string.
            NSString* output = [NSString stringWithFormat:@"data:%@;base64,%@", mimeType, [data base64EncodedString]];
            result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:output];
        } else {
            result = [CDVPluginResult resultWithStatus:CDVCommandStatus_IO_EXCEPTION messageAsInt:errorCode];
        }

        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
    }];
}

/* Read content of text file and return as an arraybuffer
 * IN:
 * NSArray* arguments
 *	0 - NSString* fullPath
 *	1 - NSString* start
 *	2 - NSString* end
 */

- (void)readAsArrayBuffer:(CDVInvokedUrlCommand*)command
{
    NSString* path = [command argumentAtIndex:0];
    NSInteger start = [[command argumentAtIndex:1] integerValue];
    NSInteger end = [[command argumentAtIndex:2] integerValue];

    [self readFileWithPath:path start:start end:end callback:^(NSData* data, NSString* mimeType, CDVFileError errorCode) {
        CDVPluginResult* result = nil;
        if (data != nil) {
            result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsArrayBuffer:data];
        } else {
            result = [CDVPluginResult resultWithStatus:CDVCommandStatus_IO_EXCEPTION messageAsInt:errorCode];
        }

        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
    }];
}

- (void)readAsBinaryString:(CDVInvokedUrlCommand*)command
{
    NSString* path = [command argumentAtIndex:0];
    NSInteger start = [[command argumentAtIndex:1] integerValue];
    NSInteger end = [[command argumentAtIndex:2] integerValue];

    [self readFileWithPath:path start:start end:end callback:^(NSData* data, NSString* mimeType, CDVFileError errorCode) {
        CDVPluginResult* result = nil;
        if (data != nil) {
            NSString* payload = [[NSString alloc] initWithBytesNoCopy:(void*)[data bytes] length:[data length] encoding:NSASCIIStringEncoding freeWhenDone:NO];
            result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:payload];
            result.associatedObject = data;
        } else {
            result = [CDVPluginResult resultWithStatus:CDVCommandStatus_IO_EXCEPTION messageAsInt:errorCode];
        }

        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
    }];
}

/* helper function to get the mimeType from the file extension
 * IN:
 *	NSString* fullPath - filename (may include path)
 * OUT:
 *	NSString* the mime type as type/subtype.  nil if not able to determine
 */
- (NSString*)getMimeTypeFromPath:(NSString*)fullPath
{
    NSString* mimeType = nil;

    if (fullPath) {
        CFStringRef typeId = UTTypeCreatePreferredIdentifierForTag(kUTTagClassFilenameExtension, (__bridge CFStringRef)[fullPath pathExtension], NULL);
        if (typeId) {
            mimeType = (__bridge_transfer NSString*)UTTypeCopyPreferredTagWithClass(typeId, kUTTagClassMIMEType);
            if (!mimeType) {
                // special case for m4a
                if ([(__bridge NSString*)typeId rangeOfString : @"m4a-audio"].location != NSNotFound) {
                    mimeType = @"audio/mp4";
                } else if ([[fullPath pathExtension] rangeOfString:@"wav"].location != NSNotFound) {
                    mimeType = @"audio/wav";
                }
            }
            CFRelease(typeId);
        }
    }
    return mimeType;
}

- (void)truncate:(CDVInvokedUrlCommand*)command
{
    // arguments
    NSString* argPath = [command.arguments objectAtIndex:0];
    unsigned long long pos = (unsigned long long)[[command.arguments objectAtIndex:1] longLongValue];

    // assets-library files can't be truncated
    if ([argPath hasPrefix:kCDVAssetsLibraryPrefix]) {
        CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_IO_EXCEPTION messageAsInt:NO_MODIFICATION_ALLOWED_ERR];
        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
        return;
    }

    NSString* appFile = argPath; // [self getFullPath:argPath];

    unsigned long long newPos = [self truncateFile:appFile atPosition:pos];
    CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsInt:newPos];

    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

- (unsigned long long)truncateFile:(NSString*)filePath atPosition:(unsigned long long)pos
{
    unsigned long long newPos = 0UL;

    NSFileHandle* file = [NSFileHandle fileHandleForWritingAtPath:filePath];

    if (file) {
        [file truncateFileAtOffset:(unsigned long long)pos];
        newPos = [file offsetInFile];
        [file synchronizeFile];
        [file closeFile];
    }
    return newPos;
}

/* write
 * IN:
 * NSArray* arguments
 *  0 - NSString* file path to write to
 *  1 - NSString* data to write
 *  2 - NSNumber* position to begin writing
 */
- (void)write:(CDVInvokedUrlCommand*)command
{
    NSString* callbackId = command.callbackId;
    NSArray* arguments = command.arguments;

    // arguments
    NSString* argPath = [arguments objectAtIndex:0];
    NSString* argData = [arguments objectAtIndex:1];
    unsigned long long pos = (unsigned long long)[[arguments objectAtIndex:2] longLongValue];

    // text can't be written into assets-library files
    if ([argPath hasPrefix:kCDVAssetsLibraryPrefix]) {
        CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_IO_EXCEPTION messageAsInt:NO_MODIFICATION_ALLOWED_ERR];
        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
        return;
    }

    NSString* fullPath = argPath; // [self getFullPath:argPath];

    [self truncateFile:fullPath atPosition:pos];

    [self writeToFile:fullPath withData:argData append:YES callback:callbackId];
}

- (void)writeToFile:(NSString*)filePath withData:(NSString*)data append:(BOOL)shouldAppend callback:(NSString*)callbackId
{
    CDVPluginResult* result = nil;
    CDVFileError errCode = INVALID_MODIFICATION_ERR;
    int bytesWritten = 0;
    NSData* encData = [data dataUsingEncoding:NSUTF8StringEncoding allowLossyConversion:YES];

    if (filePath) {
        NSOutputStream* fileStream = [NSOutputStream outputStreamToFileAtPath:filePath append:shouldAppend];
        if (fileStream) {
            NSUInteger len = [encData length];
            [fileStream open];

            bytesWritten = [fileStream write:[encData bytes] maxLength:len];

            [fileStream close];
            if (bytesWritten > 0) {
                result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsInt:bytesWritten];
                // } else {
                // can probably get more detailed error info via [fileStream streamError]
                // errCode already set to INVALID_MODIFICATION_ERR;
                // bytesWritten = 0; // may be set to -1 on error
            }
        } // else fileStream not created return INVALID_MODIFICATION_ERR
    } else {
        // invalid filePath
        errCode = NOT_FOUND_ERR;
    }
    if (!result) {
        // was an error
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsInt:errCode];
    }
    [self.commandDelegate sendPluginResult:result callbackId:callbackId];
}

- (void)testFileExists:(CDVInvokedUrlCommand*)command
{
    // arguments
    NSString* argPath = [command.arguments objectAtIndex:0];

    // Get the file manager
    NSFileManager* fMgr = [NSFileManager defaultManager];
    NSString* appFile = argPath; // [ self getFullPath: argPath];

    BOOL bExists = [fMgr fileExistsAtPath:appFile];
    CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsInt:(bExists ? 1 : 0)];

    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

- (void)testDirectoryExists:(CDVInvokedUrlCommand*)command
{
    // arguments
    NSString* argPath = [command.arguments objectAtIndex:0];

    // Get the file manager
    NSFileManager* fMgr = [[NSFileManager alloc] init];
    NSString* appFile = argPath; // [self getFullPath: argPath];
    BOOL bIsDir = NO;
    BOOL bExists = [fMgr fileExistsAtPath:appFile isDirectory:&bIsDir];

    CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsInt:((bExists && bIsDir) ? 1 : 0)];

    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

// Returns number of bytes available via callback
- (void)getFreeDiskSpace:(CDVInvokedUrlCommand*)command
{
    // no arguments

    NSNumber* pNumAvail = [self checkFreeDiskSpace:self.appDocsPath];

    NSString* strFreeSpace = [NSString stringWithFormat:@"%qu", [pNumAvail unsignedLongLongValue]];
    // NSLog(@"Free space is %@", strFreeSpace );

    CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:strFreeSpace];

    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

@end
