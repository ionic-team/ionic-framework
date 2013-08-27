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

#import "CDVContact.h"
#import "NSDictionary+Extensions.h"

#define DATE_OR_NULL(dateObj) ((aDate != nil) ? (id)([aDate descriptionWithLocale:[NSLocale currentLocale]]) : (id)([NSNull null]))
#define IS_VALID_VALUE(value) ((value != nil) && (![value isKindOfClass:[NSNull class]]))

static NSDictionary* org_apache_cordova_contacts_W3CtoAB = nil;
static NSDictionary* org_apache_cordova_contacts_ABtoW3C = nil;
static NSSet* org_apache_cordova_contacts_W3CtoNull = nil;
static NSDictionary* org_apache_cordova_contacts_objectAndProperties = nil;
static NSDictionary* org_apache_cordova_contacts_defaultFields = nil;

@implementation CDVContact : NSObject

                             @synthesize returnFields;

- (id)init
{
    if ((self = [super init]) != nil) {
        ABRecordRef rec = ABPersonCreate();
        self.record = rec;
        if (rec) {
            CFRelease(rec);
        }
    }
    return self;
}

- (id)initFromABRecord:(ABRecordRef)aRecord
{
    if ((self = [super init]) != nil) {
        self.record = aRecord;
    }
    return self;
}

/* synthesize 'record' ourselves to have retain properties for CF types */

- (void)setRecord:(ABRecordRef)aRecord
{
    if (record != NULL) {
        CFRelease(record);
    }
    if (aRecord != NULL) {
        record = CFRetain(aRecord);
    }
}

- (ABRecordRef)record
{
    return record;
}

/* Rather than creating getters and setters for each AddressBook (AB) Property, generic methods are used to deal with
 * simple properties,  MultiValue properties( phone numbers and emails) and MultiValueDictionary properties (Ims and addresses).
 * The dictionaries below are used to translate between the W3C identifiers and the AB properties.   Using the dictionaries,
 * allows looping through sets of properties to extract from or set into the W3C dictionary to/from the ABRecord.
 */

/* The two following dictionaries translate between W3C properties and AB properties.  It currently mixes both
 * Properties (kABPersonAddressProperty for example) and Strings (kABPersonAddressStreetKey) so users should be aware of
 * what types of values are expected.
 * a bit.
*/
+ (NSDictionary*)defaultABtoW3C
{
    if (org_apache_cordova_contacts_ABtoW3C == nil) {
        org_apache_cordova_contacts_ABtoW3C = [NSDictionary dictionaryWithObjectsAndKeys:
            kW3ContactNickname, [NSNumber numberWithInt:kABPersonNicknameProperty],
            kW3ContactGivenName, [NSNumber numberWithInt:kABPersonFirstNameProperty],
            kW3ContactFamilyName, [NSNumber numberWithInt:kABPersonLastNameProperty],
            kW3ContactMiddleName, [NSNumber numberWithInt:kABPersonMiddleNameProperty],
            kW3ContactHonorificPrefix, [NSNumber numberWithInt:kABPersonPrefixProperty],
            kW3ContactHonorificSuffix, [NSNumber numberWithInt:kABPersonSuffixProperty],
            kW3ContactPhoneNumbers, [NSNumber numberWithInt:kABPersonPhoneProperty],
            kW3ContactAddresses, [NSNumber numberWithInt:kABPersonAddressProperty],
            kW3ContactStreetAddress, kABPersonAddressStreetKey,
            kW3ContactLocality, kABPersonAddressCityKey,
            kW3ContactRegion, kABPersonAddressStateKey,
            kW3ContactPostalCode, kABPersonAddressZIPKey,
            kW3ContactCountry, kABPersonAddressCountryKey,
            kW3ContactEmails, [NSNumber numberWithInt:kABPersonEmailProperty],
            kW3ContactIms, [NSNumber numberWithInt:kABPersonInstantMessageProperty],
            kW3ContactOrganizations, [NSNumber numberWithInt:kABPersonOrganizationProperty],
            kW3ContactOrganizationName, [NSNumber numberWithInt:kABPersonOrganizationProperty],
            kW3ContactTitle, [NSNumber numberWithInt:kABPersonJobTitleProperty],
            kW3ContactDepartment, [NSNumber numberWithInt:kABPersonDepartmentProperty],
            kW3ContactBirthday, [NSNumber numberWithInt:kABPersonBirthdayProperty],
            kW3ContactUrls, [NSNumber numberWithInt:kABPersonURLProperty],
            kW3ContactNote, [NSNumber numberWithInt:kABPersonNoteProperty],
            nil];
    }

    return org_apache_cordova_contacts_ABtoW3C;
}

+ (NSDictionary*)defaultW3CtoAB
{
    if (org_apache_cordova_contacts_W3CtoAB == nil) {
        org_apache_cordova_contacts_W3CtoAB = [NSDictionary dictionaryWithObjectsAndKeys:
            [NSNumber numberWithInt:kABPersonNicknameProperty], kW3ContactNickname,
            [NSNumber numberWithInt:kABPersonFirstNameProperty], kW3ContactGivenName,
            [NSNumber numberWithInt:kABPersonLastNameProperty], kW3ContactFamilyName,
            [NSNumber numberWithInt:kABPersonMiddleNameProperty], kW3ContactMiddleName,
            [NSNumber numberWithInt:kABPersonPrefixProperty], kW3ContactHonorificPrefix,
            [NSNumber numberWithInt:kABPersonSuffixProperty], kW3ContactHonorificSuffix,
            [NSNumber numberWithInt:kABPersonPhoneProperty], kW3ContactPhoneNumbers,
            [NSNumber numberWithInt:kABPersonAddressProperty], kW3ContactAddresses,
            kABPersonAddressStreetKey, kW3ContactStreetAddress,
            kABPersonAddressCityKey, kW3ContactLocality,
            kABPersonAddressStateKey, kW3ContactRegion,
            kABPersonAddressZIPKey, kW3ContactPostalCode,
            kABPersonAddressCountryKey, kW3ContactCountry,
            [NSNumber numberWithInt:kABPersonEmailProperty], kW3ContactEmails,
            [NSNumber numberWithInt:kABPersonInstantMessageProperty], kW3ContactIms,
            [NSNumber numberWithInt:kABPersonOrganizationProperty], kW3ContactOrganizations,
            [NSNumber numberWithInt:kABPersonJobTitleProperty], kW3ContactTitle,
            [NSNumber numberWithInt:kABPersonDepartmentProperty], kW3ContactDepartment,
            [NSNumber numberWithInt:kABPersonBirthdayProperty], kW3ContactBirthday,
            [NSNumber numberWithInt:kABPersonNoteProperty], kW3ContactNote,
            [NSNumber numberWithInt:kABPersonURLProperty], kW3ContactUrls,
            kABPersonInstantMessageUsernameKey, kW3ContactImValue,
            kABPersonInstantMessageServiceKey, kW3ContactImType,
            [NSNull null], kW3ContactFieldType,     /* include entries in dictionary to indicate ContactField properties */
            [NSNull null], kW3ContactFieldValue,
            [NSNull null], kW3ContactFieldPrimary,
            [NSNull null], kW3ContactFieldId,
            [NSNumber numberWithInt:kABPersonOrganizationProperty], kW3ContactOrganizationName,      /* careful, name is used multiple times*/
            nil];
    }
    return org_apache_cordova_contacts_W3CtoAB;
}

+ (NSSet*)defaultW3CtoNull
{
    // these are values that have no AddressBook Equivalent OR have not been implemented yet
    if (org_apache_cordova_contacts_W3CtoNull == nil) {
        org_apache_cordova_contacts_W3CtoNull = [NSSet setWithObjects:kW3ContactDisplayName,
            kW3ContactCategories, kW3ContactFormattedName, nil];
    }
    return org_apache_cordova_contacts_W3CtoNull;
}

/*
 *	The objectAndProperties dictionary contains the all of the properties of the W3C Contact Objects specified by the key
 *	Used in calcReturnFields, and various extract<Property> methods
 */
+ (NSDictionary*)defaultObjectAndProperties
{
    if (org_apache_cordova_contacts_objectAndProperties == nil) {
        org_apache_cordova_contacts_objectAndProperties = [NSDictionary dictionaryWithObjectsAndKeys:
            [NSArray arrayWithObjects:kW3ContactGivenName, kW3ContactFamilyName,
            kW3ContactMiddleName, kW3ContactHonorificPrefix, kW3ContactHonorificSuffix, kW3ContactFormattedName, nil], kW3ContactName,
            [NSArray arrayWithObjects:kW3ContactStreetAddress, kW3ContactLocality, kW3ContactRegion,
            kW3ContactPostalCode, kW3ContactCountry, /*kW3ContactAddressFormatted,*/ nil], kW3ContactAddresses,
            [NSArray arrayWithObjects:kW3ContactOrganizationName, kW3ContactTitle, kW3ContactDepartment, nil], kW3ContactOrganizations,
            [NSArray arrayWithObjects:kW3ContactFieldType, kW3ContactFieldValue, kW3ContactFieldPrimary, nil], kW3ContactPhoneNumbers,
            [NSArray arrayWithObjects:kW3ContactFieldType, kW3ContactFieldValue, kW3ContactFieldPrimary, nil], kW3ContactEmails,
            [NSArray arrayWithObjects:kW3ContactFieldType, kW3ContactFieldValue, kW3ContactFieldPrimary, nil], kW3ContactPhotos,
            [NSArray arrayWithObjects:kW3ContactFieldType, kW3ContactFieldValue, kW3ContactFieldPrimary, nil], kW3ContactUrls,
            [NSArray arrayWithObjects:kW3ContactImValue, kW3ContactImType, nil], kW3ContactIms,
            nil];
    }
    return org_apache_cordova_contacts_objectAndProperties;
}

