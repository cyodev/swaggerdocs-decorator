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

// Anything of type SwaggerDocsContainer<T>
// must be a class (note: this also covers the { name: string } part of the type declaration)
// must have all the same properties as type T (excluding private properties and properties that aren't functions)
// may have an ApiExtraModels property
export type SwaggerDocsContainer<T> = SwaggerDocsMethods<T> & SwaggerDocsExtraModels & Class & { name: string }