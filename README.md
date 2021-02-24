# swaggerdocs-decorator

This decorator is meant to reduce code bloat in your controllers by moving API documentation to another file. 

For a complete example, please see the files in the `example/` directory of this repo.

-----------

The idea behind this decorator is that it is applied to a controller, and passed a class (called the docs container) with all the same properties. 

```
@Controller('/')
@SwaggerDocs(ExampleDocsContainer)
export class ExampleController {
  @Get('/')
  async getRecords() { ... }
  
  ...
}
```

Each property in the docs container is set equal to an array of decorator functions created by calling swagger functions. These decorator functions will then be applied to the corresponding property in the controller.

```
export class ExampleDocsContainer {
  getRecords = [
    ApiOperation({ summary: 'Example route - gets a list of records.' }),
    ApiOkResponse({ description: 'Lorum ipsum dolor'})
  ]
  
  ...
}
```

This decorator also incorporates the functionality of ApiExtraModels. If you add a property called "ApiExtraModels" to the docs container and set it equal to an array of classes (eg: ApiExtraModels = [MyEntity]) then the ApiExtraModels decorator will be applied to your controller with the elements of that array as arguments.

```
export class ExampleDocsContainer {
  getRecords = [
    ApiOperation({ summary: 'Example route - gets a list of records.' }),
    ApiOkResponse({ description: 'Lorum ipsum dolor'})
  ]
  
  ApiExtraModels = [ExampleEntity, ExampleDTO]
}
```
