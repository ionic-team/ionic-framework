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

#import "CDVJpegHeaderWriter.h"
#include "CDVExif.h"

/* macros for tag info shorthand:
   tagno        : tag number
   typecode     : data type
   components   : number of components
   appendString (TAGINF_W_APPEND only) : string to append to data
      Exif date data format include an extra 0x00 to the end of the data
 */
#define TAGINF(tagno, typecode, components) [NSArray arrayWithObjects: tagno, typecode, components, nil]
#define TAGINF_W_APPEND(tagno, typecode, components, appendString) [NSArray arrayWithObjects: tagno, typecode, components, appendString, nil]

const uint mJpegId = 0xffd8; // JPEG format marker
const uint mExifMarker = 0xffe1; // APP1 jpeg header marker
const uint mExif = 0x45786966; // ASCII 'Exif', first characters of valid exif header after size
const uint mMotorallaByteAlign = 0x4d4d; // 'MM', motorola byte align, msb first or 'sane'
const uint mIntelByteAlgin = 0x4949; // 'II', Intel byte align, lsb first or 'batshit crazy reverso world'
const uint mTiffLength = 0x2a; // after byte align bits, next to bits are 0x002a(MM) or 0x2a00(II), tiff version number


@implementation CDVJpegHeaderWriter

- (id) init {    
    self = [super init];
    // supported tags for exif IFD
    IFD0TagFormatDict = [[NSDictionary alloc] initWithObjectsAndKeys:
                  //      TAGINF(@"010e", [NSNumber numberWithInt:EDT_ASCII_STRING], @0), @"ImageDescription",
                        TAGINF_W_APPEND(@"0132", [NSNumber numberWithInt:EDT_ASCII_STRING], @20, @"00"), @"DateTime",
                        TAGINF(@"010f", [NSNumber numberWithInt:EDT_ASCII_STRING], @0), @"Make",
                        TAGINF(@"0110", [NSNumber numberWithInt:EDT_ASCII_STRING], @0), @"Model",
                        TAGINF(@"0131", [NSNumber numberWithInt:EDT_ASCII_STRING], @0), @"Software",
                        TAGINF(@"011a", [NSNumber numberWithInt:EDT_URATIONAL], @1), @"XResolution",
                        TAGINF(@"011b", [NSNumber numberWithInt:EDT_URATIONAL], @1), @"YResolution",
                        // currently supplied outside of Exif data block by UIImagePickerControllerMediaMetadata, this is set manually in CDVCamera.m
    /*                    TAGINF(@"0112", [NSNumber numberWithInt:EDT_USHORT], @1), @"Orientation",
                       
                        // rest of the tags are supported by exif spec, but are not specified by UIImagePickerControllerMediaMedadata
                        // should camera hardware supply these values in future versions, or if they can be derived, ImageHeaderWriter will include them gracefully
                        TAGINF(@"0128", [NSNumber numberWithInt:EDT_USHORT], @1), @"ResolutionUnit",
                        TAGINF(@"013e", [NSNumber numberWithInt:EDT_URATIONAL], @2), @"WhitePoint",
                        TAGINF(@"013f", [NSNumber numberWithInt:EDT_URATIONAL], @6), @"PrimaryChromaticities",
                        TAGINF(@"0211", [NSNumber numberWithInt:EDT_URATIONAL], @3), @"YCbCrCoefficients",
                        TAGINF(@"0213", [NSNumber numberWithInt:EDT_USHORT], @1), @"YCbCrPositioning",
                        TAGINF(@"0214", [NSNumber numberWithInt:EDT_URATIONAL], @6), @"ReferenceBlackWhite",
                        TAGINF(@"8298", [NSNumber numberWithInt:EDT_URATIONAL], @0), @"Copyright",
                         
                        // offset to exif subifd, we determine this dynamically based on the size of the main exif IFD
                        TAGINF(@"8769", [NSNumber numberWithInt:EDT_ULONG], @1), @"ExifOffset",*/
                        nil];


    // supported tages for exif subIFD
    SubIFDTagFormatDict = [[NSDictionary alloc] initWithObjectsAndKeys:
                           //TAGINF(@"9000", [NSNumber numberWithInt:], @), @"ExifVersion",
                           //TAGINF(@"9202",[NSNumber numberWithInt:EDT_URATIONAL],@1), @"ApertureValue",
                           //TAGINF(@"9203",[NSNumber numberWithInt:EDT_SRATIONAL],@1), @"BrightnessValue",
                           TAGINF(@"a001",[NSNumber numberWithInt:EDT_USHORT],@1), @"ColorSpace",
                           TAGINF_W_APPEND(@"9004",[NSNumber numberWithInt:EDT_ASCII_STRING],@20,@"00"), @"DateTimeDigitized",
                           TAGINF_W_APPEND(@"9003",[NSNumber numberWithInt:EDT_ASCII_STRING],@20,@"00"), @"DateTimeOriginal",
                           TAGINF(@"a402", [NSNumber numberWithInt:EDT_USHORT], @1), @"ExposureMode",
                           TAGINF(@"8822", [NSNumber numberWithInt:EDT_USHORT], @1), @"ExposureProgram",
                           //TAGINF(@"829a", [NSNumber numberWithInt:EDT_URATIONAL], @1), @"ExposureTime",
                           //TAGINF(@"829d", [NSNumber numberWithInt:EDT_URATIONAL], @1), @"FNumber",
                           TAGINF(@"9209", [NSNumber numberWithInt:EDT_USHORT], @1), @"Flash",
                           // FocalLengthIn35mmFilm
                           TAGINF(@"a405", [NSNumber numberWithInt:EDT_USHORT], @1), @"FocalLenIn35mmFilm",
                           //TAGINF(@"920a", [NSNumber numberWithInt:EDT_URATIONAL], @1), @"FocalLength",
                           //TAGINF(@"8827", [NSNumber numberWithInt:EDT_USHORT], @2), @"ISOSpeedRatings",
                           TAGINF(@"9207", [NSNumber numberWithInt:EDT_USHORT],@1), @"MeteringMode",
                           // specific to compressed data
                           TAGINF(@"a002", [NSNumber numberWithInt:EDT_ULONG],@1), @"PixelXDimension",
                           TAGINF(@"a003", [NSNumber numberWithInt:EDT_ULONG],@1), @"PixelYDimension",
                           // data type undefined, but this is a DSC camera, so value is always 1, treat as ushort
                           TAGINF(@"a301", [NSNumber numberWithInt:EDT_USHORT],@1), @"SceneType",
                           TAGINF(@"a217",[NSNumber numberWithInt:EDT_USHORT],@1), @"SensingMethod",
                           //TAGINF(@"9201", [NSNumber numberWithInt:EDT_SRATIONAL], @1), @"ShutterSpeedValue",
                           // specifies location of main subject in scene (x,y,wdith,height) expressed before rotation processing
                           //TAGINF(@"9214", [NSNumber numberWithInt:EDT_USHORT], @4), @"SubjectArea",
                           TAGINF(@"a403", [NSNumber numberWithInt:EDT_USHORT], @1), @"WhiteBalance",
                           nil];
    return self;
}

