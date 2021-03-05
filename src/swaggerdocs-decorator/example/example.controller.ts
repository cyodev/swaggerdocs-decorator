import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    UsePipes,
    ValidationPipe
} from '@nestjs/common'
import { ExampleDTO, ExamplesBulkDTO } from './example.dto'
import { ExampleSwaggerDocs } from './example.swagger-docs'
import {ExampleCategory} from "./example.enums";
import {SwaggerDocs} from "../swagger-docs.decorator";
import {ExampleService} from "./example.service";

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
    async add(@Param('category') category: ExampleCategory, @Body() dto: ExampleDTO) {
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
