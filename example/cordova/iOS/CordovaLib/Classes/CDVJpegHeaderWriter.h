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

@interface CDVJpegHeaderWriter : NSObject {
    NSDictionary * SubIFDTagFormatDict;
    NSDictionary * IFD0TagFormatDict;
}

- (NSData*) spliceExifBlockIntoJpeg: (NSData*) jpegdata
                      withExifBlock: (NSString*) exifstr;
- (NSString*) createExifAPP1 : (NSDictionary*) datadict;
- (NSString*) formattedHexStringFromDecimalNumber: (NSNumber*) numb 
                                       withPlaces: (NSNumber*) width;
- (NSString*) formatNumberWithLeadingZeroes: (NSNumber*) numb 
                                 withPlaces: (NSNumber*) places;
- (NSString*) decimalToUnsignedRational: (NSNumber*) numb
                    withResultNumerator: (NSNumber**) numerator
                  withResultDenominator: (NSNumber**) denominator;
- (void) continuedFraction: (double) val
          withFractionList: (NSMutableArray*) fractionlist 
               withHorizon: (int) horizon;
//- (void) expandContinuedFraction: (NSArray*) fractionlist;
- (void) splitDouble: (double) val 
         withIntComponent: (int*) rightside 
         withFloatRemainder: (double*) leftside;
- (NSString*) formatRationalWithNumerator: (NSNumber*) numerator
                          withDenominator: (NSNumber*) denominator
                               asSigned: (Boolean) signedFlag;
- (NSString*) hexStringFromData : (NSData*) data;
- (NSNumber*) numericFromHexString : (NSString *) hexstring;

/*
- (void) readExifMetaData : (NSData*) imgdata;
- (void) spliceImageData : (NSData*) imgdata withExifData: (NSDictionary*) exifdata;
- (void) locateExifMetaData : (NSData*) imgdata;
- (NSString*) createExifAPP1 : (NSDictionary*) datadict;
- (void) createExifDataString : (NSDictionary*) datadict;
- (NSString*) createDataElement : (NSString*) element
              withElementData: (NSString*) data
              withExternalDataBlock: (NSDictionary*) memblock;
- (NSString*) hexStringFromData : (NSData*) data;
- (NSNumber*) numericFromHexString : (NSString *) hexstring;
*/
@end
