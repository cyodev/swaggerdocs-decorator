import {Injectable} from "@nestjs/common";
import {ExampleCategory} from "./example.enums";
import {
    ApiBadRequestResponse,
    ApiBody,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam
} from "@nestjs/swagger";
import {ExampleController} from "./example.controller";
import {ExampleDTO, ExamplesBulkDTO, ExamplesListResponse} from "./example.dto";
import {SwaggerDocsContainer} from "../swagger-docs.types";
import {ExampleEntity} from "./example.entity";

@Injectable()
export class ExampleSwaggerDocs implements SwaggerDocsContainer<ExampleController> {
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