- (NSData*) spliceExifBlockIntoJpeg: (NSData*) jpegdata withExifBlock: (NSString*) exifstr {
    
    CDVJpegHeaderWriter * exifWriter = [[CDVJpegHeaderWriter alloc] init];
    
    NSMutableData * exifdata = [NSMutableData dataWithCapacity: [exifstr length]/2];
    int idx;
    for (idx = 0; idx+1 < [exifstr length]; idx+=2) {
        NSRange range = NSMakeRange(idx, 2);
        NSString* hexStr = [exifstr substringWithRange:range];
        NSScanner* scanner = [NSScanner scannerWithString:hexStr];
        unsigned int intValue;
        [scanner scanHexInt:&intValue];
        [exifdata appendBytes:&intValue length:1];
    }
    
    NSMutableData * ddata = [NSMutableData dataWithCapacity: [jpegdata length]];
    NSMakeRange(0,4);
    int loc = 0;
    bool done = false;
    // read the jpeg data until we encounter the app1==0xFFE1 marker
    while (loc+1 < [jpegdata length]) {
        NSData * blag = [jpegdata subdataWithRange: NSMakeRange(loc,2)];
        if( [[blag description] isEqualToString : @"<ffe1>"]) {
            // read the APP1 block size bits
            NSString * the = [exifWriter hexStringFromData:[jpegdata subdataWithRange: NSMakeRange(loc+2,2)]];
            NSNumber * app1width = [exifWriter numericFromHexString:the];
            //consume the original app1 block
            [ddata appendData:exifdata];
            // advance our loc marker past app1
            loc += [app1width intValue] + 2;
            done = true;
        } else {
            if(!done) {
                [ddata appendData:blag];
                loc += 2;
            } else {
                break;
            }
        }
    }
    // copy the remaining data
    [ddata appendData:[jpegdata subdataWithRange: NSMakeRange(loc,[jpegdata length]-loc)]];
    return ddata;
}



