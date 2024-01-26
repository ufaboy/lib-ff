import fp from 'fastify-plugin';
import cookie from '@fastify/cookie';

export default fp(async (fastify) => {
  fastify.register(cookie, {
    // secret: "kdhsgfkk3r1igfiho18u7493267r096ty42ygyry9ry9g#8yf013yt90718tf1", // for cookies signature
    // hook: 'onRequest', // set to false to disable cookie autoparsing or set autoparsing on any of the following hooks: 'onRequest', 'preParsing', 'preHandler', 'preValidation'. default: 'onRequest'
    // parseOptions: {
    //   secure: false
    // }
  });
});
