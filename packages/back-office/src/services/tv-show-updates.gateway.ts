import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { TvShow } from '@comingsoonseries/core/entities';

@WebSocketGateway(1080)
export class TvShowUpdatesGateway {
  @WebSocketServer() server;

  sendUpdates(updatedTvShows: TvShow[]): void {
    this.server.emit('newTvShows', updatedTvShows);
  }
}
