'use strict';

    module.exports = function(app) {
        //FIXME only run this script AT first TIME . For create table.
        // app.dataSources.db.automigrate(['user', 'userIdentity', 'accessToken', 'ACL', 'RoleMapping', 'Role'], function(err) {
        //     if (err) throw err;
        //     app.models.user.create([{
        //         username: 'admin',
        //         email:'admin@email.com',
        //         password: 'adminpw',
        //     }], function(err, coffeeShops) {
        //         if (err) throw err;
        //         console.log('Models created: \n', coffeeShops);
        //     });
        // });
    
        app.models.user.findOne({
            where: {username: 'trt-admin'},
        }, function(err, user){
            if (err) {
                throw err;
            }
            if (!user) {
                app.models.user.create([{
                    username: 'trt-admin',
                    email: 'trt-admin@example.com',
                    password: 'trt-adminpw',
                }], function(err, res) {
                    if (err) throw err;
                    console.log('trt-admin created: \n', res);
                });
            }
        })
        app.models.user.disableRemoteMethodByName("upsert");                               // disables PATCH /app.models.users
        // app.models.user.disableRemoteMethodByName("find");                                 // disables GET /app.models.users
        app.models.user.disableRemoteMethodByName("replaceOrCreate");                      // disables PUT /app.models.users
        // app.models.user.disableRemoteMethodByName("create");                               // disables POST /app.models.users
    
        app.models.user.disableRemoteMethodByName("prototype.updateAttributes");           // disables PATCH /app.models.users/{id}
        // app.models.user.disableRemoteMethodByName("findById");                             // disables GET /app.models.users/{id}
        app.models.user.disableRemoteMethodByName("exists");                               // disables HEAD /app.models.users/{id}
        app.models.user.disableRemoteMethodByName("replaceById");                          // disables PUT /app.models.users/{id}
        app.models.user.disableRemoteMethodByName("deleteById");                           // disables DELETE /app.models.users/{id}
    
        app.models.user.disableRemoteMethodByName('prototype.__get__accessTokens');        // disable GET /app.models.users/{id}/accessTokens
        app.models.user.disableRemoteMethodByName('prototype.__create__accessTokens');     // disable POST /app.models.users/{id}/accessTokens
        app.models.user.disableRemoteMethodByName('prototype.__delete__accessTokens');     // disable DELETE /app.models.users/{id}/accessTokens
    
        app.models.user.disableRemoteMethodByName('prototype.__get__credentials');        // disable GET /app.models.users/{id}/accessTokens
        app.models.user.disableRemoteMethodByName('prototype.__create__credentials');     // disable POST /app.models.users/{id}/accessTokens
        app.models.user.disableRemoteMethodByName('prototype.__delete__credentials');     // disable DELETE /app.models.users/{id}/accessTokens
    
        app.models.user.disableRemoteMethodByName('prototype.__get__identities');        // disable GET /app.models.users/{id}/accessTokens
        app.models.user.disableRemoteMethodByName('prototype.__create__identities');     // disable POST /app.models.users/{id}/accessTokens
        app.models.user.disableRemoteMethodByName('prototype.__delete__identities');     // disable DELETE /app.models.users/{id}/accessTokens
    
        app.models.user.disableRemoteMethodByName('prototype.__findById__accessTokens');   // disable GET /app.models.users/{id}/accessTokens/{fk}
        app.models.user.disableRemoteMethodByName('prototype.__updateById__accessTokens'); // disable PUT /app.models.users/{id}/accessTokens/{fk}
        app.models.user.disableRemoteMethodByName('prototype.__destroyById__accessTokens');// disable DELETE /app.models.users/{id}/accessTokens/{fk}
    
        app.models.user.disableRemoteMethodByName('prototype.__findById__identities');   // disable GET /app.models.users/{id}/accessTokens/{fk}
        app.models.user.disableRemoteMethodByName('prototype.__updateById__identities'); // disable PUT /app.models.users/{id}/accessTokens/{fk}
        app.models.user.disableRemoteMethodByName('prototype.__destroyById__identities');// disable DELETE /app.models.users/{id}/accessTokens/{fk}
    
        app.models.user.disableRemoteMethodByName('prototype.__findById__credentials');   // disable GET /app.models.users/{id}/accessTokens/{fk}
        app.models.user.disableRemoteMethodByName('prototype.__updateById__credentials'); // disable PUT /app.models.users/{id}/accessTokens/{fk}
        app.models.user.disableRemoteMethodByName('prototype.__destroyById__credentials');// disable DELETE /app.models.users/{id}/accessTokens/{fk}
    
        app.models.user.disableRemoteMethodByName('prototype.__count__accessTokens');      // disable  GET /app.models.users/{id}/accessTokens/count
        app.models.user.disableRemoteMethodByName('prototype.__count__credentials');      // disable  GET /app.models.users/{id}/accessTokens/count
        app.models.user.disableRemoteMethodByName('prototype.__count__identities');      // disable  GET /app.models.users/{id}/accessTokens/count
    
        app.models.user.disableRemoteMethodByName("prototype.verify");                     // disable POST /app.models.users/{id}/verify
        app.models.user.disableRemoteMethodByName("changePassword");                       // disable POST /app.models.users/change-password
        app.models.user.disableRemoteMethodByName("createChangeStream");                   // disable GET and POST /app.models.users/change-stream
    
        app.models.user.disableRemoteMethodByName("confirm");                              // disables GET /app.models.users/confirm
        app.models.user.disableRemoteMethodByName("count");                                // disables GET /app.models.users/count
        app.models.user.disableRemoteMethodByName("findOne");                              // disables GET /app.models.users/findOne
    
    //app.models.user.disableRemoteMethodByName("login");                                // disables POST /app.models.users/login
    //app.models.user.disableRemoteMethodByName("logout");                               // disables POST /app.models.users/logout
    
        app.models.user.disableRemoteMethodByName("resetPassword");                        // disables POST /app.models.users/reset
        app.models.user.disableRemoteMethodByName("setPassword");                          // disables POST /app.models.users/reset-password
        app.models.user.disableRemoteMethodByName("update");                               // disables POST /app.models.users/update
        app.models.user.disableRemoteMethodByName("upsertWithWhere");                      // disables POST /app.models.users/upsertWithWhere
    
    };