# Project plan

<!-- TOC depthFrom:2 -->

- [Backend](#backend)
  - [Phase 1](#phase-1)
  - [Phase 2](#phase-2)
  - [Phase 3](#phase-3)
  - [Phase 4](#phase-4)
  - [Phase 5](#phase-5)
  - [Phase 6](#phase-6)

<!-- /TOC -->

## Backend

### Phase 1

Create CRUD functionality. (pagination, ref validation, ref population).
On permissions middleware accept everything until *phase 4*.

### Phase 2 

Create the following mongoose models and apply the CRUD Functionality:

* Rss registrations
* Rss entries, one for each category
* Categories
* Rss fetch reports
* Providers
* App, only one entry

### Phase 3

Create fetch functionality from the rss resources, (fetch, store, report)
Add periodical fetch process

### Phase 4

Create the following mongoose models and apply the CRUD Functionality:

* User
* User roles
* Sessions (accessToken)

Create also login and logout process.

### Phase 5 

Third party login integration (FB)

### Phase 6

User options for Rss. Store preference for reading specific:

* Categories
* Authors
* Providers

organize on custom folders