/**
 * Create the Exif data block as a hex string
 *   jpeg uses Application Markers (APP's) as markers for application data
 *   APP1 is the application marker reserved for exif data
 *
 *   (NSDictionary*) datadict - with subdictionaries marked '{TIFF}' and '{EXIF}' as returned by imagePickerController with a valid
 *                              didFinishPickingMediaWithInfo data dict, under key @"UIImagePickerControllerMediaMetadata"
 *
 *   the following constructs a hex string to Exif specifications, and is therefore brittle
 *   altering the order of arguments to the string constructors, modifying field sizes or formats,
 *   and any other minor change will likely prevent the exif data from being read
 */
- (NSString*) createExifAPP1 : (NSDictionary*) datadict {
    NSMutableString * app1; // holds finalized product
    NSString * exifIFD; // exif information file directory
    NSString * subExifIFD; // subexif information file directory
    
    // FFE1 is the hex APP1 marker code, and will allow client apps to read the data
    NSString * app1marker = @"ffe1";
    // SSSS size, to be determined
    // EXIF ascii characters followed by 2bytes of zeros
    NSString * exifmarker = @"457869660000";
    // Tiff header: 4d4d is motorolla byte align (big endian), 002a is hex for 42
    NSString * tiffheader = @"4d4d002a";
    //first IFD offset from the Tiff header to IFD0. Since we are writing it, we know it's address 0x08
    NSString * ifd0offset = @"00000008";
    // current offset to next data area
    int currentDataOffset = 0;
    
    //data labeled as TIFF in UIImagePickerControllerMediaMetaData is part of the EXIF IFD0 portion of APP1
    exifIFD = [self createExifIFDFromDict: [datadict objectForKey:@"{TIFF}"] withFormatDict: IFD0TagFormatDict isIFD0:YES currentDataOffset:&currentDataOffset];

    //data labeled as EXIF in UIImagePickerControllerMediaMetaData is part of the EXIF Sub IFD portion of APP1
    subExifIFD = [self createExifIFDFromDict: [datadict objectForKey:@"{Exif}"] withFormatDict: SubIFDTagFormatDict isIFD0:NO currentDataOffset:&currentDataOffset];
    /*
    NSLog(@"SUB EXIF IFD %@  WITH SIZE: %d",exifIFD,[exifIFD length]);
    
    NSLog(@"SUB EXIF IFD %@  WITH SIZE: %d",subExifIFD,[subExifIFD length]);
    */
    // construct the complete app1 data block
    app1 = [[NSMutableString alloc] initWithFormat: @"%@%04x%@%@%@%@%@",
            app1marker,
            16 + ([exifIFD length]/2) + ([subExifIFD length]/2) /*16+[exifIFD length]/2*/,
            exifmarker,
            tiffheader,
            ifd0offset,
            exifIFD,
            subExifIFD];
     
    return app1;
}

