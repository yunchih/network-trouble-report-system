
# Network Trouble Report System

## Status

user part works basically.
But still don't pull down the repo so that I will be less embarrassed. 

## Functionality of the front-end

Here is some ideas about the front end. I hope they can be taken into consideration.

### Miscellaneous

* This system is NOT belong to any organization for now!! Keep this in mind, so any organization logo is improper.
* I have not figure out what to return if post succeed or some error occur. Therefore, the front-end developer may have to keep some flexbility.
* Ignore chat room for now.

### User-related part

* Account setting page
  * Requirements:
     * User must agree one term of service before they submit their data, so one page for "term of service" is need.
     * Fields to set user data.

### Trouble Report Part

* Scenario: Student's computer is in dorm, but he can only access internet in lounge.
* Requirement:
  * The front-end have to tell user some solutions.
  * The front-end may need some off-line storage functionality.
* Solution:
  * Use roommate's computer.
  * He can somehow open the troubleshooter page and complete it. Afterwards, he goes to somewhere using WIFI to submit it.

* Scenario: When Network management assistant go to other student's rooms, he can not access to network. However, he may want to check the list of reports to be solved as well as some student's information. Moreover, after he fix one problem or fail to find the student, he would want to do some mark on the report.
* Solution:
  * The front-end will save some operation and some data needed (not all data) locally, and when it can access Internet, it will synchronize them.

* A list of report unsolved for network management assistant.
* A list of report solved of a period of time for network management assistant to write journal.
* Even some journal generator that convert what nma do into journal.

### Explicit description

Interfaces for user: 
  1. to report trouble ( maybe with troubleshooter ).
  2. to view troubles he has report. ( not that important )
  3. to view/modify his/her personal information ( user have to agree with term of service before submitting/updating data ).
  4. other utilization of the API provided if want
  5. A special page for those who login first time which contains term of service

Interfaces for nma:
  1. to view all report of certain status.
  2. to change report status. ( auto sync if modified offline ).
  3. to view report submit in certain period of time.
  4. other utilization of the API provided if want
  ( Those interfaces should allow nma to view report user data easily, even a button like "send message" )

  Something you want.

Any request on APIs provided is welcomed.

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

### Login URL

(This URL is not to be call as AJAX)
* `/fb-auth/login`
  * Query:
    * redirect: The URL to be redirected to after login successfully.
  * Description:
    * FB login fail: redirect back to /fb-auth/login.
    * FB login successfully
      * Have not completed register process: redirect to register page.
      * Have completed register process: redirect to the URL specified in the request URL. If not specified, it will redirect to `/static/index.html`

### User API

* `POST /register`
  * Parameter: none.
  * Query: 
    * name
    * roomNumber
    * ip
    * mac
    * fb-id
    * studentId
    * agree
      * Agree with term of service. This query must be true otherwise the request will be rejected.
  * Description: Register new user.
  * Permission: Only those who have login and have not complete register process.
  
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