+ (NSDictionary*)defaultFields
{
    if (org_apache_cordova_contacts_defaultFields == nil) {
        org_apache_cordova_contacts_defaultFields = [NSDictionary dictionaryWithObjectsAndKeys:
            [[CDVContact defaultObjectAndProperties] objectForKey:kW3ContactName], kW3ContactName,
            [NSNull null], kW3ContactNickname,
            [[CDVContact defaultObjectAndProperties] objectForKey:kW3ContactAddresses], kW3ContactAddresses,
            [[CDVContact defaultObjectAndProperties] objectForKey:kW3ContactOrganizations], kW3ContactOrganizations,
            [[CDVContact defaultObjectAndProperties] objectForKey:kW3ContactPhoneNumbers], kW3ContactPhoneNumbers,
            [[CDVContact defaultObjectAndProperties] objectForKey:kW3ContactEmails], kW3ContactEmails,
            [[CDVContact defaultObjectAndProperties] objectForKey:kW3ContactIms], kW3ContactIms,
            [[CDVContact defaultObjectAndProperties] objectForKey:kW3ContactPhotos], kW3ContactPhotos,
            [[CDVContact defaultObjectAndProperties] objectForKey:kW3ContactUrls], kW3ContactUrls,
            [NSNull null], kW3ContactBirthday,
            [NSNull null], kW3ContactNote,
            nil];
    }
    return org_apache_cordova_contacts_defaultFields;
}

/*  Translate W3C Contact data into ABRecordRef
 *
 *	New contact information comes in as a NSMutableDictionary.  All Null entries in Contact object are set
 *	as [NSNull null] in the dictionary when translating from the JSON input string of Contact data. However, if
 *  user did not set a value within a Contact object or sub-object (by not using the object constructor) some data
 *	may not exist.
 *  bUpdate = YES indicates this is a save of an existing record
 */
- (bool)setFromContactDict:(NSDictionary*)aContact asUpdate:(BOOL)bUpdate
{
    if (![aContact isKindOfClass:[NSDictionary class]]) {
        return FALSE; // can't do anything if no dictionary!
    }

    ABRecordRef person = self.record;
    bool bSuccess = TRUE;
    CFErrorRef error;

    // set name info
    // iOS doesn't have displayName - might have to pull parts from it to create name
    bool bName = false;
    NSDictionary* dict = [aContact valueForKey:kW3ContactName];
    if ([dict isKindOfClass:[NSDictionary class]]) {
        bName = true;
        NSArray* propArray = [[CDVContact defaultObjectAndProperties] objectForKey:kW3ContactName];

        for (id i in propArray) {
            if (![(NSString*)i isEqualToString : kW3ContactFormattedName]) { // kW3ContactFormattedName is generated from ABRecordCopyCompositeName() and can't be set
                [self setValue:[dict valueForKey:i] forProperty:(ABPropertyID)[(NSNumber*)[[CDVContact defaultW3CtoAB] objectForKey:i] intValue]
                      inRecord:person asUpdate:bUpdate];
            }
        }
    }

    id nn = [aContact valueForKey:kW3ContactNickname];
    if (![nn isKindOfClass:[NSNull class]]) {
        bName = true;
        [self setValue:nn forProperty:kABPersonNicknameProperty inRecord:person asUpdate:bUpdate];
    }
    if (!bName) {
        // if no name or nickname - try and use displayName as W3Contact must have displayName or ContactName
        [self setValue:[aContact valueForKey:kW3ContactDisplayName] forProperty:kABPersonNicknameProperty
              inRecord:person asUpdate:bUpdate];
    }

    // set phoneNumbers
    // NSLog(@"setting phoneNumbers");
    NSArray* array = [aContact valueForKey:kW3ContactPhoneNumbers];
    if ([array isKindOfClass:[NSArray class]]) {
        [self setMultiValueStrings:array forProperty:kABPersonPhoneProperty inRecord:person asUpdate:bUpdate];
    }
    // set Emails
    // NSLog(@"setting emails");
    array = [aContact valueForKey:kW3ContactEmails];
    if ([array isKindOfClass:[NSArray class]]) {
        [self setMultiValueStrings:array forProperty:kABPersonEmailProperty inRecord:person asUpdate:bUpdate];
    }
    // set Urls
    // NSLog(@"setting urls");
    array = [aContact valueForKey:kW3ContactUrls];
    if ([array isKindOfClass:[NSArray class]]) {
        [self setMultiValueStrings:array forProperty:kABPersonURLProperty inRecord:person asUpdate:bUpdate];
    }

    // set multivalue dictionary properties
    // set addresses:  streetAddress, locality, region, postalCode, country
    // set ims:  value = username, type = servicetype
    // iOS addresses and im are a MultiValue Properties with label, value=dictionary of  info, and id
    // NSLog(@"setting addresses");
    error = nil;
    array = [aContact valueForKey:kW3ContactAddresses];
    if ([array isKindOfClass:[NSArray class]]) {
        [self setMultiValueDictionary:array forProperty:kABPersonAddressProperty inRecord:person asUpdate:bUpdate];
    }
    // ims
    // NSLog(@"setting ims");
    array = [aContact valueForKey:kW3ContactIms];
    if ([array isKindOfClass:[NSArray class]]) {
        [self setMultiValueDictionary:array forProperty:kABPersonInstantMessageProperty inRecord:person asUpdate:bUpdate];
    }

    // organizations
    // W3C ContactOrganization has pref, type, name, title, department
    // iOS only supports name, title, department
    // NSLog(@"setting organizations");
    // TODO this may need work - should Organization information be removed when array is empty??
    array = [aContact valueForKey:kW3ContactOrganizations];  // iOS only supports one organization - use first one
    if ([array isKindOfClass:[NSArray class]]) {
        BOOL bRemove = NO;
        NSDictionary* dict = nil;
        if ([array count] > 0) {
            dict = [array objectAtIndex:0];
        } else {
            // remove the organization info entirely
            bRemove = YES;
        }
        if ([dict isKindOfClass:[NSDictionary class]] || (bRemove == YES)) {
            [self setValue:(bRemove ? @"" : [dict valueForKey:@"name"]) forProperty:kABPersonOrganizationProperty inRecord:person asUpdate:bUpdate];
            [self setValue:(bRemove ? @"" : [dict valueForKey:kW3ContactTitle]) forProperty:kABPersonJobTitleProperty inRecord:person asUpdate:bUpdate];
            [self setValue:(bRemove ? @"" : [dict valueForKey:kW3ContactDepartment]) forProperty:kABPersonDepartmentProperty inRecord:person asUpdate:bUpdate];
        }
    }
    // add dates
    // Dates come in as milliseconds in NSNumber Object
    id ms = [aContact valueForKey:kW3ContactBirthday];
    NSDate* aDate = nil;
    if (ms && [ms isKindOfClass:[NSNumber class]]) {
        double msValue = [ms doubleValue];
        msValue = msValue / 1000;
        aDate = [NSDate dateWithTimeIntervalSince1970:msValue];
    }
    if ((aDate != nil) || [ms isKindOfClass:[NSString class]]) {
        [self setValue:aDate != nil ? aDate:ms forProperty:kABPersonBirthdayProperty inRecord:person asUpdate:bUpdate];
    }
    // don't update creation date
    // modification date will get updated when save
    // anniversary is removed from W3C Contact api Dec 9, 2010 spec - don't waste time on it yet

    // kABPersonDateProperty

    // kABPersonAnniversaryLabel

    // iOS doesn't have gender - ignore
    // note
    [self setValue:[aContact valueForKey:kW3ContactNote] forProperty:kABPersonNoteProperty inRecord:person asUpdate:bUpdate];

    // iOS doesn't have preferredName- ignore

    // photo
    array = [aContact valueForKey:kW3ContactPhotos];
    if ([array isKindOfClass:[NSArray class]]) {
        if (bUpdate && ([array count] == 0)) {
            // remove photo
            bSuccess = ABPersonRemoveImageData(person, &error);
        } else if ([array count] > 0) {
            NSDictionary* dict = [array objectAtIndex:0]; // currently only support one photo
            if ([dict isKindOfClass:[NSDictionary class]]) {
                id value = [dict objectForKey:kW3ContactFieldValue];
                if ([value isKindOfClass:[NSString class]]) {
                    if (bUpdate && ([value length] == 0)) {
                        // remove the current image
                        bSuccess = ABPersonRemoveImageData(person, &error);
                    } else {
                        // use this image
                        // don't know if string is encoded or not so first unencode it then encode it again
                        NSString* cleanPath = [value stringByReplacingPercentEscapesUsingEncoding:NSUTF8StringEncoding];
                        NSURL* photoUrl = [NSURL URLWithString:[cleanPath stringByAddingPercentEscapesUsingEncoding:NSUTF8StringEncoding]];
                        // caller is responsible for checking for a connection, if no connection this will fail
                        NSError* err = nil;
                        NSData* data = nil;
                        if (photoUrl) {
                            data = [NSData dataWithContentsOfURL:photoUrl options:NSDataReadingUncached error:&err];
                        }
                        if (data && ([data length] > 0)) {
                            bSuccess = ABPersonSetImageData(person, (__bridge CFDataRef)data, &error);
                        }
                        if (!data || !bSuccess) {
                            NSLog(@"error setting contact image: %@", (err != nil ? [err localizedDescription] : @""));
                        }
                    }
                }
            }
        }
    }

    // TODO WebURLs

    // TODO timezone

    return bSuccess;
}

/* Set item into an AddressBook Record for the specified property.
 * aValue - the value to set into the address book (code checks for null or [NSNull null]
 * aProperty - AddressBook property ID
 * aRecord - the record to update
 * bUpdate - whether this is a possible update vs a new entry
 * RETURN
 *	true - property was set (or input value as null)
 *	false - property was not set
 */
