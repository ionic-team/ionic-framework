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

#import "NSDictionary+Extensions.h"
#import <math.h>

@implementation NSDictionary (org_apache_cordova_NSDictionary_Extension)

- (bool)existsValue:(NSString*)expectedValue forKey:(NSString*)key
{
    id val = [self valueForKey:key];
    bool exists = false;

    if (val != nil) {
        exists = [(NSString*)val compare : expectedValue options : NSCaseInsensitiveSearch] == 0;
    }

    return exists;
}

- (NSInteger)integerValueForKey:(NSString*)key defaultValue:(NSInteger)defaultValue withRange:(NSRange)range
{
    NSInteger value = defaultValue;

    NSNumber* val = [self valueForKey:key];  // value is an NSNumber

    if (val != nil) {
        value = [val integerValue];
    }

    // min, max checks
    value = MAX(range.location, value);
    value = MIN(range.length, value);

    return value;
}

- (NSInteger)integerValueForKey:(NSString*)key defaultValue:(NSInteger)defaultValue
{
    NSInteger value = defaultValue;

    NSNumber* val = [self valueForKey:key];  // value is an NSNumber

    if (val != nil) {
        value = [val integerValue];
    }
    return value;
}

/*
 *	Determine the type of object stored in a dictionary
 *	IN:
 *	(BOOL*) bString - if exists will be set to YES if object is an NSString, NO if not
 *	(BOOL*) bNull - if exists will be set to YES if object is an NSNull, NO if not
 *	(BOOL*) bArray - if exists will be set to YES if object is an NSArray, NO if not
 *	(BOOL*) bNumber - if exists will be set to YES if object is an NSNumber, NO if not
 *
 *	OUT:
 *	YES if key exists
 *  NO if key does not exist.  Input parameters remain untouched
 *
 */

- (BOOL)typeValueForKey:(NSString*)key isArray:(BOOL*)bArray isNull:(BOOL*)bNull isNumber:(BOOL*)bNumber isString:(BOOL*)bString
{
    BOOL bExists = YES;
    NSObject* value = [self objectForKey:key];

    if (value) {
        bExists = YES;
        if (bString) {
            *bString = [value isKindOfClass:[NSString class]];
        }
        if (bNull) {
            *bNull = [value isKindOfClass:[NSNull class]];
        }
        if (bArray) {
            *bArray = [value isKindOfClass:[NSArray class]];
        }
        if (bNumber) {
            *bNumber = [value isKindOfClass:[NSNumber class]];
        }
    }
    return bExists;
}

- (BOOL)valueForKeyIsArray:(NSString*)key
{
    BOOL bArray = NO;
    NSObject* value = [self objectForKey:key];

    if (value) {
        bArray = [value isKindOfClass:[NSArray class]];
    }
    return bArray;
}

- (BOOL)valueForKeyIsNull:(NSString*)key
{
    BOOL bNull = NO;
    NSObject* value = [self objectForKey:key];

    if (value) {
        bNull = [value isKindOfClass:[NSNull class]];
    }
    return bNull;
}

- (BOOL)valueForKeyIsString:(NSString*)key
{
    BOOL bString = NO;
    NSObject* value = [self objectForKey:key];

    if (value) {
        bString = [value isKindOfClass:[NSString class]];
    }
    return bString;
}

- (BOOL)valueForKeyIsNumber:(NSString*)key
{
    BOOL bNumber = NO;
    NSObject* value = [self objectForKey:key];

    if (value) {
        bNumber = [value isKindOfClass:[NSNumber class]];
    }
    return bNumber;
}

- (NSDictionary*)dictionaryWithLowercaseKeys
{
    NSMutableDictionary* result = [NSMutableDictionary dictionaryWithCapacity:self.count];
    NSString* key;

    for (key in self) {
        [result setObject:[self objectForKey:key] forKey:[key lowercaseString]];
    }

    return result;
}

@end
