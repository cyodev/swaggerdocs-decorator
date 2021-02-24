import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    UseGuards,
    UseInterceptors,
    UsePipes,
    ValidationPipe
} from '@nestjs/common'
import { ExampleService } from './example.service'
import { ExampleDTO, ExamplesBulkDTO } from './example.dto'
import { ExampleCategory } from './example.enums'
import { ExampleInterceptor } from '../interceptors/example.interceptor'
import { ExamplePipe } from '../pipes/example.pipe'
import { DeveloperAuthorizationGuard } from '../guards/developer-authorization.guard'
import { ExampleSwaggerDocs } from './example.swagger-docs'
import { SwaggerDocs } from '../decorators/swagger-docs.decorator'

@Controller('/example')
@UsePipes(ValidationPipe)
@UseInterceptors(ExampleInterceptor)
@SwaggerDocs(ExampleSwaggerDocs)
export class ExampleController {
    constructor(private readonly exampleService: ExampleService) {}

    @Get('/:category')
    async getRecords(@Param('category') category: ExampleCategory) {
        return await this.exampleService.getRecords(category)
    }

    @Post('/:category/add')
    @UseGuards(DeveloperAuthorizationGuard)
    async add(@Param('category') category: ExampleCategory, @Body() dto: ExampleDTO) {
        return this.exampleService.add(dto.recordName, category)
    }

    @Post('/:category/add/bulk')
    @UseGuards(DeveloperAuthorizationGuard)
    async addBulk(
        @Param('category') category: ExampleCategory,
        @Body(new ExamplePipe('recordNames')) dto: ExamplesBulkDTO
    ) {
        return this.exampleService.addBulk(dto.recordNames, category)
    }
}
