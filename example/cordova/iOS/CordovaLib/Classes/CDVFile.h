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

#import <Foundation/Foundation.h>
#import "CDVPlugin.h"

enum CDVFileError {
    NO_ERROR = 0,
    NOT_FOUND_ERR = 1,
    SECURITY_ERR = 2,
    ABORT_ERR = 3,
    NOT_READABLE_ERR = 4,
    ENCODING_ERR = 5,
    NO_MODIFICATION_ALLOWED_ERR = 6,
    INVALID_STATE_ERR = 7,
    SYNTAX_ERR = 8,
    INVALID_MODIFICATION_ERR = 9,
    QUOTA_EXCEEDED_ERR = 10,
    TYPE_MISMATCH_ERR = 11,
    PATH_EXISTS_ERR = 12
};
typedef int CDVFileError;

enum CDVFileSystemType {
    TEMPORARY = 0,
    PERSISTENT = 1
};
typedef int CDVFileSystemType;

extern NSString* const kCDVAssetsLibraryPrefix;

@interface CDVFile : CDVPlugin {
    NSString* appDocsPath;
    NSString* appLibraryPath;
    NSString* appTempPath;
    NSString* persistentPath;
    NSString* temporaryPath;

    BOOL userHasAllowed;
}
- (NSNumber*)checkFreeDiskSpace:(NSString*)appPath;
- (NSString*)getAppPath:(NSString*)pathFragment;
// -(NSString*) getFullPath: (NSString*)pathFragment;
- (void)requestFileSystem:(CDVInvokedUrlCommand*)command;
- (NSDictionary*)getDirectoryEntry:(NSString*)fullPath isDirectory:(BOOL)isDir;
- (void)resolveLocalFileSystemURI:(CDVInvokedUrlCommand*)command;
- (void)getDirectory:(CDVInvokedUrlCommand*)command;
- (void)getFile:(CDVInvokedUrlCommand*)command;
- (void)getParent:(CDVInvokedUrlCommand*)command;
- (void)getMetadata:(CDVInvokedUrlCommand*)command;
- (void)removeRecursively:(CDVInvokedUrlCommand*)command;
- (void)remove:(CDVInvokedUrlCommand*)command;
- (CDVPluginResult*)doRemove:(NSString*)fullPath;
- (void)copyTo:(CDVInvokedUrlCommand*)command;
- (void)moveTo:(CDVInvokedUrlCommand*)command;
- (BOOL)canCopyMoveSrc:(NSString*)src ToDestination:(NSString*)dest;
- (void)doCopyMove:(CDVInvokedUrlCommand*)command isCopy:(BOOL)bCopy;
// - (void) toURI:(CDVInvokedUrlCommand*)command;
- (void)getFileMetadata:(CDVInvokedUrlCommand*)command;
- (void)readEntries:(CDVInvokedUrlCommand*)command;

- (void)readAsText:(CDVInvokedUrlCommand*)command;
- (void)readAsDataURL:(CDVInvokedUrlCommand*)command;
- (void)readAsArrayBuffer:(CDVInvokedUrlCommand*)command;
- (NSString*)getMimeTypeFromPath:(NSString*)fullPath;
- (void)write:(CDVInvokedUrlCommand*)command;
- (void)testFileExists:(CDVInvokedUrlCommand*)command;
- (void)testDirectoryExists:(CDVInvokedUrlCommand*)command;
// - (void) createDirectory:(CDVInvokedUrlCommand*)command;
// - (void) deleteDirectory:(CDVInvokedUrlCommand*)command;
// - (void) deleteFile:(CDVInvokedUrlCommand*)command;
- (void)getFreeDiskSpace:(CDVInvokedUrlCommand*)command;
- (void)truncate:(CDVInvokedUrlCommand*)command;

// - (BOOL) fileExists:(NSString*)fileName;
// - (BOOL) directoryExists:(NSString*)dirName;
- (void)writeToFile:(NSString*)fileName withData:(NSString*)data append:(BOOL)shouldAppend callback:(NSString*)callbackId;
- (unsigned long long)truncateFile:(NSString*)filePath atPosition:(unsigned long long)pos;

@property (nonatomic, strong) NSString* appDocsPath;
@property (nonatomic, strong) NSString* appLibraryPath;
@property (nonatomic, strong) NSString* appTempPath;
@property (nonatomic, strong) NSString* persistentPath;
@property (nonatomic, strong) NSString* temporaryPath;
@property BOOL userHasAllowed;

@end

#define kW3FileTemporary @"temporary"
#define kW3FilePersistent @"persistent"
