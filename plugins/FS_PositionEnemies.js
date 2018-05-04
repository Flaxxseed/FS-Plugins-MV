/*:
*
* @plugindesc Allows you to give a formula to position enemies.
* @author Flaxxseed
*
* @param ---Frontview---
* @default
*
* @param Front Position X
* @parent ---Frontview---
* @desc This formula determines the enemy's home X position.
* Default: 0
* @default Graphics.boxWidth / 8 + Graphics.boxWidth / 4 * index
*
* @param Front Position Y
* @parent ---Frontview---
* @desc This formula determines the enemy's home Y position.
* Default: 0
* @default Graphics.boxHeight - 180
*
* @param ---Sideview---
* @default
*
* @param Home Position X
* @parent ---Sideview---
* @desc This formula determines the actor's home X position.
* Default: 600 + index * 32
* @default 16 + (maxSize + 2) * 32
*
* @param Home Position Y
* @parent ---Sideview---
* @desc This formula determines the actor's home Y position.
* Default: 280 + index * 48
* @default screenHeight - statusHeight - maxSize * 48 + (index+1) * 48 - 32
*
* @param Command Window Rows
* @type number
* @min 1
* @desc variable used in yanfly's batte engine core, set it to the same thing.
* Default: 4
* @default 4
*
* @help
* ==============================================================================
*  Help File
* ==============================================================================
* This plugin allows you to set enemy locations with formulas. Free to use and
* modify for both commercial and non-commercial projects.
*
* -Flaxxseed
* ==============================================================================
*  Plugin Commands
* ==============================================================================
*
*/


//-----------------------------------------------------------------------------
// Setup
//-----------------------------------------------------------------------------
var FS = FS || {};

FS.PositionEnemies = FS.ReserveBattlers || {};
FS.PluginCommands = FS.PluginCommands || {};

var Imported = Imported || {};
Imported['Flaxxseed Reserved Battlers'] = 1.00;

(function(_,$){

'use strict';

//-----------------------------------------------------------------------------
// FS.ReserveBattlers
//-----------------------------------------------------------------------------

const params = PluginManager.parameters('FS_PositionEnemies');

_.frontPositionX = String(params['Front Position X']);
_.frontPositionY = String(params['Front Position Y']);
_.homePositionX = String(params['Home Position X']);
_.homePositionY = String(params['Home Position Y']);
_.commandWindowRows = Number(params['Command Window Rows']);

//-----------------------------------------------------------------------------
// Game_Interpreter
//-----------------------------------------------------------------------------

if(!FS.Game_Interpreter_pluginCommand) {

FS.Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
	const com = command.trim().toLowerCase();
	if($[com]) {
		$[com].call(this, args);
		return;
	}
	FS.Game_Interpreter_pluginCommand.apply(this, arguments);
};

}


//-----------------------------------------------------------------------------
// Sprite_Enemy
//-----------------------------------------------------------------------------

FS.PositionEnemies.Sprite_Enemy_prototype_setBattler =
  Sprite_Enemy.prototype.setBattler;

Sprite_Enemy.prototype.setBattler = function(battler){
  FS.PositionEnemies.Sprite_Enemy_prototype_setBattler.call(this, battler);
  this.setEnemyHome(battler.index());
};

Sprite_Enemy.prototype.setEnemyHome = function(index){
  var screenWidth = Graphics.boxWidth;
  var screenHeight = Graphics.boxHeight;
  var maxSize = $gameParty.maxBattleMembers();
  var statusHeight = eval(FS.PositionEnemies.commandWindowRows);
  statusHeight *= Window_Base.prototype.lineHeight.call(this);
  statusHeight += Window_Base.prototype.standardPadding.call(this) * 2;
  if ($gameSystem.isSideView()){
    var code = FS.PositionEnemies.homePositionX;
    try {
      var homeX = eval(code);
      console.log(homeX);
    } catch (e) {
      var homeX = 0;
      console.error(e);
    }
    var code = FS.PositionEnemies.homePositionY;
    try {
      var homeY = eval(code);
      console.log(homeY);
    } catch (e) {
      var homeY = 0;
      console.error(e);
    }
  } else {
    var code = FS.PositionEnemies.frontPositionX;
    try {
      var homeX = eval(code);
    } catch (e) {
      var homeX = 0;
      console.error(e);
    }
    var code = FS.PositionEnemies.frontPositionY;
    try {
      var homeY = eval(code);
    } catch (e) {
      var homeY = 0;
      console.error(e);
    }
  }
  this.setHome(homeX, homeY);
};

})(FS.PositionEnemies, FS.PluginCommands);
