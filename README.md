
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
 * _id: That is the primary key added automatically by Mongodb.
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
    * _id
    * name
    * roomNumber
    * ip
    * mac
    * fb-id
    * permission
    * studentId
 * Description: Get the information of current login user.
 * Permission require: general, nma.
* `POST /user/current`
 * Parameter: none.
 * Query:
   * name
   * roomNumber
   * ip
   * mac
 * Retrun: If successful
   *`{ "result": "success" }`
 * Description: Update the information of current login user.
 * Permission require: general, nma.
* `GET /user/:prop/:value`
 * Parameter:
  * prop: one proper of user.
  * value: the value of that property.
 * Query: none.
 * Retrun: (array of)
  * _id
  * name
  * roomNumber
  * ip
  * mac
  * fbId
  * permission
  * studentId
 * Description: Get the information of user(s) whose value of property `:prop` is `:value`.
 * Permission require: nma.
* `POST /user/:prop/:value`
 * Parameter:
  * prop: one proper of user.
  * value: the value of that property.
 * Query:
    * name
    * roomNumber
    * ip
    * mac
    * fb-id
    * permission
    * studentId
 * Retrun: (array of)
 * Description: Update the information of user(s) whose value of property `:prop` is `:value`.
 * Permission require: nma. 
* `GET /user/query`
 * Parameter: none
 * Query: ( some of them )
    * name
    * roomNumber
    * ip
    * mac
    * fbId
    * permission
    * studentId
 * Retrun: (array of)
 * Description: Get all information of the users that satisfy the query fields.
 * Permission require: nma. 

### Report APIs

This category of API is about problem reports.

* `GET /report/current/:status`
 * Parameter:
  * status: status of the report, like "solved", "unsolved".
 * Query: none
 * Retrun: (array of)
   * _id 
   * issue
   * description
   * status
   * solution
 * Description: Get the information of the report that is submit by current user, and satisfy the status.
 * Permission require: general, nma. 
* `GET /report/current`
 * Parameter: none.
 * Query: none
 * Retrun: (array of)
   * _id
   * issue
   * description
   * status
   * solution
 * Description: Get the information of the report that is submit by current user.
 * Permission require: general, nma. 
* `POST /report/current`
 * Parameter: none
 * Query:
   * _id
   * issue
   * description
   * status
   * solution
 * Retrun: (if success)
 * `{ "result": "success" }`
 * Description: Submit one report. If the current user have one report unsolved, this operation will update the existed one.
 * Permission require: general, nma. 
* `GET /report/all/:prop/:value`
 * Parameter:
  * prop: one property name of the report
  * value: value of that property.
 * Query: none
 * Return: (array of)
   * _id
   * issue
   * description
   * status
   * solution
   * solvedBy
   * ps
 * Description: Get all the report whose value of the property `:property` is `:value`.
 * Permission require: nma
* `GET /report/all/period/:start/:end`
 * Parameter:
  * start: start of the period.
  * end: end of the period.
 * Query: none
 * Return: (array of)
   * _id
   * issue
   * description
   * status
   * solution
   * solvedBy
   * ps
 * Description: Get all the report of submit in the period.
 * Permission require: nma
* `POST /report/:reportId`
 * Parameter:
  * reportId: the _id of the report.
 * query: none
 * Return: (if successful)
  * `{"result": success}`
 * Description: update the fields of the report with the report id.
 * Permission: nma.