// returns hex string representing a valid exif information file directory constructed from the datadict and formatdict
- (NSString*) createExifIFDFromDict : (NSDictionary*) datadict
                     withFormatDict : (NSDictionary*) formatdict
                             isIFD0 : (BOOL) ifd0flag
                  currentDataOffset : (int*) dataoffset {
    NSArray * datakeys = [datadict allKeys]; // all known data keys
    NSArray * knownkeys = [formatdict  allKeys]; // only keys in knowkeys are considered for entry in this IFD
    NSMutableArray * ifdblock = [[NSMutableArray alloc] initWithCapacity: [datadict count]]; // all ifd entries
    NSMutableArray * ifddatablock = [[NSMutableArray alloc] initWithCapacity: [datadict count]]; // data block entries
 //   ifd0flag = NO; // ifd0 requires a special flag and has offset to next ifd appended to end
    
    // iterate through known provided data keys
    for (int i = 0; i < [datakeys count]; i++) {
        NSString * key = [datakeys objectAtIndex:i];
        // don't muck about with unknown keys
        if ([knownkeys indexOfObject: key] != NSNotFound) {
            // create new IFD entry
            NSString * entry = [self  createIFDElement: key
                                            withFormat: [formatdict objectForKey:key]
                                      withElementData: [datadict objectForKey:key]];
            // create the IFD entry's data block
            NSString * data = [self createIFDElementDataWithFormat: [formatdict objectForKey:key]
                                                   withData: [datadict objectForKey:key]];
            if (entry) {
                [ifdblock addObject:entry];
                if(!data) {
                    [ifdblock addObject:@""];
                } else {
                    [ifddatablock addObject:data];
                }
            }
        }
    }
    
    NSMutableString * exifstr = [[NSMutableString alloc] initWithCapacity: [ifdblock count] * 24];
    NSMutableString * dbstr = [[NSMutableString alloc] initWithCapacity: 100];
    
    int addr=*dataoffset; // current offset/address in datablock
    if (ifd0flag) {
        // calculate offset to datablock based on ifd file entry count
        addr += 14+(12*([ifddatablock count]+1)); // +1 for tag 0x8769, exifsubifd offset
    } else {
        // current offset + numSubIFDs (2-bytes) + 12*numSubIFDs + endMarker (4-bytes)
        addr += 2+(12*[ifddatablock count])+4;
    }
    
    for (int i = 0; i < [ifdblock count]; i++) {
        NSString * entry = [ifdblock objectAtIndex:i];
        NSString * data = [ifddatablock objectAtIndex:i];
        
        // check if the data fits into 4 bytes
        if( [data length] <= 8) {
            // concatenate the entry and the (4byte) data entry into the final IFD entry and append to exif ifd string
            [exifstr appendFormat : @"%@%@", entry, data];
        } else {
            [exifstr appendFormat : @"%@%08x", entry, addr];
            [dbstr appendFormat: @"%@", data];
            addr+= [data length] / 2;
            /*
            NSLog(@"=====data-length[%i]=======",[data length]);
            NSLog(@"addr-offset[%i]",addr);
            NSLog(@"entry[%@]",entry);
            NSLog(@"data[%@]",data);
             */
        }
    }
    
    // calculate IFD0 terminal offset tags, currently ExifSubIFD
    int entrycount = [ifdblock count];
    if (ifd0flag) {
        // 18 accounts for 8769's width + offset to next ifd, 8 accounts for start of header
        NSNumber * offset = [NSNumber numberWithInt:[exifstr length] / 2 + [dbstr length] / 2 + 18+8];
        
        [self appendExifOffsetTagTo: exifstr
                        withOffset : offset];
        entrycount++;
    }
    *dataoffset = addr;
    return [[NSString alloc] initWithFormat: @"%04x%@%@%@",
            entrycount,
            exifstr,
            @"00000000", // offset to next IFD, 0 since there is none
            dbstr]; // lastly, the datablock
}

// Creates an exif formatted exif information file directory entry
- (NSString*) createIFDElement: (NSString*) elementName withFormat: (NSArray*) formtemplate withElementData: (NSString*) data  {
    //NSArray * fielddata = [formatdict objectForKey: elementName];// format data of desired field
    if (formtemplate) {
        // format string @"%@%@%@%@", tag number, data format, components, value
        NSNumber * dataformat = [formtemplate objectAtIndex:1];
        NSNumber * components = [formtemplate objectAtIndex:2];
        if([components intValue] == 0) {
            components = [NSNumber numberWithInt: [data length] * DataTypeToWidth[[dataformat intValue]-1]];            
        }

        return [[NSString alloc] initWithFormat: @"%@%@%08x",
                                                [formtemplate objectAtIndex:0], // the field code
                                                [self formatNumberWithLeadingZeroes: dataformat withPlaces: @4], // the data type code
                                                [components intValue]]; // number of components
    }
    return NULL;
}

/**
 * appends exif IFD0 tag 8769 "ExifOffset" to the string provided
 * (NSMutableString*) str - string you wish to append the 8769 tag to: APP1 or IFD0 hex data string 
 *  //  TAGINF(@"8769", [NSNumber numberWithInt:EDT_ULONG], @1), @"ExifOffset",
 */
- (void) appendExifOffsetTagTo: (NSMutableString*) str withOffset : (NSNumber*) offset {
    NSArray * format = TAGINF(@"8769", [NSNumber numberWithInt:EDT_ULONG], @1);
    
    NSString * entry = [self  createIFDElement: @"ExifOffset"
                                withFormat: format
                               withElementData: [offset stringValue]];
    
    NSString * data = [self createIFDElementDataWithFormat: format
                                                  withData: [offset stringValue]];
    [str appendFormat:@"%@%@", entry, data];
}

