# swaggerdocs-decorator

This decorator is meant to reduce code bloat in your controllers by moving API documentation to another file. 

For a complete example, please see the files in the `/src/swaggerdocs-decorator/example` directory of this repo.

-----------

This decorator annotates your controller at the class level. It must be passed a class that contains your documentation - more on how it's formatted below.

```typescript
@Controller('/')
@SwaggerDocs(ExampleDocsContainer)
export class ExampleController {
  @Get('/')
  async getRecords() { ... }
  
  ...
}
```

Each property in the docs container is set equal to an array of decorator functions created by calling swagger functions. These decorator functions will then be applied to the corresponding property in the controller.

Reccomended: to enforce type safety, your docs container class should implement `SwaggerDocsContainer<ControllerType>`.

```typescript
export class ExampleDocsContainer implements SwaggerDocsContainer<ExampleController> {
  getRecords = [
    ApiOperation({ summary: 'Example route - gets a list of records.' }),
    ApiOkResponse({ description: 'Lorum ipsum dolor'})
  ]
  
  ...
}
```

This decorator also incorporates the functionality of ApiExtraModels. If you add a property called "ApiExtraModels" to the docs container and set it equal to an array of classes (eg: ApiExtraModels = [MyEntity]) then the ApiExtraModels decorator will be applied to your controller with the elements of that array as arguments.

```typescript
export class ExampleDocsContainer {
  getRecords = [
    ApiOperation({ summary: 'Example route - gets a list of records.' }),
    ApiOkResponse({ description: 'Lorum ipsum dolor'})
  ]
  
  ApiExtraModels = [ExampleEntity, ExampleDTO]
  
  ...
}
```
