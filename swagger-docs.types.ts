// Extracts only function keys from a type
type ExtractFunctions<T> = {
    [K in keyof T]: T[K] extends Function ? K : never
}[keyof T]

type ClassMethods<T> = Pick<T, ExtractFunctions<T>>

// Type that specifies any raw class, eg `ExampleController` or `ExampleService`
type Class = { new(...args: any[]): any; };

type SwaggerDocsMethods<T> = {
    [P in keyof ClassMethods<T>]: Array<MethodDecorator>
}

type SwaggerDocsExtraModels = {
    ApiExtraModels?: Class[]
}

export type SwaggerDocsContainer<T> = SwaggerDocsMethods<T> & SwaggerDocsExtraModels