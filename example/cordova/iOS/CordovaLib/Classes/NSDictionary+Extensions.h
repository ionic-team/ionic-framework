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

@interface NSDictionary (org_apache_cordova_NSDictionary_Extension)

- (bool)existsValue:(NSString*)expectedValue forKey:(NSString*)key;
- (NSInteger)integerValueForKey:(NSString*)key defaultValue:(NSInteger)defaultValue withRange:(NSRange)range;
- (NSInteger)integerValueForKey:(NSString*)key defaultValue:(NSInteger)defaultValue;
- (BOOL)typeValueForKey:(NSString*)key isArray:(BOOL*)bArray isNull:(BOOL*)bNull isNumber:(BOOL*)bNumber isString:(BOOL*)bString;
- (BOOL)valueForKeyIsArray:(NSString*)key;
- (BOOL)valueForKeyIsNull:(NSString*)key;
- (BOOL)valueForKeyIsString:(NSString*)key;
- (BOOL)valueForKeyIsNumber:(NSString*)key;

- (NSDictionary*)dictionaryWithLowercaseKeys;

@end
