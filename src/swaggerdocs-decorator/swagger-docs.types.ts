/*
 *  src/swaggerdocs-decorator/swagger-docs.types.ts
 *
 *
 *  Description:
 *    Defines types used when consuming @SwaggerDocs.
 *
 *  Revision History:
 *    08-Mar-2021  Motorola Solutions Initial Version
 *
 * License:
 *  The MIT License (MIT)
 *
 *  Copyright (C) 2021 Motorola Solutions, Inc
 *  All rights reserved
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a
 *  copy of this software and associated documentation files (the
 *  "Software"), to deal in the Software without restriction, including
 *  without limitation the rights to use, copy, modify, merge, publish,
 *  distribute, sublicense, and/or sell copies of the Software, and to
 *  permit persons to whom the Software is furnished to do so, subject to
 *  the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included
 *  in all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
 *  OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 *  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 *  IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
 *  CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 *  TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 *  SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 */

// Extracts only function keys from a type
type ExtractFunctions<T> = {
  // tslint:disable-next-line:ban-types
  [K in keyof T]: T[K] extends Function ? K : never;
}[keyof T];

type ClassMethods<T> = Pick<T, ExtractFunctions<T>>;

// Type that specifies any raw class, eg `ExampleController` or `ExampleService`
type Class = { new (...args: any[]): any };

type SwaggerDocsMethods<T> = {
  [P in keyof ClassMethods<T>]: MethodDecorator[];
};

type SwaggerDocsExtraModels = {
  ApiExtraModels?: Class[];
};

// Anything of type SwaggerDocsContainer<T>
// must be a class
// must have all the same properties as type T
//     // (excluding private properties and properties that aren't functions)
// may have an ApiExtraModels property
export type SwaggerDocsContainer<T> = SwaggerDocsMethods<T> &
  SwaggerDocsExtraModels;