- (bool)setValue:(id)aValue forProperty:(ABPropertyID)aProperty inRecord:(ABRecordRef)aRecord asUpdate:(BOOL)bUpdate
{
    bool bSuccess = true;  // if property was null, just ignore and return success
    CFErrorRef error;

    if (aValue && ![aValue isKindOfClass:[NSNull class]]) {
        if (bUpdate && ([aValue isKindOfClass:[NSString class]] && ([aValue length] == 0))) { // if updating, empty string means to delete
            aValue = NULL;
        } // really only need to set if different - more efficient to just update value or compare and only set if necessary???
        bSuccess = ABRecordSetValue(aRecord, aProperty, (__bridge CFTypeRef)aValue, &error);
        if (!bSuccess) {
            NSLog(@"error setting %d property", aProperty);
        }
    }

    return bSuccess;
}

- (bool)removeProperty:(ABPropertyID)aProperty inRecord:(ABRecordRef)aRecord
{
    CFErrorRef err;
    bool bSuccess = ABRecordRemoveValue(aRecord, aProperty, &err);

    if (!bSuccess) {
        CFStringRef errDescription = CFErrorCopyDescription(err);
        NSLog(@"Unable to remove property %d: %@", aProperty, errDescription);
        CFRelease(errDescription);
    }
    return bSuccess;
}

- (bool)addToMultiValue:(ABMultiValueRef)multi fromDictionary:dict
{
    bool bSuccess = FALSE;
    id value = [dict valueForKey:kW3ContactFieldValue];

    if (IS_VALID_VALUE(value)) {
        CFStringRef label = [CDVContact convertContactTypeToPropertyLabel:[dict valueForKey:kW3ContactFieldType]];
        bSuccess = ABMultiValueAddValueAndLabel(multi, (__bridge CFTypeRef)value, label, NULL);
        if (!bSuccess) {
            NSLog(@"Error setting Value: %@ and label: %@", value, label);
        }
    }
    return bSuccess;
}

- (ABMultiValueRef)allocStringMultiValueFromArray:array
{
    ABMutableMultiValueRef multi = ABMultiValueCreateMutable(kABMultiStringPropertyType);

    for (NSDictionary* dict in array) {
        [self addToMultiValue:multi fromDictionary:dict];
    }

    return multi;  // caller is responsible for releasing multi
}

- (bool)setValue:(CFTypeRef)value forProperty:(ABPropertyID)prop inRecord:(ABRecordRef)person
{
    CFErrorRef error;
    bool bSuccess = ABRecordSetValue(person, prop, value, &error);

    if (!bSuccess) {
        NSLog(@"Error setting value for property: %d", prop);
    }
    return bSuccess;
}

/* Set MultiValue string properties into Address Book Record.
 * NSArray* fieldArray - array of dictionaries containing W3C properties to be set into record
 * ABPropertyID prop - the property to be set (generally used for phones and emails)
 * ABRecordRef  person - the record to set values into
 * BOOL bUpdate - whether or not to update date or set as new.
 *	When updating:
 *	  empty array indicates to remove entire property
 *	  empty string indicates to remove
 *    [NSNull null] do not modify (keep existing record value)
 * RETURNS
 * bool false indicates error
 *
 * used for phones and emails
 */
- (bool)setMultiValueStrings:(NSArray*)fieldArray forProperty:(ABPropertyID)prop inRecord:(ABRecordRef)person asUpdate:(BOOL)bUpdate
{
    bool bSuccess = TRUE;
    ABMutableMultiValueRef multi = nil;

    if (!bUpdate) {
        multi = [self allocStringMultiValueFromArray:fieldArray];
        bSuccess = [self setValue:multi forProperty:prop inRecord:person];
    } else if (bUpdate && ([fieldArray count] == 0)) {
        // remove entire property
        bSuccess = [self removeProperty:prop inRecord:person];
    } else { // check for and apply changes
        ABMultiValueRef copy = ABRecordCopyValue(person, prop);
        if (copy != nil) {
            multi = ABMultiValueCreateMutableCopy(copy);
            CFRelease(copy);

            for (NSDictionary* dict in fieldArray) {
                id val;
                NSString* label = nil;
                val = [dict valueForKey:kW3ContactFieldValue];
                label = (__bridge NSString*)[CDVContact convertContactTypeToPropertyLabel:[dict valueForKey:kW3ContactFieldType]];
                if (IS_VALID_VALUE(val)) {
                    // is an update,  find index of entry with matching id, if values are different, update.
                    id idValue = [dict valueForKey:kW3ContactFieldId];
                    int identifier = [idValue isKindOfClass:[NSNumber class]] ? [idValue intValue] : -1;
                    CFIndex i = identifier >= 0 ? ABMultiValueGetIndexForIdentifier(multi, identifier) : kCFNotFound;
                    if (i != kCFNotFound) {
                        if ([val length] == 0) {
                            // remove both value and label
                            ABMultiValueRemoveValueAndLabelAtIndex(multi, i);
                        } else {
                            NSString* valueAB = (__bridge_transfer NSString*)ABMultiValueCopyValueAtIndex(multi, i);
                            NSString* labelAB = (__bridge_transfer NSString*)ABMultiValueCopyLabelAtIndex(multi, i);
                            if ((valueAB == nil) || ![val isEqualToString:valueAB]) {
                                ABMultiValueReplaceValueAtIndex(multi, (__bridge CFTypeRef)val, i);
                            }
                            if ((labelAB == nil) || ![label isEqualToString:labelAB]) {
                                ABMultiValueReplaceLabelAtIndex(multi, (__bridge CFStringRef)label, i);
                            }
                        }
                    } else {
                        // is a new value - insert
                        [self addToMultiValue:multi fromDictionary:dict];
                    }
                } // end of if value
            } // end of for
        } else { // adding all new value(s)
            multi = [self allocStringMultiValueFromArray:fieldArray];
        }
        // set the (updated) copy as the new value
        bSuccess = [self setValue:multi forProperty:prop inRecord:person];
    }

    if (multi) {
        CFRelease(multi);
    }

    return bSuccess;
}

// used for ims and addresses
- (ABMultiValueRef)allocDictMultiValueFromArray:array forProperty:(ABPropertyID)prop
{
    ABMutableMultiValueRef multi = ABMultiValueCreateMutable(kABMultiDictionaryPropertyType);
    NSMutableDictionary* newDict;
    NSMutableDictionary* addDict;

    for (NSDictionary* dict in array) {
        newDict = [self translateW3Dict:dict forProperty:prop];
        addDict = [NSMutableDictionary dictionaryWithCapacity:2];
        if (newDict) { // create a new dictionary with a Label and Value, value is the dictionary previously created
            // June, 2011 W3C Contact spec adds type into ContactAddress book
            // get the type out of the original dictionary for address
            NSString* addrType = (NSString*)[dict valueForKey:kW3ContactFieldType];
            if (!addrType) {
                addrType = (NSString*)kABOtherLabel;
            }
            NSObject* typeValue = ((prop == kABPersonInstantMessageProperty) ? (NSObject*)kABOtherLabel : addrType);
            // NSLog(@"typeValue: %@", typeValue);
            [addDict setObject:typeValue forKey:kW3ContactFieldType];    //  im labels will be set as Other and address labels as type from dictionary
            [addDict setObject:newDict forKey:kW3ContactFieldValue];
            [self addToMultiValue:multi fromDictionary:addDict];
        }
    }

    return multi; // caller is responsible for releasing
}

// used for ims and addresses to convert W3 dictionary of values to AB Dictionary
// got messier when June, 2011 W3C Contact spec added type field into ContactAddress
- (NSMutableDictionary*)translateW3Dict:(NSDictionary*)dict forProperty:(ABPropertyID)prop
{
    NSArray* propArray = [[CDVContact defaultObjectAndProperties] valueForKey:[[CDVContact defaultABtoW3C] objectForKey:[NSNumber numberWithInt:prop]]];

    NSMutableDictionary* newDict = [NSMutableDictionary dictionaryWithCapacity:1];
    id value;

    for (NSString* key in propArray) { // for each W3 Contact key get the value
        if (((value = [dict valueForKey:key]) != nil) && ![value isKindOfClass:[NSNull class]]) {
            // if necessary convert the W3 value to AB Property label
            NSString* setValue = value;
            if ([CDVContact needsConversion:key]) { // IM types must be converted
                setValue = (NSString*)[CDVContact convertContactTypeToPropertyLabel:value];
                // IMs must have a valid AB value!
                if ((prop == kABPersonInstantMessageProperty) && [setValue isEqualToString:(NSString*)kABOtherLabel]) {
                    setValue = @""; // try empty string
                }
            }
            // set the AB value into the dictionary
            [newDict setObject:setValue forKey:(NSString*)[[CDVContact defaultW3CtoAB] valueForKey:(NSString*)key]];
        }
    }

    if ([newDict count] == 0) {
        newDict = nil; // no items added
    }
    return newDict;
}

/* set multivalue dictionary properties into an AddressBook Record
 * NSArray* array - array of dictionaries containing the W3C properties to set into the record
 * ABPropertyID prop - the property id for the multivalue dictionary (addresses and ims)
 * ABRecordRef person - the record to set the values into
 * BOOL bUpdate - YES if this is an update to an existing record
 *	When updating:
 *	  empty array indicates to remove entire property
 *	  value/label == "" indicates to remove
 *    value/label == [NSNull null] do not modify (keep existing record value)
 * RETURN
 *   bool false indicates fatal error
 *
 *  iOS addresses and im are a MultiValue Properties with label, value=dictionary of  info, and id
 *  set addresses:  streetAddress, locality, region, postalCode, country
 *  set ims:  value = username, type = servicetype
 *  there are some special cases in here for ims - needs cleanup / simplification
 *
 */
