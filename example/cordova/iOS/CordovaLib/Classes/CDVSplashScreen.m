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

#import "CDVSplashScreen.h"

#define kSplashScreenDurationDefault 0.25f

@implementation CDVSplashScreen

- (void)pluginInitialize
{
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(pageDidLoad) name:CDVPageDidLoadNotification object:self.webView];

    [self setVisible:YES];
}

- (void)show:(CDVInvokedUrlCommand*)command
{
    [self setVisible:YES];
}

- (void)hide:(CDVInvokedUrlCommand*)command
{
    [self setVisible:NO];
}

- (void)pageDidLoad
{
    id autoHideSplashScreenValue = [self.commandDelegate.settings objectForKey:@"AutoHideSplashScreen"];

    // if value is missing, default to yes
    if ((autoHideSplashScreenValue == nil) || [autoHideSplashScreenValue boolValue]) {
        [self setVisible:NO];
    }
}

- (void)observeValueForKeyPath:(NSString*)keyPath ofObject:(id)object change:(NSDictionary*)change context:(void*)context
{
    [self updateImage];
}

- (void)createViews
{
    /*
     * The Activity View is the top spinning throbber in the status/battery bar. We init it with the default Grey Style.
     *
     *     whiteLarge = UIActivityIndicatorViewStyleWhiteLarge
     *     white      = UIActivityIndicatorViewStyleWhite
     *     gray       = UIActivityIndicatorViewStyleGray
     *
     */
    NSString* topActivityIndicator = [self.commandDelegate.settings objectForKey:@"TopActivityIndicator"];
    UIActivityIndicatorViewStyle topActivityIndicatorStyle = UIActivityIndicatorViewStyleGray;

    if ([topActivityIndicator isEqualToString:@"whiteLarge"]) {
        topActivityIndicatorStyle = UIActivityIndicatorViewStyleWhiteLarge;
    } else if ([topActivityIndicator isEqualToString:@"white"]) {
        topActivityIndicatorStyle = UIActivityIndicatorViewStyleWhite;
    } else if ([topActivityIndicator isEqualToString:@"gray"]) {
        topActivityIndicatorStyle = UIActivityIndicatorViewStyleGray;
    }

    UIView* parentView = self.viewController.view;
    parentView.userInteractionEnabled = NO;  // disable user interaction while splashscreen is shown
    _activityView = [[UIActivityIndicatorView alloc] initWithActivityIndicatorStyle:topActivityIndicatorStyle];
    _activityView.center = CGPointMake(parentView.bounds.size.width / 2, parentView.bounds.size.height / 2);
    _activityView.autoresizingMask = UIViewAutoresizingFlexibleTopMargin | UIViewAutoresizingFlexibleLeftMargin
        | UIViewAutoresizingFlexibleBottomMargin | UIViewAutoresizingFlexibleRightMargin;
    [_activityView startAnimating];

    // Set the frame & image later.
    _imageView = [[UIImageView alloc] init];
    [parentView addSubview:_imageView];

    id showSplashScreenSpinnerValue = [self.commandDelegate.settings objectForKey:@"ShowSplashScreenSpinner"];
    // backwards compatibility - if key is missing, default to true
    if ((showSplashScreenSpinnerValue == nil) || [showSplashScreenSpinnerValue boolValue]) {
        [parentView addSubview:_activityView];
    }

    // Frame is required when launching in portrait mode.
    // Bounds for landscape since it captures the rotation.
    [parentView addObserver:self forKeyPath:@"frame" options:0 context:nil];
    [parentView addObserver:self forKeyPath:@"bounds" options:0 context:nil];

    [self updateImage];
}

- (void)destroyViews
{
    [_imageView removeFromSuperview];
    [_activityView removeFromSuperview];
    _imageView = nil;
    _activityView = nil;
    _curImageName = nil;

    self.viewController.view.userInteractionEnabled = YES;  // re-enable user interaction upon completion
    [self.viewController.view removeObserver:self forKeyPath:@"frame"];
    [self.viewController.view removeObserver:self forKeyPath:@"bounds"];
}

