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
