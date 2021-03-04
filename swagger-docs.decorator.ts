import { Logger } from '@nestjs/common'
import { ApiExtraModels } from '@nestjs/swagger'
import {ExampleController} from "./example/example.controller";

// Extracts only function keys from a type
type ExtractFunctions<T> = {
  [K in keyof T]: T[K] extends Function ? K : never
}[keyof T]

type ClassMethods<T> = Pick<T, ExtractFunctions<T>>

type SwaggerDocsMethods<T> = {
    [P in keyof ClassMethods<T>]: Array<MethodDecorator>
}

type Class = { new(...args: any[]): any; };

type SwaggerDocsExtraModels = {
    ApiExtraModels?: Class[]
}

export type SwaggerDocs<T> = SwaggerDocsMethods<T> & SwaggerDocsExtraModels


export const SwaggerDocs = (docsContainerClass) => {
    const docsContainer = new docsContainerClass()

    // The idea behind this decorator is that it is applied to a controller, and passed a class (called the docs
    // container) with all the same properties. Each property in the docs container is set equal to an array of
    // decorator functions created by calling swagger functions ( eg: [ApiOkResponse(), ApiBadGatewayResponse()] )
    // These decorator functions will then be applied to the corresponding property in the controller.
    // Half of this code is about matching properties between the controller and the docs container, and the other
    // half is about applying the decorator functions found in the property of the docs class to the property of the
    // controller.
    //
    // As a bonus, this decorator incorporates the functionality of ApiExtraModels. If you add a property called
    // "ApiExtraModels" to the docs container and set it equal to an array of classes (eg: ApiExtraModels = [MyEntity])
    // then the ApiExtraModels decorator will be applied to your controller with the elements of that array as
    // arguments.
    return (target) => {
        const controllerClass = target
        const controllerPrototype = target.prototype

        // Look for extra documentation
        Object.getOwnPropertyNames(docsContainer).forEach((propertyName) => {
            if (propertyName === 'constructor' || propertyName === 'ApiExtraModels') {
                return
            }

            if (!Object.getOwnPropertyDescriptor(controllerPrototype, propertyName)) {
                Logger.warn(
                    `Documentation found in specified docs container "${docsContainerClass.name}" for method ` +
                        `"${propertyName}" that doesn't exist in the controller "${controllerClass.name}".`
                )
            }
        })

        // Logic; apply the documentation decorators
        Object.getOwnPropertyNames(controllerPrototype).forEach((propertyName) => {
            const propertyValue = controllerPrototype[propertyName]
            const isMethod = propertyValue instanceof Function
            if (!isMethod) {
                return
            }

            // no documentation needed for the constructor
            if (propertyName === 'constructor') {
                return
            }

            const docsForProperty = Object.getOwnPropertyDescriptor(docsContainer, propertyName)
            if (!docsForProperty) {
                Logger.warn(
                    `Documentation for method "${propertyName}" in controller "${controllerClass.name}" was not ` +
                        `included in specified docs container "${docsContainerClass.name}".`
                )
                return
            }

            const decoratorsForProperty = docsForProperty.value
            const initialDescriptor = Object.getOwnPropertyDescriptor(controllerPrototype, propertyName)

            try {
                // heavily modified from https://stackoverflow.com/a/47621528/15107363
                let decoratedDescriptor = initialDescriptor
                for (const call of decoratorsForProperty) {
                    if (typeof call !== 'function') {
                        Logger.error(
                            `Documentation for method "${propertyName}" in specified docs container ` +
                                `"${docsContainerClass.name}" for controller "${controllerClass.name}" included an ` +
                                `incorrect element. All elements must be swagger decorators.`
                        )

                        continue
                    }
                    decoratedDescriptor = call(controllerClass, propertyName, decoratedDescriptor)
                }

                if (!decoratedDescriptor) {
                    throw {}
                }

                Object.defineProperty(controllerPrototype, propertyName, decoratedDescriptor)
            } catch {
                Logger.error(
                    `Something went wrong with documentation for method "${propertyName}" in specified docs ` +
                        `container "${docsContainerClass.name}" for controller "${controllerClass.name}". ` +
                        `Documentation likely included an incorrect element. All elements must be swagger decorators.`
                )
            }
        })

        //
        // bonus: incorporate functionality of @ApiExtraModels
        //
        if (!docsContainer.ApiExtraModels) {
            return controllerClass
        }

        try {
            const call = ApiExtraModels(...docsContainer.ApiExtraModels)
            const decoratedTarget = call(controllerClass)

            if (!decoratedTarget) {
                throw {}
            }

            return decoratedTarget
        } catch {
            Logger.error(
                `Something went wrong with documentation for ApiExtraModels in docs ` +
                    `container "${docsContainerClass.name}" for controller "${controllerClass.name}". ` +
                    `Documentation likely included an incorrect element. All elements must be class references.`
            )
        }

        return controllerClass
    }
}
