/*
 *  src/swaggerdocs-decorator/swagger-docs.decorator.ts
 *
 *
 *  Description:
 *    Core functionality for the @SwaggerDocs decorator. Allows consumer to move
 *    Swagger documentation out of controller files/classes and into dedicated
 *    documentation files/classes.
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

import { Logger } from '@nestjs/common';
import { ApiExtraModels } from '@nestjs/swagger';

export const SwaggerDocs = (docsContainerClass) => {
  // The idea behind this decorator is that it is applied to a controller, and passed a class
  // (called the docs container) with all the same properties. Each property in the docs
  // container is set equal to an array of decorator functions created by calling swagger
  // functions ( eg: [ApiOkResponse(), ApiBadGatewayResponse()] ) These decorator functions
  // will then be applied to the corresponding property in the controller. Half of this code
  // is about matching properties between the controller and the docs container, and the
  // other half is about applying the decorator functions found in the property of the docs
  // class to the property of the controller.
  //
  // As a bonus, this decorator incorporates the functionality of ApiExtraModels. If you add
  // a property called "ApiExtraModels" to the docs container and set it equal to an array of
  // classes (eg: ApiExtraModels = [MyEntity]) then the ApiExtraModels decorator will be applied
  // to your controller with the elements of that array as arguments.
  return (target) => {
    const docsContainer = new docsContainerClass();

    const controllerClass = target;
    const controllerPrototype = target.prototype;

    // Look for extra documentation
    Object.getOwnPropertyNames(docsContainer).forEach((propertyName) => {
      if (propertyName === 'constructor' || propertyName === 'ApiExtraModels') {
        return;
      }

      if (!Object.getOwnPropertyDescriptor(controllerPrototype, propertyName)) {
        Logger.warn(
          `Documentation found in specified docs container "${docsContainerClass.name}" ` +
            `for method "${propertyName}" that doesn't exist in the controller ` +
            `"${controllerClass.name}".`
        );
      }
    });

    // Logic; apply the documentation decorators
    Object.getOwnPropertyNames(controllerPrototype).forEach((propertyName) => {
      const propertyValue = controllerPrototype[propertyName];
      const isMethod = propertyValue instanceof Function;
      if (!isMethod) {
        return;
      }

      // no documentation needed for the constructor
      if (propertyName === 'constructor') {
        return;
      }

      const docsForProperty = Object.getOwnPropertyDescriptor(
        docsContainer,
        propertyName
      );
      if (!docsForProperty) {
        Logger.warn(
          `Documentation for method "${propertyName}" in controller "${controllerClass.name}" ` +
            `was not included in specified docs container "${docsContainerClass.name}".`
        );
        return;
      }

      const decoratorsForProperty = docsForProperty.value;
      const initialDescriptor = Object.getOwnPropertyDescriptor(
        controllerPrototype,
        propertyName
      );

      try {
        // heavily modified from https://stackoverflow.com/a/47621528/15107363
        let decoratedDescriptor = initialDescriptor;
        for (const call of decoratorsForProperty) {
          if (typeof call !== 'function') {
            Logger.error(
              `Documentation for method "${propertyName}" in specified docs container ` +
                `"${docsContainerClass.name}" for controller "${controllerClass.name}" included ` +
                `an incorrect element. All elements must be swagger decorators.`
            );

            continue;
          }
          decoratedDescriptor = call(
            controllerClass,
            propertyName,
            decoratedDescriptor
          );
        }

        if (!decoratedDescriptor) {
          throw {};
        }

        Object.defineProperty(
          controllerPrototype,
          propertyName,
          decoratedDescriptor
        );
      } catch {
        Logger.error(
          `Something went wrong with documentation for method "${propertyName}" in specified ` +
            `docs container "${docsContainerClass.name}" for controller "${controllerClass.name}". ` +
            `Documentation likely included an incorrect element. All elements must be swagger ` +
            `decorators.`
        );
      }
    });

    //
    // bonus: incorporate functionality of @ApiExtraModels
    //
    if (!docsContainer.ApiExtraModels) {
      return controllerClass;
    }

    try {
      const call = ApiExtraModels(...docsContainer.ApiExtraModels);
      const decoratedTarget = call(controllerClass);

      if (!decoratedTarget) {
        throw {};
      }

      return decoratedTarget;
    } catch {
      Logger.error(
        `Something went wrong with documentation for ApiExtraModels in docs ` +
          `container "${docsContainerClass.name}" for controller "${controllerClass.name}". ` +
          `Documentation likely included an incorrect element. All elements must be class ` +
          `references.`
      );
    }

    return controllerClass;
  };
};
