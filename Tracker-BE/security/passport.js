import passport from "passport";
import { ExtractJwt,Strategy } from "passport-jwt";
import config from "@/config"
import {Token} from "@/models"

const accessOptions ={
    jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken,
    secretOrKey:config.ACCESS_TOKEN_SECRET
}

export const userAuthMiddleware = (passport) =>{
    passport.use(
        "userAuthentication",
        new Strategy(accessOptions,async function (payload, done){
            try{
                const authTokens = await Token.findOne ({sessionId:payload.sessionId})
          if (authTokens?.clientId.toString() === payload?.id) {
          done(null, payload);
        } else {
          done(null, false);
        }
      } catch (error) {
        console.error("error: ", error);
        done(null, false);
      }
    })
  );
};

export const userAuthenticate = (req, res, next) =>
  passport.authenticate(
    "userAuthentication",
    {
      session: false,
    },
    (_, payload) => {
      if (!payload) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      } else {
        req.user = payload;
        return next();
      }
    }
  )(req, res, next);