// Sets the view's frame and image.
- (void)updateImage
{
    UIInterfaceOrientation orientation = self.viewController.interfaceOrientation;

    // Use UILaunchImageFile if specified in plist.  Otherwise, use Default.
    NSString* imageName = [[NSBundle mainBundle] objectForInfoDictionaryKey:@"UILaunchImageFile"];

    if (imageName) {
        imageName = [imageName stringByDeletingPathExtension];
    } else {
        imageName = @"Default";
    }

    if (CDV_IsIPhone5()) {
        imageName = [imageName stringByAppendingString:@"-568h"];
    } else if (CDV_IsIPad()) {
        switch (orientation) {
            case UIInterfaceOrientationLandscapeLeft:
            case UIInterfaceOrientationLandscapeRight:
                imageName = [imageName stringByAppendingString:@"-Landscape"];
                break;

            case UIInterfaceOrientationPortrait:
            case UIInterfaceOrientationPortraitUpsideDown:
            default:
                imageName = [imageName stringByAppendingString:@"-Portrait"];
                break;
        }
    }

    if (![imageName isEqualToString:_curImageName]) {
        UIImage* img = [UIImage imageNamed:imageName];
        _imageView.image = img;
        _curImageName = imageName;
    }

    [self updateBounds];
}

- (void)updateBounds
{
    UIImage* img = _imageView.image;
    CGRect imgBounds = CGRectMake(0, 0, img.size.width, img.size.height);

    CGSize screenSize = [self.viewController.view convertRect:[UIScreen mainScreen].bounds fromView:nil].size;

    // There's a special case when the image is the size of the screen.
    if (CGSizeEqualToSize(screenSize, imgBounds.size)) {
        CGRect statusFrame = [self.viewController.view convertRect:[UIApplication sharedApplication].statusBarFrame fromView:nil];
        imgBounds.origin.y -= statusFrame.size.height;
    } else {
        CGRect viewBounds = self.viewController.view.bounds;
        CGFloat imgAspect = imgBounds.size.width / imgBounds.size.height;
        CGFloat viewAspect = viewBounds.size.width / viewBounds.size.height;
        // This matches the behaviour of the native splash screen.
        CGFloat ratio;
        if (viewAspect > imgAspect) {
            ratio = viewBounds.size.width / imgBounds.size.width;
        } else {
            ratio = viewBounds.size.height / imgBounds.size.height;
        }
        imgBounds.size.height *= ratio;
        imgBounds.size.width *= ratio;
    }

    _imageView.frame = imgBounds;
}

- (void)setVisible:(BOOL)visible
{
    if (visible == _visible) {
        return;
    }
    _visible = visible;

    id fadeSplashScreenValue = [self.commandDelegate.settings objectForKey:@"FadeSplashScreen"];
    id fadeSplashScreenDuration = [self.commandDelegate.settings objectForKey:@"FadeSplashScreenDuration"];

    float fadeDuration = fadeSplashScreenDuration == nil ? kSplashScreenDurationDefault : [fadeSplashScreenDuration floatValue];

    if ((fadeSplashScreenValue == nil) || ![fadeSplashScreenValue boolValue]) {
        fadeDuration = 0;
    }

    // Never animate the showing of the splash screen.
    if (visible) {
        if (_imageView == nil) {
            [self createViews];
        }
    } else if (fadeDuration == 0) {
        [self destroyViews];
    } else {
        [UIView transitionWithView:self.viewController.view
                          duration:fadeDuration
                           options:UIViewAnimationOptionTransitionNone
                        animations:^(void) {
            [_imageView setAlpha:0];
            [_activityView setAlpha:0];
        }

                        completion:^(BOOL finished) {
            [self destroyViews];
        }];
    }
}

@end