- (bool)setMultiValueDictionary:(NSArray*)array forProperty:(ABPropertyID)prop inRecord:(ABRecordRef)person asUpdate:(BOOL)bUpdate
{
    bool bSuccess = FALSE;
    ABMutableMultiValueRef multi = nil;

    if (!bUpdate) {
        multi = [self allocDictMultiValueFromArray:array forProperty:prop];
        bSuccess = [self setValue:multi forProperty:prop inRecord:person];
    } else if (bUpdate && ([array count] == 0)) {
        // remove property
        bSuccess = [self removeProperty:prop inRecord:person];
    } else { // check for and apply changes
        ABMultiValueRef copy = ABRecordCopyValue(person, prop);
        if (copy) {
            multi = ABMultiValueCreateMutableCopy(copy);
            CFRelease(copy);
            // get the W3C values for this property
            NSArray* propArray = [[CDVContact defaultObjectAndProperties] valueForKey:[[CDVContact defaultABtoW3C] objectForKey:[NSNumber numberWithInt:prop]]];
            id value;
            id valueAB;

            for (NSDictionary* field in array) {
                NSMutableDictionary* dict;
                // find the index for the current property
                id idValue = [field valueForKey:kW3ContactFieldId];
                int identifier = [idValue isKindOfClass:[NSNumber class]] ? [idValue intValue] : -1;
                CFIndex idx = identifier >= 0 ? ABMultiValueGetIndexForIdentifier(multi, identifier) : kCFNotFound;
                BOOL bUpdateLabel = NO;
                if (idx != kCFNotFound) {
                    dict = [NSMutableDictionary dictionaryWithCapacity:1];
                    // NSDictionary* existingDictionary = (NSDictionary*)ABMultiValueCopyValueAtIndex(multi, idx);
                    CFTypeRef existingDictionary = ABMultiValueCopyValueAtIndex(multi, idx);
                    NSString* existingABLabel = (__bridge_transfer NSString*)ABMultiValueCopyLabelAtIndex(multi, idx);
                    NSString* testLabel = [field valueForKey:kW3ContactFieldType];
                    // fixes cb-143 where setting empty label could cause address to not be removed
                    //   (because empty label would become 'other'  in convertContactTypeToPropertyLabel
                    //   which may not have matched existing label thus resulting in an incorrect updating of the label
                    //   and the address not getting removed at the end of the for loop)
                    if (testLabel && [testLabel isKindOfClass:[NSString class]] && ([testLabel length] > 0)) {
                        CFStringRef w3cLabel = [CDVContact convertContactTypeToPropertyLabel:testLabel];
                        if (w3cLabel && ![existingABLabel isEqualToString:(__bridge NSString*)w3cLabel]) {
                            // replace the label
                            ABMultiValueReplaceLabelAtIndex(multi, w3cLabel, idx);
                            bUpdateLabel = YES;
                        }
                    } // else was invalid or empty label string so do not update

                    for (id k in propArray) {
                        value = [field valueForKey:k];
                        bool bSet = (value != nil && ![value isKindOfClass:[NSNull class]] && ([value isKindOfClass:[NSString class]] && [value length] > 0));
                        // if there is a contact value, put it into dictionary
                        if (bSet) {
                            NSString* setValue = [CDVContact needsConversion:(NSString*)k] ? (NSString*)[CDVContact convertContactTypeToPropertyLabel:value] : value;
                            [dict setObject:setValue forKey:(NSString*)[[CDVContact defaultW3CtoAB] valueForKey:(NSString*)k]];
                        } else if ((value == nil) || ([value isKindOfClass:[NSString class]] && ([value length] != 0))) {
                            // value not provided in contact dictionary - if prop exists in AB dictionary, preserve it
                            valueAB = [(__bridge NSDictionary*)existingDictionary valueForKey : [[CDVContact defaultW3CtoAB] valueForKey:k]];
                            if (valueAB != nil) {
                                [dict setValue:valueAB forKey:[[CDVContact defaultW3CtoAB] valueForKey:k]];
                            }
                        } // else if value == "" it will not be added into updated dict and thus removed
                    } // end of for loop (moving here fixes cb-143, need to end for loop before replacing or removing multivalue)

                    if ([dict count] > 0) {
                        // something was added into new dict,
                        ABMultiValueReplaceValueAtIndex(multi, (__bridge CFTypeRef)dict, idx);
                    } else if (!bUpdateLabel) {
                        // nothing added into new dict and no label change so remove this property entry
                        ABMultiValueRemoveValueAndLabelAtIndex(multi, idx);
                    }

                    CFRelease(existingDictionary);
                } else {
                    // not found in multivalue so add it
                    dict = [self translateW3Dict:field forProperty:prop];
                    if (dict) {
                        NSMutableDictionary* addDict = [NSMutableDictionary dictionaryWithCapacity:2];
                        // get the type out of the original dictionary for address
                        NSObject* typeValue = ((prop == kABPersonInstantMessageProperty) ? (NSObject*)kABOtherLabel : (NSString*)[field valueForKey:kW3ContactFieldType]);
                        // NSLog(@"typeValue: %@", typeValue);
                        [addDict setObject:typeValue forKey:kW3ContactFieldType];        //  im labels will be set as Other and address labels as type from dictionary
                        [addDict setObject:dict forKey:kW3ContactFieldValue];
                        [self addToMultiValue:multi fromDictionary:addDict];
                    }
                }
            } // end of looping through dictionaries

            // set the (updated) copy as the new value
            bSuccess = [self setValue:multi forProperty:prop inRecord:person];
        }
    } // end of copy and apply changes
    if (multi) {
        CFRelease(multi);
    }

    return bSuccess;
}

/* Determine which W3C labels need to be converted
 */
+ (BOOL)needsConversion:(NSString*)W3Label
{
    BOOL bConvert = NO;

    if ([W3Label isEqualToString:kW3ContactFieldType] || [W3Label isEqualToString:kW3ContactImType]) {
        bConvert = YES;
    }
    return bConvert;
}

/* Translation of property type labels  contact API ---> iPhone
 *
 *	phone:  work, home, other, mobile, fax, pager -->
 *		kABWorkLabel, kABHomeLabel, kABOtherLabel, kABPersonPhoneMobileLabel, kABPersonHomeFAXLabel || kABPersonHomeFAXLabel, kABPersonPhonePagerLabel
 *	emails:  work, home, other ---> kABWorkLabel, kABHomeLabel, kABOtherLabel
 *	ims: aim, gtalk, icq, xmpp, msn, skype, qq, yahoo --> kABPersonInstantMessageService + (AIM, ICG, MSN, Yahoo).  No support for gtalk, xmpp, skype, qq
 * addresses: work, home, other --> kABWorkLabel, kABHomeLabel, kABOtherLabel
 *
 *
 */
+ (CFStringRef)convertContactTypeToPropertyLabel:(NSString*)label
{
    CFStringRef type;

    if ([label isKindOfClass:[NSNull class]] || ![label isKindOfClass:[NSString class]]) {
        type = NULL; // no label
    } else if ([label caseInsensitiveCompare:kW3ContactWorkLabel] == NSOrderedSame) {
        type = kABWorkLabel;
    } else if ([label caseInsensitiveCompare:kW3ContactHomeLabel] == NSOrderedSame) {
        type = kABHomeLabel;
    } else if ([label caseInsensitiveCompare:kW3ContactOtherLabel] == NSOrderedSame) {
        type = kABOtherLabel;
    } else if ([label caseInsensitiveCompare:kW3ContactPhoneMobileLabel] == NSOrderedSame) {
        type = kABPersonPhoneMobileLabel;
    } else if ([label caseInsensitiveCompare:kW3ContactPhonePagerLabel] == NSOrderedSame) {
        type = kABPersonPhonePagerLabel;
    } else if ([label caseInsensitiveCompare:kW3ContactImAIMLabel] == NSOrderedSame) {
        type = kABPersonInstantMessageServiceAIM;
    } else if ([label caseInsensitiveCompare:kW3ContactImICQLabel] == NSOrderedSame) {
        type = kABPersonInstantMessageServiceICQ;
    } else if ([label caseInsensitiveCompare:kW3ContactImMSNLabel] == NSOrderedSame) {
        type = kABPersonInstantMessageServiceMSN;
    } else if ([label caseInsensitiveCompare:kW3ContactImYahooLabel] == NSOrderedSame) {
        type = kABPersonInstantMessageServiceYahoo;
    } else if ([label caseInsensitiveCompare:kW3ContactUrlProfile] == NSOrderedSame) {
        type = kABPersonHomePageLabel;
    } else {
        type = kABOtherLabel;
    }

    return type;
}

+ (NSString*)convertPropertyLabelToContactType:(NSString*)label
{
    NSString* type = nil;

    if (label != nil) { // improve efficiency......
        if ([label isEqualToString:(NSString*)kABPersonPhoneMobileLabel]) {
            type = kW3ContactPhoneMobileLabel;
        } else if ([label isEqualToString:(NSString*)kABPersonPhoneHomeFAXLabel] ||
            [label isEqualToString:(NSString*)kABPersonPhoneWorkFAXLabel]) {
            type = kW3ContactPhoneFaxLabel;
        } else if ([label isEqualToString:(NSString*)kABPersonPhonePagerLabel]) {
            type = kW3ContactPhonePagerLabel;
        } else if ([label isEqualToString:(NSString*)kABHomeLabel]) {
            type = kW3ContactHomeLabel;
        } else if ([label isEqualToString:(NSString*)kABWorkLabel]) {
            type = kW3ContactWorkLabel;
        } else if ([label isEqualToString:(NSString*)kABOtherLabel]) {
            type = kW3ContactOtherLabel;
        } else if ([label isEqualToString:(NSString*)kABPersonInstantMessageServiceAIM]) {
            type = kW3ContactImAIMLabel;
        } else if ([label isEqualToString:(NSString*)kABPersonInstantMessageServiceICQ]) {
            type = kW3ContactImICQLabel;
        } else if ([label isEqualToString:(NSString*)kABPersonInstantMessageServiceJabber]) {
            type = kW3ContactOtherLabel;
        } else if ([label isEqualToString:(NSString*)kABPersonInstantMessageServiceMSN]) {
            type = kW3ContactImMSNLabel;
        } else if ([label isEqualToString:(NSString*)kABPersonInstantMessageServiceYahoo]) {
            type = kW3ContactImYahooLabel;
        } else if ([label isEqualToString:(NSString*)kABPersonHomePageLabel]) {
            type = kW3ContactUrlProfile;
        } else {
            type = kW3ContactOtherLabel;
        }
    }
    return type;
}

