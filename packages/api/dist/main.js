"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const helmet = require("helmet");
const dotenv = require("dotenv");
dotenv.config();
function bootstrap() {
    return __awaiter(this, void 0, void 0, function* () {
        const app = yield core_1.NestFactory.create(app_module_1.AppModule);
        app.use(helmet());
        app.enableCors();
        const options = new swagger_1.DocumentBuilder()
            .setTitle('comingsoonseries.com API')
            .setDescription('comingsoonseries.com API description')
            .setVersion('1.0')
            .addTag('comingsoonseries.com')
            .build();
        const document = swagger_1.SwaggerModule.createDocument(app, options);
        swagger_1.SwaggerModule.setup('api', app, document);
        yield app.listen(3000);
    });
}
bootstrap();
//# sourceMappingURL=main.js.map