import { PaginationParams } from './../../../core/src/models/pagination-params';
import { DraftsService } from '@comingsoonseries/core/services';
import {
  Controller,
  Get,
  Query,
  Post,
  Put,
  Param,
  Body,
  Delete,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { ResultsWithPagination } from '@comingsoonseries/core/models';
import { Draft } from '@comingsoonseries/core/entities';

@Controller('bo/drafts')
export class DraftsController {
  constructor(private readonly draftsService: DraftsService) {}

  @Get('')
  getAll(@Query() query): Observable<ResultsWithPagination<Draft>> {
    const { page, size, sort } = query;
    const paginationParams: PaginationParams = {
      page: parseInt(page) || 0,
      size: parseInt(size) || 10,
    };

    return this.draftsService.getAll(paginationParams, sort);
  }

  @Post('')
  create(@Body() draft: Draft): Observable<Draft> {
    return this.draftsService.create(draft);
  }

  @Put(':draftId')
  update(
    @Param() urlSegmentParams: { draftId: string },
    @Body() newDraft: Draft,
  ): Observable<Draft> {
    return this.draftsService.update(urlSegmentParams.draftId, newDraft);
  }

  @Delete(':draftId')
  delete(@Param() urlSegmentParams: { draftId: string }): Observable<Draft> {
    return this.draftsService.delete(urlSegmentParams.draftId);
  }

  @Post(':draftId/publish')
  publish(@Param() urlSegmentParams: { draftId: string }): Observable<Draft> {
    return this.draftsService.publish(urlSegmentParams.draftId);
  }
}