// formats the Information File Directory Data to exif format
- (NSString*) createIFDElementDataWithFormat: (NSArray*) dataformat withData: (NSString*) data {
    NSMutableString * datastr = nil;
    NSNumber * tmp = nil;
    NSNumber * formatcode = [dataformat objectAtIndex:1];
    NSUInteger formatItemsCount = [dataformat count];
    NSNumber * num = @0;
    NSNumber * denom = @0;
    
    switch ([formatcode intValue]) {
        case EDT_UBYTE:
            break;
        case EDT_ASCII_STRING:
            datastr = [[NSMutableString alloc] init];
            for (int i = 0; i < [data length]; i++) {
                [datastr appendFormat:@"%02x",[data characterAtIndex:i]];
            }
            if (formatItemsCount > 3) {
                // We have additional data to append.
                // currently used by Date format to append final 0x00 but can be used by other data types as well in the future
                [datastr appendString:[dataformat objectAtIndex:3]];
            }
            if ([datastr length] < 8) {
                NSString * format = [NSString stringWithFormat:@"%%0%dd", 8 - [datastr length]];
                [datastr appendFormat:format,0];
            }
            return datastr;
        case EDT_USHORT:
            return [[NSString alloc] initWithFormat : @"%@%@",
                    [self formattedHexStringFromDecimalNumber: [NSNumber numberWithInt: [data intValue]] withPlaces: @4],
                    @"0000"];
        case EDT_ULONG:
            tmp = [NSNumber numberWithUnsignedLong:[data intValue]];
            return [NSString stringWithFormat : @"%@",
                    [self formattedHexStringFromDecimalNumber: tmp withPlaces: @8]];
        case EDT_URATIONAL:
            return [self decimalToUnsignedRational: [NSNumber numberWithDouble:[data doubleValue]]
                               withResultNumerator: &num
                             withResultDenominator: &denom];
        case EDT_SBYTE:
            
            break;
        case EDT_UNDEFINED:
            break;     // 8 bits
        case EDT_SSHORT:
            break;
        case EDT_SLONG:
            break;          // 32bit signed integer (2's complement)
        case EDT_SRATIONAL:
            break;     // 2 SLONGS, first long is numerator, second is denominator
        case EDT_SINGLEFLOAT:
            break;
        case EDT_DOUBLEFLOAT:
            break;
    }
    return datastr;
}

//======================================================================================================================
// Utility Methods
//======================================================================================================================

// creates a formatted little endian hex string from a number and width specifier
- (NSString*) formattedHexStringFromDecimalNumber: (NSNumber*) numb withPlaces: (NSNumber*) width {
    NSMutableString * str = [[NSMutableString alloc] initWithCapacity:[width intValue]];
    NSString * formatstr = [[NSString alloc] initWithFormat: @"%%%@%dx", @"0", [width intValue]];
    [str appendFormat:formatstr, [numb intValue]];
    return str;
}

// format number as string with leading 0's
- (NSString*) formatNumberWithLeadingZeroes: (NSNumber *) numb withPlaces: (NSNumber *) places { 
    NSNumberFormatter * formatter = [[NSNumberFormatter alloc] init];
    NSString *formatstr = [@"" stringByPaddingToLength:[places unsignedIntegerValue] withString:@"0" startingAtIndex:0];
    [formatter setPositiveFormat:formatstr];
    return [formatter stringFromNumber:numb];
}

// approximate a decimal with a rational by method of continued fraction
// can be collasped into decimalToUnsignedRational after testing
- (void) decimalToRational: (NSNumber *) numb
       withResultNumerator: (NSNumber**) numerator
     withResultDenominator: (NSNumber**) denominator {
    NSMutableArray * fractionlist = [[NSMutableArray alloc] initWithCapacity:8];
    
    [self continuedFraction: [numb doubleValue]
           withFractionList: fractionlist
                withHorizon: 8];
    
    // simplify complex fraction represented by partial fraction list
    [self expandContinuedFraction: fractionlist
              withResultNumerator: numerator
            withResultDenominator: denominator];

}

