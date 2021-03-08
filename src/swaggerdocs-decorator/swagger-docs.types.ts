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
 *
 *  Copyright (C) 2021 Motorola Solutions, Inc.
 *  All rights reserved.
 *
 *    Redistribution and use in source and binary forms, with or without
 *    modification, are permitted provided that the following conditions
 *    are met:
 *
 *       - Redistributions of source code must retain the above copyright
 *         notice, this list of conditions and the following disclaimer.
 *
 *       - Redistributions in binary form must reproduce the above copyright
 *         notice, this list of conditions and the following disclaimer in
 *         the documentation and/or other materials provided with the
 *         distribution.
 *
 *       - Neither the name of the Motorola Solutions nor the names of its
 *         contributors may be used to endorse or promote products derived
 *         from this software without specific prior written permission.
 *
 *    THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 *    "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 *    LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS
 *    FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *    COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
 *    INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
 *    BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 *    LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 *    CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT
 *    LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN
 *    ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 *    POSSIBILITY OF SUCH DAMAGE.
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