/* Check if the input label is a valid W3C ContactField.type. This is used when searching,
 * only search field types if the search string is a valid type.  If we converted any search
 * string to a ABPropertyLabel it could convert to kABOtherLabel which is probably not want
 * the user wanted to search for and could skew the results.
 */
+ (BOOL)isValidW3ContactType:(NSString*)label
{
    BOOL isValid = NO;

    if ([label isKindOfClass:[NSNull class]] || ![label isKindOfClass:[NSString class]]) {
        isValid = NO; // no label
    } else if ([label caseInsensitiveCompare:kW3ContactWorkLabel] == NSOrderedSame) {
        isValid = YES;
    } else if ([label caseInsensitiveCompare:kW3ContactHomeLabel] == NSOrderedSame) {
        isValid = YES;
    } else if ([label caseInsensitiveCompare:kW3ContactOtherLabel] == NSOrderedSame) {
        isValid = YES;
    } else if ([label caseInsensitiveCompare:kW3ContactPhoneMobileLabel] == NSOrderedSame) {
        isValid = YES;
    } else if ([label caseInsensitiveCompare:kW3ContactPhonePagerLabel] == NSOrderedSame) {
        isValid = YES;
    } else if ([label caseInsensitiveCompare:kW3ContactImAIMLabel] == NSOrderedSame) {
        isValid = YES;
    } else if ([label caseInsensitiveCompare:kW3ContactImICQLabel] == NSOrderedSame) {
        isValid = YES;
    } else if ([label caseInsensitiveCompare:kW3ContactImMSNLabel] == NSOrderedSame) {
        isValid = YES;
    } else if ([label caseInsensitiveCompare:kW3ContactImYahooLabel] == NSOrderedSame) {
        isValid = YES;
    } else {
        isValid = NO;
    }

    return isValid;
}

/* Create a new Contact Dictionary object from an ABRecordRef that contains information in a format such that
 * it can be returned to JavaScript callback as JSON object string.
 * Uses:
 * ABRecordRef set into Contact Object
 * NSDictionary withFields indicates which fields to return from the AddressBook Record
 *
 * JavaScript Contact:
 * @param {DOMString} id unique identifier
 * @param {DOMString} displayName
 * @param {ContactName} name
 * @param {DOMString} nickname
 * @param {ContactField[]} phoneNumbers array of phone numbers
 * @param {ContactField[]} emails array of email addresses
 * @param {ContactAddress[]} addresses array of addresses
 * @param {ContactField[]} ims instant messaging user ids
 * @param {ContactOrganization[]} organizations
 * @param {DOMString} published date contact was first created
 * @param {DOMString} updated date contact was last updated
 * @param {DOMString} birthday contact's birthday
 * @param (DOMString} anniversary contact's anniversary
 * @param {DOMString} gender contact's gender
 * @param {DOMString} note user notes about contact
 * @param {DOMString} preferredUsername
 * @param {ContactField[]} photos
 * @param {ContactField[]} tags
 * @param {ContactField[]} relationships
 * @param {ContactField[]} urls contact's web sites
 * @param {ContactAccounts[]} accounts contact's online accounts
 * @param {DOMString} timezone UTC time zone offset
 * @param {DOMString} connected
 */

- (NSDictionary*)toDictionary:(NSDictionary*)withFields
{
    // if not a person type record bail out for now
    if (ABRecordGetRecordType(self.record) != kABPersonType) {
        return NULL;
    }
    id value = nil;
    self.returnFields = withFields;

    NSMutableDictionary* nc = [NSMutableDictionary dictionaryWithCapacity:1];  // new contact dictionary to fill in from ABRecordRef
    // id
    [nc setObject:[NSNumber numberWithInt:ABRecordGetRecordID(self.record)] forKey:kW3ContactId];
    if (self.returnFields == nil) {
        // if no returnFields specified, W3C says to return empty contact (but Cordova will at least return id)
        return nc;
    }
    if ([self.returnFields objectForKey:kW3ContactDisplayName]) {
        // displayname requested -  iOS doesn't have so return null
        [nc setObject:[NSNull null] forKey:kW3ContactDisplayName];
        // may overwrite below if requested ContactName and there are no values
    }
    // nickname
    if ([self.returnFields valueForKey:kW3ContactNickname]) {
        value = (__bridge_transfer NSString*)ABRecordCopyValue(self.record, kABPersonNicknameProperty);
        [nc setObject:(value != nil) ? value:[NSNull null] forKey:kW3ContactNickname];
    }

    // name dictionary
    // NSLog(@"getting name info");
    NSObject* data = [self extractName];
    if (data != nil) {
        [nc setObject:data forKey:kW3ContactName];
    }
    if ([self.returnFields objectForKey:kW3ContactDisplayName] && ((data == nil) || ([(NSDictionary*)data objectForKey : kW3ContactFormattedName] == [NSNull null]))) {
        // user asked for displayName which iOS doesn't support but there is no other name data being returned
        // try and use Composite Name so some name is returned
        id tryName = (__bridge_transfer NSString*)ABRecordCopyCompositeName(self.record);
        if (tryName != nil) {
            [nc setObject:tryName forKey:kW3ContactDisplayName];
        } else {
            // use nickname or empty string
            value = (__bridge_transfer NSString*)ABRecordCopyValue(self.record, kABPersonNicknameProperty);
            [nc setObject:(value != nil) ? value:@"" forKey:kW3ContactDisplayName];
        }
    }
    // phoneNumbers array
    // NSLog(@"getting phoneNumbers");
    value = [self extractMultiValue:kW3ContactPhoneNumbers];
    if (value != nil) {
        [nc setObject:value forKey:kW3ContactPhoneNumbers];
    }
    // emails array
    // NSLog(@"getting emails");
    value = [self extractMultiValue:kW3ContactEmails];
    if (value != nil) {
        [nc setObject:value forKey:kW3ContactEmails];
    }
    // urls array
    value = [self extractMultiValue:kW3ContactUrls];
    if (value != nil) {
        [nc setObject:value forKey:kW3ContactUrls];
    }
    // addresses array
    // NSLog(@"getting addresses");
    value = [self extractAddresses];
    if (value != nil) {
        [nc setObject:value forKey:kW3ContactAddresses];
    }
    // im array
    // NSLog(@"getting ims");
    value = [self extractIms];
    if (value != nil) {
        [nc setObject:value forKey:kW3ContactIms];
    }
    // organization array (only info for one organization in iOS)
    // NSLog(@"getting organizations");
    value = [self extractOrganizations];
    if (value != nil) {
        [nc setObject:value forKey:kW3ContactOrganizations];
    }

    // for simple properties, could make this a bit more efficient by storing all simple properties in a single
    // array in the returnFields dictionary and setting them via a for loop through the array

    // add dates
    // NSLog(@"getting dates");
    NSNumber* ms;

    /** Contact Revision field removed from June 16, 2011 version of specification

    if ([self.returnFields valueForKey:kW3ContactUpdated]){
        ms = [self getDateAsNumber: kABPersonModificationDateProperty];
        if (!ms){
            // try and get published date
            ms = [self getDateAsNumber: kABPersonCreationDateProperty];
        }
        if (ms){
            [nc setObject:  ms forKey:kW3ContactUpdated];
        }

    }
    */

    if ([self.returnFields valueForKey:kW3ContactBirthday]) {
        ms = [self getDateAsNumber:kABPersonBirthdayProperty];
        if (ms) {
            [nc setObject:ms forKey:kW3ContactBirthday];
        }
    }

    /*  Anniversary removed from 12-09-2010 W3C Contacts api spec
     if ([self.returnFields valueForKey:kW3ContactAnniversary]){
        // Anniversary date is stored in a multivalue property
        ABMultiValueRef multi = ABRecordCopyValue(self.record, kABPersonDateProperty);
        if (multi){
            CFStringRef label = nil;
            CFIndex count = ABMultiValueGetCount(multi);
            // see if contains an Anniversary date
            for(CFIndex i=0; i<count; i++){
                label = ABMultiValueCopyLabelAtIndex(multi, i);
                if(label && [(NSString*)label isEqualToString:(NSString*)kABPersonAnniversaryLabel]){
                    CFDateRef aDate = ABMultiValueCopyValueAtIndex(multi, i);
                    if(aDate){
                        [nc setObject: (NSString*)aDate forKey: kW3ContactAnniversary];
                        CFRelease(aDate);
                    }
                    CFRelease(label);
                    break;
                }
            }
            CFRelease(multi);
        }
    }*/

    if ([self.returnFields valueForKey:kW3ContactNote]) {
        // note
        value = (__bridge_transfer NSString*)ABRecordCopyValue(self.record, kABPersonNoteProperty);
        [nc setObject:(value != nil) ? value:[NSNull null] forKey:kW3ContactNote];
    }

    if ([self.returnFields valueForKey:kW3ContactPhotos]) {
        value = [self extractPhotos];
        [nc setObject:(value != nil) ? value:[NSNull null] forKey:kW3ContactPhotos];
    }

    /* TimeZone removed from June 16, 2011 Contacts spec
     *
    if ([self.returnFields valueForKey:kW3ContactTimezone]){
        [NSTimeZone resetSystemTimeZone];
        NSTimeZone* currentTZ = [NSTimeZone localTimeZone];
        NSInteger seconds = [currentTZ secondsFromGMT];
        NSString* tz = [NSString stringWithFormat:@"%2d:%02u",  seconds/3600, seconds % 3600 ];
        [nc setObject:tz forKey:kW3ContactTimezone];
    }
    */
    // TODO WebURLs
    // [nc setObject:[NSNull null] forKey:kW3ContactUrls];
    // online accounts - not available on iOS

    return nc;
}

