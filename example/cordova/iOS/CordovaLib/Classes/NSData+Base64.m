//
//  NSData+Base64.m
//  base64
//
//  Created by Matt Gallagher on 2009/06/03.
//  Copyright 2009 Matt Gallagher. All rights reserved.
//
//  Permission is given to use this source code file, free of charge, in any
//  project, commercial or otherwise, entirely at your risk, with the condition
//  that any redistribution (in part or whole) of source code must retain
//  this copyright and permission notice. Attribution in compiled projects is
//  appreciated but not required.
//

#import "NSData+Base64.h"

//
// Mapping from 6 bit pattern to ASCII character.
//
static unsigned char cdvbase64EncodeLookup[65] =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

//
// Definition for "masked-out" areas of the base64DecodeLookup mapping
//
#define xx 65

//
// Mapping from ASCII character to 6 bit pattern.
//
static unsigned char cdvbase64DecodeLookup[256] =
{
    xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx,
    xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx,
    xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, 62, xx, xx, xx, 63,
    52, 53, 54, 55, 56, 57, 58, 59, 60, 61, xx, xx, xx, xx, xx, xx,
    xx, 0,  1,  2,  3,  4,  5,  6,  7,  8,  9,  10, 11, 12, 13, 14,
    15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, xx, xx, xx, xx, xx,
    xx, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
    41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, xx, xx, xx, xx, xx,
    xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx,
    xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx,
    xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx,
    xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx,
    xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx,
    xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx,
    xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx,
    xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx,
};

//
// Fundamental sizes of the binary and base64 encode/decode units in bytes
//
#define CDV_BINARY_UNIT_SIZE 3
#define CDV_BASE64_UNIT_SIZE 4

//
// NewBase64Decode
//
// Decodes the base64 ASCII string in the inputBuffer to a newly malloced
// output buffer.
//
//  inputBuffer - the source ASCII string for the decode
//	length - the length of the string or -1 (to specify strlen should be used)
//	outputLength - if not-NULL, on output will contain the decoded length
//
// returns the decoded buffer. Must be freed by caller. Length is given by
//	outputLength.
//
void *CDVNewBase64Decode(
    const char* inputBuffer,
    size_t    length,
    size_t    * outputLength)
{
    if (length == -1) {
        length = strlen(inputBuffer);
    }

    size_t outputBufferSize = (length / CDV_BASE64_UNIT_SIZE) * CDV_BINARY_UNIT_SIZE;
    unsigned char* outputBuffer = (unsigned char*)malloc(outputBufferSize);

    size_t i = 0;
    size_t j = 0;

    while (i < length) {
        //
        // Accumulate 4 valid characters (ignore everything else)
        //
        unsigned char accumulated[CDV_BASE64_UNIT_SIZE];
        bzero(accumulated, sizeof(unsigned char) * CDV_BASE64_UNIT_SIZE);
        size_t accumulateIndex = 0;

        while (i < length) {
            unsigned char decode = cdvbase64DecodeLookup[inputBuffer[i++]];
            if (decode != xx) {
                accumulated[accumulateIndex] = decode;
                accumulateIndex++;

                if (accumulateIndex == CDV_BASE64_UNIT_SIZE) {
                    break;
                }
            }
        }

        //
        // Store the 6 bits from each of the 4 characters as 3 bytes
        //
        outputBuffer[j] = (accumulated[0] << 2) | (accumulated[1] >> 4);
        outputBuffer[j + 1] = (accumulated[1] << 4) | (accumulated[2] >> 2);
        outputBuffer[j + 2] = (accumulated[2] << 6) | accumulated[3];
        j += accumulateIndex - 1;
    }

    if (outputLength) {
        *outputLength = j;
    }
    return outputBuffer;
}

