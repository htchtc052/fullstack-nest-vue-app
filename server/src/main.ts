import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const start = async () => {
  try {
    const PORT = process.env.PORT || 5000;
    const app = await NestFactory.create(AppModule);

    // app.enableCors()
    await app.listen(PORT, async () => {
      console.log(
        `server started on PORT ${PORT} MONGO_URI ${process.env.MONGO_URI} at url ` +
          (await app.getUrl()),
      );
    });
  } catch (e) {
    console.log(e);
  }
};

start();