- (NSNumber*)getDateAsNumber:(ABPropertyID)datePropId
{
    NSNumber* msDate = nil;
    NSDate* aDate = nil;
    CFTypeRef cfDate = ABRecordCopyValue(self.record, datePropId);

    if (cfDate) {
        aDate = (__bridge NSDate*)cfDate;
        msDate = [NSNumber numberWithDouble:([aDate timeIntervalSince1970] * 1000)];
        CFRelease(cfDate);
    }
    return msDate;
}

/* Create Dictionary to match JavaScript ContactName object:
 *	formatted - ABRecordCopyCompositeName
 *	familyName
 *	givenName
 *	middleName
 *	honorificPrefix
 *	honorificSuffix
*/

- (NSObject*)extractName
{
    NSArray* fields = [self.returnFields objectForKey:kW3ContactName];

    if (fields == nil) { // no name fields requested
        return nil;
    }

    NSMutableDictionary* newName = [NSMutableDictionary dictionaryWithCapacity:6];
    id value;

    for (NSString* i in fields) {
        if ([i isEqualToString:kW3ContactFormattedName]) {
            value = (__bridge_transfer NSString*)ABRecordCopyCompositeName(self.record);
            [newName setObject:(value != nil) ? value:[NSNull null] forKey:kW3ContactFormattedName];
        } else {
            // W3CtoAB returns NSNumber for AB name properties, get intValue and cast to ABPropertyID)
            value = (__bridge_transfer NSString*)ABRecordCopyValue(self.record, (ABPropertyID)[[[CDVContact defaultW3CtoAB] valueForKey:i] intValue]);
            [newName setObject:(value != nil) ? value:[NSNull null] forKey:(NSString*)i];
        }
    }

    return newName;
}

/* Create array of Dictionaries to match JavaScript ContactField object for simple multiValue properties phoneNumbers, emails
 * Input: (NSString*) W3Contact Property name
 * type
 *		for phoneNumbers type is one of (work,home,other, mobile, fax, pager)
 *		for emails type is one of (work,home, other)
 * value - phone number or email address
 * (bool) primary (not supported on iphone)
 * id
*/
- (NSObject*)extractMultiValue:(NSString*)propertyId
{
    NSArray* fields = [self.returnFields objectForKey:propertyId];

    if (fields == nil) {
        return nil;
    }
    ABMultiValueRef multi = nil;
    NSObject* valuesArray = nil;
    NSNumber* propNumber = [[CDVContact defaultW3CtoAB] valueForKey:propertyId];
    ABPropertyID propId = [propNumber intValue];
    multi = ABRecordCopyValue(self.record, propId);
    // multi = ABRecordCopyValue(self.record, (ABPropertyID)[[[Contact defaultW3CtoAB] valueForKey:propertyId] intValue]);
    CFIndex count = multi != nil ? ABMultiValueGetCount(multi) : 0;
    id value;
    if (count) {
        valuesArray = [NSMutableArray arrayWithCapacity:count];

        for (CFIndex i = 0; i < count; i++) {
            NSMutableDictionary* newDict = [NSMutableDictionary dictionaryWithCapacity:4];
            if ([fields containsObject:kW3ContactFieldType]) {
                NSString* label = (__bridge_transfer NSString*)ABMultiValueCopyLabelAtIndex(multi, i);
                value = [CDVContact convertPropertyLabelToContactType:label];
                [newDict setObject:(value != nil) ? value:[NSNull null]   forKey:kW3ContactFieldType];
            }
            if ([fields containsObject:kW3ContactFieldValue]) {
                value = (__bridge_transfer NSString*)ABMultiValueCopyValueAtIndex(multi, i);
                [newDict setObject:(value != nil) ? value:[NSNull null] forKey:kW3ContactFieldValue];
            }
            if ([fields containsObject:kW3ContactFieldPrimary]) {
                [newDict setObject:[NSNumber numberWithBool:(BOOL)NO] forKey:kW3ContactFieldPrimary];   // iOS doesn't support primary so set all to false
            }
            // always set id
            value = [NSNumber numberWithUnsignedInt:ABMultiValueGetIdentifierAtIndex(multi, i)];
            [newDict setObject:(value != nil) ? value:[NSNull null] forKey:kW3ContactFieldId];
            [(NSMutableArray*)valuesArray addObject : newDict];
        }
    } else {
        valuesArray = [NSNull null];
    }
    if (multi) {
        CFRelease(multi);
    }

    return valuesArray;
}

/* Create array of Dictionaries to match JavaScript ContactAddress object for addresses
 *  pref - not supported
 *  type - address type
 *	formatted  - formatted for mailing label (what about localization?)
 *	streetAddress
 *	locality
 *	region;
 *	postalCode
 *	country
 *	id
 *
 *	iOS addresses are a MultiValue Properties with label, value=dictionary of address info, and id
 */
- (NSObject*)extractAddresses
{
    NSArray* fields = [self.returnFields objectForKey:kW3ContactAddresses];

    if (fields == nil) { // no name fields requested
        return nil;
    }
    CFStringRef value;
    NSObject* addresses;
    ABMultiValueRef multi = ABRecordCopyValue(self.record, kABPersonAddressProperty);
    CFIndex count = multi ? ABMultiValueGetCount(multi) : 0;
    if (count) {
        addresses = [NSMutableArray arrayWithCapacity:count];

        for (CFIndex i = 0; i < count; i++) {
            NSMutableDictionary* newAddress = [NSMutableDictionary dictionaryWithCapacity:7];
            // if we got this far, at least some address info is being requested.

            // Always set id
            id identifier = [NSNumber numberWithUnsignedInt:ABMultiValueGetIdentifierAtIndex(multi, i)];
            [newAddress setObject:(identifier != nil) ? identifier:[NSNull null] forKey:kW3ContactFieldId];
            // set the type label
            NSString* label = (__bridge_transfer NSString*)ABMultiValueCopyLabelAtIndex(multi, i);

            [newAddress setObject:(label != nil) ? (NSObject*)[[CDVContact class] convertPropertyLabelToContactType:label]:[NSNull null] forKey:kW3ContactFieldType];
            // set the pref - iOS doesn't support so set to default of false
            [newAddress setObject:@"false" forKey:kW3ContactFieldPrimary];
            // get dictionary of values for this address
            CFDictionaryRef dict = (CFDictionaryRef)ABMultiValueCopyValueAtIndex(multi, i);

            for (id k in fields) {
                bool bFound;
                id key = [[CDVContact defaultW3CtoAB] valueForKey:k];
                if (key && ![k isKindOfClass:[NSNull class]]) {
                    bFound = CFDictionaryGetValueIfPresent(dict, (__bridge const void*)key, (void*)&value);
                    if (bFound && (value != NULL)) {
                        CFRetain(value);
                        [newAddress setObject:(__bridge id)value forKey:k];
                        CFRelease(value);
                    } else {
                        [newAddress setObject:[NSNull null] forKey:k];
                    }
                } else {
                    // was a property that iPhone doesn't support
                    [newAddress setObject:[NSNull null] forKey:k];
                }
            }

            if ([newAddress count] > 0) { // ?? this will always be true since we set id,label,primary field??
                [(NSMutableArray*)addresses addObject : newAddress];
            }
            CFRelease(dict);
        } // end of loop through addresses
    } else {
        addresses = [NSNull null];
    }
    if (multi) {
        CFRelease(multi);
    }

    return addresses;
}

/* Create array of Dictionaries to match JavaScript ContactField object for ims
 * type one of [aim, gtalk, icq, xmpp, msn, skype, qq, yahoo] needs other as well
 * value
 * (bool) primary
 * id
 *
 *	iOS IMs are a MultiValue Properties with label, value=dictionary of IM details (service, username), and id
 */
- (NSObject*)extractIms
{
    NSArray* fields = [self.returnFields objectForKey:kW3ContactIms];

    if (fields == nil) { // no name fields requested
        return nil;
    }
    NSObject* imArray;
    ABMultiValueRef multi = ABRecordCopyValue(self.record, kABPersonInstantMessageProperty);
    CFIndex count = multi ? ABMultiValueGetCount(multi) : 0;
    if (count) {
        imArray = [NSMutableArray arrayWithCapacity:count];

        for (CFIndex i = 0; i < ABMultiValueGetCount(multi); i++) {
            NSMutableDictionary* newDict = [NSMutableDictionary dictionaryWithCapacity:3];
            // iOS has label property (work, home, other) for each IM but W3C contact API doesn't use
            CFDictionaryRef dict = (CFDictionaryRef)ABMultiValueCopyValueAtIndex(multi, i);
            CFStringRef value;  // all values should be CFStringRefs / NSString*
            bool bFound;
            if ([fields containsObject:kW3ContactFieldValue]) {
                // value = user name
                bFound = CFDictionaryGetValueIfPresent(dict, kABPersonInstantMessageUsernameKey, (void*)&value);
                if (bFound && (value != NULL)) {
                    CFRetain(value);
                    [newDict setObject:(__bridge id)value forKey:kW3ContactFieldValue];
                    CFRelease(value);
                } else {
                    [newDict setObject:[NSNull null] forKey:kW3ContactFieldValue];
                }
            }
            if ([fields containsObject:kW3ContactFieldType]) {
                bFound = CFDictionaryGetValueIfPresent(dict, kABPersonInstantMessageServiceKey, (void*)&value);
                if (bFound && (value != NULL)) {
                    CFRetain(value);
                    [newDict setObject:(id)[[CDVContact class] convertPropertyLabelToContactType : (__bridge NSString*)value] forKey:kW3ContactFieldType];
                    CFRelease(value);
                } else {
                    [newDict setObject:[NSNull null] forKey:kW3ContactFieldType];
                }
            }
            // always set ID
            id identifier = [NSNumber numberWithUnsignedInt:ABMultiValueGetIdentifierAtIndex(multi, i)];
            [newDict setObject:(identifier != nil) ? identifier:[NSNull null] forKey:kW3ContactFieldId];

            [(NSMutableArray*)imArray addObject : newDict];
            CFRelease(dict);
        }
    } else {
        imArray = [NSNull null];
    }

    if (multi) {
        CFRelease(multi);
    }
    return imArray;
}

