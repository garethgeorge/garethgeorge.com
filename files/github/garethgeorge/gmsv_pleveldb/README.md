gmsv_pleveldb
=============

Database wrapper for <a href="https://github.com/google/leveldb">LevelDB</a>.

Download gmsv_leveldb_win32.dll <a href="https://github.com/thelastpenguin/gmsv_pleveldb/raw/master/libleveldb.dll">here</a>

Download libleveldb.dll <a href="https://github.com/thelastpenguin/gmsv_pleveldb/raw/master/libleveldb.dll">here</a>

LevelDB is a simple light weight keyvalue store developed by Google. A key value store is a kind of extremely simple database which does exactly what it's name implies. For every key it associates one string value. In the case of leveldb a key may be any binary string and a value may likewise be any binary value of for all practical intents and purposes any length desirable. 
LevelDB is optimized for extremely high read and write performance and uses a small memory cache so the database is implemented as an entirely synchronous system. All data gets written into the database folder located in garrysmod/x_leveldb/. The database is split into multiple files by Google's design to achieve better performance. It's really quite clever I assure you, you can read about the implementation specifics with the link provided at the top of this page.

All of this may leave you wondering "what can I use leveldb for?" which is a perfectly valid question. LevelDB is best thought of as a very high performance serverside cookie system. As a side note it is actually what Google Chrome uses to store cookies supposedly. An example of how you might do this is as follows:
```Lua
hook.Add('PlayerDeath', 'deathCounter', function(pl)
  local succ, deaths = leveldb.getInteger('DeathCounter.'..pl:SteamID()..'.deaths');
  if succ then
    leveldb.setInteger('DeathCounter.'..pl:SteamID()..'.deaths', deaths + 1);
  else
    leveldb.setInteger('DeathCounter.'..pl:SteamID()..'.deaths', 1);
  end
end);
```

Keep in mind when using leveldb that it will only store a prefix once per file block (4kb of key/value pairs) so the length of the key prefix has almost negligable impact on storage usage so your prefixes can be pretty long (make them descriptive) but obviously if they are too long there is some cost when retreiving values since they take more time to hash and compair. Secondly it's a good idea to use keys that are sequential grouping data that is often accessed as a set together. This way the database can take advantage of caching to load a segment of data into the cache. It is also more convenient for iterating through the data if you need to.

Installation
=============

  1. Place gmsv_leveldb_win32.dll in your garrysmod/lua/bin/ folder with the rest of your C++ modules. Create this folder if it does not exist.

  2. Place libleveldb.dll in your garrysmod/ directory with hl2.exe 

Documentation
=============

<h2>Getters and Setters</h2>

<strong>set</strong> (key:string, value:string) -> bool:success

<strong>get</strong> (key:string) -> bool:success, string:value or error

<strong>setString</strong> alias for set

<strong>getString</strong> alias for get

<strong>setInteger</strong> (key:string, value:integer) -> bool:success

<strong>getInteger</strong> (key:string) -> bool:success, int:value or string:error

<strong>setDouble</strong> (key:string, value:double) -> bool:success

<strong>getDouble</strong> (key:string) -> bool:success, double:value or string:error

<strong>setBool</strong> (key:string, value:bool) -> bool:success

<strong>getBool</strong> (key:string) -> bool:success, bool:value or string:error

<strong>setVector</strong> (key:string, value:Vector) -> bool:success

<strong>getVector</strong> (key:string) -> bool:success, Vector:value or string:error

<strong>setAngle</strong> (key:string, value:Angle) -> bool:success

<strong>getAngle</strong> (key:string) -> bool:success, Angle:value or string:error

```lua
leveldb.setString('helloString', 'hello world');
local succ, value = leveldb.getString('helloString');

leveldb.setDouble('helloDouble', -3.1415926);
local succ, value = leveldb.getDouble('helloDouble');

leveldb.setInteger('helloInteger', -3239);
local succ, value = leveldb.getInteger('helloInteger');

leveldb.setBool('helloBool', true);
local succ, value = leveldb.getDouble('helloBool');

leveldb.setVector('helloVector', Vector(1.3,2.5,3.8));
local succ, value = leveldb.getVector('helloVector');

leveldb.setAngle('helloAngle', Angle(1.3,2.5,3.8));
local succ, value = leveldb.getAngle('helloAngle');
```

<h2>Simplified Getters</h2>
Removes error passback. Will return nil if the value wasn't found. These functions are implemented in lua that gets executed by the module.
```Lua
local res = leveldb.s_getAngle('key');
local res = leveldb.s_getVector('key');
local res = leveldb.s_getInteger('key');
local res = leveldb.s_getDouble('key');
local res = leveldb.s_getString('key');
```

<h2>Iteration</h2>
The LevelDB wrapper provides a special iterator for iterating over key blocks in the database. A key block is considdered to be a block of all keys with the same prefix. 

<strong>leveldb.iter</strong> (string:prefix) -> function:iterator

```Lua
for key, value in leveldb.iter('rp:player')do
  print('key: '..key..'   value: '..value);
end
```
Take note that key, value will always be strings even if the datatype of the original data was a vector, double, integer, angle, or bool. The library does however provide a set of functions for converting these strings into usable lua datatypes.

<h2>Converters</h2>

<strong>toInteger</strong> (string:value) -> integer:value

<strong>toDouble</strong> (string:value) -> double:value

<strong>toBool</strong> (string:value) -> bool:value

<strong>toVector</strong> (string:value) -> Vector:value

<strong>toAngle</strong> (string:value) -> Angle:value
