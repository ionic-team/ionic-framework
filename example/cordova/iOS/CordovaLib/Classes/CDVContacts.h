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
#import "CDVPlugin.h"
#import "CDVContact.h"

@interface CDVContacts : CDVPlugin <ABNewPersonViewControllerDelegate,
                         ABPersonViewControllerDelegate,
                         ABPeoplePickerNavigationControllerDelegate
                         >
{
    ABAddressBookRef addressBook;
}

/*
 * newContact - create a new contact via the GUI
 *
 * arguments:
 *	1: successCallback: this is the javascript function that will be called with the newly created contactId
 */
- (void)newContact:(CDVInvokedUrlCommand*)command;

/*
 * displayContact  - IN PROGRESS
 *
 * arguments:
 *	1: recordID of the contact to display in the iPhone contact display
 *	2: successCallback - currently not used
 *  3: error callback
 * options:
 *	allowsEditing: set to true to allow the user to edit the contact - currently not supported
 */
- (void)displayContact:(CDVInvokedUrlCommand*)command;

/*
 * chooseContact
 *
 * arguments:
 *	1: this is the javascript function that will be called with the contact data as a JSON object (as the first param)
 * options:
 *	allowsEditing: set to true to not choose the contact, but to edit it in the iPhone contact editor
 */
- (void)chooseContact:(CDVInvokedUrlCommand*)command;

- (void)newPersonViewController:(ABNewPersonViewController*)newPersonViewController didCompleteWithNewPerson:(ABRecordRef)person;
- (BOOL)personViewController:(ABPersonViewController*)personViewController shouldPerformDefaultActionForPerson:(ABRecordRef)person
                    property:(ABPropertyID)property identifier:(ABMultiValueIdentifier)identifierForValue;

/*
 * search - searches for contacts.  Only person records are currently supported.
 *
 * arguments:
 *  1: successcallback - this is the javascript function that will be called with the array of found contacts
 *  2:  errorCallback - optional javascript function to be called in the event of an error with an error code.
 * options:  dictionary containing ContactFields and ContactFindOptions
 *	fields - ContactFields array
 *  findOptions - ContactFindOptions object as dictionary
 *
 */
- (void)search:(CDVInvokedUrlCommand*)command;

/*
 * save - saves a new contact or updates and existing contact
 *
 * arguments:
 *  1: success callback - this is the javascript function that will be called with the JSON representation of the saved contact
 *		search calls a fixed navigator.service.contacts._findCallback which then calls the success callback stored before making the call into obj-c
 */
- (void)save:(CDVInvokedUrlCommand*)command;

/*
 * remove - removes a contact from the address book
 *
 * arguments:
 *  1:  1: successcallback - this is the javascript function that will be called with a (now) empty contact object
 *
 * options:  dictionary containing Contact object to remove
 *	contact - Contact object as dictionary
 */
- (void)remove:(CDVInvokedUrlCommand*)command;

// - (void) dealloc;

@end

@interface CDVContactsPicker : ABPeoplePickerNavigationController
{
    BOOL allowsEditing;
    NSString* callbackId;
    NSDictionary* options;
    NSDictionary* pickedContactDictionary;
}

@property BOOL allowsEditing;
@property (copy) NSString* callbackId;
@property (nonatomic, strong) NSDictionary* options;
@property (nonatomic, strong) NSDictionary* pickedContactDictionary;

@end

@interface CDVNewContactsController : ABNewPersonViewController
{
    NSString* callbackId;
}
@property (copy) NSString* callbackId;
@end

/* ABPersonViewController does not have any UI to dismiss.  Adding navigationItems to it does not work properly,  the navigationItems are lost when the app goes into the background.
    The solution was to create an empty NavController in front of the ABPersonViewController. This
    causes the ABPersonViewController to have a back button. By subclassing the ABPersonViewController,
    we can override viewWillDisappear and take down the entire NavigationController at that time.
 */
@interface CDVDisplayContactViewController : ABPersonViewController
{}
@property (nonatomic, strong) CDVPlugin* contactsPlugin;

@end
@interface CDVAddressBookAccessError : NSObject
{}
@property (assign) CDVContactError errorCode;
- (CDVAddressBookAccessError*)initWithCode:(CDVContactError)code;
@end

typedef void (^ CDVAddressBookWorkerBlock)(
    ABAddressBookRef         addressBook,
    CDVAddressBookAccessError* error
    );
@interface CDVAddressBookHelper : NSObject
{}

- (void)createAddressBook:(CDVAddressBookWorkerBlock)workerBlock;
@end
