/*
 *  src/swaggerdocs-decorator/example/example.controller.ts
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

import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { ExampleDTO, ExamplesBulkDTO } from './example.dto';
import { ExampleSwaggerDocs } from './example.swagger-docs';
import { ExampleCategory } from './example.enums';
import { SwaggerDocs } from '../swagger-docs.decorator';
import { ExampleService } from './example.service';

@Controller('/example')
@UsePipes(ValidationPipe)
@SwaggerDocs(ExampleSwaggerDocs)
export class ExampleController {
  constructor(private readonly exampleService: ExampleService) {}

  @Get('/:category')
  async getRecords(@Param('category') category: ExampleCategory) {
    return await this.exampleService.getRecords(category);
  }

  @Post('/:category/add')
  async add(
    @Param('category') category: ExampleCategory,
    @Body() dto: ExampleDTO
  ) {
    return this.exampleService.add(dto.recordName, category);
  }

  @Post('/:category/add/bulk')
  async addBulk(
    @Param('category') category: ExampleCategory,
    @Body() dto: ExamplesBulkDTO
  ) {
    return this.exampleService.addBulk(dto.recordNames, category);
  }
}
