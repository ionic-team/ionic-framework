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
#import <AddressBook/ABAddressBook.h>
#import <AddressBookUI/AddressBookUI.h>

enum CDVContactError {
    UNKNOWN_ERROR = 0,
    INVALID_ARGUMENT_ERROR = 1,
    TIMEOUT_ERROR = 2,
    PENDING_OPERATION_ERROR = 3,
    IO_ERROR = 4,
    NOT_SUPPORTED_ERROR = 5,
    PERMISSION_DENIED_ERROR = 20
};
typedef NSUInteger CDVContactError;

@interface CDVContact : NSObject {
    ABRecordRef record;         // the ABRecord associated with this contact
    NSDictionary* returnFields; // dictionary of fields to return when performing search
}

@property (nonatomic, assign) ABRecordRef record;
@property (nonatomic, strong) NSDictionary* returnFields;

+ (NSDictionary*)defaultABtoW3C;
+ (NSDictionary*)defaultW3CtoAB;
+ (NSSet*)defaultW3CtoNull;
+ (NSDictionary*)defaultObjectAndProperties;
+ (NSDictionary*)defaultFields;

+ (NSDictionary*)calcReturnFields:(NSArray*)fields;
- (id)init;
- (id)initFromABRecord:(ABRecordRef)aRecord;
- (bool)setFromContactDict:(NSDictionary*)aContact asUpdate:(BOOL)bUpdate;

+ (BOOL)needsConversion:(NSString*)W3Label;
+ (CFStringRef)convertContactTypeToPropertyLabel:(NSString*)label;
+ (NSString*)convertPropertyLabelToContactType:(NSString*)label;
+ (BOOL)isValidW3ContactType:(NSString*)label;
- (bool)setValue:(id)aValue forProperty:(ABPropertyID)aProperty inRecord:(ABRecordRef)aRecord asUpdate:(BOOL)bUpdate;

- (NSDictionary*)toDictionary:(NSDictionary*)withFields;
- (NSNumber*)getDateAsNumber:(ABPropertyID)datePropId;
- (NSObject*)extractName;
- (NSObject*)extractMultiValue:(NSString*)propertyId;
- (NSObject*)extractAddresses;
- (NSObject*)extractIms;
- (NSObject*)extractOrganizations;
- (NSObject*)extractPhotos;

- (NSMutableDictionary*)translateW3Dict:(NSDictionary*)dict forProperty:(ABPropertyID)prop;
- (bool)setMultiValueStrings:(NSArray*)fieldArray forProperty:(ABPropertyID)prop inRecord:(ABRecordRef)person asUpdate:(BOOL)bUpdate;
- (bool)setMultiValueDictionary:(NSArray*)array forProperty:(ABPropertyID)prop inRecord:(ABRecordRef)person asUpdate:(BOOL)bUpdate;
- (ABMultiValueRef)allocStringMultiValueFromArray:array;
- (ABMultiValueRef)allocDictMultiValueFromArray:array forProperty:(ABPropertyID)prop;
- (BOOL)foundValue:(NSString*)testValue inFields:(NSDictionary*)searchFields;
- (BOOL)testStringValue:(NSString*)testValue forW3CProperty:(NSString*)property;
- (BOOL)testDateValue:(NSString*)testValue forW3CProperty:(NSString*)property;
- (BOOL)searchContactFields:(NSArray*)fields forMVStringProperty:(ABPropertyID)propId withValue:testValue;
- (BOOL)testMultiValueStrings:(NSString*)testValue forProperty:(ABPropertyID)propId ofType:(NSString*)type;
- (NSArray*)valuesForProperty:(ABPropertyID)propId inRecord:(ABRecordRef)aRecord;
- (NSArray*)labelsForProperty:(ABPropertyID)propId inRecord:(ABRecordRef)aRecord;
- (BOOL)searchContactFields:(NSArray*)fields forMVDictionaryProperty:(ABPropertyID)propId withValue:(NSString*)testValue;

@end

// generic ContactField types
#define kW3ContactFieldType @"type"
#define kW3ContactFieldValue @"value"
#define kW3ContactFieldPrimary @"pref"
// Various labels for ContactField types
#define kW3ContactWorkLabel @"work"
#define kW3ContactHomeLabel @"home"
#define kW3ContactOtherLabel @"other"
#define kW3ContactPhoneFaxLabel @"fax"
#define kW3ContactPhoneMobileLabel @"mobile"
#define kW3ContactPhonePagerLabel @"pager"
#define kW3ContactUrlBlog @"blog"
#define kW3ContactUrlProfile @"profile"
#define kW3ContactImAIMLabel @"aim"
#define kW3ContactImICQLabel @"icq"
#define kW3ContactImMSNLabel @"msn"
#define kW3ContactImYahooLabel @"yahoo"
#define kW3ContactFieldId @"id"
// special translation for IM field value and type
#define kW3ContactImType @"type"
#define kW3ContactImValue @"value"

// Contact object
#define kW3ContactId @"id"
#define kW3ContactName @"name"
#define kW3ContactFormattedName @"formatted"
#define kW3ContactGivenName @"givenName"
#define kW3ContactFamilyName @"familyName"
#define kW3ContactMiddleName @"middleName"
#define kW3ContactHonorificPrefix @"honorificPrefix"
#define kW3ContactHonorificSuffix @"honorificSuffix"
#define kW3ContactDisplayName @"displayName"
#define kW3ContactNickname @"nickname"
#define kW3ContactPhoneNumbers @"phoneNumbers"
#define kW3ContactAddresses @"addresses"
#define kW3ContactAddressFormatted @"formatted"
#define kW3ContactStreetAddress @"streetAddress"
#define kW3ContactLocality @"locality"
#define kW3ContactRegion @"region"
#define kW3ContactPostalCode @"postalCode"
#define kW3ContactCountry @"country"
#define kW3ContactEmails @"emails"
#define kW3ContactIms @"ims"
#define kW3ContactOrganizations @"organizations"
#define kW3ContactOrganizationName @"name"
#define kW3ContactTitle @"title"
#define kW3ContactDepartment @"department"
#define kW3ContactBirthday @"birthday"
#define kW3ContactNote @"note"
#define kW3ContactPhotos @"photos"
#define kW3ContactCategories @"categories"
#define kW3ContactUrls @"urls"
