window.__require=function t(e,s,i){function n(o,a){if(!s[o]){if(!e[o]){var c=o.split("/");if(c=c[c.length-1],!e[c]){var l="function"==typeof __require&&__require;if(!a&&l)return l(c,!0);if(r)return r(c,!0);throw new Error("Cannot find module '"+o+"'")}o=c}var h=s[o]={exports:{}};e[o][0].call(h.exports,function(t){return n(e[o][1][t]||t)},h,h.exports,t,e,s,i)}return s[o].exports}for(var r="function"==typeof __require&&__require,o=0;o<i.length;o++)n(i[o]);return n}({Avatar:[function(t,e,s){"use strict";cc._RF.push(e,"d5d3eHxTUFMVoXmLy+eplPc","Avatar");var i=cc.Class({extends:cc.Component,properties:{isAnimStop:!0},onLoad:function(){},start:function(){},update:function(){},onStopFrame:function(){this.isAnimStop&&this.node.getComponent(cc.Animation).stop()}});e.exports=i,cc._RF.pop()},{}],CameraController:[function(t,e,s){"use strict";cc._RF.push(e,"7bec1Z46nxIrbDHCmk4tb0C","CameraController");var i=t("./Map_c"),n=cc.Class({extends:cc.Component,properties:{target:cc.Node,isFollow:!1,_camera:null},onLoad:function(){this._camera=this.node.getComponent(cc.Camera)},start:function(){i.width<1200?(this.isFollow=!1,this._camera.zoomRatio=800/i.width,this.node.x=i.width/2-400,this.node.y=i.height/2-400):this.isFollow=!0},update:function(t){this.isFollow&&(this.node.x=this.target.x-400,this.node.y=this.target.y-400)},stopFollow:function(){return this.target.x<400||this.target.x>i.width-400||this.target.y<400||this.target.y>i.height-400}});e.exports=n,cc._RF.pop()},{"./Map_c":"Map_c"}],Client:[function(t,e,s){"use strict";function i(t,e){var s;if("undefined"==typeof Symbol||null==t[Symbol.iterator]){if(Array.isArray(t)||(s=n(t))||e&&t&&"number"==typeof t.length){s&&(t=s);var i=0;return function(){return i>=t.length?{done:!0}:{done:!1,value:t[i++]}}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}return(s=t[Symbol.iterator]()).next.bind(s)}function n(t,e){if(t){if("string"==typeof t)return r(t,e);var s=Object.prototype.toString.call(t).slice(8,-1);return"Object"===s&&t.constructor&&(s=t.constructor.name),"Map"===s||"Set"===s?Array.from(t):"Arguments"===s||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(s)?r(t,e):void 0}}function r(t,e){(null==e||e>t.length)&&(e=t.length);for(var s=0,i=new Array(e);s<e;s++)i[s]=t[s];return i}cc._RF.push(e,"3bb0br1+wRDKr/ELM9kD29e","Client");var o=t("../Messages"),a=t("./Player"),c=t("./Map_c"),l=t("./CameraController"),h=cc.Class({extends:cc.Component,properties:{_players:[],_localPlayerID:null,_inputSequenceNumber:0,_pendingInputs:[],_acceptableLatency:500,_playerState:[],_eggState:[],_input:null,_keyRight:!1,_keyLeft:!1,_keyUp:!1,_keyDown:!1,EggMgr:cc.Node,redAvatar:cc.Prefab,blueAvatar:cc.Prefab,score:cc.Label,camera:cc.Node,background:cc.Node},onLoad:function(){this.node.on(o.server_worldUpdated,this.onServerWorldUpdated,this),this.node.on(o.server_connected,this.onServerConnected,this)},start:function(){var t=new cc.Event.EventCustom(o.client_connect,!0);t.setUserData(this),this.node.dispatchEvent(t)},onServerConnected:function(t){this._localPlayerID=t.id;var e=new a,s=e.init(this._localPlayerID,this.redAvatar,t.posX,t.posY);s&&this.node.addChild(s),this.camera&&(this.camera.getComponent(l).target=s),this._players[this._localPlayerID]=e,c.setSize(t.mapWidth,t.mapHeight),this.background&&(this.background.setScale(t.mapWidth/800,t.mapHeight/800),this.background.setPosition(t.mapWidth/2,t.mapHeight/2))},update:function(t){this.processServerMessage(),null!=this._localPlayerID&&(this.processInputs(),this.interpolatePlayerPosition())},processServerMessage:function(){if(this._playerState){for(var t,e,s=0;s<this._playerState.length;s++){if(t=this._playerState[s],!this._players[t.playerID]){var n=(e=new a).init(t.playerID,this.blueAvatar,t.posX,t.posY);n&&this.node.addChild(n),this._players[t.playerID]=e}if(e=this._players[t.playerID],t.playerID===this._localPlayerID&&null!=t.lastProcessedInput){this.score&&(this.score.string=t.score),e.setPosition(t.posX,t.posY);for(var r=0;r<this._pendingInputs.length;){var o=this._pendingInputs[r];o.inputSequenceNumber<=t.lastProcessedInput?this._pendingInputs.splice(r,1):(e.applyVelocity(cc.v2(o.velX,o.velY)),r++)}}else{var c=+new Date;if(t.buffers.length>0&&e.positionBuffer.length>0)for(var l,h=e.positionBuffer[e.positionBuffer.length-1],u=i(t.buffers);!(l=u()).done;){var d=l.value,g=cc.v2(d.posX,d.posY),y=cc.v2(h.posX,h.posY),f=cc.v2(t.posX,t.posY),_=p(y,g)/p(y,f),v=h.ts+(c-h.ts)*_;e.positionBuffer.push({ts:v,posX:d.posX,posY:d.posY})}e.positionBuffer.push({ts:c,posX:t.posX,posY:t.posY})}}this._playerState=null}},processInputs:function(){if(null!=this._localPlayerID){var t;if(this._input)t=this._input;else if(this._keyLeft)t={velX:-cc.director.getDeltaTime(),velY:0};else if(this._keyRight)t={velX:cc.director.getDeltaTime(),velY:0};else if(this._keyUp)t={velX:0,velY:cc.director.getDeltaTime()};else{if(!this._keyDown)return void this._players[this._localPlayerID].stopAnim();t={velX:0,velY:-cc.director.getDeltaTime()}}t.inputSequenceNumber=this._inputSequenceNumber++,t.playerID=this._localPlayerID;var e=new cc.Event.EventCustom(o.client_input,!0);e.setUserData(t),this.node.dispatchEvent(e),this._players[this._localPlayerID].applyVelocity(cc.v2(t.velX,t.velY)),this._pendingInputs.push(t)}},onServerWorldUpdated:function(t){this._playerState=t.players,this.EggMgr&&this.EggMgr.emit("worldUpdated",t.eggs)},interpolatePlayerPosition:function(){var t=+new Date-this._acceptableLatency;for(var e in this._players){var s=this._players[e],i=void 0;if(s.playerID!=this._localPlayerID){for(i=s.positionBuffer;i.length>=2&&i[1].ts<=t;)i.shift();if(i.length>=2&&i[0].ts<=t&&t<=i[1].ts){var n=cc.v2(i[0].posX,i[0].posY),r=cc.v2(i[1].posX,i[1].posY),o=(t-i[0].ts)/(i[1].ts-i[0].ts),a=cc.v2(0,0);cc.Vec2.lerp(a,n,r,o),s.setPosition(a.x,a.y),s.playAnim()}else s.stopAnim()}}},onAcceptableLatencyChanged:function(t){this._acceptableLatency=Number(t.string)},hermite:function(t,e,s,i,n){var r=Math.pow(t,2);return(1-3*r+2*Math.pow(t,3))*e+r*(3-2*t)*s+t*Math.pow(t-1,2)*i+r*(t-1)*n}}),p=function(t,e){return Math.abs(e.x-t.x)+Math.abs(e.y-t.y)};e.exports=h,cc._RF.pop()},{"../Messages":"Messages","./CameraController":"CameraController","./Map_c":"Map_c","./Player":"Player"}],DummyController:[function(t,e,s){"use strict";function i(t,e){var s;if("undefined"==typeof Symbol||null==t[Symbol.iterator]){if(Array.isArray(t)||(s=n(t))||e&&t&&"number"==typeof t.length){s&&(t=s);var i=0;return function(){return i>=t.length?{done:!0}:{done:!1,value:t[i++]}}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}return(s=t[Symbol.iterator]()).next.bind(s)}function n(t,e){if(t){if("string"==typeof t)return r(t,e);var s=Object.prototype.toString.call(t).slice(8,-1);return"Object"===s&&t.constructor&&(s=t.constructor.name),"Map"===s||"Set"===s?Array.from(t):"Arguments"===s||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(s)?r(t,e):void 0}}function r(t,e){(null==e||e>t.length)&&(e=t.length);for(var s=0,i=new Array(e);s<e;s++)i[s]=t[s];return i}cc._RF.push(e,"4eef7vYv/dJSYBXhkqqNPQ9","DummyController");var o=t("../Messages"),a=t("../Utils"),c=t("./Client");cc.Class({extends:cc.Component,properties:{_eggList:[],_client:null,_targetIdx:null,_localPlayer:null},onLoad:function(){this.node.on(o.server_connected,this.onServerConnected,this),this.node.on(o.server_worldUpdated,this.onServerWorldUpdated,this),this._client=this.node.getComponent(c)},onServerConnected:function(){this._localPlayer=this._client._players[this._client._localPlayerID],this.schedule(this.updateDirection,.2,cc.macro.REPEAT_FOREVER,0)},onServerWorldUpdated:function(t){for(var e,s=1/0,n=null,r=i(t.eggs);!(e=r()).done;){var o=e.value;if(o.alive){this._eggList[o.eggIdx]=cc.v2(o.posX,o.posY);var c=this.distanceToPlayer(this._eggList[o.eggIdx]);c<s&&(s=c,n=o.eggIdx)}else this._eggList[o.eggIdx]=null,o.eggIdx==this._targetIdx&&(this._eggList.length>0?this._targetIdx=a.getRndInterger(0,this._eggList.length):this._targetIdx=null)}null!=n&&(null==this._targetIdx&&(this._targetIdx=n),null!=this._targetIdx&&null!=this._eggList[this._targetIdx]&&this.distanceToPlayer(this._eggList[this._targetIdx])>s&&(this._targetIdx=n))},updateDirection:function(){if(null!=this._targetIdx&&null!=this._eggList[this._targetIdx]){var t=this._eggList[this._targetIdx].sub(cc.v2(this._localPlayer.posX,this._localPlayer.posY));Math.abs(t.x)>Math.abs(t.y)?t.x>0?this._client._input={velX:cc.director.getDeltaTime(),velY:0}:this._client._input={velX:-cc.director.getDeltaTime(),velY:0}:t.y>0?this._client._input={velX:0,velY:cc.director.getDeltaTime()}:this._client._input={velX:0,velY:-cc.director.getDeltaTime()}}else this._client._input=null},distanceToPlayer:function(t){return cc.v2(this._localPlayer.posX,this._localPlayer.posY).sub(t).len()}}),cc._RF.pop()},{"../Messages":"Messages","../Utils":"Utils","./Client":"Client"}],EggMgr:[function(t,e,s){"use strict";function i(t,e){var s;if("undefined"==typeof Symbol||null==t[Symbol.iterator]){if(Array.isArray(t)||(s=n(t))||e&&t&&"number"==typeof t.length){s&&(t=s);var i=0;return function(){return i>=t.length?{done:!0}:{done:!1,value:t[i++]}}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}return(s=t[Symbol.iterator]()).next.bind(s)}function n(t,e){if(t){if("string"==typeof t)return r(t,e);var s=Object.prototype.toString.call(t).slice(8,-1);return"Object"===s&&t.constructor&&(s=t.constructor.name),"Map"===s||"Set"===s?Array.from(t):"Arguments"===s||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(s)?r(t,e):void 0}}function r(t,e){(null==e||e>t.length)&&(e=t.length);for(var s=0,i=new Array(e);s<e;s++)i[s]=t[s];return i}cc._RF.push(e,"3974apUpMdCibb83JDdzRUF","EggMgr"),cc.Class({extends:cc.Component,properties:{eggList:[],egg:cc.Prefab,eggColors:[cc.SpriteFrame]},onLoad:function(){this.node.on("worldUpdated",this.onWorldUpdated,this)},onWorldUpdated:function(t){for(var e,s=i(t);!(e=s()).done;){var n=e.value;if(n.alive)if(this.egg){var r=cc.instantiate(this.egg);r.x=n.posX,r.y=n.posY,r.getComponent(cc.Sprite).spriteFrame=this.eggColors[n.color],this.node.addChild(r),this.eggList[n.eggIdx]=r}else this.eggList[n.eggIdx]={x:n.posX,y:n.posY};else this.egg&&this.eggList[n.eggIdx]?this.eggList[n.eggIdx].destroy():this.eggList[n.eggIdx]=null}}}),cc._RF.pop()},{}],EggSpawner:[function(t,e,s){"use strict";cc._RF.push(e,"83f49rwuGZKT7N7RqFNP7T6","EggSpawner");var i=t("./Egg_s"),n=t("./Map_s"),r=t("../Utils"),o=t("../Server");cc.Class({extends:cc.Component,properties:{spawnRate:3,offset:50,currentIdx:0,eggUpdateList:null,returnedIdx:[]},onLoad:function(){var t=this.node.getComponent(o);this.eggUpdateList=t._EggUpdateList,this.spawnRate=3/o.numOfPlayer()},start:function(){this.startSpawning()},startSpawning:function(){this.schedule(this.spawn,this.spawnRate,cc.macro.REPEAT_FOREVER,0)},spawn:function(){var t=r.getRndInterger(this.offset,n.width-this.offset),e=r.getRndInterger(this.offset,n.height-this.offset),s=r.getRndIntWithMax(0,8),o=new i;o.init(this.genarateIdx(),t,e,s,this),this.eggUpdateList.push(o)},stopSpawning:function(){this.unschedule(this.spawn)},genarateIdx:function(){return this.returnedIdx.length>0?this.returnedIdx.shift():this.currentIdx++}});cc._RF.pop()},{"../Server":"Server","../Utils":"Utils","./Egg_s":"Egg_s","./Map_s":"Map_s"}],Egg_s:[function(t,e,s){"use strict";cc._RF.push(e,"b8cd39XgpJFBqW5d/i9So04","Egg_s");var i=t("./def").EntityCategory,n=t("./PhysicMgr"),r=2*n.PTM_RATIO,o=[new b2.Vec2(-18.8/r,-22.4/r),new b2.Vec2(3.4/r,-30.4/r),new b2.Vec2(21.6/r,-20.4/r),new b2.Vec2(23.8/r,-4.2/r),new b2.Vec2(15.1/r,20.7/r),new b2.Vec2(.4/r,29.6/r),new b2.Vec2(-14.3/r,20.7/r),new b2.Vec2(-22.9/r,-5.3/r)],a=cc.Class({extends:cc.Component,properties:{eggIdx:null,posX:0,posY:0,color:null,alive:!0,spawner:null,isInUpdateList:!1,collideRadius:22.7,body:null,categoryBits:i.Egg,maskBits:i.Player,playerInTouch:[]},init:function(t,e,s,i,r){this.eggIdx=t,this.posX=e,this.posY=s,this.color=i,this.isInUpdateList=!1,this.alive=!0,this.spawner=r;var a=new b2.BodyDef;a.type=b2.BodyType.b2_staticBody;var c=new b2.FixtureDef;c.shape=new b2.PolygonShape,c.shape.SetAsArray(o,o.length),c.isSensor=!0,c.filter.categoryBits=this.categoryBits,c.filter.maskBits=this.maskBits,this.body=n.world.CreateBody(a),this.body.CreateFixture(c),this.body.SetUserData(this),this.body.SetPosition(new b2.Vec2(this.posX/n.PTM_RATIO,this.posY/n.PTM_RATIO))},resolveConflict:function(){var t=this.playerInTouch.length;if(t<2)return this.playerInTouch[0].score++,void this.destroyBody();for(var e=1/0,s=t;t--;){var i=cc.v2(this.playerInTouch[t].posX,this.playerInTouch[t].posY).sub(cc.v2(this.posX,this.posY)).len();i<e&&(e=i,s=t)}this.playerInTouch[s].score++,this.destroyBody()},destroyBody:function(){n.world.DestroyBody(this.body),this.body=void 0,this.spawner.returnedIdx.push(this.eggIdx)},onCollisionEnter:function(t){t.categoryBits==i.Player&&this.playerInTouch.push(t),this.isInUpdateList||(this.spawner.eggUpdateList.push(this),this.alive=!1,this.isInUpdateList=!0)}});e.exports=a,cc._RF.pop()},{"./PhysicMgr":"PhysicMgr","./def":"def"}],KeyboardInput:[function(t,e,s){"use strict";cc._RF.push(e,"260abas6SVH/o6h9ONrb5Y5","KeyboardInput");var i=t("./Client");cc.Class({extends:cc.Component,properties:{_client:null},onLoad:function(){cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN,this.onKeyEvent,this),cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP,this.onKeyEvent,this),this._client=this.node.getComponent(i)},onKeyEvent:function(t){if(null!=this._client._localPlayerID)switch(t.keyCode){case cc.macro.KEY.left:this._client._keyLeft="keydown"==t.type;break;case cc.macro.KEY.right:this._client._keyRight="keydown"==t.type;break;case cc.macro.KEY.up:this._client._keyUp="keydown"==t.type;break;case cc.macro.KEY.down:this._client._keyDown="keydown"==t.type}}}),cc._RF.pop()},{"./Client":"Client"}],Map_c:[function(t,e,s){"use strict";cc._RF.push(e,"e08b2X1zCxKVYQ5KmSUc+tf","Map_c");var i=800,n=800,r=cc.Class({});r.width=i,r.height=n,r.setSize=function(t,e){r.width=t,r.height=e},e.exports=r,cc._RF.pop()},{}],Map_s:[function(t,e,s){"use strict";cc._RF.push(e,"4451aVTK5JOLLbhLkyX1S+y","Map_s");var i=t("./PhysicMgr"),n=800,r=800,o=cc.Class({});o.width=n,o.height=r,o.init=function(t){t>4&&(o.width=n+150*(t-4),o.height=r+150*(t-4));var e=new b2.BodyDef;e.tpye=b2.BodyType.b2_staticBody;var s=i.world.CreateBody(e);s.SetPosition(new b2.Vec2(this.width/2/i.PTM_RATIO,this.height/2/i.PTM_RATIO));var a=new b2.FixtureDef;a.shape=new b2.PolygonShape,a.shape.SetAsBox(this.width/2/i.PTM_RATIO,1,new b2.Vec2(0,-this.height/2/i.PTM_RATIO-.9),0),s.CreateFixture(a),a.shape.SetAsBox(this.width/2/i.PTM_RATIO,1,new b2.Vec2(0,this.height/2/i.PTM_RATIO+.9),0),s.CreateFixture(a),a.shape.SetAsBox(1,this.width/2/i.PTM_RATIO,new b2.Vec2(-this.width/2/i.PTM_RATIO-.9,0),0),s.CreateFixture(a),a.shape.SetAsBox(1,this.width/2/i.PTM_RATIO,new b2.Vec2(this.width/2/i.PTM_RATIO+.9,0),0),s.CreateFixture(a)},e.exports=o,cc._RF.pop()},{"./PhysicMgr":"PhysicMgr"}],Messages:[function(t,e,s){"use strict";cc._RF.push(e,"abeb86jvp5J05bVuUgUjUkL","Messages");e.exports={client_connect:"client_connect",client_input:"client_input",server_worldUpdated:"server_worldUpdated",server_connected:"server_connected"},cc._RF.pop()},{}],PhysicMgr:[function(t,e,s){"use strict";cc._RF.push(e,"034a3gV/VlB7ZWtGeBagAjx","PhysicMgr");var i=t("./def").EntityCategory,n=cc.Class({});n.world=null,n.PTM_RATIO=32,n.init=function(){this.world=new b2.World(new b2.Vec2(0,0),!1);var t=new b2.ContactListener;t.BeginContact=this.onCollisionBegin,this.world.SetContactListener(t)},n.onCollisionBegin=function(t){t.GetFixtureA().GetFilterData().categoryBits==i.Egg?t.GetFixtureA().GetBody().GetUserData().onCollisionEnter(t.GetFixtureB().GetBody().GetUserData()):t.GetFixtureB().GetFilterData().categoryBits==i.Egg&&t.GetFixtureB().GetBody().GetUserData().onCollisionEnter(t.GetFixtureA().GetBody().GetUserData())},cc._RF.pop()},{"./def":"def"}],Player_s:[function(t,e,s){"use strict";cc._RF.push(e,"ee849e52kZHM5xVUE+GWZI4","Player_s");var i=t("./def").EntityCategory,n=t("./PhysicMgr"),r=cc.Class({name:"Player_s",properties:{playerID:null,score:0,posX:0,posY:0,lastPosX:0,lastPosY:0,lastVel:null,positionBuffers:[],speed:200,collideRadius:22.7,body:null,categoryBits:i.Player,maskBits:i.Boundary|i.Egg},init:function(t,e,s){this.playerID=t,this.posX=e,this.posY=s,this.lastPosX=e,this.lastPosY=s;var i=new b2.BodyDef;i.type=b2.BodyType.b2_dynamicBody;var r=new b2.CircleShape;r.m_p.Set(0,0),r.m_radius=this.collideRadius/n.PTM_RATIO;var o=new b2.FixtureDef;o.shape=r,o.restitution=0,o.filter.categoryBits=this.categoryBits,o.filter.maskBits=this.maskBits,this.body=n.world.CreateBody(i),this.body.CreateFixture(o),this.body.SetUserData(this),this.body.SetPosition(new b2.Vec2(this.posX/n.PTM_RATIO,this.posY/n.PTM_RATIO))},applyVelocity:function(t){this.isQuarterTurn(t)&&this.positionBuffers.push({posX:this.posX,posY:this.posY}),this.lastVel=t,this.posX+=t.x*this.speed,this.posY+=t.y*this.speed},physicStep:function(){this.body.SetLinearVelocity(new b2.Vec2((this.posX-this.lastPosX)/n.PTM_RATIO,(this.posY-this.lastPosY)/n.PTM_RATIO)),this.lastPosX=this.posX,this.lastPosY=this.posY},onPhysicStepFinish:function(){this.body.SetLinearVelocity(new b2.Vec2(0,0)),this.lastPosX=this.posX=this.body.GetPosition().x*n.PTM_RATIO,this.lastPosY=this.posY=this.body.GetPosition().y*n.PTM_RATIO},isQuarterTurn:function(t){if(this.lastVel)return 0==this.lastVel.dot(t);this.lastVel=t}});e.exports=r,cc._RF.pop()},{"./PhysicMgr":"PhysicMgr","./def":"def"}],Player:[function(t,e,s){"use strict";cc._RF.push(e,"6ed31nAxrROVaUIdqmS79M2","Player");var i=t("./Avatar"),n=t("./Map_c"),r=cc.Class({name:"Player",properties:{playerID:null,posX:0,posY:0,score:0,speed:200,positionBuffer:[],avatar:cc.Node,avatarController:null,rigidBody:null,anim:null},init:function(t,e,s,r){if(this.playerID=t,this.posX=s||n.width/2,this.posY=r||n.height/2,e)return this.avatar=cc.instantiate(e),this.avatar.x=this.posX,this.avatar.y=this.posY,this.avatarController=this.avatar.getComponent(i),this.anim=this.avatar.getComponent(cc.Animation),this.rigidBody=this.avatar.getComponent(cc.RigidBody),this.avatar},applyVelocity:function(t){this.posX+=t.x*this.speed,this.posY+=t.y*this.speed,this.avatar&&(this.avatar.x=this.posX,this.avatar.y=this.posY,this.avatar.angle=cc.misc.radiansToDegrees(cc.Vec2.UP.signAngle(cc.v2(t.x,t.y)))),this.anim&&this.playAnim()},setPosition:function(t,e){var s=cc.v2(this.posX,this.posY);this.posX=t,this.posY=e,this.avatarController&&(this.avatarController.node.x=t,this.avatarController.node.y=e,cc.v2(t,e).sub(s).len()>0&&(this.avatar.angle=cc.misc.radiansToDegrees(cc.Vec2.UP.signAngle(cc.v2(t,e).sub(s)))))},playAnim:function(){this.anim&&!this.anim.getAnimationState(this.anim.defaultClip.name).isPlaying&&this.avatarController.isAnimStop&&(this.avatarController.isAnimStop=!1,this.anim.play())},stopAnim:function(){this.anim&&(this.avatarController.isAnimStop=!0)},isRunningOnServer:function(){return"Server"==this.node.getParent().name}});e.exports=r,cc._RF.pop()},{"./Avatar":"Avatar","./Map_c":"Map_c"}],Server:[function(t,e,s){"use strict";function i(t,e){var s;if("undefined"==typeof Symbol||null==t[Symbol.iterator]){if(Array.isArray(t)||(s=n(t))||e&&t&&"number"==typeof t.length){s&&(t=s);var i=0;return function(){return i>=t.length?{done:!0}:{done:!1,value:t[i++]}}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}return(s=t[Symbol.iterator]()).next.bind(s)}function n(t,e){if(t){if("string"==typeof t)return r(t,e);var s=Object.prototype.toString.call(t).slice(8,-1);return"Object"===s&&t.constructor&&(s=t.constructor.name),"Map"===s||"Set"===s?Array.from(t):"Arguments"===s||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(s)?r(t,e):void 0}}function r(t,e){(null==e||e>t.length)&&(e=t.length);for(var s=0,i=new Array(e);s<e;s++)i[s]=t[s];return i}cc._RF.push(e,"0c5edxHkp9ClbnDoYU1DJ5K","Server");var o=t("./Messages"),a=t("./Server/Player_s"),c=t("./Server/Map_s"),l=t("./Server/PhysicMgr"),h=cc.Class({extends:cc.Component,properties:{_clients:[],_players:[],_EggUpdateList:[],_inputMsges:[],_lastProcessedInput:[],_eggSpawner:null,world:null,_latency:null,remotePlayer:cc.Prefab},onLoad:function(){this.node.on(o.client_input,this.onClientInput,this),this.node.on(o.client_connect,this.onClientConnect,this),l.init(),c.init(5);var t=cc.director.getPhysicsManager();t._world=l.world,t.enabled=!0,cc.director.getPhysicsManager().debugDrawFlags=0;for(var e=0;e<4;e++){var s=cc.instantiate(this.remotePlayer);this.node.addChild(s)}},start:function(){this.schedule(this.updateLoop,1/60,cc.macro.REPEAT_FOREVER,0),this.scheduleDispatchWorldState()},scheduleDispatchWorldState:function(){this.unschedule(this.dispatchWorldState);var t=.4*Math.random()+.1;null==this._latency?this.schedule(this.dispatchWorldState,t):this.schedule(this.dispatchWorldState,.1+this._latency/1e3)},update:function(){this.processInput(),this.playerStep(),l.world.Step(1,8,3),this.resolveContact(),this.onPhysicStepFinish()},updateLoop:function(){},onClientConnect:function(t){var e=t.getUserData(),s=this._clients.length;this._clients.push(e);var i=new a,n=this.generateSpawnPosition(this._clients.length);i.init(s,n.x,n.y),this._players.push(i),e.node.emit(o.server_connected,{id:s,posX:i.posX,posY:i.posY,mapWidth:c.width,mapHeight:c.height})},onClientInput:function(t){var e=t.getUserData();this._inputMsges.push(e)},processInput:function(){for(;;){var t=this._inputMsges.shift();if(!t)break;this._players[t.playerID].applyVelocity(cc.v2(t.velX,t.velY)),this._lastProcessedInput[t.playerID]=t.inputSequenceNumber}},dispatchWorldState:function(){this.scheduleDispatchWorldState();var t,e={players:[],eggs:[]},s=this._clients.length,i=this._EggUpdateList.length;for(t=0;t<i;t++){var n=this._EggUpdateList[t];!n.alive&&n.body&&n.resolveConflict(),e.eggs.push({eggIdx:n.eggIdx,posX:n.posX,posY:n.posY,color:n.color,alive:n.alive})}for(this._EggUpdateList.splice(0,i),t=0;t<s;t++){var r=this._players[t],a=r.positionBuffers.map(function(t){return t});e.players.push({playerID:r.playerID,posX:r.posX,posY:r.posY,score:r.score,buffers:a,lastProcessedInput:this._lastProcessedInput[t]}),r.positionBuffers.length=0}for(t=0;t<s;t++)this._clients[t].node.emit(o.server_worldUpdated,e)},generateSpawnPosition:function(t){var e=.7*c.width/2,s=2*Math.PI/5*(t-1);return cc.v2(e,0).rotateSelf(s).add(cc.v2(c.width/2,c.height/2))},playerStep:function(){for(var t,e=i(this._players);!(t=e()).done;){t.value.physicStep()}},onPhysicStepFinish:function(){for(var t,e=i(this._players);!(t=e()).done;){t.value.onPhysicStepFinish()}},resolveContact:function(){for(var t,e=i(this._EggUpdateList);!(t=e()).done;){var s=t.value;!s.alive&&s.body&&s.resolveConflict()}},onLatencyChanged:function(t){this._latency=Number(t.string)}});h.numOfPlayer=function(){return 5},e.exports=h,cc._RF.pop()},{"./Messages":"Messages","./Server/Map_s":"Map_s","./Server/PhysicMgr":"PhysicMgr","./Server/Player_s":"Player_s"}],UIMgr:[function(t,e,s){"use strict";cc._RF.push(e,"dc32efD5/xO6b2lrVhAdtgR","UIMgr"),cc.Class({extends:cc.Component,properties:{},start:function(){},onRenderServerToggle:function(t){t.isChecked?cc.director.getPhysicsManager().debugDrawFlags=cc.PhysicsManager.DrawBits.e_jointBit|cc.PhysicsManager.DrawBits.e_shapeBit:cc.director.getPhysicsManager().debugDrawFlags=0}}),cc._RF.pop()},{}],Utils:[function(t,e,s){"use strict";cc._RF.push(e,"1da11WgjJxKBYo3F56aMyrf","Utils");var i=cc.Class({});i.getRndInterger=function(t,e){return Math.floor(Math.random()*(e-t))+t},i.getRndIntWithMax=function(t,e){return Math.floor(Math.random()*(e-t+1))+t},e.exports=i,cc._RF.pop()},{}],def:[function(t,e,s){"use strict";cc._RF.push(e,"928771hf6lEn6uio7ThGz3+","def");e.exports.EntityCategory={Boundary:1,Player:2,Egg:4},cc._RF.pop()},{}]},{},["Avatar","CameraController","Client","DummyController","EggMgr","KeyboardInput","Map_c","Player","Messages","Server","EggSpawner","Egg_s","Map_s","PhysicMgr","Player_s","def","UIMgr","Utils"]);