/* Create array of Dictionaries to match JavaScript ContactOrganization object
 *	pref - not supported in iOS
 *  type - not supported in iOS
 *  name
 *	department
 *	title
 */

- (NSObject*)extractOrganizations
{
    NSArray* fields = [self.returnFields objectForKey:kW3ContactOrganizations];

    if (fields == nil) { // no name fields requested
        return nil;
    }
    NSObject* array = nil;
    NSMutableDictionary* newDict = [NSMutableDictionary dictionaryWithCapacity:5];
    id value;
    int validValueCount = 0;

    for (id i in fields) {
        id key = [[CDVContact defaultW3CtoAB] valueForKey:i];
        if (key && [key isKindOfClass:[NSNumber class]]) {
            value = (__bridge_transfer NSString*)ABRecordCopyValue(self.record, (ABPropertyID)[[[CDVContact defaultW3CtoAB] valueForKey:i] intValue]);
            if (value != nil) {
                // if there are no organization values we should return null for organization
                // this counter keeps indicates if any organization values have been set
                validValueCount++;
            }
            [newDict setObject:(value != nil) ? value:[NSNull null] forKey:i];
        } else { // not a key iOS supports, set to null
            [newDict setObject:[NSNull null] forKey:i];
        }
    }

    if (([newDict count] > 0) && (validValueCount > 0)) {
        // add pref and type
        // they are not supported by iOS and thus these values never change
        [newDict setObject:@"false" forKey:kW3ContactFieldPrimary];
        [newDict setObject:[NSNull null] forKey:kW3ContactFieldType];
        array = [NSMutableArray arrayWithCapacity:1];
        [(NSMutableArray*)array addObject : newDict];
    } else {
        array = [NSNull null];
    }
    return array;
}

// W3C Contacts expects an array of photos.  Can return photos in more than one format, currently
// just returning the default format
// Save the photo data into tmp directory and return FileURI - temp directory is deleted upon application exit
- (NSObject*)extractPhotos
{
    NSMutableArray* photos = nil;

    if (ABPersonHasImageData(self.record)) {
        CFDataRef photoData = ABPersonCopyImageData(self.record);
        NSData* data = (__bridge NSData*)photoData;
        // write to temp directory and store URI in photos array
        // get the temp directory path
        NSString* docsPath = [NSTemporaryDirectory()stringByStandardizingPath];
        NSError* err = nil;
        NSString* filePath = [NSString stringWithFormat:@"%@/photo_XXXXX", docsPath];
        char template[filePath.length + 1];
        strcpy(template, [filePath cStringUsingEncoding:NSASCIIStringEncoding]);
        mkstemp(template);
        filePath = [[NSFileManager defaultManager]
            stringWithFileSystemRepresentation:template
                                        length:strlen(template)];

        // save file
        if ([data writeToFile:filePath options:NSAtomicWrite error:&err]) {
            photos = [NSMutableArray arrayWithCapacity:1];
            NSMutableDictionary* newDict = [NSMutableDictionary dictionaryWithCapacity:2];
            [newDict setObject:filePath forKey:kW3ContactFieldValue];
            [newDict setObject:@"url" forKey:kW3ContactFieldType];
            [newDict setObject:@"false" forKey:kW3ContactFieldPrimary];
            [photos addObject:newDict];
        }

        CFRelease(photoData);
    }
    return photos;
}

/**
 *	given an array of W3C Contact field names, create a dictionary of field names to extract
 *	if field name represents an object, return all properties for that object:  "name" - returns all properties in ContactName
 *	if field name is an explicit property, return only those properties:  "name.givenName - returns a ContactName with only ContactName.givenName
 *  if field contains ONLY ["*"] return all fields
 *	dictionary format:
 *	key is W3Contact #define
 *		value is NSMutableArray* for complex keys:  name,addresses,organizations, phone, emails, ims
 *		value is [NSNull null] for simple keys
*/
+ (NSDictionary*)calcReturnFields:(NSArray*)fieldsArray // NSLog(@"getting self.returnFields");
{
    NSMutableDictionary* d = [NSMutableDictionary dictionaryWithCapacity:1];

    if ((fieldsArray != nil) && [fieldsArray isKindOfClass:[NSArray class]]) {
        if (([fieldsArray count] == 1) && [[fieldsArray objectAtIndex:0] isEqualToString:@"*"]) {
            return [CDVContact defaultFields];  // return all fields
        }

        for (id i in fieldsArray) {
            NSMutableArray* keys = nil;
            NSString* fieldStr = nil;
            if ([i isKindOfClass:[NSNumber class]]) {
                fieldStr = [i stringValue];
            } else {
                fieldStr = i;
            }

            // see if this is specific property request in object - object.property
            NSArray* parts = [fieldStr componentsSeparatedByString:@"."]; // returns original string if no separator found
            NSString* name = [parts objectAtIndex:0];
            NSString* property = nil;
            if ([parts count] > 1) {
                property = [parts objectAtIndex:1];
            }
            // see if this is a complex field by looking for its array of properties in objectAndProperties dictionary
            id fields = [[CDVContact defaultObjectAndProperties] objectForKey:name];

            // if find complex name (name,addresses,organizations, phone, emails, ims) in fields, add name as key
            // with array of associated properties as the value
            if ((fields != nil) && (property == nil)) { // request was for full object
                keys = [NSMutableArray arrayWithArray:fields];
                if (keys != nil) {
                    [d setObject:keys forKey:name]; // will replace if prop array already exists
                }
            } else if ((fields != nil) && (property != nil)) {
                // found an individual property request  in form of name.property
                // verify is real property name by using it as key in W3CtoAB
                id abEquiv = [[CDVContact defaultW3CtoAB] objectForKey:property];
                if (abEquiv || [[CDVContact defaultW3CtoNull] containsObject:property]) {
                    // if existing array add to it
                    if ((keys = [d objectForKey:name]) != nil) {
                        [keys addObject:property];
                    } else {
                        keys = [NSMutableArray arrayWithObject:property];
                        [d setObject:keys forKey:name];
                    }
                } else {
                    NSLog(@"Contacts.find -- request for invalid property ignored: %@.%@", name, property);
                }
            } else { // is an individual property, verify is real property name by using it as key in W3CtoAB
                id valid = [[CDVContact defaultW3CtoAB] objectForKey:name];
                if (valid || [[CDVContact defaultW3CtoNull] containsObject:name]) {
                    [d setObject:[NSNull null] forKey:name];
                }
            }
        }
    }
    if ([d count] == 0) {
        // no array or nothing in the array. W3C spec says to return nothing
        return nil;   // [Contact defaultFields];
    }
    return d;
}

/*
 * Search for the specified value in each of the fields specified in the searchFields dictionary.
 * NSString* value - the string value to search for (need clarification from W3C on how to search for dates)
 * NSDictionary* searchFields - a dictionary created via calcReturnFields where the key is the top level W3C
 *	object and the object is the array of specific fields within that object or null if it is a single property
 * RETURNS
 *	YES as soon as a match is found in any of the fields
 *	NO - the specified value does not exist in any of the fields in this contact
 *
 *  Note: I'm not a fan of returning in the middle of methods but have done it some in this method in order to
 *    keep the code simpler. bgibson
 */
- (BOOL)foundValue:(NSString*)testValue inFields:(NSDictionary*)searchFields
{
    BOOL bFound = NO;

    if ((testValue == nil) || ![testValue isKindOfClass:[NSString class]] || ([testValue length] == 0)) {
        // nothing to find so return NO
        return NO;
    }
    NSInteger valueAsInt = [testValue integerValue];

    // per W3C spec, always include id in search
    int recordId = ABRecordGetRecordID(self.record);
    if (valueAsInt && (recordId == valueAsInt)) {
        return YES;
    }

    if (searchFields == nil) {
        // no fields to search
        return NO;
    }

    if ([searchFields valueForKey:kW3ContactNickname]) {
        bFound = [self testStringValue:testValue forW3CProperty:kW3ContactNickname];
        if (bFound == YES) {
            return bFound;
        }
    }

    if ([searchFields valueForKeyIsArray:kW3ContactName]) {
        // test name fields.  All are string properties obtained via ABRecordCopyValue except kW3ContactFormattedName
        NSArray* fields = [searchFields valueForKey:kW3ContactName];

        for (NSString* testItem in fields) {
            if ([testItem isEqualToString:kW3ContactFormattedName]) {
                NSString* propValue = (__bridge_transfer NSString*)ABRecordCopyCompositeName(self.record);
                if ((propValue != nil) && ([propValue length] > 0)) {
                    NSRange range = [propValue rangeOfString:testValue options:NSCaseInsensitiveSearch];
                    bFound = (range.location != NSNotFound);
                    propValue = nil;
                }
            } else {
                bFound = [self testStringValue:testValue forW3CProperty:testItem];
            }

            if (bFound) {
                break;
            }
        }
    }
    if (!bFound && [searchFields valueForKeyIsArray:kW3ContactPhoneNumbers]) {
        bFound = [self searchContactFields:(NSArray*)[searchFields valueForKey:kW3ContactPhoneNumbers]
                       forMVStringProperty:kABPersonPhoneProperty withValue:testValue];
    }
    if (!bFound && [searchFields valueForKeyIsArray:kW3ContactEmails]) {
        bFound = [self searchContactFields:(NSArray*)[searchFields valueForKey:kW3ContactEmails]
                       forMVStringProperty:kABPersonEmailProperty withValue:testValue];
    }

    if (!bFound && [searchFields valueForKeyIsArray:kW3ContactAddresses]) {
        bFound = [self searchContactFields:[searchFields valueForKey:kW3ContactAddresses]
                   forMVDictionaryProperty:kABPersonAddressProperty withValue:testValue];
    }

    if (!bFound && [searchFields valueForKeyIsArray:kW3ContactIms]) {
        bFound = [self searchContactFields:[searchFields valueForKey:kW3ContactIms]
                   forMVDictionaryProperty:kABPersonInstantMessageProperty withValue:testValue];
    }

    if (!bFound && [searchFields valueForKeyIsArray:kW3ContactOrganizations]) {
        NSArray* fields = [searchFields valueForKey:kW3ContactOrganizations];

        for (NSString* testItem in fields) {
            bFound = [self testStringValue:testValue forW3CProperty:testItem];
            if (bFound == YES) {
                break;
            }
        }
    }
    if (!bFound && [searchFields valueForKey:kW3ContactNote]) {
        bFound = [self testStringValue:testValue forW3CProperty:kW3ContactNote];
    }

    // if searching for a date field is requested, get the date field as a localized string then look for match against testValue in date string
    // searching for photos is not supported
    if (!bFound && [searchFields valueForKey:kW3ContactBirthday]) {
        bFound = [self testDateValue:testValue forW3CProperty:kW3ContactBirthday];
    }
    if (!bFound && [searchFields valueForKeyIsArray:kW3ContactUrls]) {
        bFound = [self searchContactFields:(NSArray*)[searchFields valueForKey:kW3ContactUrls]
                       forMVStringProperty:kABPersonURLProperty withValue:testValue];
    }

    return bFound;
}

