import {
    ApiBadRequestResponse,
    ApiBody,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam
} from '@nestjs/swagger'
import { ExampleController } from './example.controller'
import { ExampleDTO, ExamplesBulkDTO, ExamplesListResponse } from './example.dto'
import { ExampleCategory } from './example.enums'
import { Injectable } from '@nestjs/common'
import { ExampleEntity } from './example.entity'


type ClassProperties<T> = Partial<Omit<T, 'constructor'>>

type ExtractFunctions<T> = {
  [K in keyof T]: T[K] extends Function ? K : never
}[keyof T]

type ClassMethods<T> = Pick<ClassProperties<T>, ExtractFunctions<ClassProperties<T>>>

type SwaggerDocs<T> = {
    [P in keyof ClassMethods<T>]: () => any //TODO: replace me
}

// Try to make a type-safe version of ExampleSwaggerDocs
class Foo implements SwaggerDocs<ExampleController> {

}

@Injectable()
export class ExampleSwaggerDocs {

    ApiExtraModels = [ExampleEntity]

    getRecords = [
        ApiOperation({
            summary: 'Retrieves a list of all records in the given category'
        }),
        ApiParam({
            name: 'category',
            type: 'ExampleCategory',
            required: true,
            enum: ExampleCategory
        }),
        ApiOkResponse({
            description:
                'returns a list of just the records\' titles in the order they were originally inserted in, eg: ' +
                '{ examples: ["Record A", "Record B", "Record C"] }',
            type: ExamplesListResponse
        })
    ]

    add = [
        ApiOperation({
            summary: 'Adds a single record to the given category. Developer authorization is required.'
        }),
        ApiParam({
            name: 'category',
            type: 'ExampleCategory',
            required: true,
            enum: ExampleCategory
        }),
        ApiBody({
            type: ExampleDTO
        }),
        ApiCreatedResponse({}),
        ApiBadRequestResponse({
            description:
                'Encountered if the "recordName" body parameter is malformed, missing, ' +
                'or already exists in the given category.'
        })
    ]

    addBulk = [
        ApiOperation({
            summary:
                'Adds multiple records to the given category all at once. Developer authorization is required.'
        }),
        ApiParam({
            name: 'category',
            type: 'ExampleCategory',
            required: true,
            enum: ExampleCategory
        }),
        ApiBody({
            type: ExamplesBulkDTO
        }),
        ApiCreatedResponse(),
        ApiBadRequestResponse({
            description: 'Encountered if the "recordNames" body parameter is malformed or missing.'
        })
    ]
}
