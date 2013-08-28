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

#import "CDVNotification.h"
#import "NSDictionary+Extensions.h"

#define DIALOG_TYPE_ALERT @"alert"
#define DIALOG_TYPE_PROMPT @"prompt"

@implementation CDVNotification

/*
 * showDialogWithMessage - Common method to instantiate the alert view for alert, confirm, and prompt notifications.
 * Parameters:
 *  message       The alert view message.
 *  title         The alert view title.
 *  buttons       The array of customized strings for the buttons.
 *  callbackId    The commmand callback id.
 *  dialogType    The type of alert view [alert | prompt].
 */
- (void)showDialogWithMessage:(NSString*)message title:(NSString*)title buttons:(NSArray*)buttons callbackId:(NSString*)callbackId dialogType:(NSString*)dialogType
{
    CDVAlertView* alertView = [[CDVAlertView alloc]
        initWithTitle:title
                  message:message
                 delegate:self
        cancelButtonTitle:nil
        otherButtonTitles:nil];

    alertView.callbackId = callbackId;

    int count = [buttons count];

    for (int n = 0; n < count; n++) {
        [alertView addButtonWithTitle:[buttons objectAtIndex:n]];
    }

    if ([dialogType isEqualToString:DIALOG_TYPE_PROMPT]) {
        alertView.alertViewStyle = UIAlertViewStylePlainTextInput;
    }

    [alertView show];
}

- (void)alert:(CDVInvokedUrlCommand*)command
{
    NSString* callbackId = command.callbackId;
    NSString* message = [command argumentAtIndex:0];
    NSString* title = [command argumentAtIndex:1];
    NSString* buttons = [command argumentAtIndex:2];

    [self showDialogWithMessage:message title:title buttons:@[buttons] callbackId:callbackId dialogType:DIALOG_TYPE_ALERT];
}

- (void)confirm:(CDVInvokedUrlCommand*)command
{
    NSString* callbackId = command.callbackId;
    NSString* message = [command argumentAtIndex:0];
    NSString* title = [command argumentAtIndex:1];
    NSArray* buttons = [command argumentAtIndex:2];

    [self showDialogWithMessage:message title:title buttons:buttons callbackId:callbackId dialogType:DIALOG_TYPE_ALERT];
}

- (void)prompt:(CDVInvokedUrlCommand*)command
{
    NSString* callbackId = command.callbackId;
    NSString* message = [command argumentAtIndex:0];
    NSString* title = [command argumentAtIndex:1];
    NSArray* buttons = [command argumentAtIndex:2];

    [self showDialogWithMessage:message title:title buttons:buttons callbackId:callbackId dialogType:DIALOG_TYPE_PROMPT];
}

/**
  * Callback invoked when an alert dialog's buttons are clicked.
  */
- (void)alertView:(UIAlertView*)alertView clickedButtonAtIndex:(NSInteger)buttonIndex
{
    CDVAlertView* cdvAlertView = (CDVAlertView*)alertView;
    CDVPluginResult* result;

    // Determine what gets returned to JS based on the alert view type.
    if (alertView.alertViewStyle == UIAlertViewStyleDefault) {
        // For alert and confirm, return button index as int back to JS.
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsInt:buttonIndex + 1];
    } else {
        // For prompt, return button index and input text back to JS.
        NSString* value0 = [[alertView textFieldAtIndex:0] text];
        NSDictionary* info = @{
            @"buttonIndex":@(buttonIndex + 1),
            @"input1":(value0 ? value0 : [NSNull null])
        };
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:info];
    }
    [self.commandDelegate sendPluginResult:result callbackId:cdvAlertView.callbackId];
}

- (void)vibrate:(CDVInvokedUrlCommand*)command
{
    AudioServicesPlaySystemSound(kSystemSoundID_Vibrate);
}

@end

@implementation CDVAlertView

@synthesize callbackId;

@end