/*
 * Test for the existence of a given string within the value of a ABPersonRecord string property based on the W3c property name.
 *
 * IN:
 *	NSString* testValue - the value to find - search is case insensitive
 *  NSString* property - the W3c property string
 * OUT:
 * BOOL YES if the given string was found within the property value
 *		NO if the testValue was not found, W3C property string was invalid or the AddressBook property was not a string
 */
- (BOOL)testStringValue:(NSString*)testValue forW3CProperty:(NSString*)property
{
    BOOL bFound = NO;

    if ([[CDVContact defaultW3CtoAB] valueForKeyIsNumber:property]) {
        ABPropertyID propId = [[[CDVContact defaultW3CtoAB] objectForKey:property] intValue];
        if (ABPersonGetTypeOfProperty(propId) == kABStringPropertyType) {
            NSString* propValue = (__bridge_transfer NSString*)ABRecordCopyValue(self.record, propId);
            if ((propValue != nil) && ([propValue length] > 0)) {
                NSPredicate* containPred = [NSPredicate predicateWithFormat:@"SELF contains[cd] %@", testValue];
                bFound = [containPred evaluateWithObject:propValue];
                // NSRange range = [propValue rangeOfString:testValue options: NSCaseInsensitiveSearch];
                // bFound = (range.location != NSNotFound);
            }
        }
    }
    return bFound;
}

/*
 * Test for the existence of a given Date string within the value of a ABPersonRecord datetime property based on the W3c property name.
 *
 * IN:
 *	NSString* testValue - the value to find - search is case insensitive
 *  NSString* property - the W3c property string
 * OUT:
 * BOOL YES if the given string was found within the localized date string value
 *		NO if the testValue was not found, W3C property string was invalid or the AddressBook property was not a DateTime
 */
- (BOOL)testDateValue:(NSString*)testValue forW3CProperty:(NSString*)property
{
    BOOL bFound = NO;

    if ([[CDVContact defaultW3CtoAB] valueForKeyIsNumber:property]) {
        ABPropertyID propId = [[[CDVContact defaultW3CtoAB] objectForKey:property] intValue];
        if (ABPersonGetTypeOfProperty(propId) == kABDateTimePropertyType) {
            NSDate* date = (__bridge_transfer NSDate*)ABRecordCopyValue(self.record, propId);
            if (date != nil) {
                NSString* dateString = [date descriptionWithLocale:[NSLocale currentLocale]];
                NSPredicate* containPred = [NSPredicate predicateWithFormat:@"SELF contains[cd] %@", testValue];
                bFound = [containPred evaluateWithObject:dateString];
            }
        }
    }
    return bFound;
}

/*
 * Search the specified fields within an AddressBook multivalue string property for the specified test value.
 * Used for phoneNumbers, emails and urls.
 * IN:
 *	NSArray* fields - the fields to search for within the multistring property (value and/or type)
 *	ABPropertyID - the property to search
 *	NSString* testValue - the value to search for. Will convert between W3C types and AB types.  Will only
 *		search for types if the testValue is a valid ContactField type.
 * OUT:
 *	YES if the test value was found in one of the specified fields
 *	NO if the test value was not found
 */
- (BOOL)searchContactFields:(NSArray*)fields forMVStringProperty:(ABPropertyID)propId withValue:testValue
{
    BOOL bFound = NO;

    for (NSString* type in fields) {
        NSString* testString = nil;
        if ([type isEqualToString:kW3ContactFieldType]) {
            if ([CDVContact isValidW3ContactType:testValue]) {
                // only search types if the filter string is a valid ContactField.type
                testString = (NSString*)[CDVContact convertContactTypeToPropertyLabel:testValue];
            }
        } else {
            testString = testValue;
        }

        if (testString != nil) {
            bFound = [self testMultiValueStrings:testString forProperty:propId ofType:type];
        }
        if (bFound == YES) {
            break;
        }
    }

    return bFound;
}

/*
 * Searches a multiString value of the specified type for the specified test value.
 *
 * IN:
 *	NSString* testValue - the value to test for
 *	ABPropertyID propId - the property id of the multivalue property to search
 *	NSString* type - the W3C contact type to search for (value or type)
 * OUT:
 * YES is the test value was found
 * NO if the test value was not found
 */
- (BOOL)testMultiValueStrings:(NSString*)testValue forProperty:(ABPropertyID)propId ofType:(NSString*)type
{
    BOOL bFound = NO;

    if (ABPersonGetTypeOfProperty(propId) == kABMultiStringPropertyType) {
        NSArray* valueArray = nil;
        if ([type isEqualToString:kW3ContactFieldType]) {
            valueArray = [self labelsForProperty:propId inRecord:self.record];
        } else if ([type isEqualToString:kW3ContactFieldValue]) {
            valueArray = [self valuesForProperty:propId inRecord:self.record];
        }
        if (valueArray) {
            NSString* valuesAsString = [valueArray componentsJoinedByString:@" "];
            NSPredicate* containPred = [NSPredicate predicateWithFormat:@"SELF contains[cd] %@", testValue];
            bFound = [containPred evaluateWithObject:valuesAsString];
        }
    }
    return bFound;
}

/*
 * Returns the array of values for a multivalue string property of the specified property id
 */
- (__autoreleasing NSArray*)valuesForProperty:(ABPropertyID)propId inRecord:(ABRecordRef)aRecord
{
    ABMultiValueRef multi = ABRecordCopyValue(aRecord, propId);
    NSArray* values = (__bridge_transfer NSArray*)ABMultiValueCopyArrayOfAllValues(multi);

    CFRelease(multi);
    return values;
}

/*
 * Returns the array of labels for a multivalue string property of the specified property id
 */
- (NSArray*)labelsForProperty:(ABPropertyID)propId inRecord:(ABRecordRef)aRecord
{
    ABMultiValueRef multi = ABRecordCopyValue(aRecord, propId);
    CFIndex count = ABMultiValueGetCount(multi);
    NSMutableArray* labels = [NSMutableArray arrayWithCapacity:count];

    for (int i = 0; i < count; i++) {
        NSString* label = (__bridge_transfer NSString*)ABMultiValueCopyLabelAtIndex(multi, i);
        if (label) {
            [labels addObject:label];
        }
    }

    CFRelease(multi);
    return labels;
}

/* search for values within MultiValue Dictionary properties Address or IM property
 * IN:
 * (NSArray*) fields - the array of W3C field names to search within
 * (ABPropertyID) propId - the AddressBook property that returns a multivalue dictionary
 * (NSString*) testValue - the string to search for within the specified fields
 *
 */
- (BOOL)searchContactFields:(NSArray*)fields forMVDictionaryProperty:(ABPropertyID)propId withValue:(NSString*)testValue
{
    BOOL bFound = NO;

    NSArray* values = [self valuesForProperty:propId inRecord:self.record];  // array of dictionaries (as CFDictionaryRef)
    int dictCount = [values count];

    // for ims dictionary contains with service (w3C type) and username (W3c value)
    // for addresses dictionary contains street, city, state, zip, country
    for (int i = 0; i < dictCount; i++) {
        CFDictionaryRef dict = (__bridge CFDictionaryRef)[values objectAtIndex:i];

        for (NSString* member in fields) {
            NSString* abKey = [[CDVContact defaultW3CtoAB] valueForKey:member]; // im and address fields are all strings
            CFStringRef abValue = nil;
            if (abKey) {
                NSString* testString = nil;
                if ([member isEqualToString:kW3ContactImType]) {
                    if ([CDVContact isValidW3ContactType:testValue]) {
                        // only search service/types if the filter string is a valid ContactField.type
                        testString = (NSString*)[CDVContact convertContactTypeToPropertyLabel:testValue];
                    }
                } else {
                    testString = testValue;
                }
                if (testString != nil) {
                    BOOL bExists = CFDictionaryGetValueIfPresent(dict, (__bridge const void*)abKey, (void*)&abValue);
                    if (bExists) {
                        CFRetain(abValue);
                        NSPredicate* containPred = [NSPredicate predicateWithFormat:@"SELF contains[cd] %@", testString];
                        bFound = [containPred evaluateWithObject:(__bridge id)abValue];
                        CFRelease(abValue);
                    }
                }
            }
            if (bFound == YES) {
                break;
            }
        } // end of for each member in fields

        if (bFound == YES) {
            break;
        }
    } // end of for each dictionary

    return bFound;
}

@end
