import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as passport from 'passport';
import * as session from 'express-session'         //Manage user session

async function bootstrap() {
  const app = await NestFactory.create(AppModule);    
  app.use(session({                                 //Use express-session middleware
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,                                //Only true if using HTTPS,
      maxAge: parseInt(process.env.SESSION_EXP)
    }

  }));
  app.use(passport.initialize());
  app.use(passport.session());                      //Will deserialize user object from the session when req is received!
  app.setGlobalPrefix('api/v1');
  app.enableCors()
  await app.listen(3000);
}
bootstrap();