//
// NewBase64Decode
//
// Encodes the arbitrary data in the inputBuffer as base64 into a newly malloced
// output buffer.
//
//  inputBuffer - the source data for the encode
//	length - the length of the input in bytes
//  separateLines - if zero, no CR/LF characters will be added. Otherwise
//		a CR/LF pair will be added every 64 encoded chars.
//	outputLength - if not-NULL, on output will contain the encoded length
//		(not including terminating 0 char)
//
// returns the encoded buffer. Must be freed by caller. Length is given by
//	outputLength.
//
char *CDVNewBase64Encode(
    const void* buffer,
    size_t    length,
    bool      separateLines,
    size_t    * outputLength)
{
    const unsigned char* inputBuffer = (const unsigned char*)buffer;

#define MAX_NUM_PADDING_CHARS 2
#define OUTPUT_LINE_LENGTH 64
#define INPUT_LINE_LENGTH ((OUTPUT_LINE_LENGTH / CDV_BASE64_UNIT_SIZE) * CDV_BINARY_UNIT_SIZE)
#define CR_LF_SIZE 0

    //
    // Byte accurate calculation of final buffer size
    //
    size_t outputBufferSize =
        ((length / CDV_BINARY_UNIT_SIZE)
        + ((length % CDV_BINARY_UNIT_SIZE) ? 1 : 0))
        * CDV_BASE64_UNIT_SIZE;
    if (separateLines) {
        outputBufferSize +=
            (outputBufferSize / OUTPUT_LINE_LENGTH) * CR_LF_SIZE;
    }

    //
    // Include space for a terminating zero
    //
    outputBufferSize += 1;

    //
    // Allocate the output buffer
    //
    char* outputBuffer = (char*)malloc(outputBufferSize);
    if (!outputBuffer) {
        return NULL;
    }

    size_t i = 0;
    size_t j = 0;
    const size_t lineLength = separateLines ? INPUT_LINE_LENGTH : length;
    size_t lineEnd = lineLength;

    while (true) {
        if (lineEnd > length) {
            lineEnd = length;
        }

        for (; i + CDV_BINARY_UNIT_SIZE - 1 < lineEnd; i += CDV_BINARY_UNIT_SIZE) {
            //
            // Inner loop: turn 48 bytes into 64 base64 characters
            //
            outputBuffer[j++] = cdvbase64EncodeLookup[(inputBuffer[i] & 0xFC) >> 2];
            outputBuffer[j++] = cdvbase64EncodeLookup[((inputBuffer[i] & 0x03) << 4)
                | ((inputBuffer[i + 1] & 0xF0) >> 4)];
            outputBuffer[j++] = cdvbase64EncodeLookup[((inputBuffer[i + 1] & 0x0F) << 2)
                | ((inputBuffer[i + 2] & 0xC0) >> 6)];
            outputBuffer[j++] = cdvbase64EncodeLookup[inputBuffer[i + 2] & 0x3F];
        }

        if (lineEnd == length) {
            break;
        }

        //
        // Add the newline
        //
        // outputBuffer[j++] = '\r';
        // outputBuffer[j++] = '\n';
        lineEnd += lineLength;
    }

    if (i + 1 < length) {
        //
        // Handle the single '=' case
        //
        outputBuffer[j++] = cdvbase64EncodeLookup[(inputBuffer[i] & 0xFC) >> 2];
        outputBuffer[j++] = cdvbase64EncodeLookup[((inputBuffer[i] & 0x03) << 4)
            | ((inputBuffer[i + 1] & 0xF0) >> 4)];
        outputBuffer[j++] = cdvbase64EncodeLookup[(inputBuffer[i + 1] & 0x0F) << 2];
        outputBuffer[j++] = '=';
    } else if (i < length) {
        //
        // Handle the double '=' case
        //
        outputBuffer[j++] = cdvbase64EncodeLookup[(inputBuffer[i] & 0xFC) >> 2];
        outputBuffer[j++] = cdvbase64EncodeLookup[(inputBuffer[i] & 0x03) << 4];
        outputBuffer[j++] = '=';
        outputBuffer[j++] = '=';
    }
    outputBuffer[j] = 0;

    //
    // Set the output length and return the buffer
    //
    if (outputLength) {
        *outputLength = j;
    }
    return outputBuffer;
}

@implementation NSData (CDVBase64)

//
// dataFromBase64String:
//
// Creates an NSData object containing the base64 decoded representation of
// the base64 string 'aString'
//
// Parameters:
//    aString - the base64 string to decode
//
// returns the autoreleased NSData representation of the base64 string
//
+ (NSData*)dataFromBase64String:(NSString*)aString
{
    size_t outputLength = 0;
    void* outputBuffer = CDVNewBase64Decode([aString UTF8String], [aString length], &outputLength);

    return [NSData dataWithBytesNoCopy:outputBuffer length:outputLength freeWhenDone:YES];
}

//
// base64EncodedString
//
// Creates an NSString object that contains the base 64 encoding of the
// receiver's data. Lines are broken at 64 characters long.
//
// returns an autoreleased NSString being the base 64 representation of the
//	receiver.
//
- (NSString*)base64EncodedString
{
    size_t outputLength = 0;
    char* outputBuffer =
        CDVNewBase64Encode([self bytes], [self length], true, &outputLength);

    NSString* result = [[NSString alloc] initWithBytesNoCopy:outputBuffer
                                                      length:outputLength
                                                    encoding:NSASCIIStringEncoding
                                                freeWhenDone:YES];

    return result;
}

@end