// approximate a decimal with an unsigned rational by method of continued fraction
- (NSString*) decimalToUnsignedRational: (NSNumber *) numb
                          withResultNumerator: (NSNumber**) numerator
                        withResultDenominator: (NSNumber**) denominator {
    NSMutableArray * fractionlist = [[NSMutableArray alloc] initWithCapacity:8];
    
    // generate partial fraction list
    [self continuedFraction: [numb doubleValue]
           withFractionList: fractionlist
                withHorizon: 8];
    
    // simplify complex fraction represented by partial fraction list
    [self expandContinuedFraction: fractionlist
              withResultNumerator: numerator
            withResultDenominator: denominator];
    
    return [self formatFractionList: fractionlist];
}

// recursive implementation of decimal approximation by continued fraction
- (void) continuedFraction: (double) val
          withFractionList: (NSMutableArray*) fractionlist
               withHorizon: (int) horizon {
    int whole;
    double remainder;
    // 1. split term
    [self splitDouble: val withIntComponent: &whole withFloatRemainder: &remainder];
    [fractionlist addObject: [NSNumber numberWithInt:whole]];
    
    // 2. calculate reciprocal of remainder
    if (!remainder) return; // early exit, exact fraction found, avoids recip/0
    double recip = 1 / remainder;

    // 3. exit condition
    if ([fractionlist count] > horizon) {
        return;
    }
    
    // 4. recurse
    [self continuedFraction:recip withFractionList: fractionlist withHorizon: horizon];
    
}

// expand continued fraction list, creating a single level rational approximation
-(void) expandContinuedFraction: (NSArray*) fractionlist
                  withResultNumerator: (NSNumber**) numerator
                withResultDenominator: (NSNumber**) denominator {
    int i = 0;
    int den = 0;
    int num = 0;
    if ([fractionlist count] == 1) {
        *numerator = [NSNumber numberWithInt:[[fractionlist objectAtIndex:0] intValue]];
        *denominator = @1;
        return;
    }
    
    //begin at the end of the list
    i = [fractionlist count] - 1;
    num = 1;
    den = [[fractionlist objectAtIndex:i] intValue];
    
    while (i > 0) {
        int t = [[fractionlist objectAtIndex: i-1] intValue];
        num = t * den + num;
        if (i==1) {
            break;
        } else {
            t = num;
            num = den;
            den = t;
        }
        i--;
    }
    // set result parameters values
    *numerator = [NSNumber numberWithInt: num];
    *denominator = [NSNumber numberWithInt: den];
}

// formats expanded fraction list to string matching exif specification
- (NSString*) formatFractionList: (NSArray *) fractionlist {
    NSMutableString * str = [[NSMutableString alloc] initWithCapacity:16];
    
    if ([fractionlist count] == 1){
        [str appendFormat: @"%08x00000001", [[fractionlist objectAtIndex:0] intValue]];
    }
    return str;
}

// format rational as
- (NSString*) formatRationalWithNumerator: (NSNumber*) numerator withDenominator: (NSNumber*) denominator asSigned: (Boolean) signedFlag {
    NSMutableString * str = [[NSMutableString alloc] initWithCapacity:16];
    if (signedFlag) {
        long num = [numerator longValue];
        long den = [denominator longValue];
        [str appendFormat: @"%08lx%08lx", num >= 0 ? num : ~ABS(num) + 1, num >= 0 ? den : ~ABS(den) + 1];
    } else {
        [str appendFormat: @"%08lx%08lx", [numerator unsignedLongValue], [denominator unsignedLongValue]];
    }
    return str;
}

// split a floating point number into two integer values representing the left and right side of the decimal
- (void) splitDouble: (double) val withIntComponent: (int*) rightside withFloatRemainder: (double*) leftside {
    *rightside = val; // convert numb to int representation, which truncates the decimal portion
    *leftside = val - *rightside;
}


//
- (NSString*) hexStringFromData : (NSData*) data {
    //overflow detection
    const unsigned char *dataBuffer = [data bytes];
    return [[NSString alloc] initWithFormat: @"%02x%02x",
            (unsigned char)dataBuffer[0],
            (unsigned char)dataBuffer[1]];
}

// convert a hex string to a number
- (NSNumber*) numericFromHexString : (NSString *) hexstring {
    NSScanner * scan = NULL;
    unsigned int numbuf= 0;
    
    scan = [NSScanner scannerWithString:hexstring];
    [scan scanHexInt:&numbuf];
    return [NSNumber numberWithInt:numbuf];
}

@end
