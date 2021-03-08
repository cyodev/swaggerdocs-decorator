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
