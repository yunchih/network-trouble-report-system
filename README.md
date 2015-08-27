
# Network Trouble Report System

## APIs

### Introduction

* Base URL: It will be `/api/:version/`. You can take the current version as 1.0. Therefore, the base URL will be `/api/1.0/`.
* API URL naming convension:
 * Using lower case.
 * For multiple-word noun like FB ID, use dash - to connect them. Ex. fb-id.
* Terms:
 * Parameter: The `:xxx` part of the URL.
 * Query: The fields attached in the end of the URL, eg. the fields after ? the url. Ex: In `/user/current?name=XXX`, name is one field of the query.
* Permission: Each user has their own permission level. There can be many permission level in this system. For now, there are two permission level, `nma` and `general`.
 * `nma`: Network management assistant.
 * `general`: General user, eg. dorm students.
* Configuration: This system is designed to be highly configurable. Following settings can be changed easily.
 * Permission of API access: Each API can be set to be available only to specific permission level(s).
 * Property stored in database: Many APIs aim to interact data stored in database. Those data is usually "properties" of something. Ex. A user may have a property "student-id".  What property to store is also configurable.
 * Permission of property access: Database stores many properties. Some of them may should only available to certain permission leve(s). It is also configurable which permission level can access what properties is also configurable.
* Return of DB: Array.
* Feedback: If anymore API or any modification of configuration is needed, please open issue to discuss.

### User API

This category of APIs provide user-related operation.

* `GET /user/current`
 * Parameter: none.
 * Query: none.
 * Retrun: (array of)
    * name
    * room-number
    * ip
    * mac
    * fb-id
    * permission
    * student-id
 * Description: Get the information of current login user.
 * Permission require: general, nma.
* `POST /user/current`
 * Parameter: none.
 * Query:
   * name
   * room-number
   * ip
   * mac
 * Retrun: If successful
````
    { "result": "success" }
````
 * Description: Update the information of current login user.
 * Permission require: general, nma.
* `GET /user/:prop/:value`
 * Parameter:
  * prop: one proper of user.
  * value: the value of that property.
 * Query: none.
 * Retrun: (array of)
    * name
    * room-number
    * ip
    * mac
    * fb-id
    * permission
    * student-id
 * Description: Get the information of user(s) whose value of property `:prop` is `:value`.
 * Permission require: nma.
* `POST /user/:prop/:value`
 * Parameter:
  * prop: one proper of user.
  * value: the value of that property.
 * Query:
    * name
    * room-number
    * ip
    * mac
    * fb-id
    * permission
    * student-id
 * Retrun: (array of)
 * Description: Update the information of user(s) whose value of property `:prop` is `:value`.
 * Permission require: nma. 
* `GET /user/query`
 * Parameter: none
 * Query: ( some of them )
    * name
    * room-number
    * ip
    * mac
    * fb-id
    * permission
    * student-id
 * Retrun: (array of)
 * Description: Get all information of the users that satisfy the query fields.
 * Permission require: nma. 
