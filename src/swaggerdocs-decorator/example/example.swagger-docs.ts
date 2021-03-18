/*
 *  src/swaggerdocs-decorator/example/example.swagger-docs.ts
 *
 *
 *  Description:
 *    Part of the example usage of @SwaggerDocs.
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

import { Injectable } from '@nestjs/common';
import { ExampleCategory } from './example.enums';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam
} from '@nestjs/swagger';
import { ExampleController } from './example.controller';
import {
  ExampleDTO,
  ExamplesBulkDTO,
  ExamplesListResponse
} from './example.dto';
import { SwaggerDocsContainer } from '../swagger-docs.types';
import { ExampleEntity } from './example.entity';

@Injectable()
export class ExampleSwaggerDocs
  implements SwaggerDocsContainer<ExampleController> {
  ApiExtraModels = [ExampleEntity];

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
        `returns a list of just the records' titles in the order they were originally ` +
        `inserted in, eg: { examples: ['Record A', 'Record B', 'Record C'] }`,
      type: ExamplesListResponse
    })
  ];

  add = [
    ApiOperation({
      summary:
        'Adds a single record to the given category. Developer authorization is required.'
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
        `Encountered if the 'recordName' body parameter is malformed, missing, ` +
        'or already exists in the given category.'
    })
  ];

  addBulk = [
    ApiOperation({
      summary:
        'Adds multiple records to the given category all at once. ' +
        'Developer authorization is required.'
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
      description: `Encountered if the 'recordNames' body parameter is malformed or missing.`
    })
  ];
}
